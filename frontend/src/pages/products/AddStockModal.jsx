import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const AddStockModal = ({ open, onClose, onConfirm, loading, product }) => {
  const { t } = useTranslation();
  const [stockDelta, setStockDelta] = useState('');
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setStockDelta(e.target.value);
    setError(null);
  };

  const handleConfirm = () => {
    const delta = parseInt(stockDelta, 10);
    if (isNaN(delta)) {
      setError(t('common.invalidNumber') || 'Entrée invalide');
      return;
    }
    console.log('[AddStockModal] Confirm add stock delta:', delta, 'for product:', product);
    onConfirm(delta);
  };

  const handleClose = () => {
    setStockDelta('');
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t('product.addStock') || 'Ajouter du stock'}</DialogTitle>
      <DialogContent>
        <Typography>{t('product.currentStock') || 'Stock actuel'}: {product?.stock}</Typography>
        <TextField
          autoFocus
          margin="dense"
          label={t('product.addStockAmount') || 'Quantité à ajouter'}
          type="number"
          fullWidth
          value={stockDelta}
          onChange={handleChange}
          disabled={loading}
          error={!!error}
          helperText={error}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          {t('common.cancel') || 'Annuler'}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={loading}
          sx={{ bgcolor: '#1976d2' }}
        >
          {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : t('product.addStock') || 'Ajouter'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStockModal;
