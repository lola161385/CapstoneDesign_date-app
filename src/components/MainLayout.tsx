import { Box, Container } from '@mui/material';
import styled from '@emotion/styled';
import Header from './Header';
import MainContent from './MainContent';

const LayoutContainer = styled(Box)`
  min-height: 100vh;
  background-color: #FAFAFA;
`;

const MainLayout = () => {
  return (
    <LayoutContainer>
      <Header />
      <Container 
        maxWidth="lg"
        sx={{
          paddingTop: '24px',
          paddingBottom: '48px'
        }}
      >
        <MainContent />
      </Container>
    </LayoutContainer>
  );
};

export default MainLayout; 