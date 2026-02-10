import { prisma } from '../prisma';

export async function createVendor(data: { name: string; userId: string; description?: string; category?: string; contactName?: string; contactNumber?: string; contactEmail?: string }) {
  const vendor = await prisma.vendor.create({ data });
  return vendor;
}

export async function getVendorById(id: string) {
  return prisma.vendor.findUnique({ where: { id } });
}

export async function listVendors() {
  return prisma.vendor.findMany({
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

export async function listVendorsByUserId(userId: string) {
  return prisma.vendor.findMany({
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

export async function updateVendor(id: string, data: Partial<{ name: string; userId: string; description?: string; category?: string; contactName?: string; contactNumber?: string; contactEmail?: string }>) {
  return prisma.vendor.update({ where: { id }, data });
}

export async function deleteVendor(id: string) {
  return prisma.vendor.delete({ where: { id } });
}

export async function getVendorStats(vendorId: string) {
  // Get total sales from confirmed orders containing vendor products
  const ordersWithProducts = await prisma.order.findMany({
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

  const totalSales = ordersWithProducts.reduce((sum: number, order: any) => {
    const vendorItemsTotal = order.items.reduce((itemSum: number, item: any) => itemSum + Number(item.total || 0), 0);
    return sum + vendorItemsTotal;
  }, 0);

  const totalOrders = ordersWithProducts.length;

  // Get total products sold (quantity sum)
  const productsSold = ordersWithProducts.reduce((sum: number, order: any) => {
    const vendorItemsQty = order.items.reduce((qtySum: number, item: any) => qtySum + Number(item.quantity || 0), 0);
    return sum + vendorItemsQty;
  }, 0);

  // Calculate yesterday's stats for comparison
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterdayOrders = await prisma.order.findMany({
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

  const yesterdaySales = yesterdayOrders.reduce((sum: number, order: any) => {
    const vendorItemsTotal = order.items.reduce((itemSum: number, item: any) => itemSum + Number(item.total || 0), 0);
    return sum + vendorItemsTotal;
  }, 0);

  const yesterdayOrdersCount = yesterdayOrders.length;

  const yesterdayProductsSold = yesterdayOrders.reduce((sum: number, order: any) => {
    const vendorItemsQty = order.items.reduce((qtySum: number, item: any) => qtySum + Number(item.quantity || 0), 0);
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

export default {
  createVendor,
  getVendorById,
  listVendors,
  updateVendor,
  deleteVendor,
  getVendorStats,
};
