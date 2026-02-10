"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const order_service_1 = require("../services/order.service");
const router = (0, express_1.Router)();
function isAdmin(req) {
    return req.user?.role === 'ADMIN';
}
function getUserId(req) {
    return req.user?.id || null;
}
// Get all orders
router.get('/', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const status = req.query.status;
        const userId = getUserId(req);
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        console.log('[GET /orders] userId:', userId, 'status:', status);
        // Always filter by user's orders (multi-tenancy)
        const where = { userId };
        if (status)
            where.status = status;
        const orders = await (0, order_service_1.listOrders)({ where });
        console.log('[GET /orders] Returning', orders.length, 'orders');
        res.json({ orders });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: message });
    }
});
// List draft orders (place before :id to avoid route shadowing)
router.get('/draft', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const orders = await (0, order_service_1.listDraftOrders)();
        // Always filter by user (multi-tenancy)
        const filteredOrders = orders.filter((o) => o.userId === userId);
        res.json({ orders: filteredOrders });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: message });
    }
});
// Stats (place before :id to avoid route shadowing)
router.get('/stats', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        // Always filter stats by user (multi-tenancy)
        const stats = await (0, order_service_1.getOrderStats)(userId);
        res.json({ stats });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: message });
    }
});
// Get one order
router.get('/:id', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const order = await (0, order_service_1.getOrder)(req.params.id);
        if (!order)
            return res.status(404).json({ error: 'Order not found' });
        // Check if user owns this order or is admin
        const userId = getUserId(req);
        if (!isAdmin(req) && order.userId !== userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        res.json(order);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: message });
    }
});
// Create order
router.post('/', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const { items } = req.body;
        // Use authenticated user's ID, not from request body
        const userId = getUserId(req);
        if (!userId)
            return res.status(400).json({ error: 'User ID required' });
        const order = await (0, order_service_1.createOrder)({ userId, items });
        res.json(order);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: message });
    }
});
// Create draft order (park sale)
router.post('/draft', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const { items } = req.body;
        // Use authenticated user's ID, not from request body
        const userId = getUserId(req);
        if (!userId)
            return res.status(400).json({ error: 'User ID required' });
        // Validate: draft must have at least one item
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Draft order must contain at least one item' });
        }
        const draftOrder = await (0, order_service_1.createDraftOrder)({ userId, items });
        res.json(draftOrder);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: message });
    }
});
// Update order status
router.put('/:id', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        // Check ownership first
        const existingOrder = await (0, order_service_1.getOrder)(req.params.id);
        if (!existingOrder)
            return res.status(404).json({ error: 'Order not found' });
        const userId = getUserId(req);
        if (!isAdmin(req) && existingOrder.userId !== userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const order = await (0, order_service_1.updateOrder)(req.params.id, req.body);
        res.json(order);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: message });
    }
});
// Delete order
router.delete('/:id', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        // Check ownership first
        const existingOrder = await (0, order_service_1.getOrder)(req.params.id);
        if (!existingOrder)
            return res.status(404).json({ error: 'Order not found' });
        const userId = getUserId(req);
        if (!isAdmin(req) && existingOrder.userId !== userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        await (0, order_service_1.deleteOrder)(req.params.id);
        res.json({ success: true });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: message });
    }
});
exports.default = router;
//# sourceMappingURL=order.routes.js.map