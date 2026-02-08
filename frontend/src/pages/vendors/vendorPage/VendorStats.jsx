import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Grid, Paper, Card, CircularProgress, Stack, Icon, CardContent } from '@mui/material';
import { observer } from 'mobx-react-lite';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { formatCurrency } from '../../../utils/currency';
import { STATE } from '../../../constants';

const StatCard = ({ Icon, title, value, subtitle, bg }) => (
  <Card sx={{ bgcolor: bg || '#fff', borderRadius: 2, borderColor: 'divider', width: '100%', height: '100%' }}>
    <CardContent>
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography variant="caption" color="text.secondary">{title}</Typography>
        {Icon}
      </Stack>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>{value}</Typography>
        {subtitle ? <Typography variant="caption" sx={{ color: subtitle.color || 'text.secondary' }}>{subtitle.text}</Typography> : null}
    </CardContent>
  </Card>
);
const VendorStats = observer(({ vendorId, vendorStore}) => {
  console.log('[VendorStats] Props:', { vendorId, hasVendorStore: !!vendorStore, hasClient: !!vendorStore?.client });

  useEffect(() => {
    let mounted = true;
    const fetchStats = async () => {
      if (!vendorId || !vendorStore || !vendorStore.client) return;
      try {
        await vendorStore.fetchVendorStats(vendorId);
      } catch (err) {
        console.error('[VendorStats] Failed to fetch stats:', err);
      }
    };
    fetchStats();
    return () => { mounted = false; };
  }, [vendorId, vendorStore]);

  const loading = vendorStore?.fetchState?.stats === STATE.PENDING;
  const stats = vendorStore?.vendorStats;

  console.log('[VendorStats] State:', { loading, stats, fetchState: vendorStore?.fetchState?.stats });

  if (!vendorStore) {
    console.warn('[VendorStats] No vendorStore provided');
    return <Box p={3}><Typography color="error">Vendor store not initialized</Typography></Box>;
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (!stats) return null;

  const statsData = [
    {
      icon: <InsertChartIcon sx={{ fontSize: 32, color: '#ff5e5e' }} />,
      value: formatCurrency(stats.totalSales),
      label: 'Total Sales',
      sub: `${stats.salesChange >= 0 ? '+' : ''}${stats.salesChange}% from yesterday`,
      subColor: stats.salesChange >= 0 ? '#4cd964' : '#ff5e5e',
      bg: '#ffeaea',
    },
    {
      icon: <ReceiptIcon sx={{ fontSize: 32, color: '#ffb347' }} />,
      value: stats.totalOrders.toString(),
      label: 'Total Orders',
      sub: `${stats.ordersChange >= 0 ? '+' : ''}${stats.ordersChange}% from yesterday`,
      subColor: stats.ordersChange >= 0 ? '#4cd964' : '#ff5e5e',
      bg: '#fff6e5',
    },
    {
      icon: <CheckCircleIcon sx={{ fontSize: 32, color: '#4cd964' }} />,
      value: stats.productsSold.toString(),
      label: 'Products Sold',
      sub: `${stats.productsSoldChange >= 0 ? '+' : ''}${stats.productsSoldChange}% from yesterday`,
      subColor: stats.productsSoldChange >= 0 ? '#4cd964' : '#ff5e5e',
      bg: '#eafff2',
    },
  ];

    return (
      <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCard Icon={statsData[0].icon} title={statsData[0].label} value={statsData[0].value} subtitle={{ text: statsData[0].sub, color: statsData[0].subColor }} bg={statsData[0].bg} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCard Icon={statsData[1].icon} title={statsData[1].label} value={statsData[1].value} subtitle={{ text: statsData[1].sub, color: statsData[1].subColor }} bg={statsData[1].bg} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCard Icon={statsData[2].icon} title={statsData[2].label} value={statsData[2].value} subtitle={{ text: statsData[2].sub, color: statsData[2].subColor }} bg={statsData[2].bg} />
          </Grid>
      </Grid>
)});

export default VendorStats;
