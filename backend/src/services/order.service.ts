import {prisma} from '../prisma';
import { Order } from '@prisma/client';

export const listOrders = async (params: Record<string, any>) => {
  return await prisma.order.findMany({
    include: { items: true },
    ...params,
  });
};

export const getOrder = async (id: string) => {
  return await prisma.order.findUnique({
    where: { id },
    include: { items: true },
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
  for (const item of items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } }
    });
  }
  return order;
};

export const updateOrder = async (id: string, data: Record<string, any>) => {
  return await prisma.order.update({
    where: { id },
    data,
    include: { items: true },
  });
};

export const deleteOrder = async (id: string) => {
  return await prisma.order.delete({ where: { id } });
};
