import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { listOrders, listDraftOrders, getOrder as getOrderService, createOrder as createOrderService, updateOrder as updateOrderService, deleteOrder as deleteOrderService, createDraftOrder, getOrderStats } from '../services/order.service';

const router = Router();

function isAdmin(req: any) {
  return req.user?.role === 'ADMIN';
}

function getUserId(req: any) {
  return req.user?.id || null;
}

// Get all orders
router.get('/', authMiddleware, async (req: any, res) => {
  try {
    const status = req.query.status as string | undefined;
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    console.log('[GET /orders] userId:', userId, 'status:', status);
    
    // Always filter by user's orders (multi-tenancy)
    const where: any = { userId };
    if (status) where.status = status;
    
    const orders = await listOrders({ where });
    console.log('[GET /orders] Returning', orders.length, 'orders');
    res.json({ orders });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

// List draft orders (place before :id to avoid route shadowing)
router.get('/draft', authMiddleware, async (req: any, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    const orders = await listDraftOrders();
    // Always filter by user (multi-tenancy)
    const filteredOrders = orders.filter((o: any) => o.userId === userId);
    res.json({ orders: filteredOrders });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

// Stats (place before :id to avoid route shadowing)
router.get('/stats', authMiddleware, async (req: any, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    // Always filter stats by user (multi-tenancy)
    const stats = await getOrderStats(userId);
    res.json({ stats });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

// Get one order
router.get('/:id', authMiddleware, async (req: any, res) => {
  try {
    const order = await getOrderService(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    // Check if user owns this order or is admin
    const userId = getUserId(req);
    if (!isAdmin(req) && order.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    res.json(order);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

// Create order
router.post('/', authMiddleware, async (req: any, res) => {
  try {
    const { items } = req.body;
    // Use authenticated user's ID, not from request body
    const userId = getUserId(req);
    if (!userId) return res.status(400).json({ error: 'User ID required' });
    
    const order = await createOrderService({ userId, items });
    res.json(order);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

// Create draft order (park sale)
router.post('/draft', authMiddleware, async (req: any, res) => {
  try {
    const { items } = req.body;
    // Use authenticated user's ID, not from request body
    const userId = getUserId(req);
    if (!userId) return res.status(400).json({ error: 'User ID required' });
    
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
router.put('/:id', authMiddleware, async (req: any, res) => {
  try {
    // Check ownership first
    const existingOrder = await getOrderService(req.params.id);
    if (!existingOrder) return res.status(404).json({ error: 'Order not found' });
    
    const userId = getUserId(req);
    if (!isAdmin(req) && existingOrder.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    const order = await updateOrderService(req.params.id, req.body);
    res.json(order);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

// Delete order
router.delete('/:id', authMiddleware, async (req: any, res) => {
  try {
    // Check ownership first
    const existingOrder = await getOrderService(req.params.id);
    if (!existingOrder) return res.status(404).json({ error: 'Order not found' });
    
    const userId = getUserId(req);
    if (!isAdmin(req) && existingOrder.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    await deleteOrderService(req.params.id);
    res.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

export default router;
