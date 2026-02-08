import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  useMediaQuery,
  useTheme,
  TextField,
  InputAdornment,
  Button,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { Menu as MenuIcon, Search as SearchIcon, Language as LanguageIcon, Add as AddIcon } from '@mui/icons-material';
import { UserButton } from '@clerk/clerk-react';
import { useStore } from '../context/useStoreHooks';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Navbar = observer(() => {
  const store = useStore();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = () => {
    if (isDesktop) store.toggleSidebarCollapsed();
    else store.toggleSidebar();
  };

  const handleLangClick = (e) => setAnchorEl(e.currentTarget);
  const handleLangClose = () => setAnchorEl(null);

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    handleLangClose();
  };

  const handleCreateOrder = () => navigate('/pos');

  return (
    <AppBar position="fixed" color="default" sx={{ backgroundColor: '#ffffff', zIndex: (theme) => theme.zIndex.appBar }}>
      <Toolbar>
        <IconButton
          aria-label="open drawer"
          onClick={handleMenu}
          edge="start"
          sx={{ mr: 2, color: '#1976d2' }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
          <Typography
            variant="h6"
            onClick={() => navigate('/')}
            sx={{ margin: 0, fontSize: '1.25rem', color: '#111', fontWeight: 600, cursor: 'pointer' }}
          >
            {t('navbar.title')}
          </Typography>

          <TextField
            size="small"
            placeholder={t('navbar.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') console.log('Search:', search); }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#1976d2' }} />
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: '100%', sm: 240, md: 360 }, backgroundColor: '#f5f5f5', borderRadius: 1 }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon sx={{ color: '#fff' }} />}
            onClick={handleCreateOrder}
            sx={{ color: '#1976d2', textTransform: 'none' }}
          >
            <Typography sx={{ color: '#fff', textTransform: 'lowercase' }}>{t('navbar.createOrder')}</Typography>
          </Button>

          <IconButton onClick={handleLangClick} sx={{ color: '#1976d2' }}>
            <LanguageIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleLangClose}>
            <MenuItem onClick={() => changeLang('en')}>{t('languages.en')}</MenuItem>
            <MenuItem onClick={() => changeLang('ar')}>{t('languages.ar')}</MenuItem>
          </Menu>

          <UserButton />
        </Box>
      </Toolbar>
    </AppBar>
  );
});
