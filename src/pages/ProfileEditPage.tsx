import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Avatar,
    MenuItem,
    Select,
    Chip,
    Dialog,
    DialogTitle,
    DialogActions,
    useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';

const PageContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    height: 'auto',
    overflowY: 'auto',
    padding: '32px 16px',
    background: theme.palette.mode === 'light'
        ? 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)'
        : 'linear-gradient(135deg, #121212 0%, #2c2c2c 100%)',
    color: theme.palette.text.primary,
}));

const FormContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    maxWidth: 430,
    maxHeight: 'calc(100vh - 160px)',
    overflowY: 'auto',
    background: theme.palette.mode === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(18,18,18,0.9)',
    borderRadius: 16,
    padding: '32px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    boxShadow: theme.palette.mode === 'light'
        ? '0 4px 12px rgba(0,0,0,0.05)'
        : '0 4px 12px rgba(0,0,0,0.3)',
    margin: '24px 0',
}));

const AvatarContainer = styled(Box)({
    width: 120,
    height: 120,
    margin: '0 auto',
    borderRadius: '50%',
    background: '#e0e0e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    overflow: 'hidden',
});

const TagContainer = styled(Box)({
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
});

const ButtonGroup = styled(Box)({
    display: 'flex',
    gap: 12,
    marginTop: 16,
});

const tagOptions = [
    '긍정적','독창적','무계획','열정적','포용적',
    '창의적','감성적','예술가','활발함','리더십',
    '배려심','성실함','도전적','신중함','낙천적',
];

const mbtiOptions = [
    'ISTJ','ISFJ','INFJ','INTJ',
    'ISTP','ISFP','INFP','INTP',
    'ESTP','ESFP','ENFP','ENTP',
    'ESTJ','ESFJ','ENFJ','ENTJ',
];

const ProfileEditPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const theme = useTheme();
    const [form, setForm] = useState({
        name: '배고픈 춘식이',
        nickname: 'HHHLL',
        age: '22',
        mbti: 'ENTJ',
        tags: ['긍정적','독창적','무계획'],
        description: '명확한 비전과 논리적인 사고를 바탕으로 전략을 세우고, 효율적으로 실행하는 것을 좋아합니다.',
        profileImage: '',
    });
    const [preview, setPreview] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleMbtiChange = (e: any) => {
        setForm(prev => ({ ...prev, mbti: e.target.value }));
    };

    const handleTagClick = (tag: string) => {
        setForm(prev => {
            const selected = prev.tags.includes(tag);
            if (selected) return { ...prev, tags: prev.tags.filter(t => t !== tag) };
            if (prev.tags.length < 5) return { ...prev, tags: [...prev.tags, tag] };
            return prev;
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
            setForm(prev => ({ ...prev, profileImage: url }));
        }
    };

    const handleSubmit = () => {
        console.log('저장', form);
        localStorage.setItem('userProfile', JSON.stringify(form));
        alert('저장되었습니다!');
        navigate(`/profile/${id}`);
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <PageContainer>
            <FormContainer>
                <Typography variant="h4" fontWeight={700} textAlign="center" mb={2}>
                    프로필 수정
                </Typography>
                <input
                    type="file"
                    accept="image/*"
                    id="upload-avatar"
                    style={{ display:'none' }}
                    onChange={handleImageChange}
                />
                <label htmlFor="upload-avatar">
                    <AvatarContainer>
                        { preview || form.profileImage ? (
                            <Avatar src={preview||form.profileImage} sx={{ width:120,height:120 }}/>
                        ) : (
                            <Avatar sx={{ width:100,height:100 }}><PersonIcon/></Avatar>
                        )}
                    </AvatarContainer>
                </label>
                <TextField label="이름" name="name" value={form.name} onChange={handleChange} fullWidth/>
                <TextField label="닉네임" name="nickname" value={form.nickname} onChange={handleChange} fullWidth/>
                <TextField label="나이" name="age" value={form.age} onChange={handleChange} fullWidth/>
                <Select value={form.mbti} onChange={handleMbtiChange} displayEmpty fullWidth>
                    <MenuItem value="">MBTI 선택</MenuItem>
                    {mbtiOptions.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </Select>
                <Box>
                    <Typography variant="subtitle1" fontWeight={600} mb={1}>
                        성격 태그 (최대 5개)
                    </Typography>
                    <TagContainer>
                        {tagOptions.map(tag => (
                            <Chip
                                key={tag}
                                label={tag}
                                clickable
                                variant={form.tags.includes(tag) ? 'filled' : 'outlined'}
                                color={form.tags.includes(tag) ? 'primary' : 'default'}
                                onClick={() => handleTagClick(tag)}
                            />
                        ))}
                    </TagContainer>
                </Box>
                <TextField
                    label="자기소개"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    fullWidth multiline minRows={4}
                />
                <ButtonGroup>
                    <Button fullWidth variant="outlined" onClick={handleCancel}>취소</Button>
                    <Button fullWidth variant="contained" onClick={handleSubmit}>저장</Button>
                </ButtonGroup>
            </FormContainer>
            <Dialog
                open={showSuccess}
                onClose={() => {
                    setShowSuccess(false);
                    navigate(`/profile/${id}`);
                }}
            >
                <DialogTitle>저장되었습니다!</DialogTitle>
                <DialogActions>
                    <Button onClick={() => {
                        setShowSuccess(false);
                        navigate(`/profile/${id}`);
                    }}>
                        확인
                    </Button>
                </DialogActions>
            </Dialog>
        </PageContainer>
    );
};

export default ProfileEditPage;