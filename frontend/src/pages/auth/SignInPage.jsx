import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Box, Container } from '@mui/material';

const SignInPage = () => {
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
          <SignIn
            routing="path"
            path="/sign-in"
            redirectUrl="/dashboard"
            appearance={{
              elements: {
                footerAction: { display: 'none !important' },
                footer: { display: 'none !important' },
                footerActionLink: { display: 'none !important' },
              },
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default SignInPage;
