import React, {useEffect, useState} from 'react';
import OrdersTable from './OrdersTable';
import { Paper, Stack, Typography, Button, Skeleton, Grid, Box } from '@mui/material';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useApiClient } from '../../api/client';
import { useStore } from '../../context/useStoreHooks';
import { STATE } from '../../constants/index';
import { observer } from 'mobx-react-lite';
import OrderDetailsDrawer from './OrderDetailsDrawer';
import { formatCurrency } from '../../utils/currency';



const OrdersStats = observer(() => {
  const rootStore = useStore();
  const orderStore = rootStore.Order;
  const { t } = useTranslation();
  const loading = orderStore.fetchState.stats === STATE.PENDING;
  const s = orderStore.orderStats || {};
  const activeOrders = (s.confirmedCount || 0) + (s.waitingCount || 0);
  const delayedCount = s.cancelledCount || 0;

  const Card = ({ title, value, subtitle, Icon, iconColor }) => (
    <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider', width: '100%' }}>
      <Stack spacing={1}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="caption" sx={{ letterSpacing: 0.5, color: 'text.secondary' }}>{title}</Typography>
          {Icon ? <Icon sx={{ color: iconColor }} /> : null}
        </Stack>
        {loading ? (
          <Skeleton width={80} height={36} />
        ) : (
          <Typography variant="h5" sx={{ fontWeight: 600 }}>{value}</Typography>
        )}
        <Typography variant="caption" sx={{ color: subtitle?.color || 'text.secondary' }}>{subtitle?.text || ''}</Typography>
      </Stack>
    </Paper>
  );

  return (
      <Grid container spacing={2} sx={{ alignItems: 'stretch', width: '100%' }}>
        <Grid item xs={12} md={4}>
          <Card
          title={t('orders.stats.totalOrders')}
          value={s.totalOrders || 0}
          subtitle={{ text: `+ ${s.ordersThisMonth || 0} ${t('orders.stats.thisMonth')}`, color: 'success.main' }}
          Icon={PeopleAltOutlinedIcon}
          iconColor={'#1e88e5'}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
          title={t('orders.stats.activeOrders')}
          value={activeOrders}
          subtitle={{ text: `${t('orders.stats.totalValue')}: ${formatCurrency(s.totalRevenue || 0)}` }}
          Icon={ShoppingCartOutlinedIcon}
          iconColor={'#fb8c00'}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
          title={t('orders.stats.pendingShipments')}
          value={s.waitingCount || 0}
          subtitle={{ text: `${delayedCount} ${t('orders.stats.delayed')}`, color: 'error.main' }}
          Icon={LocalShippingOutlinedIcon}
          iconColor={'#5e35b1'}
          />
        </Grid>
      </Grid>
  );
});

const Orders = observer(() =>{
  const navigate = useNavigate();
  const rootStore = useStore();
  const orderStore = rootStore.Order;
  const getClient = useApiClient();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState(null);
  useEffect(() => {
    let mounted = true;
    const initAndFetch = async () => {
        try {
            if (!orderStore.client) {
                const client = await getClient();
                if (mounted) orderStore.setClient(client);
            }
        if (mounted) {
          await orderStore.fetchListOrders();
          await orderStore.fetchStats();
        }
        } catch (err) {
            console.error('Error loading orders:', err);
        }
    };
    initAndFetch();
    return () => { mounted = false; };
  }, []);
  const { t } = useTranslation();

  const handleView = async (orderId) => {
    setActiveOrderId(orderId);
    setDrawerOpen(true);
    try {
      await orderStore.getOrder(orderId);
    } catch (e) {
      // error already managed in store
    }
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setActiveOrderId(null);
    orderStore.clearSelectedOrder();
  };
  return (
    <Stack spacing={3}>
      <OrdersStats />
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{t('orders.history')}</Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ bgcolor: '#1976d2', color: '#fff' }}
          onClick={() => navigate('/orders/create')}
        >
          {t('orders.createNew') || 'Create New Order'}
        </Button>
      </Box>
      <OrdersTable ordersList={orderStore.ordersList} onView={handleView} />
      <OrderDetailsDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        order={orderStore.selectedOrder}
        loading={orderStore.fetchState.get === STATE.PENDING}
        onPrint={() => activeOrderId && orderStore.downloadOrderPdf(activeOrderId)}
      />
    </Stack>
  );
})
export default Orders;