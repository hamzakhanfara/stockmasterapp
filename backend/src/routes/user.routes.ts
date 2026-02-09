import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { getAuth } from '@clerk/express';
import { getCurrentUserHandler, updateUserRole, listUsers } from '../services/user.service';

const router = Router();

/**
 * GET /api/me
 * Test auth + sync user
 */
router.get('/me', authMiddleware, getCurrentUserHandler);

// Debug route: returns Clerk auth payload and request headers to help diagnose 401s
router.get('/auth-debug', (req, res) => {
	try {
		const auth = getAuth(req);
		return res.json({ success: true, auth, headers: req.headers });
	} catch (err) {
		return res.status(500).json({ success: false, error: String(err) });
	}
});

/**
 * PUT /api/users/role
 * Change current user's role (any authenticated user can change their own role)
 */
router.put('/users/role', authMiddleware, async (req: any, res) => {
	try {
		const { role } = req.body;
		if (!role || !['ADMIN', 'STAFF', 'VENDOR_VIEW_ONLY'].includes(role)) {
			return res.status(400).json({ success: false, message: 'Invalid role' });
		}

		const updated = await updateUserRole(req.user.id, role);
		return res.json({ success: true, user: updated });
	} catch (err) {
		return res.status(500).json({ success: false, error: String(err) });
	}
});

/**
 * GET /api/users
 * List all users (admin only)
 */
router.get('/users/', authMiddleware, async (req: any, res) => {
	try {
		if (req.user?.role !== 'ADMIN') {
			return res.status(403).json({ success: false, message: 'Forbidden - Admin only' });
		}

		const users = await listUsers();
		return res.json({ success: true, users });
	} catch (err) {
		return res.status(500).json({ success: false, error: String(err) });
	}
});

export default router;
