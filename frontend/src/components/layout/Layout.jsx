import React from 'react';
import { Box } from '@mui/material';
import { Navbar } from '../Navbar';
import { Sidebar, DRAWER_WIDTH, COLLAPSED_WIDTH } from '../Sidebar';
import { useStore } from '../../context/useStoreHooks';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

export const Layout = observer(({ children }) => {
  const store = useStore();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const drawerWidth = store.sidebarCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', direction: isRTL ? 'rtl' : 'ltr' }}>
      <Navbar />
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          pt: 10,
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {children}
      </Box>
    </Box>
  );
});
