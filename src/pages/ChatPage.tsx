import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  TextField,
  IconButton,
  useTheme,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Send as SendIcon,
  Brightness4 as LightIcon,
  Brightness7 as DarkIcon,
  Person as PersonIcon,
  People as PeopleIcon,
  Favorite as FavoriteIcon,
  Edit as EditIcon,
  ArrowBackIosNew as BackIcon,
} from '@mui/icons-material';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useColorMode } from '../contexts/ColorModeContext';

// Layout constants
const HEADER_HEIGHT = 64;
const INPUT_HEIGHT = 72;
const NAV_HEIGHT = 56;
const SAFE_PADDING = 8;
const REACTIONS = ['❤️', '👍', '😂', '😮', '🎉'];

const FRIENDS_MAP: Record<string, string> = {
  '1': '또컴공이야',
  '2': '라이언',
  '3': '어피치',
  '4': '무지', 
};
const MY_NAME = '배고픈 춘식이';

interface IMessage {
  id: number;
  sender: 'me' | 'other';
  content: string;
  timestamp: number;
}

// Styled components
const Container = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  overflow: 'hidden',
}));
const Sticky = styled('div')(({ theme }) => ({
  background: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  zIndex: 10,
}));
const HeaderBar = styled(Sticky)(({ theme }) => ({
  height: HEADER_HEIGHT,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 16px',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));
const Messages = styled('div')(({ theme }) => ({
  flex: 1,
  padding: SAFE_PADDING,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  gap: SAFE_PADDING,
  overflowY: 'auto',
  '&::-webkit-scrollbar': { width: 8 },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.mode === 'light' ? '#bbb' : '#555',
    borderRadius: 4,
  },
}));
const Bubble = styled(motion.div)<{ mine: boolean }>(({ mine, theme }) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    alignSelf: mine ? 'flex-end' : 'flex-start',
    background: mine
      ? theme.palette.primary.main
      : isDark
        ? theme.palette.grey[800]
        : theme.palette.grey[300],
    color: mine
      ? theme.palette.primary.contrastText
      : theme.palette.text.primary,
    padding: '12px 16px',
    borderRadius: 20,
    maxWidth: '70%',
    position: 'relative',
    boxShadow: theme.shadows[1],
    wordBreak: 'break-word',
    cursor: 'pointer',
    fontSize: '0.95rem',
    lineHeight: 1.4,
    border: isDark
      ? `1px solid ${theme.palette.grey[700]}`
      : `1px solid ${theme.palette.grey[400]}`,
  };
});
const ReactionPicker = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  bottom: '110%',
  right: 9,
  display: 'flex',
  gap: 8,
  background: theme.palette.background.paper,
  padding: '8px',
  borderRadius: 16,
  boxShadow: theme.shadows[3],
}));
const Timestamp = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  marginTop: 4,
  textAlign: 'right',
}));
const InputArea = styled(Sticky)(({ theme }) => ({
  position: 'sticky',
  bottom: NAV_HEIGHT,
  height: INPUT_HEIGHT,
  display: 'flex',
  alignItems: 'center',
  padding: '8px 16px',
  borderTop: `1px solid ${theme.palette.divider}`,
  zIndex: 12,
}));
const NavBar = styled(Sticky)(() => ({
  position: 'sticky',
  bottom: 0,
  height: NAV_HEIGHT,
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  zIndex: 11,
}));
const MemoBubble = React.memo(Bubble);

