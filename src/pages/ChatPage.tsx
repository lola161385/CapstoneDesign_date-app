import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Box, TextField, IconButton, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import styled from 'styled-components';

interface IMessage {
  id: number;
  sender: 'me' | 'other';
  content: string;
}

const PageContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 0;
`;

const Header = styled(Box)`
  padding: 16px;
  font-weight: 600;
  font-size: 18px;
  border-bottom: 1px solid #ccc;
`;

const MessageContainer = styled(Box)`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MessageBubble = styled(Paper)<{ isMine: boolean }>`
  align-self: ${({ isMine }) => (isMine ? 'flex-end' : 'flex-start')};
  background-color: ${({ isMine, theme }) =>
    isMine ? theme.palette.primary.main : theme.palette.grey[300]};
  color: ${({ isMine, theme }) =>
    isMine ? '#fff' : theme.palette.text.primary};
  padding: 10px 14px;
  border-radius: 16px;
  max-width: 70%;
`;

const InputBar = styled(Box)`
  padding: 8px 16px;
  display: flex;
  border-top: 1px solid #ccc;
`;

const ChatPage: React.FC = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { id: Date.now(), sender: 'me', content: trimmed }]);
    setInput('');
  }, [input]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <PageContainer>
      <Header>친구 #{id}와의 채팅</Header>

      <MessageContainer>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} isMine={msg.sender === 'me'}>
            {msg.content}
          </MessageBubble>
        ))}
        <div ref={bottomRef} />
      </MessageContainer>

      <InputBar>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요"
          inputProps={{ 'aria-label': '메시지 입력' }}
        />
        <IconButton onClick={sendMessage} color="primary" aria-label="메시지 전송">
          <SendIcon />
        </IconButton>
      </InputBar>
    </PageContainer>
  );
};

export default ChatPage;
