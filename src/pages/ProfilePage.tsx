import React, { useState, useEffect, createContext, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Avatar,
    IconButton,
    Chip,
    useTheme,
    Badge,
    Switch,
    Menu,
    MenuItem,
    Divider,
    Tooltip,
    ThemeProvider,
    createTheme,
    CssBaseline,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Button,
} from '@mui/material';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
import PeopleIcon from '@mui/icons-material/People';

interface ColorModeContextType {
    toggleColorMode: () => void;
    mode: 'light' | 'dark';
}

const ColorModeContext = createContext<ColorModeContextType>({
    toggleColorMode: () => {},
    mode: 'light'
});

interface Notification {
    id: number;
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    avatar?: string;
    type: 'match' | 'system' | 'message' | 'like' | 'chat';
    friendId: number;
}

const ThemeLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setMode] = useState<'light' | 'dark'>(() => {
        const savedMode = localStorage.getItem('themeMode');
        return (savedMode === 'dark' || savedMode === 'light') ? savedMode : 'light';
    });

    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => {
                    const newMode = prevMode === 'light' ? 'dark' : 'light';
                    localStorage.setItem('themeMode', newMode);
                    return newMode;
                });
            },
            mode,
        }),
        [mode],
    );

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    primary: {
                        main: mode === 'light' ? '#2E7D32' : '#81c784',
                    },
                },
            }),
        [mode],
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

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

const HeaderBar = styled(Box)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0 8px;
`;

const HeaderLeft = styled(Box)`
    display: flex;
    align-items: center;
`;

const HeaderRight = styled(Box)`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const ThemeToggle = styled(Box)`
    display: flex;
    align-items: center;
    gap: 4px;
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const shake = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(5deg); }
  50% { transform: rotate(0deg); }
  75% { transform: rotate(-5deg); }
  100% { transform: rotate(0deg); }
`;

const slideDown = keyframes`
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const heartBeat = keyframes`
  0% { transform: scale(1); }
  14% { transform: scale(1.3); }
  28% { transform: scale(1); }
  42% { transform: scale(1.3); }
  70% { transform: scale(1); }
`;

const AnimatedNotificationIcon = styled(NotificationsIcon)<{ hasNotifications: boolean }>`
  animation: ${props => props.hasNotifications ? `${shake} 1s infinite, ${pulse} 2s infinite` : 'none'};
`;

const HeartIcon = styled(FavoriteIcon)`
  animation: ${heartBeat} 1.3s ease-in-out;
  color: #f50057;
  margin-right: 8px;
`;

const NotificationItem = styled(ListItem)<{ read: boolean }>`
  background-color: ${props => props.read ? 'transparent' : 'rgba(66, 165, 245, 0.1)'};
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.08)'};
  }
`;

const NotificationContainer = styled(Box)`
  position: fixed;
  top: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 9999;
  pointer-events: none;
`;

const ClickableArea = styled(Box)`
  pointer-events: auto;
  cursor: pointer;
`;

const ToastContent = styled(Box)`
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: ${({ theme }) => theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(45, 45, 45, 0.95)'};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: calc(100% - 32px);
  margin: 0 auto;
  position: relative;
  border-left: ${({ theme }) => `4px solid ${theme.palette.mode === 'light' ? '#2E7D32' : '#81c784'}`};
  animation: ${slideDown} 0.3s ease-out;
`;

const ToastMessage = styled(Box)`
  display: flex;
  flex-direction: column;
  margin-left: 16px;
  flex: 1;
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

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                    '#fff',
                )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
        width: 32,
        height: 32,
        '&:before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                '#fff',
            )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        borderRadius: 20 / 2,
    },
}));

