import React from 'react';
import {
  Drawer,
  Box,
  Stack,
  Typography,
  Divider,
  Chip,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../utils/currency';


export default function OrderDetailsDrawer({ open, onClose, order, loading, onPrint }) {
  const { t } = useTranslation();

  const items = order?.items || [];
  const subtotal = items.reduce((sum, it) => sum + parseFloat(it?.total || 0), 0);
  const tax = 0; // not modeled yet
  const discount = 0; // not modeled yet
  const total = order ? parseFloat(order.totalAmount || 0) : 0;

  return (
    <Drawer anchor="right" open={open} onClose={onClose} sx={{ zIndex: (theme) => theme.zIndex.modal + 2 }} PaperProps={{ sx: { width: 420 } }}>
      <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {t('orders.details.title', { number: order?.orderNumber || '' })}
            </Typography>
            {order?.customerName ? (
              <Typography variant="caption" color="text.secondary">
                {t('orders.details.customer')}: {order.customerName}
              </Typography>
            ) : null}
          </Box>
          <IconButton size="small" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Stack spacing={0.5}>
            <Typography variant="caption" color="text.secondary">
              {t('orders.details.status')}
            </Typography>
            <Chip size="small" label={order?.status || ''} color={order?.status === 'CONFIRMED' ? 'success' : order?.status === 'WAITING' ? 'warning' : 'default'} variant="outlined" />
          </Stack>
          <Stack spacing={0.5}>
            <Typography variant="caption" color="text.secondary">
              {t('orders.details.timestamp')}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <AccessTimeIcon fontSize="inherit" />
              <Typography variant="body2">
                {order?.createdAt ? new Date(order.createdAt).toLocaleString() : ''}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Stack spacing={0.5}>
            <Typography variant="caption" color="text.secondary">
              {t('orders.details.vendorStaff')}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <PersonOutlineIcon fontSize="inherit" />
              <Typography variant="body2">
                {order?.user?.email || t('common.na')}
              </Typography>
            </Stack>
          </Stack>
          <Stack spacing={0.5}>
            <Typography variant="caption" color="text.secondary">
              {t('orders.details.payment')}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <CreditCardIcon fontSize="inherit" />
              <Typography variant="body2">{t('common.na')}</Typography>
            </Stack>
          </Stack>
        </Stack>

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          {t('orders.details.itemizedList')}
        </Typography>
        <Divider />

        <Box sx={{ flex: 1, overflowY: 'auto', my: 1 }}>
          {loading ? (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
              <CircularProgress size={24} />
            </Stack>
          ) : (
            <List dense>
              {items.map((it) => (
                <ListItem key={it.id} secondaryAction={<Typography variant="body2">{formatCurrency(it.unitPrice)} x{it.quantity}</Typography>}>
                  <ListItemAvatar>
                    <Avatar variant="rounded">
                      <Inventory2OutlinedIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={it?.product?.name || ''}
                    secondary={it?.product?.barcode ? `${t('product.skuCode')}: ${it.product.barcode}` : ''}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        <Divider />
        <Box sx={{ mt: 2 }}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">{t('orders.details.subtotal')}</Typography>
            <Typography variant="body2">{formatCurrency(subtotal)}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">{t('orders.details.tax')}</Typography>
            <Typography variant="body2">{formatCurrency(tax)}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">{t('orders.details.discount')}</Typography>
            <Typography variant="body2" color="success.main">-{formatCurrency(discount)}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle2">{t('orders.details.totalAmount')}</Typography>
            <Typography variant="subtitle2">{formatCurrency(total)}</Typography>
          </Stack>
        </Box>

        <Box sx={{ pt: 2 }}>
          <Stack direction="row" spacing={1}>
            <Button variant="contained" onClick={onPrint}>{t('orders.details.printReceipt')}</Button>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
}
