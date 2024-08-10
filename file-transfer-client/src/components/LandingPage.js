import React from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" gutterBottom>
        Welcome to File Sharer
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        fullWidth 
        onClick={handleRegister}
        style={{ marginBottom: '10px' }}
      >
        Register
      </Button>
      <Button 
        variant="contained" 
        color="secondary" 
        fullWidth 
        onClick={handleLogin}
      >
        Login
      </Button>
    </Container>
  );
};

export default LandingPage;
