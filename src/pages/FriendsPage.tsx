import React, { useState, useRef, useCallback, useEffect } from 'react';
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
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import styled from 'styled-components';

// 0.7초 클릭 시 이벤트 발생
const HOLD_DURATION = 700;

const FRIENDS = [
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
] as const;

type Friend = typeof FRIENDS[number];

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
`;

const MainContent = styled(Box)`
  flex: 1;
  width: 90vw;
  max-width: 450px;
  margin: 0 auto;
  background: ${({ theme }) =>
    theme.palette.mode === 'light' ? 'rgba(255,255,255,0.8)' : 'rgba(45,45,45,0.8)'};
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px;
  overflow-y: auto;
`;

const WavingHand = styled.span`
  font-size: 24px;
  cursor: pointer;
  animation: wave 1.5s infinite;
  transform-origin: 70% 70%;
  @keyframes wave {
    0% {
      transform: rotate(0deg);
    }
    10% {
      transform: rotate(14deg);
    }
    20% {
      transform: rotate(-8deg);
    }
    30% {
      transform: rotate(14deg);
    }
    40% {
      transform: rotate(-4deg);
    }
    50% {
      transform: rotate(10deg);
    }
    60% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
`;

// 부드러운 슬라이드 업 전환
const SlideUp = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FriendsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Friend | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const openProfile = (friend: Friend) => setSelected(friend);
  const closeProfile = () => setSelected(null);

  const toChat = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/chat/${id}`);
  };

  const startHold = () => {
    if (!selected) return;
    timerRef.current = setTimeout(() => navigate(`/profile/${selected.id}`), HOLD_DURATION);
  };

  const cancelHold = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  // 컴포넌트 사라질 때 타이머 해제
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <PageContainer>
      <Typography variant="h4" fontWeight={600}>
        친구 목록
      </Typography>

      <MainContent>
        <List>
          {FRIENDS.map((f) => (
            <ListItem
              key={f.id}
              onClick={() => openProfile(f)}
              sx={{ cursor: 'pointer' }}
              secondaryAction={
                <IconButton edge="end" onClick={(e) => toChat(f.id, e)} aria-label="채팅하기">
                  <WavingHand role="img" aria-label="wave">
                    🤚
                  </WavingHand>
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar>{f.name[0]}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={f.name} secondary={`${f.status} · ${f.lastSeen}`} />
            </ListItem>
          ))}
        </List>
      </MainContent>

      {/* 전체를 덮지 않는 모달 , 슬라이드 전환 */}
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
          <Avatar sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}>{selected?.name[0]}</Avatar>
          <Typography variant="h5" fontWeight={700}>
            {selected?.name}
          </Typography>

          {selected?.tagline && (
            <Typography sx={{ mt: 1 }} color="text.secondary">
              “{selected.tagline}”
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
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mt: 2 }}>
              {selected.intro}
            </Typography>
          )}

          <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate(`/chat/${selected?.id}`)}>
            채팅하기
          </Button>
          <Button sx={{ mt: 2 }} onClick={() => navigate(`/profile/${selected?.id}`)}>
            살펴보기
          </Button>
          <Button sx={{ mt: 2 }} onClick={closeProfile}>
            닫기
          </Button>
        </Box>
      </Dialog>
    </PageContainer>
  );
};

export default FriendsPage;
