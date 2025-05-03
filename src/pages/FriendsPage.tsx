import React, { useState, useRef, useCallback, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Dialog,
  Button,
  Slide,
  Badge,
  Tooltip,
  useTheme,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Theme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useColorMode } from '../contexts/ColorModeContext';

// 0.7초 클릭 시 이벤트 발생
const HOLD_DURATION = 700;

interface Friend {
  id: number;
  name: string;
  status: '온라인' | '오프라인';
  lastSeen: string;
  age?: number;
  mbti?: string;
  tagline?: string;
  intro?: string;
}

const FRIENDS: Friend[] = [
  {
    id: 1,
    name: '또컴공이야',
    status: '온라인',
    lastSeen: '방금 전',
    age: 24,
    mbti: 'ENTJ',
    tagline: ' 오류 이제 그만 ',
    intro: '안녕하세요! 전 커피와 케이크를 사랑하는...(더보기)',
  },
  {
    id: 2,
    name: '라이언',
    status: '오프라인',
    lastSeen: '1시간 전',
  },
  {
    id: 3,
    name: '어피치',
    status: '온라인',
    lastSeen: '방금 전',
  },
  {
    id: 4,
    name: '무지',
    status: '오프라인',
    lastSeen: '2시간 전',
  },
];

const PageContainer = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 24px;
  gap: 24px;
  background: ${({ theme }: { theme: Theme }) =>
    theme.palette.mode === 'light'
      ? 'linear-gradient(135deg,#f5f7fa 0%,#e4e9f2 100%)'
      : 'linear-gradient(135deg,#1a1a1a 0%,#2d3436 100%)'};
`;

const Header = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const MainContent = styled('div')`
  flex: 1;
  width: 90vw;
  max-width: 450px;
  margin: 0 auto;
  background: ${({ theme }: { theme: Theme }) =>
    theme.palette.mode === 'light' 
      ? 'rgba(255,255,255,0.8)' 
      : 'rgba(45,45,45,0.8)'};
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }: { theme: Theme }) =>
      theme.palette.mode === 'light'
        ? 'rgba(0,0,0,0.2)'
        : 'rgba(255,255,255,0.2)'};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }: { theme: Theme }) =>
      theme.palette.mode === 'light'
        ? 'rgba(0,0,0,0.3)'
        : 'rgba(255,255,255,0.3)'};
  }
`;

const WavingHand = styled('span')`
  font-size: 24px;
  cursor: pointer;
  animation: wave 1.5s infinite;
  transform-origin: 70% 70%;
  @keyframes wave {
    0% { transform: rotate(0deg); }
    10% { transform: rotate(14deg); }
    20% { transform: rotate(-8deg); }
    30% { transform: rotate(14deg); }
    40% { transform: rotate(-4deg); }
    50% { transform: rotate(10deg); }
    60% { transform: rotate(0deg); }
    100% { transform: rotate(0deg); }
  }
`;

// 부드러운 슬라이드 업 전환
const SlideUp = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FriendListItem = memo(({ friend, onSelect, onChat }: {
  friend: Friend;
  onSelect: (friend: Friend) => void;
  onChat: (id: number, e: React.MouseEvent) => void;
}) => (
  <ListItem
    component={motion.div}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => onSelect(friend)}
    sx={{ 
      cursor: 'pointer',
      borderRadius: 2,
      mb: 1,
      '&:hover': {
        bgcolor: 'action.hover',
      }
    }}
    secondaryAction={
      <Tooltip title="채팅하기">
        <IconButton 
          edge="end" 
          onClick={(e) => onChat(friend.id, e)} 
          aria-label={`${friend.name}님과 채팅하기`}
        >
          <WavingHand role="img" aria-label="wave">
            🤚
          </WavingHand>
        </IconButton>
      </Tooltip>
    }
  >
    <ListItemAvatar>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
        color={friend.status === '온라인' ? 'success' : 'default'}
      >
        <Avatar>{friend.name[0]}</Avatar>
      </Badge>
    </ListItemAvatar>
    <ListItemText 
      primary={friend.name} 
      secondary={`${friend.status} · ${friend.lastSeen}`}
      primaryTypographyProps={{ fontWeight: 600 }}
    />
  </ListItem>
));

const FriendsPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { toggleColorMode } = useColorMode();
  const [selected, setSelected] = useState<Friend | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openProfile = useCallback((friend: Friend) => setSelected(friend), []);
  const closeProfile = useCallback(() => setSelected(null), []);

  const toChat = useCallback((id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/chat/${id}`);
  }, [navigate]);

  const startHold = useCallback(() => {
    if (!selected) return;
    timerRef.current = setTimeout(() => navigate(`/profile/${selected.id}`), HOLD_DURATION);
  }, [selected, navigate]);

  const cancelHold = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <PageContainer>
      <Header>
        <Typography variant="h4" fontWeight={600} component="h1">
          친구 목록
        </Typography>
        <IconButton onClick={toggleColorMode} color="inherit">
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Header>

      <MainContent>
        <List>
          {FRIENDS.map((friend) => (
            <FriendListItem
              key={friend.id}
              friend={friend}
              onSelect={openProfile}
              onChat={toChat}
            />
          ))}
        </List>
      </MainContent>

      <Dialog
        TransitionComponent={SlideUp}
        open={Boolean(selected)}
        onClose={closeProfile}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'visible',
            maxHeight: '90vh',
            background: theme.palette.mode === 'light' 
              ? 'rgba(255,255,255,0.95)' 
              : 'rgba(45,45,45,0.95)',
            backdropFilter: 'blur(10px)',
          },
        }}
      >
        <Box
          p={3}
          textAlign="center"
          onMouseDown={startHold}
          onMouseUp={cancelHold}
          onTouchStart={startHold}
          onTouchEnd={cancelHold}
        >
          <Avatar 
            sx={{ 
              width: 120, 
              height: 120, 
              mx: 'auto', 
              mb: 2,
              boxShadow: 3,
            }}
          >
            {selected?.name[0]}
          </Avatar>
          <Typography variant="h5" fontWeight={700} component="h2">
            {selected?.name}
          </Typography>

          {selected?.tagline && (
            <Typography sx={{ mt: 1 }} color="text.secondary">
              "{selected.tagline}"
            </Typography>
          )}

          {selected?.age && (
            <Box mt={3}>
              <Typography variant="body2">
                만 {selected.age} · {selected.mbti}
              </Typography>
            </Box>
          )}
          {selected?.intro && (
            <Typography 
              variant="body2" 
              sx={{ 
                whiteSpace: 'pre-line', 
                mt: 2,
                maxHeight: '200px',
                overflowY: 'auto',
                px: 2,
              }}
            >
              {selected.intro}
            </Typography>
          )}

          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              onClick={() => navigate(`/chat/${selected?.id}`)}
              sx={{ minWidth: '120px' }}
            >
              채팅하기
            </Button>
            <Button 
              variant="outlined"
              onClick={() => navigate(`/profile/${selected?.id}`)}
              sx={{ minWidth: '120px' }}
            >
              살펴보기
            </Button>
            <Button 
              variant="text"
              onClick={closeProfile}
              sx={{ minWidth: '120px' }}
            >
              닫기
            </Button>
          </Box>
        </Box>
      </Dialog>
    </PageContainer>
  );
};

export default memo(FriendsPage);
