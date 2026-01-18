import { Request, Response, NextFunction } from "express";
import { UserRole } from "@prisma/client";

export function requireRole(allowedRoles: UserRole[]) {
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
export const requireAdmin = requireRole([UserRole.ADMIN]);

export const requireStaffOrAdmin = requireRole([
  UserRole.STAFF,
  UserRole.ADMIN,
]);

export const requireVendor = requireRole([UserRole.VENDOR_VIEW_ONLY]);