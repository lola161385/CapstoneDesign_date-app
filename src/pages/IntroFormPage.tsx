import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Chip, IconButton, Avatar, Snackbar, Alert, MenuItem, Select, FormControl, InputLabel, FormHelperText, CircularProgress } from '@mui/material';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

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

const Form = styled('form')`
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

const PhotoPreview = styled(Box)`
  position: relative;
  display: inline-block;
`;

const PhotoOverlay = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s;
  cursor: pointer;
  
  &:hover {
    opacity: 1;
  }
`;

const StyledAvatar = styled(Avatar)`
  width: 120px;
  height: 120px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover { opacity: 0.8; }
`;

const Section = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// 원형 척도 컴포넌트
const Circle = styled('div')<{ selected?: boolean; size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: 50%;
  background-color: ${({ theme, selected }) =>
    selected
      ? theme.palette.primary.main
      : theme.palette.mode === 'light'
        ? 'rgba(0,0,0,0.1)'
        : 'rgba(255,255,255,0.2)'};
  transition: all 0.2s;
  flex-shrink: 0;
  box-sizing: border-box;
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
        ? 'rgba(109, 171, 113, 0.1)'
        : 'rgba(165, 214, 183, 0.1)'
      : 'transparent'};
  border: 1px solid ${({ theme, selected }) =>
    selected
      ? theme.palette.mode === 'light'
        ? 'rgba(109, 171, 113, 0.2)'
        : 'rgba(165, 214, 183, 0.2)'
      : theme.palette.mode === 'light'
      ? 'rgba(0, 0, 0, 0.1)'
      : 'rgba(255, 255, 255, 0.1)'};
  color: ${({ theme, selected }) =>
    selected
      ? theme.palette.mode === 'light'
        ? '#6dab71'
        : '#a5d6b7'
      : theme.palette.mode === 'light'
      ? '#666666'
      : '#cccccc'};
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  transform: ${({ selected }) => selected ? 'scale(1.05)' : 'scale(1)'};
  box-shadow: ${({ selected }) => selected ? '0 3px 5px rgba(0, 0, 0, 0.1)' : 'none'};
  
  &:hover { 
    background: ${({ theme }) =>
      theme.palette.mode === 'light'
        ? 'rgba(109, 171, 113, 0.05)'
        : 'rgba(165, 214, 183, 0.05)'};
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
`;

const SuggestionChip = styled(Chip)<{ isAuto?: boolean }>`
  margin: 4px;
  background: ${({ theme, isAuto }) =>
    isAuto
      ? theme.palette.mode === 'light'
        ? 'rgba(109, 171, 113, 0.1)'
        : 'rgba(165, 214, 183, 0.1)'
      : 'transparent'};
  border: 1px solid ${({ theme, isAuto }) =>
    isAuto
      ? theme.palette.mode === 'light'
        ? 'rgba(109, 171, 113, 0.2)'
        : 'rgba(165, 214, 183, 0.2)'
      : theme.palette.mode === 'light'
      ? 'rgba(0, 0, 0, 0.1)'
      : 'rgba(255, 255, 255, 0.1)'};
  color: ${({ theme, isAuto }) =>
    isAuto
      ? theme.palette.mode === 'light'
        ? '#6dab71'
        : '#a5d6b7'
      : theme.palette.mode === 'light'
      ? '#666666'
      : '#cccccc'};
`;

const GenerateButton = styled(Button)`
  margin-top: 8px;
  padding: 10px;
  border-radius: 100px;
  font-weight: 600;
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
  &:hover { background: ${({ theme }) =>
      theme.palette.mode === 'light'
        ? 'rgba(33, 150, 243, 0.2)'
        : 'rgba(33, 150, 243, 0.3)'}; }
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
  &:hover { background: ${({ theme }) =>
      theme.palette.mode === 'light'
        ? 'rgba(33, 150, 243, 0.2)'
        : 'rgba(33, 150, 243, 0.3)'}; }
`;

// 질문 목록 및 스케일 단계
const traitQuestions = [
  { key: 'openness', label: '새로운 아이디어나 경험을 적극적으로 찾는다.' },
  { key: 'conscientiousness', label: '목표 달성을 위해 계획적으로 움직인다.' },
  { key: 'extraversion', label: '다양한 사람들과 어울리는 것을 즐긴다.' },
  { key: 'agreeableness', label: '다른 사람의 감정에 공감하며 배려하려 한다.' },
  { key: 'neuroticism', label: '작은 일에도 쉽게 불안해질 때가 있다.' },
];
const scaleSteps = [1, 2, 3, 4, 5, 6, 7];
const circleSizes = [24, 20, 16, 12, 16, 20, 24];

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
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [autoTags, setAutoTags] = useState<string[]>([]);
  const [big5, setBig5] = useState<Record<string, number>>({
    openness: 4,
    conscientiousness: 4,
    extraversion: 4,
    agreeableness: 4,
    neuroticism: 4,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('success');
  const [loadingTags, setLoadingTags] = useState(false);
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [showTagLimitWarning, setShowTagLimitWarning] = useState(false);

  const availableTags = [
    '긍정적', '독창적', '무계획', '열정적', '포용적',
    '창의적', '감성적', '예술가', '활발함', '리더십',
    '배려심', '성실함', '도전적', '신중함', '낙천적',
  ];

  const mbtiTypes = [
    'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
    'ISTP', 'ISFP', 'INFP', 'INTP',
    'ESTP', 'ESFP', 'ENFP', 'ENTP',
    'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'
  ];

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      
      const reader = new FileReader();
      reader.onload = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
      
      // VLM API 호출하여 태그 자동 생성
      try {
        setLoadingTags(true);
        setAutoTags([]);
        
        const formData = new FormData();
        formData.append('image', file);
        
        // VLM API 호출
        const response = await fetch('/api/vlm/tags', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error('이미지 태그 생성에 실패했습니다');
        }
        
        const data = await response.json();
        if (data.tags && Array.isArray(data.tags)) {
          setAutoTags(data.tags);
          setSnackbarMessage('이미지에서 태그를 추출했습니다.');
          setSnackbarSeverity('info');
          setShowSnackbar(true);
        }
      } catch (error) {
        console.error('이미지 태그 생성 오류:', error);
        setSnackbarMessage('태그 생성 중 오류가 발생했습니다');
        setSnackbarSeverity('error');
        setShowSnackbar(true);
      } finally {
        setLoadingTags(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        // 이미 선택된 태그는 제거
        return prev.filter(t => t !== tag);
      } else if (prev.length < 5) {
        // 5개 미만일 때는 추가
        return [...prev, tag];
      } else {
        // 5개 이상이면 경고 표시
        setShowTagLimitWarning(true);
        // 3초 후 경고 메시지 숨김
        setTimeout(() => setShowTagLimitWarning(false), 3000);
        return prev;
      }
    });
  };

  const handleAutoTagToggle = (tag: string) => {
    const formattedTag = tag.startsWith('#') ? tag : `#${tag}`;
    handleTagToggle(formattedTag);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 유효성 검사
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = '이름을 입력해주세요';
    if (!formData.nickname.trim()) newErrors.nickname = '닉네임을 입력해주세요';
    if (!formData.age || parseInt(formData.age) <= 0) newErrors.age = '올바른 나이를 입력해주세요';
    if (!formData.mbti.trim()) newErrors.mbti = 'MBTI를 입력해주세요';
    if (!formData.description.trim()) newErrors.description = '자기소개를 입력해주세요';
    if (selectedTags.length === 0 && autoTags.length === 0) newErrors.tags = '최소 1개 이상의 태그를 선택해주세요';
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      // 여기에 API 호출 등 데이터 저장 로직 추가
      console.log('제출할 데이터:', {
        ...formData,
        tags: selectedTags.concat(autoTags),
        big5,
        photo
      });
      
      setShowSnackbar(true);
      
      // 성공 시 홈으로 이동 (3초 후)
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  };

  const generateDescription = async () => {
    if (!formData.name.trim()) {
      setErrors(prev => ({ ...prev, name: '이름을 입력해주세요' }));
      return;
    }
    
    if (!formData.mbti) {
      setErrors(prev => ({ ...prev, mbti: 'MBTI를 선택해주세요' }));
      return;
    }
    
    if (selectedTags.length === 0 && autoTags.length === 0) {
      setErrors(prev => ({ ...prev, tags: '태그를 하나 이상 선택해주세요' }));
      return;
    }
    
    try {
      setGeneratingDescription(true);
      
      // 자동 태그와 사용자 선택 태그 통합
      const allTags = [
        ...selectedTags,
        ...autoTags
          .filter(autoTag => !selectedTags.some(tag => 
            tag === autoTag || 
            tag === `#${autoTag}` || 
            autoTag === `#${tag}`
          ))
          .map(tag => tag.startsWith('#') ? tag : `#${tag}`)
      ];
      
      const payload = {
        name: formData.name,
        nickname: formData.nickname || undefined,
        age: formData.age ? parseInt(formData.age) : undefined,
        personality: {
          mbti: formData.mbti,
          big5: big5,
          tags: allTags
        },
        image: photo ? {
          hasImage: true,
          autoDetectedTags: autoTags.map(tag => tag.startsWith('#') ? tag : `#${tag}`)
        } : undefined,
        options: {
          maxLength: 500,
          language: 'ko'
        }
      };
      
      const response = await fetch('/api/llm/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || '자기소개 생성에 실패했습니다');
      }
      
      const data = await response.json();
      if (data.description) {
        setFormData(prev => ({
          ...prev,
          description: data.description
        }));
        setSnackbarMessage('자기소개 초안이 생성되었습니다.');
        setSnackbarSeverity('success');
        setShowSnackbar(true);
      } else {
        throw new Error('생성된 자기소개가 없습니다.');
      }
    } catch (error) {
      console.error('자기소개 생성 오류:', error);
      setSnackbarMessage('자기소개 생성 중 오류가 발생했습니다: ' + 
        (error instanceof Error ? error.message : '알 수 없는 오류'));
      setSnackbarSeverity('error');
      setShowSnackbar(true);
    } finally {
      setGeneratingDescription(false);
    }
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  return (
    <PageContainer>
      <Typography variant="h4" component="h1" sx={{ color: theme => theme.palette.mode === 'light' ? '#1a1a1a' : '#ffffff', fontWeight: 600 }}>
        자기소개 작성
      </Typography>
      <MainContent>
        <Form onSubmit={handleSubmit}>
          {/* 사진 업로드 */}
          <PhotoUpload>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePhotoChange}
            />
            <label htmlFor="photo-upload">
              <PhotoPreview>
                <StyledAvatar src={photo || undefined} alt="프로필 사진">
                  {!photo && <AddPhotoAlternateIcon />}
                </StyledAvatar>
                <PhotoOverlay>
                  <AddPhotoAlternateIcon style={{ color: 'white' }} />
                </PhotoOverlay>
              </PhotoPreview>
            </label>
            <Typography variant="body2" color="textSecondary">프로필 사진을 선택하세요</Typography>
            {loadingTags && <CircularProgress size={24} sx={{ mt: 1 }} />}
          </PhotoUpload>

          {/* 기본 정보 */}
          <TextField 
            label="이름" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            fullWidth 
            required 
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField 
            label="닉네임" 
            name="nickname" 
            value={formData.nickname} 
            onChange={handleChange} 
            fullWidth 
            required 
            error={!!errors.nickname}
            helperText={errors.nickname}
          />
          <TextField 
            label="나이" 
            name="age" 
            type="number" 
            value={formData.age} 
            onChange={handleChange} 
            fullWidth 
            required 
            error={!!errors.age}
            helperText={errors.age}
          />

          {/* BIG 5 질문 + 원형 척도 */}
          <Section>
            <Typography variant="h6">BIG 5 성격 특성</Typography>
            {traitQuestions.map(({ key, label }) => (
              <Box key={key}>
                <Typography gutterBottom>{label}</Typography>
                <Box display="flex" alignItems="center">
                  <Typography variant="body2" sx={{ width: 40 }}>그렇지 않다</Typography>
                  <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', mx: 1 }}>
                    {scaleSteps.map((step, i) => (
                      <IconButton
                        key={step}
                        onClick={() => setBig5(prev => ({ ...prev, [key]: step }))}
                        size="small"
                        sx={{ 
                          p: 0, 
                          width: circleSizes[i] + 8,
                          height: circleSizes[i] + 8,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <Circle size={circleSizes[i]} selected={big5[key] === step} />
                      </IconButton>
                    ))}
                  </Box>
                  <Typography variant="body2" sx={{ width: 40, textAlign: 'right' }}>그렇다</Typography>
                </Box>
              </Box>
            ))}
          </Section>

          {/* MBTI 선택 */}
          <FormControl fullWidth required error={!!errors.mbti}>
            <InputLabel id="mbti-label">MBTI</InputLabel>
            <Select
              labelId="mbti-label"
              name="mbti"
              value={formData.mbti}
              label="MBTI"
              onChange={(e) => setFormData(prev => ({ ...prev, mbti: e.target.value }))}
            >
              {mbtiTypes.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
            {errors.mbti && <FormHelperText>{errors.mbti}</FormHelperText>}
          </FormControl>

          {/* 태그 선택 */}
          <TagSection>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">성격 태그 (최대 5개)</Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                <span style={{ fontWeight: 600 }}>{selectedTags.length}</span> / 5
              </Typography>
            </Box>
            
            {errors.tags && (
              <Typography color="error" variant="caption">
                {errors.tags}
              </Typography>
            )}
            
            {showTagLimitWarning && (
              <Box 
                sx={{ 
                  bgcolor: 'warning.light', 
                  color: 'warning.dark',
                  p: 1, 
                  borderRadius: 1,
                  mb: 2,
                  mt: 1,
                  display: 'flex',
                  alignItems: 'center',
                  animation: 'fadeIn 0.3s ease-in-out',
                  '@keyframes fadeIn': {
                    '0%': { opacity: 0, transform: 'translateY(-10px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' }
                  }
                }}
              >
                <Typography variant="body2">
                  최대 5개까지만 선택할 수 있습니다.
                </Typography>
              </Box>
            )}
            
            {/* VLM에서 생성된 자동 태그 */}
            {autoTags.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  사진에서 추출한 태그
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                  {autoTags.map(tag => (
                    <SuggestionChip
                      key={tag}
                      label={tag.startsWith('#') ? tag : `#${tag}`}
                      onClick={() => handleAutoTagToggle(tag)}
                      isAuto
                      variant="outlined"
                      color="secondary"
                    />
                  ))}
                </Box>
              </Box>
            )}
            
            <TagGrid>
              {availableTags.map(tag => (
                <TagChip
                  key={tag}
                  label={tag}
                  onClick={() => handleTagToggle(tag)}
                  selected={selectedTags.includes(tag)}
                />
              ))}
            </TagGrid>
          </TagSection>

          {/* 자기소개 */}
          <Section>
            <Typography variant="h6">자기소개</Typography>
            <Box sx={{ mb: 2 }}>
              <GenerateButton 
                startIcon={generatingDescription ? 
                  <CircularProgress size={16} color="inherit" /> : 
                  <AutoAwesomeIcon />
                }
                onClick={generateDescription}
                disabled={generatingDescription || (!formData.name || (!selectedTags.length && !autoTags.length))}
                variant="outlined"
                fullWidth
                sx={{
                  mt: 1,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  transition: 'all 0.2s ease',
                  '&:hover:not(:disabled)': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }
                }}
              >
                {generatingDescription ? '자기소개 생성 중...' : '자기소개 초안 자동 생성'}
              </GenerateButton>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, fontSize: '0.75rem' }}>
                프로필 이미지, BIG 5 성격 특성, 선택한 태그를 기반으로 AI가 자기소개 초안을 생성합니다.
              </Typography>
            </Box>
            <TextField
              label="자기소개"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
              required
              error={!!errors.description}
              helperText={errors.description || "300~500자 내외의 자기소개가 생성됩니다."}
              placeholder="자신에 대한 소개를 작성하거나 위 버튼을 클릭하여 자동으로 생성해보세요."
            />
          </Section>

          <StyledButton type="submit" fullWidth>저장하기</StyledButton>
        </Form>
      </MainContent>
      
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default IntroFormPage;
