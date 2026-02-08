import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../context/useStoreHooks';
import { useApiClient } from '../../api/client';
import { STATE } from '../../constants/index';


import ProductsTable from '../vendors/vendorPage/ProductsTable';
import CreateProductModal from './CreateProductModal';

export const Products = observer(() => {
	const { t } = useTranslation();
	const rootStore = useStore();
	const productStore = rootStore.Product;
	const getClient = useApiClient();

	const [createModalOpen, setCreateModalOpen] = useState(false);
	const [productLoading, setProductLoading] = useState(false);
	const [productError, setProductError] = useState(null);
    const vendorStore = rootStore.Vendor;
	// Charger la liste des vendors si besoin
	useEffect(() => {
		let mounted = true;
		const fetchVendors = async () => {
			try {
				if (!vendorStore.client) {
					const client = await getClient();
					if (mounted) vendorStore.setClient(client);
				}
				if (mounted) await vendorStore.fetchListVendors();
			} catch (err) {
				console.error('Error loading vendors:', err);
			}
		};
		fetchVendors();
		return () => { mounted = false; };
	}, []);
	useEffect(() => {
		let mounted = true;
		const initAndFetch = async () => {
			try {
				if (!productStore.client) {
					const client = await getClient();
					if (mounted) productStore.setClient(client);
				}
				if (mounted) await productStore.fetchListProducts();
			} catch (err) {
				console.error('Error loading products:', err);
			}
		};
		initAndFetch();
		return () => { mounted = false; };
	}, []);

	const handleCreateClick = () => {
		setCreateModalOpen(true);
	};

	const handleCreateModalClose = () => {
		setCreateModalOpen(false);
		setProductError(null);
	};


	const handleCreateConfirm = async (formData) => {
		try {
			setProductLoading(true);
			setProductError(null);
			await productStore.createProduct(formData);
			await productStore.fetchListProducts();
			setCreateModalOpen(false);
		} catch (err) {
			setProductError(err.message || 'Erreur création produit');
		} finally {
			setProductLoading(false);
		}
	};


	// Handler pour l'édition d'un produit
	const handleEditProduct = async (productId, formData) => {
		try {
			await productStore.updateProduct(productId, formData);
			await productStore.fetchListProducts();
		} catch (err) {
			// Optionnel : gestion d'erreur globale
			console.error('Erreur modification produit', err);
		}
	};

	// Handler pour la suppression d'un produit
	const handleDeleteProduct = async (productId) => {
		try {
			await productStore.deleteProduct(productId);
			await productStore.fetchListProducts();
		} catch (err) {
			// Optionnel : gestion d'erreur globale
			console.error('Erreur suppression produit', err);
		}
	};
    // Handler pour l'ajout de stock
    const handleAddStock = async (productId, delta) => {
        console.log('[Products.jsx] handleAddStock productId:', productId, 'delta:', delta);
        try {
            const result = await productStore.updateProductStock(productId, delta);
            console.log('[Products.jsx] productStore.updateProductStock result:', result);
            await productStore.fetchListProducts();
        } catch (err) {
            // Optionnel : gestion d'erreur globale
            console.error('Erreur ajout stock', err);
        }
    };

	const isLoading = productStore.fetchState?.list === STATE.PENDING;
	const hasError = productStore.error;

	return (
		<Box sx={{ p: 3 }}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
				<Typography variant="h4" sx={{ fontWeight: 'bold' }}>
					{t('sidebar.products') || 'Products'}
				</Typography>
			</Box>


			<ProductsTable
				products={productStore.productsList}
				productModalOpen={createModalOpen}
				setProductModalOpen={setCreateModalOpen}
				productLoading={productLoading}
				setProductLoading={setProductLoading}
				productError={productError}
				setProductError={setProductError}
				onCreateProduct={handleCreateConfirm}
				vendors={vendorStore.vendorslist}
				onEdit={handleEditProduct}
				onDelete={handleDeleteProduct}
				onAddStock={handleAddStock}
			/>

		</Box>
	);
});

export default Products;
