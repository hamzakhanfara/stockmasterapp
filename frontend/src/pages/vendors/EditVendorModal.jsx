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
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { STATE } from '../../constants';

export const EditVendorModal = ({ open, vendor, onClose, onConfirm, loading, error }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name || '',
        description: vendor.description || '',
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
        <TextField
          fullWidth
          label="Nom du Vendor"
          name="name"
          value={formData.name}
          onChange={handleChange}
          disabled={isLoading}
          autoFocus
        />
        <TextField
          fullWidth
          label="Description (optionnelle)"
          name="description"
          value={formData.description}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Ex: Magasin de produits bio"
          multiline
          minRows={2}
          sx={{ mt: 2 }}
        />
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
