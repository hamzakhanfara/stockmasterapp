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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { STATE } from '../../constants';

export const EditVendorModal = ({ open, vendor, onClose, onConfirm, loading, error }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'OTHER',
    contactName: '',
    contactNumber: '',
    contactEmail: '',
  });

  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name || '',
        description: vendor.description || '',
        category: vendor.category || '',
        contactName: vendor.contactName || '',
        contactNumber: vendor.contactNumber || '',
        contactEmail: vendor.contactEmail || '',
      });
    }
  }, [vendor, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleConfirm = async () => {
    await onConfirm(formData);
  };

  const isLoading = loading === STATE.PENDING;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {t('common.edit') || 'Modifier'} - {vendor?.name}
      </DialogTitle>
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
            <InputLabel id="edit-vendor-category-select-label">{t('vendor.category') || 'Category'}</InputLabel>
            <Select
              labelId="edit-vendor-category-select-label"
              id="edit-vendor-category-select"
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
            label={t('vendorMgmt.contactName') || 'Contact Name'}
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            disabled={isLoading}
          />
          <TextField
            label={t('vendorMgmt.contactNumber') || 'Contact Number'}
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            disabled={isLoading}
          />
          <TextField
            label={t('vendorMgmt.contactEmail') || 'Contact Email'}
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            disabled={isLoading}
            type="email"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          {t('common.cancel') || 'Annuler'}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={isLoading || !formData.name.trim()}
          sx={{ bgcolor: '#1976d2' }}
        >
          {isLoading ? <CircularProgress size={24} /> : t('common.save') || 'Confirmer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditVendorModal;
