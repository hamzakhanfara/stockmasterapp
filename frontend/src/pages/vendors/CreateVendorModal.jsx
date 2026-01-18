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
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { STATE } from '../../constants';

export const CreateVendorModal = ({ open, onClose, onConfirm, loading, error }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
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
      setFormData({ name: '', description: '' });
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
        <TextField
          fullWidth
          label={t('vendor.vendorName') || 'Vendor Name'}
          name="name"
          value={formData.name}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Ex: Vendor ABC"
          autoFocus
        />
        <TextField
          fullWidth
          label={t('vendor.vendorDescription') || 'Description (optional)'}
          name="description"
          value={formData.description}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Ex: Store Bio products supplier"
          multiline
          minRows={2}
          sx={{ mt: 2 }}
        />
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
