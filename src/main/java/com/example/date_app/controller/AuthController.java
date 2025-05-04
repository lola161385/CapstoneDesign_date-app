// com/example/date_app/controller/AuthController.java
package com.example.date_app.controller;

import com.example.date_app.service.FirebaseAuthService;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.example.date_app.util.JwtUtil;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequiredArgsConstructor
public class AuthController {

    private final FirebaseAuthService firebaseAuthService;
    private final JwtUtil jwtUtil;

    @GetMapping("/login")
    public String loginForm() {
        return "login"; // login.html
    }

    @PostMapping(value = "/api/login", consumes = "application/json", produces = "application/json")
    @ResponseBody
    public ResponseEntity<Map<String, String>> loginWithToken(@RequestBody Map<String, String> body, HttpSession session) {
        System.out.println("🔥 로그인 요청 도착");

        String idToken = body.get("idToken");
        System.out.println("📦 전달받은 idToken: " + idToken);

        try {
            FirebaseToken decodedToken = firebaseAuthService.verifyIdToken(idToken);
            String email = decodedToken.getEmail();

            try {
                // 🔐 프로필 없으면 기본 생성
                if (!firebaseAuthService.userProfileExists(email)) {
                    firebaseAuthService.createInitialUserProfile(email);
                    System.out.println("🌱 기본 프로필 자동 생성 완료");
                }
            } catch (Exception e) {
                System.err.println("⚠️ 프로필 자동 생성 중 오류 발생: " + e.getMessage());
                e.printStackTrace(); // 디버깅을 위해 예외 스택 출력
            }

            // ✅ JWT 발급
            String jwt = jwtUtil.generateToken(email);

            Map<String, String> response = new HashMap<>();
            response.put("token", jwt);

            return ResponseEntity.ok(response);
        } catch (FirebaseAuthException e) {
            System.out.println("❌ Firebase 인증 실패: " + e.getMessage());
            return ResponseEntity.status(401).body(Map.of("error", "Firebase 인증 실패: " + e.getMessage()));
        }
    }


    @GetMapping("/api/home")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> apiHome() {
        String userEmail = getCurrentUserEmail();
        if (userEmail == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }

        try {
            Map<String, Object> profile = firebaseAuthService.getUserProfile(userEmail);
            Map<String, Object> result = new HashMap<>();
            result.put("userEmail", userEmail);
            result.put("profile", profile);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Profile fetch failed"));
        }
    }



    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }

    @GetMapping("/register")
    public String registerForm() {
        return "register";
    }

    @PostMapping("/register")
    public String registerSubmit(@RequestParam String email,
                                 @RequestParam String password,
                                 Model model) {
        try {
            firebaseAuthService.registerUser(email, password);
            firebaseAuthService.createInitialUserProfile(email); // 🔥 이 줄 추가
            return "redirect:/login";
        } catch (FirebaseAuthException e) {
            model.addAttribute("message", "회원가입 실패: " + e.getMessage());
            return "register";
        }
    }

    @PostMapping("/delete-account")
    public String deleteAccount(Model model) {
        String userEmail = getCurrentUserEmail();
        if (userEmail == null) {
            return "redirect:/login";
        }

        try {
            firebaseAuthService.deleteUserByEmail(userEmail);
            return "redirect:/login";
        } catch (FirebaseAuthException e) {
            model.addAttribute("message", "회원탈퇴 실패: " + e.getMessage());
            return "home"; // 실패 시 홈으로
        }
    }

    private String getCurrentUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (auth != null) ? (String) auth.getPrincipal() : null;
    }

}
