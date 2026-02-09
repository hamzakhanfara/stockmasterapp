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
const vendorService = __importStar(require("../services/vendor.service"));
const router = (0, express_1.Router)();
function isAdmin(req) {
    return req.user?.role === 'ADMIN';
}
// Create vendor (admin only)
router.post('/', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        if (!isAdmin(req))
            return res.status(403).json({ success: false, message: 'Forbidden' });
        const { name, userId, description, category, contactName, contactNumber, contactEmail } = req.body;
        if (!name || !userId)
            return res.status(400).json({ success: false, message: 'Missing name or userId' });
        // Basic email validation if provided
        if (contactEmail && typeof contactEmail === 'string') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(contactEmail))
                return res.status(400).json({ success: false, message: 'Invalid email' });
        }
        const vendor = await vendorService.createVendor({ name, userId, description, category, contactName, contactNumber, contactEmail });
        return res.status(201).json({ success: true, vendor });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: String(err) });
    }
});
// List vendors (admin or vendor own)
router.get('/', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        if (isAdmin(req)) {
            const vendors = await vendorService.listVendors();
            return res.json({ success: true, vendors });
        }
        // If vendor user, return their vendor only
        const myVendor = req.user?.vendor ? [req.user.vendor] : [];
        return res.json({ success: true, vendors: myVendor });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: String(err) });
    }
});
// Get vendor by id
router.get('/:id', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const vendor = await vendorService.getVendorById(id);
        if (!vendor)
            return res.status(404).json({ success: false, message: 'Not found' });
        if (!isAdmin(req) && req.user?.vendor?.id !== id)
            return res.status(403).json({ success: false, message: 'Forbidden' });
        return res.json({ success: true, vendor });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: String(err) });
    }
});
// Get vendor stats
router.get('/:id/stats', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const vendor = await vendorService.getVendorById(id);
        if (!vendor)
            return res.status(404).json({ success: false, message: 'Vendor not found' });
        if (!isAdmin(req) && req.user?.vendor?.id !== id)
            return res.status(403).json({ success: false, message: 'Forbidden' });
        const stats = await vendorService.getVendorStats(id);
        return res.json({ success: true, stats });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: String(err) });
    }
});
// Update vendor
router.put('/:id', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        if (!isAdmin(req) && req.user?.vendor?.id !== id)
            return res.status(403).json({ success: false, message: 'Forbidden' });
        const { name, userId, description, category, contactName, contactNumber, contactEmail } = req.body;
        if (contactEmail && typeof contactEmail === 'string') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(contactEmail))
                return res.status(400).json({ success: false, message: 'Invalid email' });
        }
        const vendor = await vendorService.updateVendor(id, { name, userId, description, category, contactName, contactNumber, contactEmail });
        return res.json({ success: true, vendor });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: String(err) });
    }
});
// Delete vendor
router.delete('/:id', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        if (!isAdmin(req) && req.user?.vendor?.id !== id)
            return res.status(403).json({ success: false, message: 'Forbidden' });
        await vendorService.deleteVendor(id);
        return res.json({ success: true });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: String(err) });
    }
});
exports.default = router;
//# sourceMappingURL=vendor.routes.js.map