import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as productService from '../services/product.service';

const router = Router();

function isAdmin(req: any) {
  return req.user?.role === 'ADMIN';
}

function getVendorId(req: any) {
  return req.user?.vendor?.id || null;
}

// Create product (Admin or own Vendor)
router.post('/', authMiddleware, async (req: any, res) => {
  try {
    const { name, description, price, stock, lowStockAt, vendorId, barcode } = req.body;
    if (!name || !price || stock === undefined || !vendorId) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const userVendorId = getVendorId(req);
    if (!isAdmin(req) && userVendorId !== vendorId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const product = await productService.createProduct({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      lowStockAt: lowStockAt !== undefined ? parseInt(lowStockAt) : 5,
      vendorId,
      barcode,
    });
    return res.status(201).json({ success: true, product });
  } catch (err) {
    return res.status(500).json({ success: false, error: String(err) });
  }
});

// List products (Admin=all, Vendor=own, with filters)
router.get('/', authMiddleware, async (req: any, res) => {
  try {
    const { vendorId, shelfId, lowStockOnly } = req.query;
    const userVendorId = getVendorId(req);

    const filters: any = {};
    if (isAdmin(req) && vendorId) filters.vendorId = vendorId;
    else if (!isAdmin(req)) filters.vendorId = userVendorId;

    if (shelfId) filters.shelfId = shelfId;
    if (lowStockOnly === 'true') filters.lowStockOnly = true;

    const products = await productService.listProducts(filters);
    return res.json({ success: true, products });
  } catch (err) {
    return res.status(500).json({ success: false, error: String(err) });
  }
});

// Get product by id
router.get('/:id', authMiddleware, async (req: any, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Not found' });

    const userVendorId = getVendorId(req);
    if (!isAdmin(req) && product.vendorId !== userVendorId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    return res.json({ success: true, product });
  } catch (err) {
    return res.status(500).json({ success: false, error: String(err) });
  }
});

// Update product
router.put('/:id', authMiddleware, async (req: any, res) => {
  try {
    console.log('[PUT /v1/products/:id] id:', req.params.id, 'body:', req.body);
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      console.log('[PUT /v1/products/:id] Not found for id:', req.params.id);
      return res.status(404).json({ success: false, message: 'Not found' });
    }

    const userVendorId = getVendorId(req);
    if (!isAdmin(req) && product.vendorId !== userVendorId) {
      console.log('[PUT /v1/products/:id] Forbidden for vendor:', userVendorId);
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const { name, description, price, stock, lowStockAt, vendorId } = req.body;
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (lowStockAt !== undefined) updateData.lowStockAt = parseInt(lowStockAt);
    if (vendorId !== undefined) updateData.vendorId = vendorId;
    console.log('[PUT /v1/products/:id] updateData:', updateData);
    const updated = await productService.updateProduct(req.params.id, updateData);
    return res.json({ success: true, product: updated });
  } catch (err) {
    console.log('[PUT /v1/products/:id] Error:', err);
    return res.status(500).json({ success: false, error: String(err) });
  }
});

// Delete product
router.delete('/:id', authMiddleware, async (req: any, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Not found' });

    const userVendorId = getVendorId(req);
    if (!isAdmin(req) && product.vendorId !== userVendorId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    await productService.deleteProduct(req.params.id);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: String(err) });
  }
});

// Update stock (increase/decrease)
router.patch('/:id/stock', authMiddleware, async (req: any, res) => {
  try {
    const { delta } = req.body;
    if (delta === undefined) {
      return res.status(400).json({ success: false, message: 'Missing delta' });
    }

    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Not found' });

    const userVendorId = getVendorId(req);
    if (!isAdmin(req) && product.vendorId !== userVendorId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const updated = await productService.updateStock(req.params.id, parseInt(delta));
    return res.json({ success: true, product: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: String(err) });
  }
});

export default router;
