"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireVendor = exports.requireStaffOrAdmin = exports.requireAdmin = void 0;
exports.requireRole = requireRole;
function requireRole(allowedRoles) {
    return (req, res, next) => {
        const userRole = req.user.role;
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                message: "Forbidden: insufficient permissions",
            });
        }
        next();
    };
}
exports.requireAdmin = requireRole(['ADMIN']);
exports.requireStaffOrAdmin = requireRole([
    'STAFF',
    'ADMIN',
]);
exports.requireVendor = requireRole(['VENDOR_VIEW_ONLY']);
//# sourceMappingURL=rbac.middleware.js.map