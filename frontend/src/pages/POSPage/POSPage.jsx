import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../context/useStoreHooks';
import { useApiClient } from '../../api/client';
import POSDashboard from './POSDashboard';
import POSCart from './POSCart';

const TAX_RATE = 0.0825; // 8.25%

export default function POSPage() {
  const { t } = useTranslation();
  const rootStore = useStore();
  const productStore = rootStore.Product;
  const orderStore = rootStore.Order;
  const getClient = useApiClient();

  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [activeDraftId, setActiveDraftId] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!productStore.client) {
          const client = await getClient();
          if (mounted) productStore.setClient(client);
        }
        if (!orderStore.client) {
          const client = await getClient();
          if (mounted) orderStore.setClient(client);
        }
        await productStore.fetchListProducts();
        await orderStore.fetchListDraftOrders();
      } catch (err) {
        console.error('[POSPage] Failed to init products', err);
      }
    })();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const products = productStore.productsList || [];
  const orders = orderStore.ordersList || [];

  const filteredProducts = useMemo(() => {
    let list = products;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(p => (p.name || '').toLowerCase().includes(q) || (p.barcode || '').toLowerCase().includes(q));
    }
    return list;
  }, [products, search]);

  const heldOrders = useMemo(() => orders.filter(o => o.status === 'DRAFT'), [orders]);
  const [heldLoading, setHeldLoading] = useState(false);

  const fetchHeldOrdersOnDemand = async () => {
    try {
      setHeldLoading(true);
      if (!orderStore.client) {
        const client = await getClient();
        orderStore.setClient(client);
      }
      await orderStore.fetchListDraftOrders();
    } catch (e) {
      console.error('[POSPage] fetch held orders failed', e);
      setToastSeverity('error');
      setToastMsg(t('common.error'));
      setToastOpen(true);
    } finally {
      setHeldLoading(false);
    }
  };

  const addToCart = (p) => {
    setCart(prev => {
      const idx = prev.findIndex(i => i.id === p.id);
      if (idx !== -1) {
        const updated = [...prev];
        const nextUnits = updated[idx].units + 1;
        updated[idx] = { ...updated[idx], units: nextUnits, totalCost: nextUnits * Number(p.price) };
        return updated;
      }
      return [...prev, { id: p.id, name: p.name, unitPrice: Number(p.price), units: 1, totalCost: Number(p.price) }];
    });
  };

  const inc = (id) => setCart(prev => prev.map(i => i.id === id ? { ...i, units: i.units + 1, totalCost: (i.units + 1) * i.unitPrice } : i));
  const dec = (id) => setCart(prev => prev.map(i => i.id === id && i.units > 1 ? { ...i, units: i.units - 1, totalCost: (i.units - 1) * i.unitPrice } : i));
  const removeItem = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const handleCheckout = async () => {
    try {
      if (!orderStore.client) {
        const client = await getClient();
        orderStore.setClient(client);
      }
      if (activeDraftId) {
        await orderStore.updateOrder(activeDraftId, { status: 'CONFIRMED' });
      } else if (typeof orderStore.checkout === 'function') {
        await orderStore.checkout({ items: cart });
      } else {
        // Fallback: create then confirm via API client directly
        const client = await getClient();
        const items = cart.map(it => ({ productId: it.id, quantity: it.units, price: it.unitPrice }));
        const me = await client.getCurrentUser();
        const userId = me?.user?.id || me?.id;
        const order = await client.createOrder({ userId, items });
        await client.updateOrder(order.id, { status: 'CONFIRMED' });
      }
      // Refresh products to reflect stock decrement after confirmation
      try {
        await productStore.fetchListProducts();
      } catch (refreshErr) {
        console.warn('[POSPage] failed refreshing products after checkout', refreshErr);
      }
      // Refresh held orders so confirmed drafts disappear from the list
      try {
        await orderStore.fetchListDraftOrders();
      } catch (refreshErr) {
        console.warn('[POSPage] failed refreshing draft orders after checkout', refreshErr);
      }
      setCart([]);
      setActiveDraftId(null);
      setToastSeverity('success');
      setToastMsg(t('pos.checkout'));
      setToastOpen(true);
    } catch (e) {
      console.error('[POSPage] checkout failed', e);
      setToastSeverity('error');
      setToastMsg(t('common.error'));
      setToastOpen(true);
    }
  };

  const handleParkSale = async () => {
    try {
      if (!orderStore.client) {
        const client = await getClient();
        orderStore.setClient(client);
      }
      if (typeof orderStore.parkSale === 'function') {
        await orderStore.parkSale({ items: cart });
      } else {
        // HMR fallback: call API directly if store method not present on existing instance
        const client = await getClient();
        const items = cart.map(it => ({ productId: it.id, quantity: it.units, price: it.unitPrice }));
        const me = await client.getCurrentUser();
        const userId = me?.user?.id || me?.id;
        await client.createOrderDraft({ userId, items });
      }
      setCart([]);
      setToastSeverity('success');
      setToastMsg(t('pos.parkSale'));
      setToastOpen(true);
      await orderStore.fetchListDraftOrders();
    } catch (e) {
      console.error('[POSPage] park sale failed', e);
      setToastSeverity('error');
      setToastMsg(t('common.error'));
      setToastOpen(true);
    }
  };

  const handleResumeDraft = async (orderId) => {
    try {
      if (!orderStore.client) {
        const client = await getClient();
        orderStore.setClient(client);
      }
      const order = await orderStore.getOrder(orderId);
      const mapped = (order.items || []).map((it) => ({
        id: it.productId,
        name: it.product?.name || '',
        unitPrice: Number(it.unitPrice),
        units: it.quantity,
        totalCost: Number(it.total),
      }));
      setCart(mapped);
      setActiveDraftId(orderId);
      setToastSeverity('success');
      setToastMsg(t('pos.resume'));
      setToastOpen(true);
    } catch (e) {
      console.error('[POSPage] resume draft failed', e);
      setToastSeverity('error');
      setToastMsg(t('common.error'));
      setToastOpen(true);
    }
  };

  const handleDeleteDraft = async (orderId) => {
    try {
      if (!orderStore.client) {
        const client = await getClient();
        orderStore.setClient(client);
      }
      await orderStore.deleteOrder(orderId);
      await orderStore.fetchListDraftOrders();
      setToastSeverity('success');
      setToastMsg(t('common.delete'));
      setToastOpen(true);
    } catch (e) {
      console.error('[POSPage] delete draft failed', e);
      setToastSeverity('error');
      setToastMsg(t('common.error'));
      setToastOpen(true);
    }
  };

  const subTotal = cart.reduce((s, i) => s + i.totalCost, 0);
  const tax = Math.round(subTotal * TAX_RATE * 100) / 100;
  const total = Math.round((subTotal + tax) * 100) / 100;

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');

  const handleScan = (code) => {
    const p = products.find(pr => String(pr.barcode || '').trim() === code);
    if (p) {
      const existed = cart.some(i => i.id === p.id);
      addToCart(p);
      setToastSeverity('success');
      setToastMsg(existed ? t('pos.toastIncremented') : t('pos.toastAdded'));
      setToastOpen(true);
    } else {
      setToastSeverity('warning');
      setToastMsg(t('pos.toastNotFound'));
      setToastOpen(true);
      console.warn('[POSPage] scanned barcode not found:', code);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: { xs: 'auto', md: '100vh' }, bgcolor: '#f7f8fa' }}>
      {/* LEFT: Products listing handled by POSDashboard */}
      <Box sx={{ flex: { xs: '1 1 auto', md: 1.2 }, borderRight: { xs: 'none', md: '1px solid #eee' }, borderBottom: { xs: '1px solid #eee', md: 'none' }, p: { xs: 1.5, md: 2 } }}>
        <POSDashboard
          activeTab={activeTab}
          onTabChange={(e, v) => setActiveTab(v)}
          search={search}
          onSearchChange={setSearch}
          products={filteredProducts}
          onAddToCart={addToCart}
          heldOrders={heldOrders}
          heldLoading={heldLoading}
          onToggleHeld={fetchHeldOrdersOnDemand}
          onResumeDraft={handleResumeDraft}
          onDeleteDraft={handleDeleteDraft}
        />
      </Box>

      {/* RIGHT: Cart handled by POSCart */}
      <Box sx={{ flex: { xs: '1 1 auto', md: 1 }, p: { xs: 1.5, md: 2 }, overflow: 'auto' }}>
        <POSCart
          cart={cart}
          onInc={inc}
          onDec={dec}
          onRemove={removeItem}
          subTotal={subTotal}
          tax={tax}
          total={total}
          onClear={() => { setCart([]); setActiveDraftId(null); }}
          onCheckout={handleCheckout}
          onParkSale={handleParkSale}
          onDiscount={() => { /* TODO: discount flow */ }}
          onScan={handleScan}
          productBarcodes={(products || []).map(p => String(p.barcode || '').trim()).filter(Boolean)}
        />
      </Box>
      <Snackbar open={toastOpen} autoHideDuration={2000} onClose={() => setToastOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setToastOpen(false)} severity={toastSeverity} sx={{ width: '100%' }}>
          {toastMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
