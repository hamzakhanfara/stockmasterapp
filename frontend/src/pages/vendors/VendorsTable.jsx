import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  TablePagination,
} from '@mui/material';
import { MoreVert as MoreVertIcon, Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { STATE } from '../../constants';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';

export const VendorsTable = observer(({ vendors, loading, error, onEdit, onDelete, onAddProducts }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const { t } = useTranslation();

  const handleMenuOpen = (event, vendor) => {
    setAnchorEl(event.currentTarget);
    setSelectedVendor(vendor);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVendor(null);
  };

  const handleEdit = () => {
    if (selectedVendor) {
      onEdit(selectedVendor);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedVendor) {
      onDelete(selectedVendor.id);
    }
    handleMenuClose();
  };

  const handleAddProducts = () => {
    if (selectedVendor) {
      onAddProducts(selectedVendor);
    }
    handleMenuClose();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!vendors || vendors.length === 0) {
    return (
      <Box sx={{ mt: 4, p: 3, textAlign: 'center', bgcolor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="h6" sx={{ color: '#999' }}>
          {t('common.noData') || 'Aucun vendor'}
        </Typography>
      </Box>
    );
  }

  const columns = [
    {
      field: 'name',
      headerName: t('table.name') || 'Nom',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Link to={`/vendors/${params.row.id}`} style={{ color: '#1976d2', textDecoration: 'underline', cursor: 'pointer' }}>
          {params.value || 'N/A'}
        </Link>
      ),
    },
    { field: 'description', headerName: t('table.description') || 'Description', flex: 1, minWidth: 150 },
    { field: 'createdAt', headerName: t('table.createdAt') || 'Créé le', flex: 0.7, minWidth: 110, valueGetter: (params) => params.value ? new Date(params.value).toLocaleDateString() : 'N/A' },
    { field: 'updatedAt', headerName: t('table.updatedAt') || 'Modifié le', flex: 0.7, minWidth: 110, valueGetter: (params) => params.value ? new Date(params.value).toLocaleDateString() : 'N/A' },
    {
      field: 'actions',
      headerName: t('table.actions') || 'Actions',
      flex: 0.7,
      minWidth: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton size="small" onClick={(e) => handleMenuOpen(e, params.row)} sx={{ color: '#1976d2' }}>
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ];

  const rows = vendors.map((v) => ({ ...v, id: v.id }));

  return (
    <Box sx={{ width: '100%', bgcolor: 'white', mt: 3 }}>
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 25]}
        disableSelectionOnClick
        sx={{ border: 0 }}
      />
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
        <MenuItem onClick={handleAddProducts}>
          <AddIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
          Ajouter des produits
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: '#d32f2f' }}>
          <DeleteIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
          {t('common.delete') || 'Supprimer'}
        </MenuItem>
      </Menu>
    </Box>
  );
});

export default VendorsTable;