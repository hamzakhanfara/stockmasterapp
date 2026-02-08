import React, { useEffect, useMemo, useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActionArea,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Button,
  CircularProgress,
  Box,
  Chip,
  Stack
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../../utils/currency';
import { STATE } from '../../../constants';

const VendorOrders = observer(({ vendorId, orderStore }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const fetchOrders = async () => {
      if (!vendorId || !orderStore || !orderStore.client) return;
      try {
        await orderStore.fetchListOrders();
      } catch (err) {
        console.error('[VendorOrders] Failed to fetch orders:', err);
      }
    };
    fetchOrders();
    return () => { mounted = false; };
  }, [vendorId, orderStore]);

  const loading = orderStore?.fetchState?.list === STATE.PENDING;
  const orders = orderStore?.ordersList || [];

  // Filter orders that contain products from this vendor
  const vendorOrders = useMemo(() => {
    if (!vendorId || !orders.length) return [];
    
    return orders
      .filter(order => {
        // Check if any item in the order belongs to this vendor
        return (order.items || []).some(item => item.product?.vendorId === vendorId);
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map(o => ({
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        amount: Number(o.totalAmount || 0),
        date: o.createdAt,
        itemsCount: (o.items || []).filter(item => item.product?.vendorId === vendorId).length
      }));
  }, [orders, vendorId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'success';
      case 'WAITING': return 'warning';
      case 'CANCELLED': return 'error';
      case 'DRAFT': return 'default';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    return t(`orders.status.${status.toLowerCase()}`) || status;
  };

  if (!orderStore) {
    return (
      <Card sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Typography color="error">{t('common.error')}</Typography>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <CardHeader title={t('vendor.recentOrders')} />
        <CardContent>
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <CardHeader 
        title={t('vendor.recentOrders')} 
        subheader={`${vendorOrders.length} ${t('vendor.orders')}`}
      />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {vendorOrders.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
            {t('vendor.noOrders')}
          </Typography>
        ) : (
          <List dense sx={{ width: '100%' }}>
            {vendorOrders.map(order => (
              <ListItem key={order.id} sx={{ px: 0 }}>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: '#bbdefb' }}>
                    <ReceiptIcon sx={{ color: 'info.main' }} />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {order.orderNumber}
                      </Typography>
                      <Chip
                        label={getStatusLabel(order.status)}
                        color={getStatusColor(order.status)}
                        size="small"
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                    </Stack>
                  }
                  secondary={
                    <Typography variant="body2">
                      {`${new Date(order.date).toLocaleDateString()} • ${order.itemsCount} ${t('orders.items')} • `}
                      <Typography component="span" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                        {formatCurrency(order.amount)}
                      </Typography>
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
      {vendorOrders.length > 0 && (
        <CardActionArea sx={{ justifyContent: 'center', display: 'flex', px: 2, paddingBottom: 2 }}>
          <Button
            onClick={() => navigate('/orders')}
            variant="outlined"
            size="medium"
            sx={{ width: '100%' }}
          >
            {t('vendor.viewAllOrders')}
          </Button>
        </CardActionArea>
      )}
    </Card>
  );
});

export default VendorOrders;
