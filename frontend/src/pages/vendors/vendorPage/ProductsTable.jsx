


import React from 'react';
import { Typography, Box, Paper, Stack, Button, IconButton, Menu, MenuItem, Chip, Toolbar } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { downloadBarcodePng } from '../../../utils/barcodeDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import CreateProductModal from '../../products/CreateProductModal';
import EditProductModal from '../../products/EditProductModal';
import DeleteProductConfirmModal from '../../products/DeleteProductConfirmModal';
import AddStockModal from '../../products/AddStockModal';
import { formatCurrency } from '../../../utils/currency';


const ProductsTable = observer(({
  products,
  vendorId,
  productModalOpen,
  setProductModalOpen,
  productLoading,
  setProductLoading,
  productError,
  setProductError,
  onCreateProduct,
  vendors,
  onEdit,
  onDelete,
  onAddProducts,
  onAddStock
}) => {
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [editLoading, setEditLoading] = React.useState(false);
  const [editError, setEditError] = React.useState(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [addStockModalOpen, setAddStockModalOpen] = React.useState(false);
  const [addStockLoading, setAddStockLoading] = React.useState(false);
  const [addStockError, setAddStockError] = React.useState(null);
  const [selectedRows, setSelectedRows] = React.useState([]);

  const handleMenuOpen = (event, product) => {
    console.log('[ProductsTable] handleMenuOpen selected product:', product);
    setAnchorEl(event.currentTarget);
    setSelectedProduct(product);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    // Ne pas reset selectedProduct ici, pour garder la sélection pour la modale
  };
  const handleEdit = () => {
    console.log('[ProductsTable] handleEdit selectedProduct:', selectedProduct);
    setEditModalOpen(true);
    handleMenuClose();
  };
  const handleDelete = () => {
    setDeleteModalOpen(true);
    handleMenuClose();
  };
    // Callback pour édition produit
    const handleEditConfirm = async (id, formData) => {
      if (!id) return;
      try {
        setEditLoading(true);
        setEditError(null);
        if (onEdit) {
          await onEdit(id, formData); // Appelle le handler du parent (Products.jsx)
        }
        setEditModalOpen(false);
      } catch (err) {
        setEditError(err.message || 'Erreur modification produit');
      } finally {
        setEditLoading(false);
      }
    };

    // Callback pour suppression produit
    const handleDeleteConfirm = async () => {
      if (!selectedProduct) return;
      try {
        setDeleteLoading(true);
        if (onDelete) await onDelete(selectedProduct.id);
        setDeleteModalOpen(false);
      } finally {
        setDeleteLoading(false);
      }
    };
  // Ouvre le modal d'ajout de stock
  const handleAddStock = () => {
    setAddStockModalOpen(true);
    handleMenuClose();
  };

  // Callback pour ajout de stock
  const handleAddStockConfirm = async (delta) => {
    if (!selectedProduct || !selectedProduct.id) return;
    console.log('[ProductsTable] handleAddStockConfirm productId:', selectedProduct.id, 'delta:', delta);
    try {
      setAddStockLoading(true);
      setAddStockError(null);
      if (typeof window !== 'undefined' && window.productStore) {
        console.log('[ProductsTable] call window.productStore.updateProductStock with:', selectedProduct.id, delta);
        await window.productStore.updateProductStock(selectedProduct.id, delta);
      } else if (onAddStock) {
        console.log('[ProductsTable] call onAddStock with:', selectedProduct.id, delta);
        await onAddStock(selectedProduct.id, delta);
      }
      setAddStockModalOpen(false);
    } catch (err) {
      setAddStockError(err.message || 'Erreur ajout stock');
      console.error('[ProductsTable] handleAddStockConfirm error:', err);
    } finally {
      setAddStockLoading(false);
    }
  };

  const columns = [
    { field: 'name', headerName: t('product.productName') || 'Nom', flex: 1, minWidth: 120 },
    { field: 'description', headerName: t('product.productDescription') || 'Description', flex: 1, minWidth: 150 },
    { field: 'price', headerName: t('common.price') || 'Prix', flex: 0.5, minWidth: 120, type: 'number',
      renderCell: (params) => (
        <Typography variant="body2">{formatCurrency(params.value)}</Typography>
      )
    },
    {
      field: 'stock',
      headerName: t('common.stock') || 'Stock',
      flex: 0.5,
      minWidth: 100,
      type: 'number',
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const stock = params.row.stock;
        const lowStockAt = params.row.lowStockAt ?? 5;
        let color = 'success';
        let label = t('product.status.available') || 'Available';
        if (stock <= 0) {
          color = 'error';
          label = t('product.status.outOfStock') || 'Out of stock';
        } else if (stock <= lowStockAt) {
          color = 'warning';
          label = t('product.status.lowStock') || 'Low stock';
        }
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 60, width: '100%' }}>
            <Chip size="small" label={label} color={color} sx={{ fontWeight: 600, mb: 0.5 }} />
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#333' }}>{stock}</Typography>
          </Box>
        );
      },
    },
    {
      field: 'actions',
      headerName: t('table.actions') || 'Actions',
      flex: 0.9,
      minWidth: 160,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="small" onClick={(e) => handleMenuOpen(e, params.row)} sx={{ color: '#1976d2' }}>
            <MoreVertIcon />
          </IconButton>
          <IconButton
            size="small"
            color="primary"
            title="Télécharger code-barres"
            onClick={async (e) => {
              e.stopPropagation();
              const code = params.row.barcode || '';
              const productName = params.row.name || 'product';
              console.log('Download barcode:', code, params.row);
              if (!code) return;
              await downloadBarcodePng(code, `${productName}-barcode.png`);
            }}
          >
            <DownloadIcon />
          </IconButton>
        </Box>
      ),
    },
  ];


  // DataGrid attend un champ id unique
  let rows = [];
  let hasIdError = false;
  if (products && products.length > 0) {
    rows = products.map((p, idx) => {
      if (!p.id) hasIdError = true;
      return { ...p, id: p.id || `row-${idx}` };
    });
  }

  return (
    <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, bgcolor: '#fff', boxShadow: '0 2px 8px #f0f1f2', position: 'relative' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h6">{t('product.productsList') || 'Products List'}</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon sx={{ color: '#fff' }} />}
          sx={{ color: '#1976d2', textTransform: 'none', minWidth: 180, height: 46, fontSize: 16 }}
          onClick={() => setProductModalOpen(true)}
        >
          <Typography sx={{ color: '#fff', textTransform: 'lowercase' }}>{t('product.addProduct') || 'add Product'}</Typography>
        </Button>
      </Stack>
      {hasIdError && (
        <Typography color="error" sx={{ mb: 2 }}>
          Erreur : Un ou plusieurs produits n'ont pas de champ id. Vérifiez la réponse de l'API.
        </Typography>
      )}
      {selectedRows.length > 0 && (
        <Box sx={{ bgcolor: '#e3f2fd', mb: 1, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {selectedRows.length} selected
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton color="error" sx={{}}>
              <DeleteIcon />
            </IconButton>
            <Button variant="contained" color="primary" sx={{ bgcolor: '#1976d2', fontWeight: 600 }}>
              Create Order
            </Button>
          </Box>
        </Box>
      )}
      {(!products || products.length === 0) ? (
        <Typography color="text.secondary">Aucun produit pour l'instant.</Typography>
      ) : (
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 25]}
          checkboxSelection
          disableSelectionOnClick
          onSelectionModelChange={(ids) => setSelectedRows(Array.isArray(ids) ? ids : [])}
        />
      )}
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
          {t('common.edit') || 'Modifier'}
        </MenuItem>
        <MenuItem onClick={handleAddStock}>
          <AddIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
          {t('product.addStock') || 'Add more stock'}
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: '#d32f2f' }}>
          <DeleteIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
          {t('common.delete') || 'Supprimer'}
        </MenuItem>
      </Menu>
      <EditProductModal
        open={editModalOpen}
        onClose={() => { setEditModalOpen(false); setEditError(null); setSelectedProduct(null); }}
        onConfirm={handleEditConfirm}
        loading={editLoading}
        error={editError}
        product={selectedProduct}
        vendors={vendors}
      />
      <DeleteProductConfirmModal
        open={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setSelectedProduct(null); }}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        product={selectedProduct}
      />
      <AddStockModal
        open={addStockModalOpen}
        onClose={() => { setAddStockModalOpen(false); setAddStockError(null); }}
        onConfirm={handleAddStockConfirm}
        loading={addStockLoading}
        error={addStockError}
        product={selectedProduct}
      />
      <CreateProductModal
        open={productModalOpen}
        onClose={() => { setProductModalOpen(false); setProductError(null); }}
        onConfirm={onCreateProduct}
        loading={productLoading}
        error={productError}
        vendorId={vendorId}
        vendors={vendors}
      />
    </Paper>
  );
});

export default ProductsTable;