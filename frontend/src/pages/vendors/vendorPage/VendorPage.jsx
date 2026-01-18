import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Paper, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useStore } from '../../../context/useStoreHooks';
import { useTranslation } from 'react-i18next';
import CreateProductModal from '../../products/CreateProductModal';
import { useApiClient } from '../../../api/client';
import ProductsTable from './ProductsTable';
import VendorStats from './VendorStats';


const VendorDetails = () => {
  const { id } = useParams();
  const { Vendor: vendorStore, Product: productStore } = useStore();
  const getClient = useApiClient();
  const { t } = useTranslation();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productLoading, setProductLoading] = useState(false);
  const [productError, setProductError] = useState(null);
  const [products, setProducts] = useState([]);

  // Initialisation du client pour ProductStore si besoin
  useEffect(() => {
    let mounted = true;
    const initProductStore = async () => {
      if (!productStore.client) {
        const client = await getClient();
        if (mounted) productStore.setClient(client);
      }
    };
    initProductStore();
    return () => { mounted = false; };
  }, [productStore, getClient]);

  // Récupération du vendor
  useEffect(() => {
    let mounted = true;
    const fetchVendor = async () => {
      setLoading(true);
      try {
        const v = await vendorStore.client.getVendor(id);
        if (mounted) setVendor(v.vendor);
      } catch (e) {
        if (mounted) setVendor(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (vendorStore.client && id) fetchVendor();
    return () => { mounted = false; };
  }, [id, vendorStore.client]);

  // Récupération des produits du vendor
  useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      if (productStore.client && id) {
        await productStore.fetchListProducts({ vendorId: id });
        if (mounted) setProducts(productStore.productsList.slice());
      }
    };
    fetchProducts();
    return () => { mounted = false; };
  }, [productStore.client, id, productStore.productsList.length]);

  if (loading) return <Box p={3}>Chargement...</Box>;
  if (!vendor) return <Box p={3}>Vendor introuvable.</Box>;

  return (
    <Box p={3}>
      <Box maxWidth={1200} mx="auto">
        <Stack direction="column" spacing={3}>
          <VendorStats vendorsName={vendor.name} vendorDescription={vendor.description} />
          <ProductsTable
            products={products}
            vendorId={id}
            productModalOpen={productModalOpen}
            setProductModalOpen={setProductModalOpen}
            productLoading={productLoading}
            setProductLoading={setProductLoading}
            productError={productError}
            setProductError={setProductError}
            onCreateProduct={async (data) => {
              setProductLoading(true);
              setProductError(null);
              try {
                await productStore.createProduct(data);
                setProductModalOpen(false);
              } catch (e) {
                setProductError(e.message || 'Erreur création produit');
              } finally {
                setProductLoading(false);
              }
            }}
          />
        </Stack>
      </Box>
    </Box>
  );
};

export default VendorDetails;
