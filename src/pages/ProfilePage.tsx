import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Avatar,
  Button,
  useTheme,
  Chip,
  IconButton,
} from '@mui/material';
import styled from '@emotion/styled';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';

const PageContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 24px;
  gap: 24px;
  background: ${({ theme }) =>
    theme.palette.mode === 'light'
      ? 'linear-gradient(135deg,#f5f7fa 0%,#e4e9f2 100%)'
      : 'linear-gradient(135deg,#1a1a1a 0%,#2d3436 100%)'};

  @media (max-width: 430px) {
    padding: 16px;
    gap: 16px;
  }
`;

const ProfileContainer = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 24px;
  background: ${({ theme }) =>
    theme.palette.mode === 'light' ? 'rgba(255,255,255,0.8)' : 'rgba(45,45,45,0.8)'};
  backdrop-filter: blur(10px);
  border-radius: 20px;
`;

const ProfileHeader = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const StyledAvatar = styled(Avatar)`
  width: 120px;
  height: 120px;
  margin-bottom: 8px;
  background-color: ${({ theme }) =>
    theme.palette.mode === 'light' ? '#f0f0f0' : '#2d2d2d'};
  border: 4px solid ${({ theme }) =>
    theme.palette.mode === 'light'
      ? 'rgba(255, 255, 255, 0.8)'
      : 'rgba(255, 255, 255, 0.1)'};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);

  svg {
    width: 60%;
    height: 60%;
    color: ${({ theme }) =>
      theme.palette.mode === 'light' ? '#666' : '#999'};
  }
`;

const TagContainer = styled(Box)`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  margin: 16px 0;
`;

const ProfileContent = styled(Box)`
  flex: 1;
  width: 90vw;
  max-width: 430px;
  margin: 0 auto;
  background: ${({ theme }) =>
    theme.palette.mode === 'light'
      ? 'rgba(255, 255, 255, 0.8)'
      : 'rgba(45, 45, 45, 0.8)'};
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 24px;
  overflow-y: auto;

  @media (max-width: 430px) {
    width: 100%;
    padding: 20px;
  }
`;

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();

  const userProfile = {
    name: "배고픈 춘식이",
    nickname: "HHHLL",
    age: 22,
    mbti: "ENTJ",
    tags: ["긍정적", "독창적", "무계획"],
    description: "명확한 비전과 논리적인 사고를 바탕으로 전략을 세우고, 효율적으로 실행하는 것을 좋아합니다."
  };

  return (
    <PageContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            color: theme => theme.palette.mode === 'light' ? '#1a1a1a' : '#ffffff',
            fontWeight: 600,
          }}
        >
          프로필
        </Typography>
        <IconButton
          sx={{
            color: theme => theme.palette.mode === 'light' ? '#666666' : '#cccccc',
          }}
        >
          <EditIcon />
        </IconButton>
      </Box>

      <ProfileContent>
        <ProfileHeader>
          <StyledAvatar>
            <PersonIcon />
          </StyledAvatar>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: theme => theme.palette.mode === 'light' ? '#1a1a1a' : '#ffffff',
              }}
            >
              {userProfile.name}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme => theme.palette.mode === 'light' ? '#666666' : '#cccccc',
                mt: 0.5,
              }}
            >
              {userProfile.nickname}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography
              variant="body2"
              sx={{
                color: theme => theme.palette.mode === 'light' ? '#666666' : '#cccccc',
              }}
            >
              만 {userProfile.age}세
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme => theme.palette.mode === 'light' ? '#666666' : '#cccccc',
              }}
            >
              ·
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme => theme.palette.mode === 'light' ? '#666666' : '#cccccc',
              }}
            >
              {userProfile.mbti}
            </Typography>
          </Box>
        </ProfileHeader>

        <TagContainer>
          {userProfile.tags.map((tag) => (
            <Chip
              key={tag}
              label={`#${tag}`}
              sx={{
                backgroundColor: theme =>
                  theme.palette.mode === 'light'
                    ? 'rgba(46, 125, 50, 0.1)'
                    : 'rgba(129, 199, 132, 0.1)',
                color: theme =>
                  theme.palette.mode === 'light' ? '#2E7D32' : '#81c784',
                border: theme =>
                  `1px solid ${
                    theme.palette.mode === 'light'
                      ? 'rgba(46, 125, 50, 0.2)'
                      : 'rgba(129, 199, 132, 0.2)'
                  }`,
              }}
            />
          ))}
        </TagContainer>

        <Typography
          variant="body1"
          sx={{
            color: theme => theme.palette.mode === 'light' ? '#666666' : '#cccccc',
            textAlign: 'center',
            lineHeight: 1.6,
          }}
        >
          {userProfile.description}
        </Typography>
      </ProfileContent>
    </PageContainer>
  );
};

export default ProfilePage; 