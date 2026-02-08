import React, { useState } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { STATE } from '../../constants';

export const CreateVendorModal = ({ open, onClose, onConfirm, loading, error }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'OTHER',
    contactName: '',
    contactNumber: '',
    contactEmail: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleConfirm = async () => {
    if (formData.name.trim()) {
      await onConfirm(formData);
      setFormData({ name: '', description: '', category: 'OTHER', contactName: '', contactNumber: '', contactEmail: '' });
    }
  };

  const handleClose = () => {
    setFormData({ name: '', description: '' });
    onClose();
  };

  const isLoading = loading === STATE.PENDING;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('vendor.addNewVendor') || 'Ajouter un nouveau Vendor'}</DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <TextField
            label={t('vendor.vendorName') || 'Vendor Name'}
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={isLoading}
            autoFocus
          />
          <FormControl>
            <InputLabel id="vendor-category-select-label">{t('vendor.category') || 'Category'}</InputLabel>
            <Select
              labelId="vendor-category-select-label"
              id="vendor-category-select"
              name="category"
              value={formData.category}
              label={t('vendor.category') || 'Category'}
              onChange={handleChange}
              disabled={isLoading}
            >
              <MenuItem value="ELECTRONICS">{t('categories.electronics') || 'Electronics'}</MenuItem>
              <MenuItem value="FURNITURE">{t('categories.furniture') || 'Furniture'}</MenuItem>
              <MenuItem value="ACCESSORIES">{t('categories.accessories') || 'Accessories'}</MenuItem>
              <MenuItem value="FOOD_DRINK">{t('categories.foodAndDrink') || 'Food & Drink'}</MenuItem>
              <MenuItem value="OTHER">{t('categories.other') || 'Other'}</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ gridColumn: '1 / -1' }}>
            <TextField
              fullWidth
              label={t('vendor.vendorDescription') || 'Description (optional)'}
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={isLoading}
              multiline
              minRows={2}
            />
          </Box>
          <TextField
            label={t('vendor.contactName') || 'Contact Name'}
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            disabled={isLoading}
          />
          <TextField
            label={t('vendor.contactNumber') || 'Contact Number'}
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            disabled={isLoading}
          />
          <TextField
            label={t('vendor.contactEmail') || 'Contact Email'}
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            disabled={isLoading}
            type="email"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          {t('common.cancel') || 'Annuler'}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={isLoading || !formData.name.trim()}
          sx={{ bgcolor: '#1976d2' }}
        >
          {isLoading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : t('common.create') || 'Créer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateVendorModal;
