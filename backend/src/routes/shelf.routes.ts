import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as shelfService from '../services/shelf.service';

const router = Router();

function isAdmin(req: any) {
  return req.user?.role === 'ADMIN';
}

function getVendorId(req: any) {
  return req.user?.vendor?.id || null;
}

// Create shelf (Admin or own Vendor)
router.post('/', authMiddleware, async (req: any, res) => {
  try {
    const { name, vendorId, status } = req.body;
    if (!name || !vendorId) {
      return res.status(400).json({ success: false, message: 'Missing name or vendorId' });
    }

    const userVendorId = getVendorId(req);
    if (!isAdmin(req) && userVendorId !== vendorId) {
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

// List shelves (Admin=all, Vendor=own)
router.get('/', authMiddleware, async (req: any, res) => {
  try {
    const vendorId = isAdmin(req) ? undefined : getVendorId(req);
    const shelves = await shelfService.listShelves(vendorId);
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

    const userVendorId = getVendorId(req);
    if (!isAdmin(req) && shelf.vendorId !== userVendorId) {
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

    const userVendorId = getVendorId(req);
    if (!isAdmin(req) && shelf.vendorId !== userVendorId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const { name, status, vendorId } = req.body;
    const updated = await shelfService.updateShelf(req.params.id, { name, status, vendorId });
    return res.json({ success: true, shelf: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: String(err) });
  }
});

// Delete shelf (Admin only)
router.delete('/:id', authMiddleware, async (req: any, res) => {
  try {
    if (!isAdmin(req)) return res.status(403).json({ success: false, message: 'Forbidden' });

    const shelf = await shelfService.getShelfById(req.params.id);
    if (!shelf) return res.status(404).json({ success: false, message: 'Not found' });

    await shelfService.deleteShelf(req.params.id);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: String(err) });
  }
});

export default router;
