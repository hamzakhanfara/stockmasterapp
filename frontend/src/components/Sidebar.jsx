import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Avatar,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Store as StoreIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUser } from '@clerk/clerk-react';
import { useStore } from '../context/useStoreHooks';
import { observer } from 'mobx-react-lite';

const DRAWER_WIDTH = 280;
const COLLAPSED_WIDTH = 80;

const navItems = [
  { label: 'Dashboard', labelKey: 'sidebar.dashboard', icon: <DashboardIcon />, path: '/' },
  { label: 'Vendors', labelKey: 'sidebar.vendors', icon: <StoreIcon />, path: '/vendors' },
  { label: 'Products', labelKey: 'sidebar.products', icon: <ShoppingCartIcon />, path: '/products' },
  { label: 'Orders', labelKey: 'sidebar.orders', icon: <ShoppingCartIcon />, path: '/orders' },
];

const settingsItems = [
  { label: 'Users', labelKey: 'sidebar.users', icon: <PersonIcon />, path: '/users' },
  { label: 'Settings', labelKey: 'common.settings', icon: <SettingsIcon />, path: '/settings' },
];

export const Sidebar = observer(({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const store = useStore();
  const { t, i18n } = useTranslation();
  const { user } = useUser();
  const isRTL = i18n.language === 'ar';

  const handleNavClick = (path) => {
    navigate(path);
    store.closeSidebar();
    if (onClose) onClose();
  };

  const isActive = (path) => location.pathname === path;

  const drawerContent = (
    <Box sx={{ width: store.sidebarCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* User Profile Section */}
      <Box
        sx={{
          p: 2,
          pt: 10,
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: store.sidebarCollapsed ? 'center' : 'flex-start',
          gap: 2,
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Avatar
          src={user?.imageUrl}
          alt={user?.fullName || 'User'}
          sx={{
            width: store.sidebarCollapsed ? 48 : 56,
            height: store.sidebarCollapsed ? 48 : 56,
            bgcolor: '#1976d2',
            fontSize: '1.25rem',
          }}
        >
          {user?.firstName?.charAt(0) || 'U'}
        </Avatar>
        {!store.sidebarCollapsed && (
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#111' }}>
              {user?.fullName || 'User'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#666' }}>
              {user?.primaryEmailAddress?.emailAddress}
            </Typography>
          </Box>
        )}
      </Box>

      <List sx={{ flex: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={isActive(item.path)}
              onClick={() => handleNavClick(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(25, 103, 210, 0.08)',
                  borderLeft: '4px solid #1967d2',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={t(item.labelKey)} sx={{ display: store.sidebarCollapsed ? 'none' : 'block', pl: 2 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {settingsItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={isActive(item.path)}
              onClick={() => handleNavClick(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(25, 103, 210, 0.08)',
                  borderLeft: '4px solid #1967d2',
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={t(item.labelKey)} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="permanent"
        anchor={isRTL ? 'right' : 'left'}
        sx={{
          width: store.sidebarCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: store.sidebarCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
            boxSizing: 'border-box',
            mt: '64px',
            overflowX: 'hidden',
          },
          display: { xs: 'none', md: 'block' },
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        anchor={isRTL ? 'right' : 'left'}
        open={store.sidebarOpen}
        onClose={() => store.closeSidebar()}
        sx={{
          display: { xs: 'block', md: 'none' },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
});

export { DRAWER_WIDTH, COLLAPSED_WIDTH };
