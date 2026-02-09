import {prisma} from '../prisma';

export const listOrders = async (params: Record<string, any>) => {
  return await prisma.order.findMany({
    include: { items: { include: { product: true } } },
    ...params,
  });
};

export const listDraftOrders = async () => {
  return await prisma.order.findMany({
    where: { status: 'DRAFT' },
    include: { items: true },
  });
};

export const getOrder = async (id: string) => {
  return await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } }, user: true },
  });
};

export const createOrder = async ({ userId, items }: { userId: string; items: Array<{ productId: string; quantity: number; price: number }> }) => {
  const order = await prisma.order.create({
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

export const createDraftOrder = async ({ userId, items }: { userId: string; items: Array<{ productId: string; quantity: number; price: number }> }) => {
  // Create an order in DRAFT status without decrementing stock
  const order = await prisma.order.create({
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

export const updateOrder = async (id: string, data: Record<string, any>) => {
  // Fetch current order to compare status and get items
  const current = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!current) return null;

  const willConfirm = data.status === 'CONFIRMED' && current.status !== 'CONFIRMED';

  // Use a transaction to update order and adjust stock atomically when confirming
  const [updated] = await prisma.$transaction([
    prisma.order.update({
      where: { id },
      data,
      include: { items: true },
    }),
    ...(willConfirm
      ? current.items.map((it: any) =>
          prisma.product.update({
            where: { id: it.productId },
            data: { stock: { decrement: it.quantity } },
          })
        )
      : [])
  ]);

  return updated;
};

export const deleteOrder = async (id: string) => {
  // Delete dependent order items first to satisfy FK constraints
  await prisma.orderItem.deleteMany({ where: { orderId: id } });
  return await prisma.order.delete({ where: { id } });
};

export const getOrderStats = async () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalOrders, confirmedCount, waitingCount, draftCount, cancelledCount, totalRevenueAgg, revenueThisMonthAgg, ordersThisMonth] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: 'CONFIRMED' } }),
    prisma.order.count({ where: { status: 'WAITING' } }),
    prisma.order.count({ where: { status: 'DRAFT' } }),
    prisma.order.count({ where: { status: 'CANCELLED' } }),
    prisma.order.aggregate({ _sum: { totalAmount: true }, where: { status: 'CONFIRMED' } }),
    prisma.order.aggregate({ _sum: { totalAmount: true }, where: { status: 'CONFIRMED', createdAt: { gte: startOfMonth } } }),
    prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
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
