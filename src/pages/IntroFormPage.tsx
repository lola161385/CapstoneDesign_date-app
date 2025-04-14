import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Chip, IconButton, Slider, Avatar } from '@mui/material';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const PageContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  padding: 24px;
  gap: 24px;
  background: ${({ theme }) =>
    theme.palette.mode === 'light'
      ? 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)'
      : 'linear-gradient(135deg, #1a1a1a 0%, #2d3436 100%)'};

  @media (max-width: 430px) {
    padding: 16px;
    gap: 16px;
  }
`;

const MainContent = styled(Box)`
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

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) =>
      theme.palette.mode === 'light'
        ? 'rgba(0, 0, 0, 0.2)'
        : 'rgba(255, 255, 255, 0.2)'};
    border-radius: 3px;
  }
`;

const Form = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const PhotoUpload = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const StyledAvatar = styled(Avatar)`
  width: 120px;
  height: 120px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    opacity: 0.8;
  }
`;

const Section = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SliderContainer = styled(Box)`
  padding: 0 8px;
`;

const TagSection = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TagGrid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px;
`;

const TagChip = styled(Chip)<{ selected?: boolean }>`
  width: 100%;
  border-radius: 100px;
  background: ${({ theme, selected }) =>
    selected
      ? theme.palette.mode === 'light'
        ? 'rgba(46, 125, 50, 0.1)'
        : 'rgba(129, 199, 132, 0.1)'
      : 'transparent'};
  border: 1px solid ${({ theme, selected }) =>
    selected
      ? theme.palette.mode === 'light'
        ? 'rgba(46, 125, 50, 0.2)'
        : 'rgba(129, 199, 132, 0.2)'
      : theme.palette.mode === 'light'
      ? 'rgba(0, 0, 0, 0.1)'
      : 'rgba(255, 255, 255, 0.1)'};
  color: ${({ theme, selected }) =>
    selected
      ? theme.palette.mode === 'light'
        ? '#2E7D32'
        : '#81c784'
      : theme.palette.mode === 'light'
      ? '#666666'
      : '#cccccc'};

  &:hover {
    background: ${({ theme }) =>
      theme.palette.mode === 'light'
        ? 'rgba(46, 125, 50, 0.05)'
        : 'rgba(129, 199, 132, 0.05)'};
  }
`;

const StyledButton = styled(Button)`
  margin-top: 16px;
  padding: 12px;
  border-radius: 100px;
  font-size: 16px;
  font-weight: 600;
  text-transform: none;
  background: ${({ theme }) =>
    theme.palette.mode === 'light'
      ? 'rgba(33, 150, 243, 0.1)'
      : 'rgba(33, 150, 243, 0.2)'};
  color: ${({ theme }) =>
    theme.palette.mode === 'light' ? '#2196f3' : '#64b5f6'};
  border: 1px solid ${({ theme }) =>
    theme.palette.mode === 'light'
      ? 'rgba(33, 150, 243, 0.2)'
      : 'rgba(33, 150, 243, 0.3)'};
  
  &:hover {
    background: ${({ theme }) =>
      theme.palette.mode === 'light'
        ? 'rgba(33, 150, 243, 0.2)'
        : 'rgba(33, 150, 243, 0.3)'};
  }
`;

const IntroFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    age: '',
    mbti: '',
    description: '',
  });
  const [photo, setPhoto] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [big5, setBig5] = useState({
    openness: 50,
    conscientiousness: 50,
    extraversion: 50,
    agreeableness: 50,
    neuroticism: 50,
  });

  const availableTags = [
    "긍정적", "독창적", "무계획", "열정적", "포용적",
    "창의적", "감성적", "예술가", "활발함", "리더십",
    "배려심", "성실함", "도전적", "신중함", "낙천적"
  ];

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : prev.length < 5
        ? [...prev, tag]
        : prev
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle form submission
    navigate('/');
  };

  return (
    <PageContainer>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          color: theme => theme.palette.mode === 'light' ? '#1a1a1a' : '#ffffff',
          fontWeight: 600,
        }}
      >
        자기소개 작성
      </Typography>

      <MainContent>
        <Form component="form" onSubmit={handleSubmit}>
          <PhotoUpload>
            <input
              type="file"
              accept="image/*"
              id="photo-upload"
              style={{ display: 'none' }}
              onChange={handlePhotoChange}
            />
            <label htmlFor="photo-upload">
              <StyledAvatar
                src={photo || undefined}
                alt="프로필 사진"
              >
                <AddPhotoAlternateIcon />
              </StyledAvatar>
            </label>
            <Typography variant="body2" color="textSecondary">
              프로필 사진을 선택하세요
            </Typography>
          </PhotoUpload>

          <TextField
            label="이름"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            label="닉네임"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            label="나이"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            fullWidth
            required
          />

          <Section>
            <Typography variant="h6">BIG 5 성격 특성</Typography>
            <SliderContainer>
              <Typography>개방성 (Openness)</Typography>
              <Slider
                value={big5.openness}
                onChange={(_, value) => setBig5(prev => ({ ...prev, openness: value as number }))}
              />
              <Typography>성실성 (Conscientiousness)</Typography>
              <Slider
                value={big5.conscientiousness}
                onChange={(_, value) => setBig5(prev => ({ ...prev, conscientiousness: value as number }))}
              />
              <Typography>외향성 (Extraversion)</Typography>
              <Slider
                value={big5.extraversion}
                onChange={(_, value) => setBig5(prev => ({ ...prev, extraversion: value as number }))}
              />
              <Typography>우호성 (Agreeableness)</Typography>
              <Slider
                value={big5.agreeableness}
                onChange={(_, value) => setBig5(prev => ({ ...prev, agreeableness: value as number }))}
              />
              <Typography>신경성 (Neuroticism)</Typography>
              <Slider
                value={big5.neuroticism}
                onChange={(_, value) => setBig5(prev => ({ ...prev, neuroticism: value as number }))}
              />
            </SliderContainer>
          </Section>

          <TextField
            label="MBTI"
            name="mbti"
            value={formData.mbti}
            onChange={handleChange}
            fullWidth
            required
          />

          <TagSection>
            <Typography variant="h6">성격 태그 (최대 5개)</Typography>
            <TagGrid>
              {availableTags.map((tag) => (
                <TagChip
                  key={tag}
                  label={tag}
                  onClick={() => handleTagToggle(tag)}
                  selected={selectedTags.includes(tag)}
                />
              ))}
            </TagGrid>
          </TagSection>

          <TextField
            label="자기소개"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            required
          />

          <StyledButton type="submit" fullWidth>
            저장하기
          </StyledButton>
        </Form>
      </MainContent>
    </PageContainer>
  );
};

export default IntroFormPage; 