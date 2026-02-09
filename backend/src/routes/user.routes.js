"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const express_2 = require("@clerk/express");
const user_service_1 = require("../services/user.service");
const router = (0, express_1.Router)();
/**
 * GET /api/me
 * Test auth + sync user
 */
router.get('/me', auth_middleware_1.authMiddleware, user_service_1.getCurrentUserHandler);
// Debug route: returns Clerk auth payload and request headers to help diagnose 401s
router.get('/auth-debug', (req, res) => {
    try {
        const auth = (0, express_2.getAuth)(req);
        return res.json({ success: true, auth, headers: req.headers });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: String(err) });
    }
});
/**
 * PUT /api/users/role
 * Change current user's role (any authenticated user can change their own role)
 */
router.put('/users/role', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const { role } = req.body;
        if (!role || !['ADMIN', 'STAFF', 'VENDOR_VIEW_ONLY'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role' });
        }
        const updated = await (0, user_service_1.updateUserRole)(req.user.id, role);
        return res.json({ success: true, user: updated });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: String(err) });
    }
});
/**
 * GET /api/users
 * List all users (admin only)
 */
router.get('/users/', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        if (req.user?.role !== 'ADMIN') {
            return res.status(403).json({ success: false, message: 'Forbidden - Admin only' });
        }
        const users = await (0, user_service_1.listUsers)();
        return res.json({ success: true, users });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: String(err) });
    }
});
exports.default = router;
//# sourceMappingURL=user.routes.js.map