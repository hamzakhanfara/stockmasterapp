"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const productService = __importStar(require("../services/product.service"));
const router = (0, express_1.Router)();
function isAdmin(req) {
    return req.user?.role === 'ADMIN';
}
function getVendorId(req) {
    return req.user?.vendor?.id || null;
}
// Create product (Admin or own Vendor)
router.post('/', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const { name, description, price, stock, lowStockAt, vendorId, barcode, category } = req.body;
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
            category,
        });
        return res.status(201).json({ success: true, product });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: String(err) });
    }
});
// List products (Admin=all, Vendor=own, with filters)
router.get('/', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const { vendorId, shelfId, lowStockOnly } = req.query;
        const userVendorId = getVendorId(req);
        const filters = {};
        if (isAdmin(req) && vendorId)
            filters.vendorId = vendorId;
        else if (!isAdmin(req))
            filters.vendorId = userVendorId;
        if (shelfId)
            filters.shelfId = shelfId;
        if (lowStockOnly === 'true')
            filters.lowStockOnly = true;
        const products = await productService.listProducts(filters);
        return res.json({ success: true, products });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: String(err) });
    }
});
// Get product by id
router.get('/:id', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        if (!product)
            return res.status(404).json({ success: false, message: 'Not found' });
        const userVendorId = getVendorId(req);
        if (!isAdmin(req) && product.vendorId !== userVendorId) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }
        return res.json({ success: true, product });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: String(err) });
    }
});
// Update product
router.put('/:id', auth_middleware_1.authMiddleware, async (req, res) => {
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
        const { name, description, price, stock, lowStockAt, vendorId, category } = req.body;
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (description !== undefined)
            updateData.description = description;
        if (price !== undefined)
            updateData.price = parseFloat(price);
        if (stock !== undefined)
            updateData.stock = parseInt(stock);
        if (lowStockAt !== undefined)
            updateData.lowStockAt = parseInt(lowStockAt);
        if (vendorId !== undefined)
            updateData.vendorId = vendorId;
        if (category !== undefined)
            updateData.category = category;
        console.log('[PUT /v1/products/:id] updateData:', updateData);
        const updated = await productService.updateProduct(req.params.id, updateData);
        return res.json({ success: true, product: updated });
    }
    catch (err) {
        console.log('[PUT /v1/products/:id] Error:', err);
        return res.status(500).json({ success: false, error: String(err) });
    }
});
// Delete product
router.delete('/:id', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        if (!product)
            return res.status(404).json({ success: false, message: 'Not found' });
        const userVendorId = getVendorId(req);
        if (!isAdmin(req) && product.vendorId !== userVendorId) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }
        await productService.deleteProduct(req.params.id);
        return res.json({ success: true });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: String(err) });
    }
});
// Update stock (increase/decrease)
router.patch('/:id/stock', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const { delta } = req.body;
        if (delta === undefined) {
            return res.status(400).json({ success: false, message: 'Missing delta' });
        }
        const product = await productService.getProductById(req.params.id);
        if (!product)
            return res.status(404).json({ success: false, message: 'Not found' });
        const userVendorId = getVendorId(req);
        if (!isAdmin(req) && product.vendorId !== userVendorId) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }
        const updated = await productService.updateStock(req.params.id, parseInt(delta));
        return res.json({ success: true, product: updated });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: String(err) });
    }
});
exports.default = router;
//# sourceMappingURL=product.routes.js.map