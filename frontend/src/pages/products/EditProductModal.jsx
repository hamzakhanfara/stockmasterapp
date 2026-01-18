import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { STATE } from '../../constants';

const initialForm = {
  name: '',
  description: '',
  price: '',
  stock: '',
  lowStockAt: '',
  vendorId: '',
};

const EditProductModal = ({ open, onClose, onConfirm, loading, error, product, vendors }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(initialForm);
  useEffect(() => {
    // ...
  }, [open, product]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        stock: product.stock || '',
        lowStockAt: product.lowStockAt || '',
        vendorId: product.vendorId || '',
      });
    }
  }, [product, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirm = async () => {
    if (formData.name.trim() && formData.price && formData.stock && formData.vendorId) {
      await onConfirm(product.id, { ...formData });
    }
  };

  const handleClose = () => {
    setFormData(initialForm);
    onClose();
  };

  const isLoading = loading === STATE.PENDING;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('product.editProduct') || 'Modifier le produit'}</DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="vendor-select-label">{t('vendor.vendorName') || 'Vendor'}</InputLabel>
          <Select
            labelId="vendor-select-label"
            id="vendor-select"
            name="vendorId"
            value={formData.vendorId}
            label={t('vendor.vendorName') || 'Vendor'}
            onChange={handleChange}
            disabled={isLoading}
          >
            {vendors && vendors.map((v) => (
              <MenuItem key={v.id} value={v.id}>{v.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label={t('product.productName') || ''}
          name="name"
          value={formData.name}
          onChange={handleChange}
          disabled={isLoading}
          autoFocus
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label={t('product.productDescription') || ''}
          name="description"
          value={formData.description}
          onChange={handleChange}
          disabled={isLoading}
          multiline
          minRows={2}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label={t('common.price') || ''}
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          disabled={isLoading}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label={t('common.initialStock') || ''}
          name="stock"
          type="number"
          value={formData.stock}
          onChange={handleChange}
          disabled={isLoading}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label={t('common.lowStockAt') || ''}
          name="lowStockAt"
          type="number"
          value={formData.lowStockAt}
          onChange={handleChange}
          disabled={isLoading}
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          {t('common.cancel') || 'Annuler'}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={isLoading || !formData.name.trim() || !formData.price || !formData.stock || !formData.vendorId}
          sx={{ bgcolor: '#1976d2' }}
        >
          {isLoading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : t('common.save') || 'Enregistrer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductModal;
