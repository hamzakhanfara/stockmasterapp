"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderStats = exports.deleteOrder = exports.updateOrder = exports.createDraftOrder = exports.createOrder = exports.getOrder = exports.listDraftOrders = exports.listOrders = void 0;
const prisma_1 = require("../prisma");
const listOrders = async (params) => {
    return await prisma_1.prisma.order.findMany({
        include: { items: { include: { product: true } } },
        ...params,
    });
};
exports.listOrders = listOrders;
const listDraftOrders = async () => {
    return await prisma_1.prisma.order.findMany({
        where: { status: 'DRAFT' },
        include: { items: true },
    });
};
exports.listDraftOrders = listDraftOrders;
const getOrder = async (id) => {
    return await prisma_1.prisma.order.findUnique({
        where: { id },
        include: { items: { include: { product: true } }, user: true },
    });
};
exports.getOrder = getOrder;
const createOrder = async ({ userId, items }) => {
    const order = await prisma_1.prisma.order.create({
        data: {
            user: { connect: { id: userId } },
            orderNumber: `ORD-${Date.now()}`, // or use your own logic for order number
            totalAmount: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
            items: {
                create: items.map((item) => ({
                    product: { connect: { id: item.productId } },
                    quantity: item.quantity,
                    unitPrice: item.price,
                    total: item.price * item.quantity,
                }))
            }
        },
        include: { items: true }
    });
    return order;
};
exports.createOrder = createOrder;
const createDraftOrder = async ({ userId, items }) => {
    // Create an order in DRAFT status without decrementing stock
    const order = await prisma_1.prisma.order.create({
        data: {
            user: { connect: { id: userId } },
            orderNumber: `ORD-${Date.now()}`,
            status: 'DRAFT',
            totalAmount: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
            items: {
                create: items.map((item) => ({
                    product: { connect: { id: item.productId } },
                    quantity: item.quantity,
                    unitPrice: item.price,
                    total: item.price * item.quantity,
                }))
            }
        },
        include: { items: true }
    });
    return order;
};
exports.createDraftOrder = createDraftOrder;
const updateOrder = async (id, data) => {
    // Fetch current order to compare status and get items
    const current = await prisma_1.prisma.order.findUnique({
        where: { id },
        include: { items: true },
    });
    if (!current)
        return null;
    const willConfirm = data.status === 'CONFIRMED' && current.status !== 'CONFIRMED';
    // Use a transaction to update order and adjust stock atomically when confirming
    const [updated] = await prisma_1.prisma.$transaction([
        prisma_1.prisma.order.update({
            where: { id },
            data,
            include: { items: true },
        }),
        ...(willConfirm
            ? current.items.map((it) => prisma_1.prisma.product.update({
                where: { id: it.productId },
                data: { stock: { decrement: it.quantity } },
            }))
            : [])
    ]);
    return updated;
};
exports.updateOrder = updateOrder;
const deleteOrder = async (id) => {
    // Delete dependent order items first to satisfy FK constraints
    await prisma_1.prisma.orderItem.deleteMany({ where: { orderId: id } });
    return await prisma_1.prisma.order.delete({ where: { id } });
};
exports.deleteOrder = deleteOrder;
const getOrderStats = async (userId) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    // Base filter for user
    const userFilter = userId ? { userId } : {};
    const [totalOrders, confirmedCount, waitingCount, draftCount, cancelledCount, totalRevenueAgg, revenueThisMonthAgg, ordersThisMonth] = await Promise.all([
        prisma_1.prisma.order.count({ where: userFilter }),
        prisma_1.prisma.order.count({ where: { ...userFilter, status: 'CONFIRMED' } }),
        prisma_1.prisma.order.count({ where: { ...userFilter, status: 'WAITING' } }),
        prisma_1.prisma.order.count({ where: { ...userFilter, status: 'DRAFT' } }),
        prisma_1.prisma.order.count({ where: { ...userFilter, status: 'CANCELLED' } }),
        prisma_1.prisma.order.aggregate({ _sum: { totalAmount: true }, where: { ...userFilter, status: 'CONFIRMED' } }),
        prisma_1.prisma.order.aggregate({ _sum: { totalAmount: true }, where: { ...userFilter, status: 'CONFIRMED', createdAt: { gte: startOfMonth } } }),
        prisma_1.prisma.order.count({ where: { ...userFilter, createdAt: { gte: startOfMonth } } }),
    ]);
    return {
        totalOrders,
        confirmedCount,
        waitingCount,
        draftCount,
        cancelledCount,
        totalRevenue: totalRevenueAgg._sum.totalAmount || 0,
        revenueThisMonth: revenueThisMonthAgg._sum.totalAmount || 0,
        ordersThisMonth,
    };
};
exports.getOrderStats = getOrderStats;
//# sourceMappingURL=order.service.js.map