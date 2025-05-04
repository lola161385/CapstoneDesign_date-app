package com.example.date_app.controller;

import com.example.date_app.dto.ProfileUpdateRequest;
import com.example.date_app.service.FirebaseAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequiredArgsConstructor
public class ProfileController {

    private final FirebaseAuthService firebaseAuthService;

    @GetMapping("/profile")
    public String profileForm(Model model) {
        String userEmail = getCurrentUserEmail();
        if (userEmail == null) {
            return "redirect:/login";
        }

        try {
            Map<String, Object> profile = firebaseAuthService.getUserProfile(userEmail);
            if (profile != null) {
                // null 체크 추가
                model.addAttribute("name", profile.getOrDefault("name", ""));
                model.addAttribute("birthdate", profile.getOrDefault("birthdate", ""));
                model.addAttribute("bio", profile.getOrDefault("bio", ""));
            }
        } catch (Exception e) {
            model.addAttribute("error", "프로필 조회 실패: " + e.getMessage());
        }
        return "profile";
    }


    @PostMapping("/api/profile/update")
    @ResponseBody
    public ResponseEntity<?> updateFullProfile(@RequestBody ProfileUpdateRequest request) {
        String email = getCurrentUserEmail();
        if (email == null) return ResponseEntity.status(401).body("Unauthorized");

        if (!request.isValid()) {
            return ResponseEntity.badRequest().body("❌ 태그는 최대 5개 이하로 선택 가능합니다.");
        }

        try {
            firebaseAuthService.updateUserProfile(
                    email,
                    request.getName(),
                    request.getBirthdate(),
                    request.getGender(),
                    request.getBio(),
                    request.getMbti(),
                    request.getTags()
            );
            return ResponseEntity.ok("✅ 프로필 전체 저장 완료");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("❌ 저장 실패: " + e.getMessage());
        }
    }


    @GetMapping("/api/profile")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> apiProfile() {
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

    private String getCurrentUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (auth != null) ? (String) auth.getPrincipal() : null;
    }

}
