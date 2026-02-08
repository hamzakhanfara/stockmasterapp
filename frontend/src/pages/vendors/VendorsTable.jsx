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
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
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
      field: 'vendor',
      headerName: t('vendorMgmt.vendor') || 'Vendor',
      flex: 1.2,
      minWidth: 220,
      sortable: true,
      valueGetter: (params) => params?.row?.name ?? '',
      renderCell: (params) => {
        const name = params.row.name || 'N/A';
        const initials = name.split(' ').map(s => s[0]).join('').slice(0,2).toUpperCase();
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 32, height: 32 }}>{initials}</Avatar>
            <Box>
              <Link to={`/vendors/${params.row.id}`} style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 600 }}>{name}</Link>
              <Typography variant="caption" color="text.secondary">{params.row.id}</Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      field: 'contact',
      headerName: t('vendorMgmt.contactPerson') || 'Contact Person',
      flex: 1,
      minWidth: 180,
      valueGetter: (params) => params?.row?.userId ?? '',
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">{params?.value ? String(params.value).slice(0,8) + '...' : '-'}</Typography>
      ),
    },
    {
      field: 'category',
      headerName: t('vendor.category') || 'Category',
      flex: 0.8,
      minWidth: 160,
      sortable: false,
      renderCell: (params) => {
        const cat = params.row.category || '';
        const labelMap = {
          ELECTRONICS: t('categories.electronics') || 'Electronics',
          FURNITURE: t('categories.furniture') || 'Furniture',
          ACCESSORIES: t('categories.accessories') || 'Accessories',
          FOOD_DRINK: t('categories.foodAndDrink') || 'Food & Drink',
          OTHER: t('categories.other') || 'Other',
        };
        const label = labelMap[cat] || '-';
        const color = cat === 'OTHER' ? 'default' : 'info';
        return <Chip size="small" label={label} color={color} variant="outlined" />;
      },
    },
    {
      field: 'updatedAt',
      headerName: t('vendorMgmt.lastOrder') || 'Last Order',
      flex: 0.9,
      minWidth: 140,
      valueGetter: (params) => {
        const d = params?.row?.updatedAt ? new Date(params.row.updatedAt) : null;
        return d ? d.toLocaleDateString() : 'N/A';
      },
    },
    {
      field: 'status',
      headerName: t('vendorMgmt.status') || 'Status',
      flex: 0.6,
      minWidth: 120,
      sortable: false,
      renderCell: (params) => {
        const updated = params.row.updatedAt ? new Date(params.row.updatedAt) : null;
        const days = updated ? (Date.now() - updated.getTime()) / (1000*60*60*24) : Infinity;
        const isActive = days <= 60;
        return <Chip size="small" label={isActive ? (t('vendorMgmt.active') || 'Active') : (t('vendorMgmt.onHold') || 'On Hold')} color={isActive ? 'success' : 'warning'} variant="outlined" />;
      },
    },
    {
      field: 'actions',
      headerName: t('table.actions') || 'Actions',
      flex: 0.4,
      minWidth: 90,
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
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50, 100]}
        disableSelectionOnClick
        hideFooterSelectedRowCount
        disableColumnMenu
        initialState={{ sorting: { sortModel: [{ field: 'updatedAt', sort: 'desc' }] } }}
        sx={{ border: 0, '& .MuiDataGrid-columnHeaders': { bgcolor: '#fafafa' }, '& .MuiDataGrid-row': { height: 56 } }}
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