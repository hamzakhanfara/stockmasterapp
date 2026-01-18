import React, { useState } from 'react';
import { useEffect, useCallback } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, CircularProgress } from '@mui/material';
import { useApiClient } from '../../api/client';
import { useStore } from '../../context/useStoreHooks';
import { Box, Typography, Button, Stack, TextField, MenuItem, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Height } from '@mui/icons-material';

const orderStatuses = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
];

export default function CreateOrderPage() {
  const store = useStore();
  const [orderStatus, setOrderStatus] = useState('pending');
  const [billFrom, setBillFrom] = useState('');
  const [billTo, setBillTo] = useState('');
  const [fromAddress, setFromAddress] = useState('');
  const [billToAddress, setBillToAddress] = useState('');

  // Items state
  const [items, setItems] = useState([]);

  // Modal state
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [units, setUnits] = useState(1);

  // Recherche par code-barres
  const [barcodeSearch, setBarcodeSearch] = useState('');
  const filteredProducts = barcodeSearch
    ? products.filter(p => p.barcode && p.barcode.includes(barcodeSearch))
    : products;

  const getApiClient = useApiClient();
  // Assure que le OrderStore a bien un ApiClient pour exécuter les appels
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!store.Order.client) {
          const client = await getApiClient();
          if (mounted) store.Order.setClient(client);
        }
      } catch (e) {
        console.error('Failed to set OrderStore client', e);
      }
    })();
    return () => { mounted = false; };
  }, [getApiClient, store.Order]);

  const fetchProducts = useCallback(() => {
    setLoadingProducts(true);
    getApiClient().then(api => api.listProducts()).then(res => {
      // If API returns {success, products}, extract products
      let productList = [];
      if (res && Array.isArray(res.products)) {
        productList = res.products;
      } else if (Array.isArray(res)) {
        productList = res;
      }
      setProducts(productList);
      setLoadingProducts(false);
    }).catch(() => setLoadingProducts(false));
  }, [getApiClient]);

  useEffect(() => {
    if (addItemOpen) {
      fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addItemOpen]);

  const handleAddItem = () => {
    setAddItemOpen(true);
    setSelectedProductId('');
    setUnits(1);
  };

  const handleAddItemConfirm = () => {
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;
    setItems([...items, {
      id: product.id,
      name: product.name,
      unitPrice: product.price,
      units,
      totalCost: product.price * units
    }]);
    setAddItemOpen(false);
  };

  const handleRemoveItem = (idx) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  // Calculs
  const subTotal = items.reduce((sum, item) => sum + item.totalCost, 0);
  const vat = Math.round(subTotal * 0.2); // 20% VAT
  const grandTotal = subTotal + vat;

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Envoyer la commande au backend
  };

  // Champ de scan pour ajout direct par code-barres
  const [scanValue, setScanValue] = useState('');
  const scanInputRef = React.useRef();

  // Ajout automatique à la commande via scan
  const handleScanSubmit = (e) => {
    e.preventDefault();
    const code = scanValue.trim();
    if (!code) return;
    const product = products.find(p => p.barcode === code);
    if (product) {
      setItems((prev) => {
        const idx = prev.findIndex(item => item.id === product.id);
        if (idx !== -1) {
          // Incrémente la quantité si déjà présent
          const updated = [...prev];
          updated[idx] = {
            ...updated[idx],
            units: updated[idx].units + 1,
            totalCost: (updated[idx].units + 1) * updated[idx].unitPrice,
          };
          return updated;
        }
        // Ajoute un nouvel item
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            unitPrice: product.price,
            units: 1,
            totalCost: product.price,
          },
        ];
      });
    }
    setScanValue('');
    // Remet le focus pour le prochain scan
    if (scanInputRef.current) scanInputRef.current.focus();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Create Order
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Home &nbsp; • &nbsp; Order Create
        </Typography>
      </Box>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, boxShadow: '0 2px 8px #f0f1f2', mb: 2 }}>
        <form onSubmit={handleSubmit}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>#1</Typography>
            <Stack direction="row" alignItems="center" gap={2}>
              <TextField
                select
                label="Order Status"
                value={orderStatus}
                onChange={e => setOrderStatus(e.target.value)}
                size="small"
                sx={{ minWidth: 120 }}
              >
                {orderStatuses.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <Typography variant="body2" color="text.secondary">
                Order Date: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </Typography>
            </Stack>
          </Stack>
          <Stack direction="row" gap={2} sx={{ mb: 2 }}>
            <TextField
              label="Bill From"
              value={billFrom}
              onChange={e => setBillFrom(e.target.value)}
              fullWidth
            />
            <TextField
              label="Bill To (not required)"
              value={billTo}
              onChange={e => setBillTo(e.target.value)}
              fullWidth
            />
          </Stack>
        </form>
      </Paper>

      {/* Items Details Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Items Details :</Typography>
        {/* Champ de scan code-barres */}
        <Paper elevation={0} sx={{ p: 2, borderRadius: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            <Stack direction="row" alignItems="center" gap={2} sx={{ mr: 2 }}>
                <form onSubmit={handleScanSubmit} autoComplete="off">
                  <TextField
                    inputRef={scanInputRef}
                    label="Scan barcode (ajout rapide)"
                    value={scanValue}
                    onChange={e => setScanValue(e.target.value)}
                    placeholder="Scanner ou taper le code-barres"
                    size="small"
                    variant="outlined"
                    sx={{ maxWidth: 350, '& .MuiInputBase-root': { height: 40 }, '& .MuiInputBase-input': { padding: '8px 14px' } }}
                    autoFocus
                  />
                </form>
                <Button variant="contained" color="primary" sx={{ borderRadius: 2, textTransform: 'none', height: 40 }} onClick={handleAddItem}>+ Add Item</Button>
            </Stack>
          </Box>
          <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', mb: 2 }}>
            <Box component="thead" sx={{ background: '#fafafa' }}>
              <Box component="tr">
                <Box component="th" sx={{ p: 1, fontWeight: 600 }}>Item Name</Box>
                <Box component="th" sx={{ p: 1, fontWeight: 600 }}>Unit Price</Box>
                <Box component="th" sx={{ p: 1, fontWeight: 600 }}>Units</Box>
                <Box component="th" sx={{ p: 1, fontWeight: 600 }}>Total Cost</Box>
                <Box component="th" sx={{ p: 1, fontWeight: 600 }}>Actions</Box>
              </Box>
            </Box>
            <Box component="tbody">
              {items.length === 0 ? (
                <Box component="tr">
                  <Box component="td" colSpan={5} sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>No items added</Box>
                </Box>
              ) : items.map((item, idx) => (
                <Box component="tr" key={idx}>
                  <Box component="td" sx={{ p: 1 }}>{item.name}</Box>
                  <Box component="td" sx={{ p: 1 }}>{item.unitPrice}</Box>
                  <Box component="td" sx={{ p: 1 }}>{item.units}</Box>
                  <Box component="td" sx={{ p: 1 }}>{item.totalCost}</Box>
                  <Box component="td" sx={{ p: 1 }}>
                    <IconButton size="small" variant="outlined" color="error" sx={{ minWidth: 32, p: 0 }} onClick={() => handleRemoveItem(idx)}><DeleteIcon /></IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
          <Box sx={{ background: '#eef3fc', p: 3, borderRadius: 2 }}>
            <Stack direction="column" alignItems="flex-end" gap={1}>
              <Typography variant="body2">Sub Total: {subTotal}</Typography>
              <Typography variant="body2">VAT: {vat}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Grand Total: {grandTotal}</Typography>
            </Stack>
          </Box>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" color="error" onClick={() => window.location.reload()}>Annuler</Button>
                <Button variant="outlined" color="secondary" onClick={async () => {
                  await store.Order.putOnHold({ items });
                  alert('Order mis en attente (WAITING) !');
                }}>Put on Hold</Button>
                <Button variant="contained" color="primary" onClick={async () => {
                  await store.Order.createOrder({
                    status: orderStatus,
                    billFrom,
                    billTo,
                    fromAddress,
                    billToAddress,
                    items,
                    subTotal,
                    vat,
                    grandTotal,
                    createdAt: new Date().toISOString(),
                  });
                  alert('Order créé !');
                }}>Créer Order</Button>
                <Button variant="outlined" color="info" disabled>Print</Button>
            </Box>
        </Paper>

        {/* Add Item Modal */}
        <Dialog open={addItemOpen} onClose={() => setAddItemOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Add Item</DialogTitle>
          <DialogContent>
            {loadingProducts ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TextField
                  label="search by Barcode"
                  variant="outlined"
                  fullWidth
                  size="small"
                  sx={{ mb: 2, '& .MuiInputBase-root': { height: 40 }, '& .MuiInputBase-input': { padding: '8px 14px' } }}
                  value={barcodeSearch || ''}
                  onChange={e => setBarcodeSearch(e.target.value)}
                  placeholder="Enter product barcode"
                  disabled={loadingProducts}
                />
                <Typography variant="subtitle2" sx={{ mb: 1, textAlign: 'center' }}>or</Typography>
                <TextField
                  select
                  label="Select Product"
                  value={selectedProductId}
                  onChange={e => setSelectedProductId(e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                  disabled={loadingProducts}
                >
                  {loadingProducts ? (
                    <MenuItem value="" disabled>Loading...</MenuItem>
                  ) : (Array.isArray(products) && products.length === 0 ? (
                    <MenuItem value="" disabled>No products available</MenuItem>
                  ) : (filteredProducts.map(p => (
                    <MenuItem key={p.id} value={p.id} disabled={p.stock === 0}>
                      {p.name}
                    </MenuItem>
                  ))))}
                </TextField>
                <TextField
                  type="number"
                  label="Units"
                  value={units}
                  onChange={e => setUnits(Number(e.target.value))}
                  inputProps={{ min: 1 }}
                  fullWidth
                  sx={{ mb: 2 }}
                  disabled={!selectedProductId || loadingProducts}
                />
                {selectedProductId && products.length > 0 && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Unit Price: {products.find(p => p.id === selectedProductId)?.price || 0} €<br />
                    Total Cost: {(products.find(p => p.id === selectedProductId)?.price || 0) * units} €
                  </Typography>
                )}
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddItemOpen(false)} color="error">Cancel</Button>
            <Button onClick={handleAddItemConfirm} color="primary" disabled={!selectedProductId}>Add</Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/* Actions Section */}

    </Box>
  );
}
