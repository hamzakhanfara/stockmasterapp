"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = createProduct;
exports.getProductById = getProductById;
exports.listProducts = listProducts;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.updateStock = updateStock;
const prisma_1 = require("../prisma");
async function createProduct(data) {
    return prisma_1.prisma.product.create({ data });
}
async function getProductById(id) {
    return prisma_1.prisma.product.findUnique({
        where: { id },
        include: { vendor: true },
    });
}
async function listProducts(filters) {
    const where = {};
    if (filters?.vendorId)
        where.vendorId = filters.vendorId;
    if (filters?.lowStockOnly) {
        where.stock = { lte: prisma_1.prisma.product.fields.lowStockAt };
    }
    return prisma_1.prisma.product.findMany({
        where,
        include: { vendor: true },
    });
}
async function updateProduct(id, data) {
    console.log('[service:updateProduct] id:', id, 'data:', data);
    return prisma_1.prisma.product.update({
        where: { id },
        data,
        include: { vendor: true },
    });
}
async function deleteProduct(id) {
    return prisma_1.prisma.product.delete({ where: { id } });
}
async function updateStock(id, delta) {
    const product = await prisma_1.prisma.product.findUnique({ where: { id } });
    if (!product)
        throw new Error('Product not found');
    const newStock = Math.max(0, product.stock + delta);
    return prisma_1.prisma.product.update({
        where: { id },
        data: { stock: newStock },
        include: { vendor: true },
    });
}
exports.default = {
    createProduct,
    getProductById,
    listProducts,
    updateProduct,
    deleteProduct,
    updateStock,
};
//# sourceMappingURL=product.service.js.map