import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress, Stack, Select, MenuItem, FormControl, InputLabel, TextField, InputAdornment, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Add as AddIcon } from '@mui/icons-material';
import { useAuth, useUser } from '@clerk/clerk-react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../context/useStoreHooks';
import { useApiClient } from '../../api/client';
import { STATE } from '../../constants';
import VendorsTable from './VendorsTable';
import VendorsHeaderStats from './VendorsHeaderStats';
import EditVendorModal from './EditVendorModal';
import CreateVendorModal from './CreateVendorModal';

export const Vendors = observer(() => {
  const { t } = useTranslation();
  const { user } = useUser();
  const rootStore = useStore();
  const vendorStore = rootStore.Vendor;
  const getClient = useApiClient();

  const [editingVendor, setEditingVendor] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [backendUserId, setBackendUserId] = useState(null);
  const [filters, setFilters] = useState({ preferred: 'all', category: 'all', status: 'all', sort: 'recent', search: '' });

  useEffect(() => {
    let mounted = true;

    const initAndFetch = async () => {
      try {
        if (!vendorStore.client) {
          const client = await getClient();
          if (mounted) {
            vendorStore.setClient(client);
          }
        }

        if (mounted) {
          await vendorStore.fetchListVendors();
        }
        // Récupérer l'userId backend
        if (mounted && vendorStore.client) {
          try {
            const me = await vendorStore.client.getCurrentUser();
            setBackendUserId(me.id || (me.user && me.user.id));
          } catch (e) {
            console.error('Erreur récupération user backend', e);
          }
        }
      } catch (err) {
        console.error('Error loading vendors:', err);
      }
    };

    initAndFetch();

    return () => {
      mounted = false;
    };
  }, []);

  const handleEditClick = (vendor) => {
    setEditingVendor(vendor);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingVendor(null);
    vendorStore.clearError();
  };

  const handleModalConfirm = async (formData) => {
    console.log('Updating vendor:', editingVendor.id, formData);
    try {
      await vendorStore.updateVendor(editingVendor.id, { 
        name: formData.name, 
        description: formData.description,
        category: formData.category,
        contactName: formData.contactName,
        contactNumber: formData.contactNumber,
        contactEmail: formData.contactEmail,
      });
      console.log('Update successful, refreshing list...');
      // Rafraîchir la liste après modification
      await vendorStore.fetchListVendors();
      console.log('List refreshed:', vendorStore.vendorslist);
      handleModalClose();
    } catch (err) {
      console.error('Error updating vendor:', err);
    }
  };

  const handleDelete = async (vendorId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce vendor?')) {
      try {
        await vendorStore.deleteVendor(vendorId);
      } catch (err) {
        console.error('Error deleting vendor:', err);
      }
    }
  };

  const handleAddProducts = (vendor) => {
    console.log('Ajouter des produits pour:', vendor.name);
    // À implémenter
  };

  const handleCreateClick = () => {
    setCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setCreateModalOpen(false);
    vendorStore.clearError();
  };

  const handleCreateConfirm = async (formData) => {
    try {
      console.log('Creating vendor:', formData, 'userId:', backendUserId);
      const extra = {
        category: formData.category,
        contactName: formData.contactName,
        contactNumber: formData.contactNumber,
        contactEmail: formData.contactEmail,
      };
      await vendorStore.createVendor(formData.name, backendUserId, formData.description, extra);
      console.log('Create successful, refreshing list...');
      await vendorStore.fetchListVendors();
      handleCreateModalClose();
    } catch (err) {
      console.error('Error creating vendor:', err);
    }
  };

  const isLoading = vendorStore.fetchState.list === STATE.PENDING;
  const hasError = vendorStore.error;

  const filteredVendors = (vendorStore.vendorslist || []).filter((v) => {
    const text = `${v.name || ''} ${v.description || ''}`.toLowerCase();
    if (filters.search && !text.includes(filters.search.toLowerCase())) return false;
    // Preferred: simple heuristic using description text
    if (filters.preferred === 'preferred') {
      const desc = (v.description || '').toLowerCase();
      if (!desc.includes('preferred')) return false;
    }
    // Status: heuristic based on updatedAt recency
    if (filters.status !== 'all') {
      const updated = v.updatedAt ? new Date(v.updatedAt) : null;
      const days = updated ? (Date.now() - updated.getTime()) / (1000 * 60 * 60 * 24) : Infinity;
      const isActive = days <= 60;
      if (filters.status === 'active' && !isActive) return false;
      if (filters.status === 'onhold' && isActive) return false;
    }
    // Category: match vendor.category (aligned to product categories)
    if (filters.category !== 'all') {
      const cat = v.category || '';
      if (cat !== filters.category) return false;
    }
    return true;
  }).sort((a, b) => {
    if (filters.sort === 'recent') {
      const ad = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const bd = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return bd - ad;
    }
    return 0;
  });

  return (
    <Box sx={{ p: 3 }}>
      <VendorsHeaderStats totalVendors={vendorStore.vendorslist?.length || 0} activeOrders={0} pendingShipments={0} />
      <Paper sx={{ p: { xs: 1.5, md: 2 }, mb: 3, mt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1.5, mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {t('sidebar.vendors') || 'Vendors'}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }} sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <TextField
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder={t('navbar.search') || 'Search suppliers, items...'}
              size="small"
              sx={{ width: { xs: '100%', sm: 280, md: 320 } }}
              InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateClick}
              sx={{ bgcolor: '#1976d2', color: '#fff' }}
            >
              {t('vendor.addVendor') || 'Ajouter'}
            </Button>
          </Stack>
        </Box>

        {/* Filters row */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }} sx={{ mb: 2, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }} sx={{ flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: { xs: 160, sm: 200, md: 240 } }}>
            <InputLabel>{t('vendorMgmt.filterAllVendors') || 'All Vendors'}</InputLabel>
            <Select autoWidth value={filters.preferred} label={t('vendorMgmt.filterAllVendors') || 'All Vendors'} onChange={(e) => setFilters({ ...filters, preferred: e.target.value })}>
              <MenuItem value="all">{t('common.all') || 'All'}</MenuItem>
              <MenuItem value="preferred">{t('vendorMgmt.preferred') || 'Preferred'}</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: { xs: 160, sm: 200, md: 240 } }}>
            <InputLabel>{t('vendorMgmt.category') || 'Category'}</InputLabel>
            <Select autoWidth value={filters.category} label={t('vendorMgmt.category') || 'Category'} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
              <MenuItem value="all">{t('common.all') || 'All'}</MenuItem>
              <MenuItem value="ELECTRONICS">{t('categories.electronics') || 'Electronics'}</MenuItem>
              <MenuItem value="FURNITURE">{t('categories.furniture') || 'Furniture'}</MenuItem>
              <MenuItem value="ACCESSORIES">{t('categories.accessories') || 'Accessories'}</MenuItem>
              <MenuItem value="FOOD_DRINK">{t('categories.foodAndDrink') || 'Food & Drink'}</MenuItem>
              <MenuItem value="OTHER">{t('categories.other') || 'Other'}</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: { xs: 160, sm: 200, md: 240 } }}>
            <InputLabel>{t('vendorMgmt.status') || 'Status'}</InputLabel>
            <Select autoWidth value={filters.status} label={t('vendorMgmt.status') || 'Status'} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <MenuItem value="all">{t('common.all') || 'All'}</MenuItem>
              <MenuItem value="active">{t('vendorMgmt.active') || 'Active'}</MenuItem>
              <MenuItem value="onhold">{t('vendorMgmt.onHold') || 'On Hold'}</MenuItem>
            </Select>
          </FormControl>
          </Stack>
          <FormControl size="small" sx={{ minWidth: { xs: 160, sm: 200, md: 240 } }}>
            <InputLabel>{t('vendorMgmt.sortBy') || 'Sort by'}</InputLabel>
            <Select autoWidth value={filters.sort} label={t('vendorMgmt.sortBy') || 'Sort by'} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
              <MenuItem value="recent">{t('vendorMgmt.recentlyActive') || 'Recently Active'}</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      <VendorsTable
        vendors={filteredVendors}
        loading={isLoading}
        error={hasError}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        onAddProducts={handleAddProducts}
      />

      <EditVendorModal
        open={modalOpen}
        vendor={editingVendor}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        loading={vendorStore.fetchState.update}
        error={vendorStore.error}
      />

      <CreateVendorModal
        open={createModalOpen}
        onClose={handleCreateModalClose}
        onConfirm={handleCreateConfirm}
        loading={vendorStore.fetchState.create}
        error={vendorStore.error}
      />
    </Box>
  );
});

export default Vendors;
