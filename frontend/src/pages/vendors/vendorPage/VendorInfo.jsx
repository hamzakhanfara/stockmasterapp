import React from 'react';
import { Card, CardContent, Grid, Typography, Box, Chip, Divider, Stack } from '@mui/material';
import { observer } from 'mobx-react-lite';
import BusinessIcon from '@mui/icons-material/Business';
import CategoryIcon from '@mui/icons-material/Category';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import { useTranslation } from 'react-i18next';

const InfoRow = ({ icon: Icon, label, value, color = 'text.primary' }) => (
  <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ py: 1 }}>
    <Icon sx={{ fontSize: 20, color: 'text.secondary', mt: 0.25 }} />
    <Box sx={{ flex: 1 }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
        {label}
      </Typography>
      <Typography variant="body2" color={color} sx={{ fontWeight: 500 }}>
        {value || '-'}
      </Typography>
    </Box>
  </Stack>
);

const VendorInfo = observer(({ vendor }) => {
  const { t, i18n } = useTranslation();

  if (!vendor) return null;

  const getCategoryLabel = (category) => {
    if (!category) return t('categories.other');
    const categoryKey = category.toLowerCase().replace('_', '');
    return t(`categories.${categoryKey}`) || category;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={2} alignItems="center">
              <BusinessIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {vendor.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('vendor.info')}
                </Typography>
              </Box>
            </Stack>
            {vendor.category && (
              <Chip
                icon={<CategoryIcon />}
                label={getCategoryLabel(vendor.category)}
                color="primary"
                variant="outlined"
              />
            )}
          </Stack>

          <Divider />

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <InfoRow
                icon={DescriptionIcon}
                label={t('vendor.description')}
                value={vendor.description}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoRow
                icon={CategoryIcon}
                label={t('vendor.category')}
                value={getCategoryLabel(vendor.category)}
              />
            </Grid>
          </Grid>

          <Divider />

          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            {t('vendor.contactInfo')}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <InfoRow
                icon={PersonIcon}
                label={t('vendor.contactName')}
                value={vendor.contactName}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <InfoRow
                icon={PhoneIcon}
                label={t('vendor.contactNumber')}
                value={vendor.contactNumber}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <InfoRow
                icon={EmailIcon}
                label={t('vendor.contactEmail')}
                value={vendor.contactEmail}
                color="primary.main"
              />
            </Grid>
          </Grid>

          <Divider />

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <InfoRow
                icon={CalendarTodayIcon}
                label={t('common.createdAt')}
                value={formatDate(vendor.createdAt)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoRow
                icon={CalendarTodayIcon}
                label={t('common.updatedAt')}
                value={formatDate(vendor.updatedAt)}
              />
            </Grid>
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );
});

export default VendorInfo;
