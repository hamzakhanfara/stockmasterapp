import React, { useEffect, useMemo } from 'react';
import { Box, Card, CardContent, Grid, Typography, CircularProgress, Alert, Stack, List, ListItem, ListItemText, Divider, Button, Container, CardHeader, CardActionArea, ListItemAvatar, Avatar, ListItemIcon, styled, Paper } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupIcon from '@mui/icons-material/Group';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../context/useStoreHooks';
import { useApiClient } from '../../api/client';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { formatCurrency } from '../../utils/currency';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { blue } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';

const currency = (n) => formatCurrency(n);

export const Dashboard = observer(() => {
  const { t } = useTranslation();
  const rootStore = useStore();
  const productStore = rootStore.Product;
  const orderStore = rootStore.Order;
  const vendorStore = rootStore.Vendor;
  const getClient = useApiClient();
  const navigate = useNavigate();
  const navigatetoRoute = (path) => {
    navigate(path);
  };

  const loading = (
    productStore.fetchState.list === 'pending' ||
    orderStore.fetchState.list === 'pending' ||
    vendorStore.fetchState.list === 'pending'
  );
  const error = productStore.error || orderStore.error || vendorStore.error;

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const client = await getClient();
        if (!productStore.client) productStore.setClient(client);
        if (!orderStore.client) orderStore.setClient(client);
        if (!vendorStore.client) vendorStore.setClient(client);
        await Promise.all([
          productStore.fetchListProducts(),
          orderStore.fetchListOrders(),
          vendorStore.fetchListVendors()
        ]);
      } catch (e) {
        // errors handled in stores
      }
    };
    init();
    return () => { mounted = false; };
  }, []);

  // Metrics
  const totalStockValue = useMemo(() => {
    return (productStore.productsList || []).reduce((sum, p) => sum + Number(p.price || 0) * Number(p.stock || 0), 0);
  }, [productStore.productsList]);

  const lowStockAlerts = useMemo(() => {
    return (productStore.productsList || []).filter(p => Number(p.stock || 0) <= Number(p.lowStockAt || 0)).length;
  }, [productStore.productsList]);

  const todaysSales = useMemo(() => {
    const today = new Date();
    const isSameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    return (orderStore.ordersList || [])
      .filter(o => o.status === 'CONFIRMED' && o.createdAt && isSameDay(new Date(o.createdAt), today))
      .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
  }, [orderStore.ordersList]);

  const totalVendors = useMemo(() => (vendorStore.vendorslist || []).length, [vendorStore.vendorslist]);

  // Weekly revenue from orders
  const weeklyRevenue = useMemo(() => {
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 6);
    const buckets = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
      buckets[key] = { name: days[d.getDay()], sales: 0 };
    }
    (orderStore.ordersList || []).forEach(o => {
      if (o.status !== 'CONFIRMED' || !o.createdAt) return;
      const d = new Date(o.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
      if (buckets[key]) buckets[key].sales += Number(o.totalAmount || 0);
    });
    return Object.values(buckets);
  }, [orderStore.ordersList]);

  // Recent sales
  const recentSales = useMemo(() => {
    return (orderStore.ordersList || [])
      .slice()
      .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0,5)
      .map(o => ({ id: o.id, orderNumber: o.orderNumber, amount: Number(o.totalAmount || 0), date: o.createdAt }));
  }, [orderStore.ordersList]);

  // Low stock inventory
  const lowStockInventory = useMemo(() => {
    return (productStore.productsList || [])
      .filter(p => Number(p.stock || 0) <= Number(p.lowStockAt || 0))
      .slice(0,5);
  }, [productStore.productsList]);

  // Top selling products by quantity from Orders items
  const topSelling = useMemo(() => {
    const m = new Map();
    (orderStore.ordersList || []).forEach(o => {
      (o.items || []).forEach(it => {
        const name = it.product?.name || 'Unknown';
        const prev = m.get(name) || 0;
        m.set(name, prev + Number(it.quantity || 0));
      });
    });
    return Array.from(m.entries()).sort((a,b)=> b[1]-a[1]).slice(0,5).map(([name, qty]) => ({ name, qty }));
  }, [orderStore.ordersList]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 420 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  // Cards component
  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <Card sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', width: '100%' }}>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="caption" color="text.secondary">{title}</Typography>
          <Icon sx={{ color }} />
        </Stack>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>{value}</Typography>
        {subtitle ? <Typography variant="caption" color="text.secondary">{subtitle}</Typography> : null}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', padding: 2 }}>
      <Typography variant="h6" sx={{ color: 'text.secondary', mb: 0.5 }}>{t('dashboard.overviewTitle')}</Typography>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>{t('dashboard.welcome')}</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard title={t('dashboard.totalStockValue')} value={currency(totalStockValue)} icon={AttachMoneyIcon} color="#1e88e5" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard title={t('dashboard.lowStockAlerts')} value={lowStockAlerts} icon={WarningAmberIcon} color="#e53935" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard title={t('dashboard.todaysSales')} value={currency(todaysSales)} icon={TrendingUpIcon} color="#43a047" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard title={t('dashboard.totalVendors')} value={totalVendors} icon={GroupIcon} color="#5e35b1" />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', width: '100%', height: '100%' }}>
            <CardHeader title={t('dashboard.weeklyRevenue')} />
            <CardContent>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="sales" stroke="#1976d2" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <CardHeader title={t('dashboard.recentSales')} />
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <List dense>
                {recentSales.map(rs => (
                  <ListItem key={rs.id}>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: '#bbdefb' }}>
                        <ReceiptIcon sx={{ color: "info.main" }} />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary={rs.orderNumber} secondary={<Typography>{`${new Date(rs.date).toLocaleDateString()} • `}<Typography component="span" sx={{ fontWeight: 'bold', color: "success.main" }}>{currency(rs.amount)}</Typography></Typography>} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
            <CardActionArea sx={{ justifyContent: 'center', display: 'flex', px: 2, paddingBottom: 2 }}>
              <Button onClick={() => navigatetoRoute('/orders')} variant="outlined" size="medium" sx={{ width: '100%' }}>{t('dashboard.viewAllSales')}</Button>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', height: '100%' }}>
              <CardHeader title={t('dashboard.lowStockInventory')} />
              <CardContent>
                <List dense>
                  {lowStockInventory.length === 0 ? <Typography>{t('dashboard.noLowStock')}</Typography> : lowStockInventory.map(p => (
                    <ListItem key={p.id} sx={{ px: 0 }} secondaryAction={<Button size="small">{t('dashboard.restock')}</Button>}>
                      <ListItemText primary={p.name} secondary={`${t('common.stock')}: ${p.stock} • ${t('product.productPrice')}: ${currency(p.price)}`} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', height: '100%' }}>
              <CardHeader title={t('dashboard.topSellingProducts')} />
              <CardContent>
                <List dense>
                  {topSelling.length === 0 ? <Typography>{t('dashboard.noTopSelling')}</Typography> : topSelling.map(ts => (
                    <ListItem key={ts.name} sx={{ px: 0 }}>
                      <ListItemText primary={ts.name} secondary={`${ts.qty} ${t('orders.items')}`} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
        </Grid>
      </Grid>
      
    </Box>
  );
});
