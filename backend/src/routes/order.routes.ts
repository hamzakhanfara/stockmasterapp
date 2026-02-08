import { Router } from 'express';
import { listOrders, listDraftOrders, getOrder as getOrderService, createOrder as createOrderService, updateOrder as updateOrderService, deleteOrder as deleteOrderService, createDraftOrder, getOrderStats } from '../services/order.service';

const router = Router();

// Get all orders
router.get('/', async (req, res) => {
  try {
    const status = req.query.status as string | undefined;
    const orders = await listOrders({ where: status ? { status } : undefined });
    res.json({ orders });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

// List draft orders (place before :id to avoid route shadowing)
router.get('/draft', async (_req, res) => {
  try {
    const orders = await listDraftOrders();
    res.json({ orders });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

// Stats (place before :id to avoid route shadowing)
router.get('/stats', async (_req, res) => {
  try {
    const stats = await getOrderStats();
    res.json({ stats });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

// Get one order
router.get('/:id', async (req, res) => {
  try {
    const order = await getOrderService(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

// Create order
router.post('/', async (req, res) => {
  try {
    const { userId, items } = req.body;
    const order = await createOrderService({ userId, items });
    res.json(order);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

// Create draft order (park sale)
router.post('/draft', async (req, res) => {
  try {
    const { userId, items } = req.body;
    // Validate: draft must have at least one item
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Draft order must contain at least one item' });
    }
    const draftOrder = await createDraftOrder({ userId, items });
    res.json(draftOrder);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});


// Update order status
router.put('/:id', async (req, res) => {
  try {
    const order = await updateOrderService(req.params.id, req.body);
    res.json(order);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

// Delete order
router.delete('/:id', async (req, res) => {
  try {
    await deleteOrderService(req.params.id);
    res.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

export default router;
