import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { theme } from './theme';
import ProfilePage from './pages/ProfilePage';
import FriendsPage from './pages/FriendsPage';
import WriteIntroPage from './pages/WriteIntroPage';
import IntroFormPage from './pages/IntroFormPage';
import MatchingPage from './pages/MatchingPage';
import ChatPage from './pages/ChatPage';
import Layout from './components/Layout';

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <StyledThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<ProfilePage />} />
              <Route path="/friends" element={<FriendsPage />} />
              <Route path="/write" element={<WriteIntroPage />} />
              <Route path="/write/intro" element={<IntroFormPage />} />
              <Route path="/matching" element={<MatchingPage />} />
              <Route path="/chat/:id" element={<ChatPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </StyledThemeProvider>
    </MuiThemeProvider>
  );
}

export default App; 