import React from 'react';
import { Grid, Paper, Stack, Typography } from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useTranslation } from 'react-i18next';

const StatCard = ({ icon, title, value, subtitle }) => (
  <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider', width: '100%', height: '100px' }}>
    <Stack direction="row" spacing={2} alignItems="center">
      {icon}
      <Stack>
        <Typography variant="caption" color="text.secondary">{title}</Typography>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>{value}</Typography>
        {subtitle && <Typography variant="caption" color="success.main">{subtitle}</Typography>}
      </Stack>
    </Stack>
  </Paper>
);

export const VendorsHeaderStats = ({ totalVendors = 0, activeOrders = 0, pendingShipments = 0 }) => {
  const { t } = useTranslation();
  return (
    <Stack direction="row" spacing={2} sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <StatCard
            icon={<PeopleAltIcon color="primary" />}
            title={t('vendorMgmt.totalVendors') || 'Total Vendors'}
            value={totalVendors}
            subtitle={t('vendorMgmt.thisMonth') || '+ this month'}
        />
        <StatCard
            icon={<ShoppingCartIcon color="warning" />}
            title={t('vendorMgmt.activeOrders') || 'Active Orders'}
            value={activeOrders}
        />
        <StatCard
            icon={<LocalShippingIcon color="info" />}
            title={t('vendorMgmt.pendingShipments') || 'Pending Shipments'}
            value={pendingShipments}
        />
    </Stack>
  );
};

export default VendorsHeaderStats;
