import { Request, Response, NextFunction } from "express";

export function requireRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: "Forbidden: insufficient permissions",
      });
    }

    next();
  };
}
export const requireAdmin = requireRole(['ADMIN']);

export const requireStaffOrAdmin = requireRole([
  'STAFF',
  'ADMIN',
]);

export const requireVendor = requireRole(['VENDOR_VIEW_ONLY']);