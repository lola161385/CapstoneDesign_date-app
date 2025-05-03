import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProfilePage from './pages/ProfilePage';
import FriendsPage from './pages/FriendsPage';
import WriteIntroPage from './pages/WriteIntroPage';
import IntroFormPage from './pages/IntroFormPage';
import MatchingPage from './pages/MatchingPage';
import ChatPage from './pages/ChatPage';
import Layout from './components/Layout';
import ProfileEditPage from './pages/ProfileEditPage';

const Router: React.FC = () => {
    return (
        <Layout>
            <Routes>
                <Route path="/profile/edit/:id" element={<ProfileEditPage />} />
                <Route path="/profile/:id" element={<ProfilePage />} />
                <Route path="/friends" element={<FriendsPage />} />
                <Route path="/write" element={<WriteIntroPage />} />
                <Route path="/write/intro" element={<IntroFormPage />} />
                <Route path="/matching" element={<MatchingPage />} />
                <Route path="/chat/:id" element={<ChatPage />} />
                <Route path="/" element={<Navigate to="/profile/1" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Layout>
    );
};

export default Router;