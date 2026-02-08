import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { Box, Container } from '@mui/material';

const SignUpPage = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <SignUp
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            redirectUrl="/dashboard"
          />
        </Box>
      </Container>
    </Box>
  );
};

export default SignUpPage;
