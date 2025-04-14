import { Box, Button, Container, Typography, Paper } from '@mui/material';
import styled from '@emotion/styled';
import GoogleIcon from '@mui/icons-material/Google';

const LoginContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #FAFAFA;
`;

const LoginBox = styled(Paper)`
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
  max-width: 400px;
  border-radius: 16px;
`;

const GoogleButton = styled(Button)`
  width: 100%;
  padding: 12px;
  text-transform: none;
  font-size: 16px;
  border-radius: 8px;
  background-color: #fff;
  color: #000;
  border: 1px solid #ddd;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const LoginPage = () => {
  const handleGoogleLogin = () => {
    // Google 로그인 구현
    console.log('Google login clicked');
  };

  return (
    <LoginContainer maxWidth={false}>
      <LoginBox elevation={1}>
        <Typography variant="h5" component="h1" gutterBottom>
          환영합니다!
        </Typography>
        <GoogleButton
          variant="contained"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
        >
          Google로 로그인
        </GoogleButton>
      </LoginBox>
    </LoginContainer>
  );
};

export default LoginPage; 