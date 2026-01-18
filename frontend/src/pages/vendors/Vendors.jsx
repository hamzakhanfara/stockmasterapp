import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAuth, useUser } from '@clerk/clerk-react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../context/useStoreHooks';
import { useApiClient } from '../../api/client';
import { STATE } from '../../constants';
import VendorsTable from './VendorsTable';
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
      await vendorStore.updateVendor(editingVendor.id, { name: formData.name, description: formData.description });
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
      await vendorStore.createVendor(formData.name, backendUserId, formData.description);
      console.log('Create successful, refreshing list...');
      await vendorStore.fetchListVendors();
      handleCreateModalClose();
    } catch (err) {
      console.error('Error creating vendor:', err);
    }
  };

  const isLoading = vendorStore.fetchState.list === STATE.PENDING;
  const hasError = vendorStore.error;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          {t('sidebar.vendors') || 'Vendors'}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateClick}
          sx={{ bgcolor: '#1976d2', color: '#fff' }}
        >
          {t('vendor.addVendor') || 'Ajouter'}
        </Button>
      </Box>

      <VendorsTable
        vendors={vendorStore.vendorslist}
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
