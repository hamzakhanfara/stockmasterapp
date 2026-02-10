import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as shelfService from '../services/shelf.service';
import * as vendorService from '../services/vendor.service';

const router = Router();

function isAdmin(req: any) {
  return req.user?.role === 'ADMIN';
}

function getVendorId(req: any) {
  return req.user?.vendor?.id || null;
}

// Create shelf (user must own the vendor)
router.post('/', authMiddleware, async (req: any, res) => {
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
  } catch (err) {
    return res.status(500).json({ success: false, error: String(err) });
  }
});

// List shelves (only user's vendor shelves)
router.get('/', authMiddleware, async (req: any, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    
    // Get user's vendors
    const userVendors = await vendorService.listVendorsByUserId(userId);
    const vendorIds = userVendors.map((v: any) => v.id);
    
    // Get shelves for user's vendors
    const shelves = await shelfService.listShelvesByVendorIds(vendorIds);
    return res.json({ success: true, shelves });
  } catch (err) {
    return res.status(500).json({ success: false, error: String(err) });
  }
});

// Get shelf by id
router.get('/:id', authMiddleware, async (req: any, res) => {
  try {
    const shelf = await shelfService.getShelfById(req.params.id);
    if (!shelf) return res.status(404).json({ success: false, message: 'Not found' });

    // Check if shelf's vendor belongs to user
    const userId = req.user?.id;
    const vendor = await vendorService.getVendorById(shelf.vendorId);
    if (!vendor || vendor.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    return res.json({ success: true, shelf });
  } catch (err) {
    return res.status(500).json({ success: false, error: String(err) });
  }
});

// Update shelf
router.put('/:id', authMiddleware, async (req: any, res) => {
  try {
    const shelf = await shelfService.getShelfById(req.params.id);
    if (!shelf) return res.status(404).json({ success: false, message: 'Not found' });

    // Check if shelf's vendor belongs to user
    const userId = req.user?.id;
    const vendor = await vendorService.getVendorById(shelf.vendorId);
    if (!vendor || vendor.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const { name, status, vendorId } = req.body;
    const updated = await shelfService.updateShelf(req.params.id, { name, status, vendorId });
    return res.json({ success: true, shelf: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: String(err) });
  }
});

// Delete shelf
router.delete('/:id', authMiddleware, async (req: any, res) => {
  try {
    const shelf = await shelfService.getShelfById(req.params.id);
    if (!shelf) return res.status(404).json({ success: false, message: 'Not found' });

    // Check if shelf's vendor belongs to user
    const userId = req.user?.id;
    const vendor = await vendorService.getVendorById(shelf.vendorId);
    if (!vendor || vendor.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    await shelfService.deleteShelf(req.params.id);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: String(err) });
  }
});

export default router;
