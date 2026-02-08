import React from 'react';
import { Paper, Stack, Typography, Button, IconButton, Box, Divider, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { HeatPump } from '@mui/icons-material';
import { formatCurrency } from '../../utils/currency';

export default function POSCart({
  cart,
  onInc,
  onDec,
  onRemove,
  subTotal,
  tax,
  total,
  onClear,
  onCheckout,
  onParkSale,
  onDiscount,
  onScan,
  productBarcodes = [],
}) {
  const { t } = useTranslation();
  const [scanValue, setScanValue] = React.useState('');
  const scanRef = React.useRef(null);
  const cartEmpty = !Array.isArray(cart) || cart.length === 0;

  React.useEffect(() => {
    if (scanRef.current) {
      scanRef.current.focus();
    }
  }, []);

  return (
    <Paper elevation={0} sx={{ p: { xs: 1.5, md: 2 }, borderRadius: 2, boxShadow: '0 2px 8px #eef0f3', height: { xs: 'auto', md: '100%' }, display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{t('pos.currentCart')}</Typography>
        <Button variant="text" color="error" onClick={onClear}>{t('pos.emptyCart')}</Button>
      </Stack>

      <TextField
        placeholder={t('pos.scanBarcode')}
        value={scanValue}
        inputRef={scanRef}
        onChange={(e) => {
          const next = e.target.value;
          setScanValue(next);
          const code = next.trim();
          if (code && productBarcodes.includes(code)) {
            onScan && onScan(code);
            setScanValue('');
            requestAnimationFrame(() => scanRef.current && scanRef.current.focus());
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            const code = scanValue.trim();
            if (code) {
              onScan && onScan(code);
              setScanValue('');
              // keep focus for continuous scanning
              requestAnimationFrame(() => scanRef.current && scanRef.current.focus());
            }
          }
        }}
        size="small"
        sx={{ mb: 2, '& .MuiInputBase-root': { height: 40 } }}
      />

      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Stack spacing={1}>
          {cart.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>{t('pos.noItems')}</Typography>
          ) : cart.map(i => (
            <Paper key={i.id} variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Box>
                  <Typography variant="subtitle2">{i.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{t('pos.pricePerUnit')}: {formatCurrency(i.unitPrice)}</Typography>
                </Box>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <IconButton size="small" onClick={() => onDec(i.id)}><RemoveIcon /></IconButton>
                  <Typography variant="body2" sx={{ minWidth: 24, textAlign: 'center' }}>{i.units}</Typography>
                  <IconButton size="small" onClick={() => onInc(i.id)}><AddIcon /></IconButton>
                </Stack>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatCurrency(i.totalCost)}</Typography>
                <IconButton size="small" color="error" onClick={() => onRemove(i.id)}><DeleteIcon /></IconButton>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Box>

      <Divider sx={{ my: 2 }} />
      <Stack spacing={1} alignItems="flex-end" sx={{ mt: 'auto' }}>
        <Typography variant="body2">{t('pos.subtotal')}: {formatCurrency(subTotal)}</Typography>
        <Typography variant="body2">{t('pos.tax')}: {formatCurrency(tax)}</Typography>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>{t('pos.total')}: {formatCurrency(total)}</Typography>
      </Stack>

      <Box sx={{ mt: 2, position: { xs: 'sticky', sm: 'static' }, bottom: 0, bgcolor: 'background.paper', pt: 2, pb: { xs: 1.5, sm: 0 }, boxShadow: { xs: '0 -2px 8px rgba(0,0,0,0.03)', sm: 'none' } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button variant="outlined" onClick={onParkSale} disabled={cartEmpty} sx={{ width: { xs: '100%', sm: 'auto' } }}>{t('pos.parkSale')}</Button>
          <Button variant="outlined" onClick={onDiscount} sx={{ width: { xs: '100%', sm: 'auto' } }}>{t('pos.discount')}</Button>
          <Button variant="contained" color="primary" onClick={onCheckout} disabled={cartEmpty} sx={{ width: { xs: '100%', sm: 'auto' } }}>{t('pos.checkout')}</Button>
        </Stack>
      </Box>
    </Paper>
  );
}