const ConfirmModalContainer = styled(Box)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
`;

const ConfirmModalContent = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#333',
    borderRadius: '8px',
    padding: '24px',
    width: '300px',
    maxWidth: '90%',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
}));

const ConfirmModalButtons = styled(Box)`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 24px;
`;

const StyledButton = styled.button<{ variant: 'outlined' | 'contained', color?: string }>`
    padding: 8px 16px;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    
    ${({ variant, color, theme }) =>
    variant === 'outlined'
        ? `
                background-color: transparent;
                border: 1px solid ${color === 'error' ? '#d32f2f' : '#666'};
                color: ${color === 'error' ? '#d32f2f' : 'inherit'};
                
                &:hover {
                    background-color: rgba(0, 0, 0, 0.04);
                }
            `
        : `
                background-color: ${color === 'error' ? '#d32f2f' : '#1976d2'};
                border: none;
                color: white;
                
                &:hover {
                    background-color: ${color === 'error' ? '#c62828' : '#1565c0'};
                }
            `
}
`;

interface UserProfile {
    name: string;
    nickname: string;
    age: string;
    mbti: string;
    tags: string[];
    description: string;
    profileImage?: string;
}

const ProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

    const matchingPartners = [
        { id: 1, name: '또컴공이야', nickname: '또컴공이야', age: '24', mbti: 'ENTJ', avatar: '' },
        { id: 2, name: '라이언', nickname: '라이언', age: '', mbti: '', avatar: '' },
        { id: 3, name: '어피치', nickname: '어피치', age: '', mbti: '', avatar: '' },
        { id: 4, name: '무지', nickname: '무지', age: '', mbti: '', avatar: '' }
    ];

    const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [currentToast, setCurrentToast] = useState<Notification | null>(null);

    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: 1,
            title: '새로운 관심 표현',
            message: `${matchingPartners[0].nickname}님이 당신에게 관심을 표현했습니다.`,
            timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5분 전
            read: false,
            avatar: '',
            type: 'like',
            friendId: 1
        },
        {
            id: 2,
            title: '채팅 요청',
            message: `${matchingPartners[1].nickname}님이 채팅을 시작하고 싶어합니다.`,
            timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30분 전
            read: false,
            avatar: '',
            type: 'chat',
            friendId: 2
        },
        {
            id: 3,
            title: '새로운 관심 표현',
            message: `${matchingPartners[2].nickname}님이 당신에게 관심을 표현했습니다.`,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2시간 전
            read: false,
            avatar: '',
            type: 'like',
            friendId: 3
        },
        {
            id: 4,
            title: '채팅 요청',
            message: `${matchingPartners[3].nickname}님이 채팅을 시작하고 싶어합니다.`,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4시간 전
            read: false,
            avatar: '',
            type: 'chat',
            friendId: 4
        }
    ]);

    const [userProfile, setUserProfile] = useState<UserProfile>({
        name: '',
        nickname: '',
        age: '',
        mbti: '',
        tags: [],
        description: '',
        profileImage: '',
    });

    useEffect(() => {
        try {
            const storedProfile = localStorage.getItem('userProfile');
            if (storedProfile) {
                setUserProfile(JSON.parse(storedProfile));
            } else {
                const testProfile = {
                    name: '홍길동',
                    nickname: '도적의 왕',
                    age: '28',
                    mbti: 'ENFP',
                    tags: ['여행', '음악', '독서'],
                    description: '안녕하세요! 새로운 만남을 기대하고 있습니다.',
                    profileImage: '',
                };
                localStorage.setItem('userProfile', JSON.stringify(testProfile));
                setUserProfile(testProfile);
            }
        } catch (error) {
            console.error('프로필 로드 실패:', error);
        }
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (showToast) {
            timer = setTimeout(() => {
                setShowToast(false);
            }, 5000);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [showToast]);

    const notificationCount = notifications.filter(n => !n.read).length;

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
        setNotificationAnchorEl(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setNotificationAnchorEl(null);
    };

    const handleReadNotification = (id: number) => {
        const notification = notifications.find(n => n.id === id);
        if (notification && !notification.read) {
            setNotifications(prevNotifications =>
                prevNotifications.map(n =>
                    n.id === id ? { ...n, read: true } : n
                )
            );

            setCurrentToast(notification);
            setShowToast(true);
            handleNotificationClose();
        }
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        handleNotificationClose();
    };

    const handleToastClose = () => {
        setShowToast(false);
    };

    const handleLogout = () => {
        setShowLogoutConfirm(true);
        handleMenuClose();
    };

    const confirmLogout = () => {
        localStorage.removeItem('userProfile');
        navigate('/login');
        setShowLogoutConfirm(false);
    };

    const cancelLogout = () => {
        setShowLogoutConfirm(false);
    };

    const getTimeAgo = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return `${Math.floor(interval)}년 전`;

        interval = seconds / 2592000;
        if (interval > 1) return `${Math.floor(interval)}개월 전`;

        interval = seconds / 86400;
        if (interval > 1) return `${Math.floor(interval)}일 전`;

        interval = seconds / 3600;
        if (interval > 1) return `${Math.floor(interval)}시간 전`;

        interval = seconds / 60;
        if (interval > 1) return `${Math.floor(interval)}분 전`;

        return `${Math.floor(seconds)}초 전`;
    };

    return (
        <PageContainer>
            <HeaderBar>
                <HeaderLeft>
                    <Typography
                        variant="h5"
                        component="h1"
                        sx={{
                            color: theme.palette.mode === 'light' ? '#1a1a1a' : '#ffffff',
                            fontWeight: 600,
                        }}
                    >
                        프로필
                    </Typography>
                </HeaderLeft>

                <HeaderRight>
                    <ThemeToggle>
                        <MaterialUISwitch
                            checked={theme.palette.mode === 'dark'}
                            onChange={colorMode.toggleColorMode}
                            inputProps={{ 'aria-label': '테마 전환' }}
                        />
                    </ThemeToggle>

                    <Tooltip title={notificationCount > 0 ? `${notificationCount}개의 새 알림` : "알림 없음"}>
                        <IconButton
                            onClick={handleNotificationOpen}
                            sx={{ color: theme.palette.mode === 'light' ? '#666666' : '#cccccc' }}
                        >
                            <Badge badgeContent={notificationCount} color="error">
                                <AnimatedNotificationIcon hasNotifications={notificationCount > 0} />
                            </Badge>
                        </IconButton>
                    </Tooltip>

                    <Menu
                        anchorEl={notificationAnchorEl}
                        open={Boolean(notificationAnchorEl)}
                        onClose={handleNotificationClose}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        PaperProps={{
                            sx: { width: 320, maxHeight: 400, overflow: 'auto', mt: 1 }
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            p: 2,
                            borderBottom: 1,
                            borderColor: 'divider'
                        }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                알림
                            </Typography>
                            {notificationCount > 0 && (
                                <Button size="small" onClick={markAllAsRead}>
                                    모두 읽음 표시
                                </Button>
                            )}
                        </Box>

                        <List>
                            {notifications.length === 0 ? (
                                <Box sx={{ p: 3, textAlign: 'center' }}>
                                    <Typography variant="body1" color="text.secondary">
                                        알림이 없습니다
                                    </Typography>
                                </Box>
                            ) : (
                                notifications.map(notification => (
                                    <NotificationItem
                                        key={notification.id}
                                        read={notification.read}
                                        onClick={() => {
                                            handleReadNotification(notification.id);
                                            // 직접 라우팅 처리 추가
                                            if (notification.type === 'like') {
                                                navigate(`/profile/${notification.friendId}`);
                                            } else if (notification.type === 'chat') {
                                                navigate(`/chat/${notification.friendId}`);
                                            }
                                            handleNotificationClose();
                                        }}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar src={notification.avatar}>
                                                {notification.type === 'like' && <FavoriteIcon color="error" />}
                                                {notification.type === 'chat' && <ChatIcon color="primary" />}
                                                {notification.type === 'match' && <PeopleIcon color="success" />}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Typography variant="subtitle2" sx={{ fontWeight: notification.read ? 'normal' : 'bold' }}>
                                                    {notification.title}
                                                </Typography>
                                            }
                                            secondary={
                                                <>
                                                    <Typography variant="body2" component="span" sx={{ display: 'block' }}>
                                                        {notification.message}
                                                    </Typography>
                                                    <Typography variant="caption" component="span" color="text.secondary">
                                                        {getTimeAgo(notification.timestamp)}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                        {!notification.read && (
                                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', ml: 1 }} />
                                        )}
                                    </NotificationItem>
                                ))
                            )}
                        </List>
                    </Menu>

                    <Tooltip title="계정 관리">
                        <IconButton
                            onClick={handleMenuOpen}
                            sx={{ color: theme.palette.mode === 'light' ? '#666666' : '#cccccc' }}
                        >
                            <AccountCircleIcon />
                        </IconButton>
                    </Tooltip>

                    <Menu
                        anchorEl={menuAnchorEl}
                        open={Boolean(menuAnchorEl)}
                        onClose={handleMenuClose}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem onClick={() => {
                            navigate(`/profile/edit/${id}`);
                            handleMenuClose();
                        }}>
                            <EditIcon fontSize="small" sx={{ mr: 1 }} />
                            프로필 편집
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout}>
                            <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                            로그아웃
                        </MenuItem>
                    </Menu>
                </HeaderRight>
            </HeaderBar>

            <ProfileContent>
                <ProfileHeader>
                    <StyledAvatar>
                        {userProfile.profileImage ? (
                            <Avatar src={userProfile.profileImage} sx={{ width: 120, height: 120 }} />
                        ) : (
                            <PersonIcon />
                        )}
                    </StyledAvatar>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 600,
                                color: theme.palette.mode === 'light' ? '#1a1a1a' : '#ffffff',
                            }}
                        >
                            {userProfile.name}
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: theme.palette.mode === 'light' ? '#666666' : '#cccccc',
                                mt: 0.5,
                            }}
                        >
                            {userProfile.nickname}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Typography
                            variant="body2"
                            sx={{ color: theme.palette.mode === 'light' ? '#666666' : '#cccccc' }}
                        >
                            만 {userProfile.age}세
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: theme.palette.mode === 'light' ? '#666666' : '#cccccc' }}
                        >
                            ·
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: theme.palette.mode === 'light' ? '#666666' : '#cccccc' }}
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
                                backgroundColor: theme.palette.mode === 'light' ? 'rgba(46, 125, 50, 0.1)' : 'rgba(129, 199, 132, 0.1)',
                                color: theme.palette.mode === 'light' ? '#2E7D32' : '#81c784',
                                border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(46, 125, 50, 0.2)' : 'rgba(129, 199, 132, 0.2)'}`,
                            }}
                        />
                    ))}
                </TagContainer>

                <Typography
                    variant="body1"
                    sx={{
                        color: theme.palette.mode === 'light' ? '#666666' : '#cccccc',
                        textAlign: 'center',
                        lineHeight: 1.6,
                    }}
                >
                    {userProfile.description}
                </Typography>
            </ProfileContent>

            {showLogoutConfirm && (
                <ConfirmModalContainer>
                    <ConfirmModalContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>로그아웃</Typography>
                        <Typography variant="body1">정말로 로그아웃 하시겠습니까?</Typography>
                        <ConfirmModalButtons>
                            <StyledButton
                                variant="outlined"
                                onClick={cancelLogout}
                            >
                                취소
                            </StyledButton>
                            <StyledButton
                                variant="contained"
                                color="error"
                                onClick={confirmLogout}
                            >
                                로그아웃
                            </StyledButton>
                        </ConfirmModalButtons>
                    </ConfirmModalContent>
                </ConfirmModalContainer>
            )}

            {showToast && (
                <NotificationContainer>
                    <ClickableArea onClick={() => {
                        handleToastClose();
                        if (currentToast?.type === 'like') {
                            navigate(`/profile/${currentToast.friendId}`);
                        } else if (currentToast?.type === 'chat') {
                            navigate(`/chat/${currentToast.friendId}`);
                        }
                    }}>
                        <ToastContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                {currentToast?.type === 'like' && (
                                    <Box sx={{ position: 'relative', mr: 1 }}>
                                        <HeartIcon />
                                    </Box>
                                )}
                                {currentToast?.type === 'chat' && (
                                    <Box sx={{ position: 'relative', mr: 1 }}>
                                        <ChatIcon sx={{ color: '#2196f3', animation: `${heartBeat} 1.3s ease-in-out` }} />
                                    </Box>
                                )}
                                {currentToast?.type === 'match' && (
                                    <Box sx={{ position: 'relative', mr: 1 }}>
                                        <PeopleIcon sx={{ color: '#4caf50', animation: `${heartBeat} 1.3s ease-in-out` }} />
                                    </Box>
                                )}
                                <Avatar src={currentToast?.avatar} sx={{ width: 48, height: 48 }} />
                                <ToastMessage>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {currentToast?.title}
                                    </Typography>
                                    <Typography variant="body2">
                                        {currentToast?.message}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                                        지금 • 탭하여 {currentToast?.type === 'chat' ? '채팅하기' : '확인하기'}
                                    </Typography>
                                </ToastMessage>
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleToastClose();
                                    }}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </ToastContent>
                    </ClickableArea>
                </NotificationContainer>
            )}
        </PageContainer>
    );
};

const App: React.FC = () => {
    return (
        <ThemeLayout>
            <ProfilePage />
        </ThemeLayout>
    );
};

export default App;