"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVendor = createVendor;
exports.getVendorById = getVendorById;
exports.listVendors = listVendors;
exports.listVendorsByUserId = listVendorsByUserId;
exports.updateVendor = updateVendor;
exports.deleteVendor = deleteVendor;
exports.getVendorStats = getVendorStats;
const prisma_1 = require("../prisma");
async function createVendor(data) {
    const vendor = await prisma_1.prisma.vendor.create({ data });
    return vendor;
}
async function getVendorById(id) {
    return prisma_1.prisma.vendor.findUnique({ where: { id } });
}
async function listVendors() {
    return prisma_1.prisma.vendor.findMany({
        select: {
            id: true,
            name: true,
            description: true,
            category: true,
            contactName: true,
            contactNumber: true,
            contactEmail: true,
            userId: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}
async function listVendorsByUserId(userId) {
    return prisma_1.prisma.vendor.findMany({
        where: { userId },
        select: {
            id: true,
            name: true,
            description: true,
            category: true,
            contactName: true,
            contactNumber: true,
            contactEmail: true,
            userId: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}
async function updateVendor(id, data) {
    return prisma_1.prisma.vendor.update({ where: { id }, data });
}
async function deleteVendor(id) {
    return prisma_1.prisma.vendor.delete({ where: { id } });
}
async function getVendorStats(vendorId) {
    // Get total sales from confirmed orders containing vendor products
    const ordersWithProducts = await prisma_1.prisma.order.findMany({
        where: {
            status: 'CONFIRMED',
            items: {
                some: {
                    product: {
                        vendorId: vendorId,
                    },
                },
            },
        },
        include: {
            items: {
                where: {
                    product: {
                        vendorId: vendorId,
                    },
                },
            },
        },
    });
    const totalSales = ordersWithProducts.reduce((sum, order) => {
        const vendorItemsTotal = order.items.reduce((itemSum, item) => itemSum + Number(item.total || 0), 0);
        return sum + vendorItemsTotal;
    }, 0);
    const totalOrders = ordersWithProducts.length;
    // Get total products sold (quantity sum)
    const productsSold = ordersWithProducts.reduce((sum, order) => {
        const vendorItemsQty = order.items.reduce((qtySum, item) => qtySum + Number(item.quantity || 0), 0);
        return sum + vendorItemsQty;
    }, 0);
    // Calculate yesterday's stats for comparison
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterdayOrders = await prisma_1.prisma.order.findMany({
        where: {
            status: 'CONFIRMED',
            createdAt: {
                gte: yesterday,
                lt: today,
            },
            items: {
                some: {
                    product: {
                        vendorId: vendorId,
                    },
                },
            },
        },
        include: {
            items: {
                where: {
                    product: {
                        vendorId: vendorId,
                    },
                },
            },
        },
    });
    const yesterdaySales = yesterdayOrders.reduce((sum, order) => {
        const vendorItemsTotal = order.items.reduce((itemSum, item) => itemSum + Number(item.total || 0), 0);
        return sum + vendorItemsTotal;
    }, 0);
    const yesterdayOrdersCount = yesterdayOrders.length;
    const yesterdayProductsSold = yesterdayOrders.reduce((sum, order) => {
        const vendorItemsQty = order.items.reduce((qtySum, item) => qtySum + Number(item.quantity || 0), 0);
        return sum + vendorItemsQty;
    }, 0);
    // Calculate percentage changes
    const salesChange = yesterdaySales > 0 ? ((totalSales - yesterdaySales) / yesterdaySales) * 100 : 0;
    const ordersChange = yesterdayOrdersCount > 0 ? ((totalOrders - yesterdayOrdersCount) / yesterdayOrdersCount) * 100 : 0;
    const productsSoldChange = yesterdayProductsSold > 0 ? ((productsSold - yesterdayProductsSold) / yesterdayProductsSold) * 100 : 0;
    return {
        totalSales,
        totalOrders,
        productsSold,
        salesChange: Math.round(salesChange * 10) / 10,
        ordersChange: Math.round(ordersChange * 10) / 10,
        productsSoldChange: Math.round(productsSoldChange * 10) / 10,
    };
}
exports.default = {
    createVendor,
    getVendorById,
    listVendors,
    updateVendor,
    deleteVendor,
    getVendorStats,
};
//# sourceMappingURL=vendor.service.js.map