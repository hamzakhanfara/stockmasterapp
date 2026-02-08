import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as vendorService from '../services/vendor.service';

const router = Router();

function isAdmin(req: any) {
  return req.user?.role === 'ADMIN';
}

// Create vendor (admin only)
router.post('/', authMiddleware, async (req: any, res) => {
  try {
    if (!isAdmin(req)) return res.status(403).json({ success: false, message: 'Forbidden' });

    const { name, userId, description, category, contactName, contactNumber, contactEmail } = req.body;
    if (!name || !userId) return res.status(400).json({ success: false, message: 'Missing name or userId' });

    // Basic email validation if provided
    if (contactEmail && typeof contactEmail === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactEmail)) return res.status(400).json({ success: false, message: 'Invalid email' });
    }

    const vendor = await vendorService.createVendor({ name, userId, description, category, contactName, contactNumber, contactEmail });
    return res.status(201).json({ success: true, vendor });
  } catch (err) {
    return res.status(500).json({ success: false, error: String(err) });
  }
});

// List vendors (admin or vendor own)
router.get('/', authMiddleware, async (req: any, res) => {
  try {
    if (isAdmin(req)) {
      const vendors = await vendorService.listVendors();
      return res.json({ success: true, vendors });
    }

    // If vendor user, return their vendor only
    const myVendor = req.user?.vendor ? [req.user.vendor] : [];
    return res.json({ success: true, vendors: myVendor });
  } catch (err) {
    return res.status(500).json({ success: false, error: String(err) });
  }
});

// Get vendor by id
router.get('/:id', authMiddleware, async (req: any, res) => {
  try {
    const { id } = req.params;
    const vendor = await vendorService.getVendorById(id);
    if (!vendor) return res.status(404).json({ success: false, message: 'Not found' });

    if (!isAdmin(req) && req.user?.vendor?.id !== id) return res.status(403).json({ success: false, message: 'Forbidden' });

    return res.json({ success: true, vendor });
  } catch (err) {
    return res.status(500).json({ success: false, error: String(err) });
  }
});

// Get vendor stats
router.get('/:id/stats', authMiddleware, async (req: any, res) => {
  try {
    const { id } = req.params;
    const vendor = await vendorService.getVendorById(id);
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });

    if (!isAdmin(req) && req.user?.vendor?.id !== id) return res.status(403).json({ success: false, message: 'Forbidden' });

    const stats = await vendorService.getVendorStats(id);
    return res.json({ success: true, stats });
  } catch (err) {
    return res.status(500).json({ success: false, error: String(err) });
  }
});

// Update vendor
router.put('/:id', authMiddleware, async (req: any, res) => {
  try {
    const { id } = req.params;
    if (!isAdmin(req) && req.user?.vendor?.id !== id) return res.status(403).json({ success: false, message: 'Forbidden' });

    const { name, userId, description, category, contactName, contactNumber, contactEmail } = req.body;
    if (contactEmail && typeof contactEmail === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactEmail)) return res.status(400).json({ success: false, message: 'Invalid email' });
    }
    const vendor = await vendorService.updateVendor(id, { name, userId, description, category, contactName, contactNumber, contactEmail });
    return res.json({ success: true, vendor });
  } catch (err) {
    return res.status(500).json({ success: false, error: String(err) });
  }
});

// Delete vendor
router.delete('/:id', authMiddleware, async (req: any, res) => {
  try {
    const { id } = req.params;
    if (!isAdmin(req) && req.user?.vendor?.id !== id) return res.status(403).json({ success: false, message: 'Forbidden' });

    await vendorService.deleteVendor(id);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: String(err) });
  }
});

export default router;
