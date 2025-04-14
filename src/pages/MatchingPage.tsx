import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';

/* -------- styled components -------- */
const PageContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  padding: 24px;
  gap: 24px;
  background: ${({ theme }) =>
    theme.palette.mode === 'light'
      ? 'linear-gradient(135deg,#f5f7fa 0%,#e4e9f2 100%)'
      : 'linear-gradient(135deg,#1a1a1a 0%,#2d3436 100%)'};
`;

const MainContent = styled(Box)`
  flex: 1;
  width: 90vw;
  max-width: 430px;
  margin: 0 auto;
  position: relative;
`;

const MatchingCard = styled(motion.div)`
  position: absolute;
  width: 100%;
  max-width: 380px;
  background: ${({ theme }) =>
    theme.palette.mode === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(45,45,45,0.9)'};
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 32px 24px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  touch-action: none;
`;

const OverlayIcon = styled(motion.div)`
  position: absolute;
  top: 20px;
  ${(props: { right?: boolean }) => (props.right ? 'right: 20px;' : 'left: 20px;')}
  font-size: 64px;
  color: ${({ right }) => (right ? '#e91e63' : '#f44336')};
  pointer-events: none;
`;

const StyledAvatar = styled(Avatar)`
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
`;

const Tag = styled(motion.span)`
  display: inline-block;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(46, 125, 50, 0.1);
  color: #2e7d32;
  font-size: 13px;
  margin: 4px;
`;

const ActionButton = styled(IconButton)`
  width: 60px;
  height: 60px;
  background: rgba(255,255,255,0.9);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

/* -------- component -------- */
const MatchingPage: React.FC = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [exitX, setExitX] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const likeRef = useRef(false); // demo: 첫 like == 매칭 성공

  const profiles = [
    {
      id: 1,
      name: '배고픈 춘식이',
      age: 22,
      mbti: 'ENTJ',
      nickname: 'HHHLL',
      tags: ['긍정적', '독창적', '무계획'],
      description: '명확한 비전과 논리적인 사고를 바탕으로 전략을 세우고, 효율적으로 실행하는 것을 좋아합니다.',
    },
    {
      id: 2,
      name: '행복한 라이언',
      age: 25,
      mbti: 'INFP',
      nickname: 'HAPPY',
      tags: ['창의적', '감성적', '예술가'],
      description: '따뜻한 마음과 풍부한 상상력으로 세상을 바라봅니다.',
    },
  ];

  const profile = profiles[index % profiles.length];

  const swipeHandlers = useSwipeable({
    onSwiping: ({ deltaX }) => {
      const card = document.querySelector('.matching-card') as HTMLElement;
      if (card) card.style.transform = `translateX(${deltaX}px) rotate(${deltaX * 0.05}deg)`;
    },
    onSwiped: () => {
      const card = document.querySelector('.matching-card') as HTMLElement;
      if (card) card.style.transform = '';
    },
    onSwipedLeft: () => handleDislike(),
    onSwipedRight: () => handleLike(),
    trackMouse: true,
  });

  const nextProfile = () => {
    setIndex((prev) => prev + 1);
    setExitX(0);
  };

  const handleLike = () => {
    setExitX(250);
    likeRef.current = !likeRef.current; // demo 매칭 토글
    setTimeout(() => {
      if (likeRef.current) {
        setShowMatch(true);
      }
      nextProfile();
    }, 300);
  };

  const handleDislike = () => {
    setExitX(-250);
    setTimeout(nextProfile, 300);
  };

  const gotoChat = () => {
    setShowMatch(false);
    navigate(`/chat/${profile.id}`);
  };

  return (
    <PageContainer>
      <Typography variant="h4" fontWeight={700}>매칭하기</Typography>
      <MainContent>
        <AnimatePresence mode="wait">
          <MatchingCard
            {...swipeHandlers}
            key={index}
            className="matching-card"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ x: exitX, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* overlay icons */}
            <OverlayIcon
              right
              initial={{ opacity: 0 }}
              animate={{ opacity: exitX > 0 ? 0.8 : 0 }}
            >
              <FavoriteIcon fontSize="inherit" />
            </OverlayIcon>
            <OverlayIcon
              initial={{ opacity: 0 }}
              animate={{ opacity: exitX < 0 ? 0.8 : 0 }}
            >
              <CloseIcon fontSize="inherit" />
            </OverlayIcon>

            <StyledAvatar>
              <PersonIcon fontSize="large" />
            </StyledAvatar>
            <Typography variant="h6" fontWeight={600} textAlign="center">
              {profile.name}
            </Typography>
            <Typography variant="subtitle2" textAlign="center" color="text.secondary">
              만 {profile.age} · {profile.mbti}
            </Typography>
            <Typography variant="body2" textAlign="center" gutterBottom>
              {profile.nickname}
            </Typography>
            <Box textAlign="center" mb={1}>
              {profile.tags.map((t, i) => (
                <Tag key={t} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  #{t}
                </Tag>
              ))}
            </Box>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
              {profile.description}
            </Typography>

            {/* action buttons */}
            <Box display="flex" justifyContent="center" gap={4} mt={3}>
              <ActionButton onClick={handleDislike}>
                <CloseIcon />
              </ActionButton>
              <ActionButton onClick={handleLike}>
                <FavoriteIcon color="error" />
              </ActionButton>
            </Box>
          </MatchingCard>
        </AnimatePresence>
      </MainContent>

      {/* 매칭 성공 팝업 */}
      <Dialog open={showMatch} onClose={() => setShowMatch(false)}>
        <DialogTitle>매칭 성공!</DialogTitle>
        <DialogContent>
          <Typography>새로운 친구와 매칭됐어요! 지금 바로 대화를 시작해보세요!</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMatch(false)}>나중에</Button>
          <Button variant="contained" onClick={gotoChat}>채팅으로 이동</Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default MatchingPage;
