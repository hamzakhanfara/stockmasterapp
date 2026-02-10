import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as productService from '../services/product.service';
import * as vendorService from '../services/vendor.service';

const router = Router();

function isAdmin(req: any) {
  return req.user?.role === 'ADMIN';
}

function getVendorId(req: any) {
  return req.user?.vendor?.id || null;
}

// Create product (user must own the vendor)
router.post('/', authMiddleware, async (req: any, res) => {
  try {
    const { name, description, price, stock, lowStockAt, vendorId, barcode, category } = req.body;
    if (!name || !price || stock === undefined || !vendorId) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Check if vendor belongs to authenticated user
    const userId = req.user?.id;
    const vendor = await vendorService.getVendorById(vendorId);
    if (!vendor || vendor.userId !== userId) {
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
      category,
    });
    return res.status(201).json({ success: true, product });
  } catch (err) {
    return res.status(500).json({ success: false, error: String(err) });
  }
});

// List products (only user's vendor products)
router.get('/', authMiddleware, async (req: any, res) => {
  try {
    const { vendorId, shelfId, lowStockOnly } = req.query;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const filters: any = {};
    
    // Always filter by user's vendors
    const userVendors = await vendorService.listVendorsByUserId(userId);
    const userVendorIds = userVendors.map((v: any) => v.id);
    
    console.log('[GET /products] userId:', userId, 'userVendorIds:', userVendorIds);
    
    if (vendorId) {
      // Check if requested vendor belongs to user
      if (!userVendorIds.includes(vendorId)) {
        console.log('[GET /products] Forbidden - vendor does not belong to user');
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }
      filters.vendorId = vendorId;
    } else {
      // Return products from all user's vendors
      filters.vendorIds = userVendorIds;
    }

    if (shelfId) filters.shelfId = shelfId;
    if (lowStockOnly === 'true') filters.lowStockOnly = true;

    const products = await productService.listProducts(filters);
    console.log('[GET /products] Returning', products.length, 'products');
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

    // Check if product's vendor belongs to user
    const userId = req.user?.id;
    const vendor = await vendorService.getVendorById(product.vendorId);
    if (!vendor || vendor.userId !== userId) {
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

    // Check if product's vendor belongs to user
    const userId = req.user?.id;
    const vendor = await vendorService.getVendorById(product.vendorId);
    if (!vendor || vendor.userId !== userId) {
      console.log('[PUT /v1/products/:id] Forbidden - vendor does not belong to user');
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const { name, description, price, stock, lowStockAt, vendorId, category } = req.body;
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (lowStockAt !== undefined) updateData.lowStockAt = parseInt(lowStockAt);
    if (vendorId !== undefined) updateData.vendorId = vendorId;
    if (category !== undefined) updateData.category = category;
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

    // Check if product's vendor belongs to user
    const userId = req.user?.id;
    const vendor = await vendorService.getVendorById(product.vendorId);
    if (!vendor || vendor.userId !== userId) {
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
