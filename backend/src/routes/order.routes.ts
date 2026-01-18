import { Router } from 'express';
import {prisma} from '../prisma';

const router = Router();

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true }
    });
    res.json({ orders });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

// Get one order
router.get('/:id', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: true }
    });
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
    // items: [{ productId, quantity, price }]
    const order = await prisma.order.create({
      data: {
        user: { connect: { id: userId } },
        orderNumber: `ORD-${Date.now()}`, // or use your own logic for order number
        totalAmount: (items as Array<{ productId: string; quantity: number; price: number }>).reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        items: {
          create: (items as Array<{ productId: string; quantity: number; price: number }>).map(item => ({
            product: { connect: { id: item.productId } },
            quantity: item.quantity,
            unitPrice: item.price,
            total: item.price * item.quantity,
          }))
        }
      },
      include: { items: true }
    });
    // Decrement stock for each product
    for (const item of items as Array<{ productId: string; quantity: number }>) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      });
    }
    res.json(order);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

// Update order status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
      include: { items: true }
    });
    res.json(order);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

// Delete order
router.delete('/:id', async (req, res) => {
  try {
    await prisma.order.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

export default router;
