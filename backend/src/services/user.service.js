"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = getCurrentUser;
exports.getCurrentUserHandler = getCurrentUserHandler;
exports.updateUserRole = updateUserRole;
exports.listUsers = listUsers;
const prisma_1 = require("../prisma");
function getCurrentUser(req) {
    return req.user ?? null;
}
function getCurrentUserHandler(req, res) {
    const user = getCurrentUser(req);
    if (!user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    return res.json({ success: true, user });
}
async function updateUserRole(userId, role) {
    return prisma_1.prisma.user.update({ where: { id: userId }, data: { role: role } });
}
async function listUsers() {
    return prisma_1.prisma.user.findMany({ include: { vendors: true } });
}
exports.default = {
    getCurrentUser,
    getCurrentUserHandler,
    updateUserRole,
    listUsers,
};
//# sourceMappingURL=user.service.js.map