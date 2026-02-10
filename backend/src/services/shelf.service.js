"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShelf = createShelf;
exports.getShelfById = getShelfById;
exports.listShelves = listShelves;
exports.listShelvesByVendorIds = listShelvesByVendorIds;
exports.updateShelf = updateShelf;
exports.deleteShelf = deleteShelf;
const prisma_1 = require("../prisma");
async function createShelf(data) {
    return prisma_1.prisma.shelf.create({ data });
}
async function getShelfById(id) {
    return prisma_1.prisma.shelf.findUnique({
        where: { id },
        include: { vendor: true },
    });
}
async function listShelves(vendorId) {
    const where = vendorId ? { vendorId } : {};
    return prisma_1.prisma.shelf.findMany({
        where,
        include: { vendor: true },
    });
}
async function listShelvesByVendorIds(vendorIds) {
    return prisma_1.prisma.shelf.findMany({
        where: {
            vendorId: {
                in: vendorIds,
            },
        },
        include: { vendor: true },
    });
}
async function updateShelf(id, data) {
    return prisma_1.prisma.shelf.update({
        where: { id },
        data,
        include: { vendor: true },
    });
}
async function deleteShelf(id) {
    return prisma_1.prisma.shelf.delete({ where: { id } });
}
exports.default = {
    createShelf,
    getShelfById,
    listShelves,
    updateShelf,
    deleteShelf,
};
//# sourceMappingURL=shelf.service.js.map