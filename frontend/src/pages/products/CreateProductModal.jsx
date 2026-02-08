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
  IconButton,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { STATE } from '../../constants';
import BarcodeGenerator from '../../components/BarcodeGenerator';
import html2canvas from 'html2canvas';
import DownloadIcon from '@mui/icons-material/Download';


function generateBarcode8Digits() {
  return String(Math.floor(10000000 + Math.random() * 90000000));
}

const initialForm = {
  name: '',
  description: '',
  price: '',
  stock: '',
  lowStockAt: '',
  vendorId: '',
  barcode: '',
  category: 'ELECTRONICS',
};


export const CreateProductModal = ({ open, onClose, onConfirm, loading, error, vendorId, vendors }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(initialForm);

  // Génère un barcode UUID par défaut si vide à l'ouverture
  useEffect(() => {
    if (open && !formData.barcode) {
      setFormData((prev) => ({ ...prev, barcode: generateBarcode8Digits() }));
    }
    if (!open) {
      setFormData(initialForm);
    }
    // eslint-disable-next-line
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Si vendors est fourni (page Products), on laisse choisir le vendor
  const showVendorSelect = Array.isArray(vendors) && vendors.length > 0;

  const handleConfirm = async () => {
    if (formData.name.trim() && formData.price && formData.stock && formData.barcode && (showVendorSelect ? formData.vendorId : vendorId)) {
      await onConfirm({ ...formData, vendorId: showVendorSelect ? formData.vendorId : vendorId });
      setFormData(initialForm);
    }
  };

  const handleClose = () => {
    setFormData(initialForm);
    onClose();
  };

  const isLoading = loading === STATE.PENDING;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('product.addNewProduct') || 'Ajouter un produit'}</DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {/* Grid layout for two-column structure */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <TextField
            label={t('product.productName') || ''}
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={isLoading}
            autoFocus
          />
          <TextField
            label={t('product.skuCode') || 'SKU Code'}
            name="barcode"
            value={formData.barcode}
            onChange={handleChange}
            disabled={isLoading}
          />

          <Box sx={{ gridColumn: '1 / -1' }}>
            <TextField
              fullWidth
              label={t('product.productDescription') || ''}
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={isLoading}
              multiline
              minRows={3}
            />
          </Box>

          <TextField
            label={t('common.price') || ''}
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            disabled={isLoading}
          />
          <TextField
            label={t('common.initialStock') || ''}
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            disabled={isLoading}
          />

          <FormControl>
            <InputLabel id="category-select-label">{t('product.category') || 'Category'}</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              name="category"
              value={formData.category}
              label={t('product.category') || 'Category'}
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

          {showVendorSelect ? (
            <FormControl>
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
                {vendors.map((v) => (
                  <MenuItem key={v.id} value={v.id}>{v.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <Box>
              <TextField
                fullWidth
                label="Vendor ID"
                name="vendorId"
                value={vendorId}
                disabled={true}
                sx={{ bgcolor: '#f5f5f5' }}
              />
            </Box>
          )}

          <TextField
            label={t('common.lowStockAt') || ''}
            name="lowStockAt"
            type="number"
            value={formData.lowStockAt}
            onChange={handleChange}
            disabled={isLoading}
          />
        </Box>

        {/* Barcode preview & download */}
        {formData.barcode && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Box id="barcode-download-area" sx={{ mb: 1, display: 'inline-block', bgcolor: '#fff', p: 2, borderRadius: 2 }}>
              <BarcodeGenerator value={formData.barcode} style={{ width: 220, height: 60 }} />
              <Box sx={{ fontSize: 12, color: '#888', mt: 1 }}>{formData.barcode}</Box>
            </Box>
            <IconButton
              variant="outlined"
              size="small"
              sx={{ ml: 2, mt: 1 }}
              onClick={async () => {
                const area = document.getElementById('barcode-download-area');
                if (!area) return;
                const canvas = await html2canvas(area);
                const link = document.createElement('a');
                link.download = `barcode-${formData.barcode}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
              }}
            ><DownloadIcon /></IconButton>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          {t('common.cancel') || 'Annuler'}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={isLoading || !formData.name.trim() || !formData.price || !formData.stock || (showVendorSelect && !formData.vendorId)}
          sx={{ bgcolor: '#1976d2' }}
        >
          {isLoading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : t('common.create') || 'Créer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProductModal;
