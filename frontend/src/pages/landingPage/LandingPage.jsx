import React from 'react';
import { Box, Container, Typography, Button, Card, CardContent, Stack, Grid, Avatar, Chip, AppBar, Toolbar, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SignInButton } from '@clerk/clerk-react';
import InventoryIcon from '@mui/icons-material/Inventory';
import StoreIcon from '@mui/icons-material/Store';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VideocamIcon from '@mui/icons-material/Videocam';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <InventoryIcon sx={{ fontSize: 40, color: '#fff' }} />,
      title: 'Inventory Tracking',
      description: 'Real-time stock level monitoring with automated low-stock alerts, barcode integration, and multi-location management.',
      color: '#2563eb',
    },
    {
      icon: <StoreIcon sx={{ fontSize: 40, color: '#fff' }} />,
      title: 'Vendor Management',
      description: 'Centralize supplier communications, manage purchase orders, and track delivery performance automatically in one place.',
      color: '#059669',
    },
    {
      icon: <PointOfSaleIcon sx={{ fontSize: 40, color: '#fff' }} />,
      title: 'Smart POS',
      description: 'A fast, intuitive point-of-sale system that works offline and syncs instantly with your global inventory once back online.',
      color: '#dc2626',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box sx={{ width: 40, height: 40, bgcolor: '#2563eb', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <InventoryIcon sx={{ color: '#fff', fontSize: 24 }} />
              </Box>
              <Typography variant="h6" sx={{ color: '#0f172a', fontWeight: 700 }}>
                StockMaster
              </Typography>
            </Stack>
            <Stack direction="row" spacing={4} sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button sx={{ color: '#64748b', textTransform: 'none', fontSize: 15 }}>Features</Button>
              <Button sx={{ color: '#64748b', textTransform: 'none', fontSize: 15 }}>Pricing</Button>
              <Button sx={{ color: '#64748b', textTransform: 'none', fontSize: 15 }}>Solutions</Button>
              <Button sx={{ color: '#64748b', textTransform: 'none', fontSize: 15 }}>About</Button>
            </Stack>
            <Stack direction="row" spacing={2}>
              <SignInButton mode="modal" redirectUrl="/dashboard">
                <Button sx={{ color: '#64748b', textTransform: 'none', fontSize: 15 }}>
                  Login
                </Button>
              </SignInButton>
              <SignInButton mode="modal" redirectUrl="/dashboard">
                <Button variant="contained" sx={{ bgcolor: '#2563eb', textTransform: 'none', borderRadius: 2, px: 3 }}>
                  Get Started
                </Button>
              </SignInButton>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 12 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Chip
                label="NEW: MULTI-WAREHOUSE SUPPORT"
                icon={<Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#2563eb', ml: 1 }} />}
                sx={{ width: 'fit-content', bgcolor: '#dbeafe', color: '#2563eb', fontWeight: 600, fontSize: 12 }}
              />
              <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: 36, md: 56 }, lineHeight: 1.1, color: '#0f172a' }}>
                Simplify Your{' '}
                <Typography component="span" sx={{ color: '#2563eb', fontWeight: 800, fontSize: { xs: 36, md: 56 } }}>
                  Business
                </Typography>{' '}
                Management
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b', fontSize: 18, lineHeight: 1.7 }}>
                The all-in-one platform for real-time inventory tracking, vendor relations, and seamless POS transactions. Scale your operations without the headache.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <SignInButton mode="modal" redirectUrl="/dashboard">
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ bgcolor: '#2563eb', textTransform: 'none', borderRadius: 2, px: 4, py: 1.5, fontSize: 16, fontWeight: 600 }}
                  >
                    Get Started
                  </Button>
                </SignInButton>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ pt: 2 }}>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: '#fff', py: { xs: 8, md: 16 } }}>
        <Container maxWidth="lg">
          <Stack spacing={2} alignItems="center" sx={{ mb: 8 }}>
            <Typography variant="overline" sx={{ color: '#2563eb', fontWeight: 700, letterSpacing: 2 }}>
              THE 3 PILLARS OF EFFICIENCY
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, textAlign: 'center', color: '#0f172a', maxWidth: 600 }}>
              Everything you need to manage your operations at scale
            </Typography>
                      <Grid container spacing={4}>
            {features.map((feature, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Card sx={{ height: '100%', borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none', bgcolor: '#f8fafc'}}>
                  <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Stack spacing={2}>
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: 2,
                          bgcolor: feature.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.7 }}>
                        {feature.description}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#f8fafc', py: 8, borderTop: '1px solid #e2e8f0' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box sx={{ width: 32, height: 32, bgcolor: '#2563eb', borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <InventoryIcon sx={{ color: '#fff', fontSize: 20 }} />
                  </Box>
                  <Typography variant="h6" sx={{ color: '#0f172a', fontWeight: 700 }}>
                    StockMaster
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: '#64748b', maxWidth: 360 }}>
                  Empowering retail businesses with intelligence-driven inventory management. Built for speed, scale, and global operations.
                </Typography>
                <Stack direction="row" spacing={2}>
                  <IconButton sx={{ color: '#64748b' }}>
                    <FacebookIcon />
                  </IconButton>
                  <IconButton sx={{ color: '#64748b' }}>
                    <TwitterIcon />
                  </IconButton>
                  <IconButton sx={{ color: '#64748b' }}>
                    <LinkedInIcon />
                  </IconButton>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={6} md={3}>
              <Stack spacing={2}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  Product
                </Typography>
                <Stack spacing={1}>
                  <Button sx={{ justifyContent: 'flex-start', color: '#64748b', textTransform: 'none' }}>Features</Button>
                  <Button sx={{ justifyContent: 'flex-start', color: '#64748b', textTransform: 'none' }}>Pricing</Button>
                  <Button sx={{ justifyContent: 'flex-start', color: '#64748b', textTransform: 'none' }}>Integrations</Button>
                  <Button sx={{ justifyContent: 'flex-start', color: '#64748b', textTransform: 'none' }}>Updates</Button>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={6} md={3}>
              <Stack spacing={2}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  Company
                </Typography>
                <Stack spacing={1}>
                  <Button sx={{ justifyContent: 'flex-start', color: '#64748b', textTransform: 'none' }}>About Us</Button>
                  <Button sx={{ justifyContent: 'flex-start', color: '#64748b', textTransform: 'none' }}>Careers</Button>
                  <Button sx={{ justifyContent: 'flex-start', color: '#64748b', textTransform: 'none' }}>Legal</Button>
                  <Button sx={{ justifyContent: 'flex-start', color: '#64748b', textTransform: 'none' }}>Privacy Policy</Button>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
          <Typography variant="body2" sx={{ color: '#94a3b8', textAlign: 'center', mt: 8 }}>
            © 2024 StockMaster Inc. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
