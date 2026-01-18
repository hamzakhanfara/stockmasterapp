import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const DeleteProductConfirmModal = ({ open, onClose, onConfirm, loading, product }) => {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t('product.deleteProduct') || 'Supprimer le produit'}</DialogTitle>
      <DialogContent>
        <Typography>
          {t('product.confirmDelete') || 'Êtes-vous sûr de vouloir supprimer ce produit ?'}
        </Typography>
        <Typography sx={{ mt: 2, fontWeight: 'bold' }}>
          {product?.name}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {t('common.cancel') || 'Annuler'}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : t('common.delete') || 'Supprimer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteProductConfirmModal;
