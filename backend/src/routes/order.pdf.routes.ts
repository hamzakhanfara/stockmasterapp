import { Router } from 'express';
import {prisma} from '../prisma';
import PDFDocument from 'pdfkit';

const router = Router();

router.get('/:id/pdf', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: { include: { product: true } }, user: true }
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=order_${order.orderNumber}.pdf`);
    doc.pipe(res);

    doc.fontSize(20).text('Facture', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Numéro de commande: ${order.orderNumber}`);
    doc.text(`Date: ${order.createdAt.toLocaleDateString()}`);
    if (order.user) doc.text(`Client: ${order.user.email}`);
    doc.text(`Statut: ${order.status}`);
    doc.moveDown();

    doc.text('Produits:', { underline: true });
    order.items.forEach(item => {
      doc.text(`- ${item.product.name} x${item.quantity} @ ${item.unitPrice}€ = ${item.total}€`);
    });
    doc.moveDown();
    doc.fontSize(14).text(`Total: ${order.totalAmount}€`, { align: 'right' });

    doc.end();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

export default router;