export const ChatPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode, toggleColorMode } = useColorMode();

  const friendName = useMemo(() => FRIENDS_MAP[id ?? ''] || `친구 #${id}`, [id]);

  // Modal state for welcome
  const [showWelcome, setShowWelcome] = useState(true);

  // Messages state
  const [messages, setMessages] = useState<IMessage[]>([
    { id: Date.now() - 60000, sender: 'other', content: `안녕하세요, ${MY_NAME}님!`, timestamp: Date.now() - 60000 }
  ]);
  const [draft, setDraft] = useState('');
  const [reactions, setReactions] = useState<Record<number, string>>({});
  const [activePicker, setActivePicker] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const longPressTimeout = useRef<number | null>(null);

  // Send message
  const send = useCallback((text?: string) => {
    const content = text ?? draft.trim();
    if (!content) return;
    const msg: IMessage = { id: Date.now(), sender: 'me', content, timestamp: Date.now() };
    setMessages(prev => [...prev, msg]);
    setDraft('');
  }, [draft]);

  // Handle welcome confirm
  const onWelcome = () => {
    send(`안녕하세요, ${friendName}님!`);
    setShowWelcome(false);
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
  }, [messages.length]);

  // Long press handlers
  const handleLongPressEnd = useCallback(() => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
  }, []);

  const handleLongPressStart = useCallback((msg: IMessage) => {
    if (msg.sender !== 'other') return;
    longPressTimeout.current = window.setTimeout(() => {
      setActivePicker(msg.id);
    }, 500);
  }, []);

  return (
    <Container>
      {/* Welcome Dialog */}
      <Dialog open={showWelcome} onClose={() => setShowWelcome(false)}>
        <DialogTitle>{`${friendName}과 첫 대화가 시작되었어요!`}</DialogTitle>
        <DialogContent>
          <Typography>아래 버튼을 눌러 인사해보세요.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onWelcome} variant="contained">
            안녕하세요!
          </Button>
        </DialogActions>
      </Dialog>

      <HeaderBar>
        <IconButton onClick={() => navigate(-1)}><BackIcon /></IconButton>
        <Typography variant="h6">{friendName}와의 채팅</Typography>
        <IconButton onClick={toggleColorMode} color="inherit">
          {mode === 'dark' ? <DarkIcon /> : <LightIcon />}
        </IconButton>
      </HeaderBar>

      <Messages>
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <MemoBubble
              key={msg.id}
              mine={msg.sender === 'me'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              whileTap={{ scale: 1.05 }}
              onMouseDown={() => handleLongPressStart(msg)}
              onMouseUp={handleLongPressEnd}
              onMouseLeave={handleLongPressEnd}
              onTouchStart={() => handleLongPressStart(msg)}
              onTouchEnd={handleLongPressEnd}
            >
              <Typography variant="body1">{msg.content}</Typography>
              {reactions[msg.id] && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    fontSize: '1.5rem',
                  }}
                >
                  {reactions[msg.id]}
                </Box>
              )}
              <Timestamp variant="caption">
                {new Date(msg.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
              </Timestamp>
              {activePicker === msg.id && (
                <ReactionPicker
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  {REACTIONS.map(e => (
                    <Box
                      key={e}
                      onClick={() => {
                        setReactions(prev => ({ ...prev, [msg.id]: e }));
                        setActivePicker(null);
                      }}
                      sx={{ cursor: 'pointer', fontSize: '1.5rem' }}
                    >
                      {e}
                    </Box>
                  ))}
                </ReactionPicker>
              )}
            </MemoBubble>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </Messages>

      <InputArea>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          variant="outlined"
          size="small"
          placeholder="메시지를 입력하고 Enter 또는 버튼을 눌러 전송"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          inputProps={{ 'aria-label': '메시지 입력' }}
        />
        <IconButton onClick={() => send()} color="primary" disabled={!draft.trim()} aria-label="전송">
          <SendIcon />
        </IconButton>
      </InputArea>

      <NavBar>
        <IconButton onClick={() => navigate('/profile')} color="inherit"><PersonIcon /></IconButton>
        <IconButton onClick={() => navigate('/friends')} color="inherit"><PeopleIcon /></IconButton>
        <IconButton onClick={() => navigate('/favorites')} color="inherit"><FavoriteIcon /></IconButton>
        <IconButton onClick={() => navigate('/edit')} color="inherit"><EditIcon /></IconButton>
      </NavBar>
    </Container>
  );
};

export default React.memo(ChatPage);
