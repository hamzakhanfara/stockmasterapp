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
const shelfService = __importStar(require("../services/shelf.service"));
const vendorService = __importStar(require("../services/vendor.service"));
const router = (0, express_1.Router)();
function isAdmin(req) {
    return req.user?.role === 'ADMIN';
}
function getVendorId(req) {
    return req.user?.vendor?.id || null;
}
// Create shelf (user must own the vendor)
router.post('/', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const { name, vendorId, status } = req.body;
        if (!name || !vendorId) {
            return res.status(400).json({ success: false, message: 'Missing name or vendorId' });
        }
        // Check if vendor belongs to authenticated user
        const userId = req.user?.id;
        const vendor = await vendorService.getVendorById(vendorId);
        if (!vendor || vendor.userId !== userId) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }
        const shelf = await shelfService.createShelf({
            name,
            vendorId,
            status: status || 'ACTIVE',
        });
        return res.status(201).json({ success: true, shelf });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: String(err) });
    }
});
// List shelves (only user's vendor shelves)
router.get('/', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        // Get user's vendors
        const userVendors = await vendorService.listVendorsByUserId(userId);
        const vendorIds = userVendors.map((v) => v.id);
        // Get shelves for user's vendors
        const shelves = await shelfService.listShelvesByVendorIds(vendorIds);
        return res.json({ success: true, shelves });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: String(err) });
    }
});
// Get shelf by id
router.get('/:id', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const shelf = await shelfService.getShelfById(req.params.id);
        if (!shelf)
            return res.status(404).json({ success: false, message: 'Not found' });
        // Check if shelf's vendor belongs to user
        const userId = req.user?.id;
        const vendor = await vendorService.getVendorById(shelf.vendorId);
        if (!vendor || vendor.userId !== userId) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }
        return res.json({ success: true, shelf });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: String(err) });
    }
});
// Update shelf
router.put('/:id', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const shelf = await shelfService.getShelfById(req.params.id);
        if (!shelf)
            return res.status(404).json({ success: false, message: 'Not found' });
        // Check if shelf's vendor belongs to user
        const userId = req.user?.id;
        const vendor = await vendorService.getVendorById(shelf.vendorId);
        if (!vendor || vendor.userId !== userId) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }
        const { name, status, vendorId } = req.body;
        const updated = await shelfService.updateShelf(req.params.id, { name, status, vendorId });
        return res.json({ success: true, shelf: updated });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: String(err) });
    }
});
// Delete shelf
router.delete('/:id', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const shelf = await shelfService.getShelfById(req.params.id);
        if (!shelf)
            return res.status(404).json({ success: false, message: 'Not found' });
        // Check if shelf's vendor belongs to user
        const userId = req.user?.id;
        const vendor = await vendorService.getVendorById(shelf.vendorId);
        if (!vendor || vendor.userId !== userId) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }
        await shelfService.deleteShelf(req.params.id);
        return res.json({ success: true });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: String(err) });
    }
});
exports.default = router;
//# sourceMappingURL=shelf.routes.js.map