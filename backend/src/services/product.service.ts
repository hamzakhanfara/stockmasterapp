import { prisma } from '../prisma';
import { Product } from '@prisma/client';

export async function createProduct(data: {
  name: string;
  description?: string;
  price: number;
  stock: number;
  lowStockAt?: number;
  vendorId: string;
  barcode?: string;
}): Promise<Product> {
  return prisma.product.create({ data });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { vendor: true },
  });
}

export async function listProducts(filters?: {
  vendorId?: string;
  lowStockOnly?: boolean;
}) {
  const where: any = {};
  if (filters?.vendorId) where.vendorId = filters.vendorId;
  if (filters?.lowStockOnly) {
    where.stock = { lte: prisma.product.fields.lowStockAt };
  }

  return prisma.product.findMany({
    where,
    include: { vendor: true },
  });
}

export async function updateProduct(
  id: string,
  data: Partial<{
    name: string;
    description: string;
    price: number;
    stock: number;
    lowStockAt: number;
    vendorId: string;
  }>
) {
  console.log('[service:updateProduct] id:', id, 'data:', data);
  return prisma.product.update({
    where: { id },
    data,
    include: { vendor: true },
  });
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}

export async function updateStock(id: string, delta: number) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new Error('Product not found');

  const newStock = Math.max(0, product.stock + delta);
  return prisma.product.update({
    where: { id },
    data: { stock: newStock },
    include: { vendor: true },
  });
}

export default {
  createProduct,
  getProductById,
  listProducts,
  updateProduct,
  deleteProduct,
  updateStock,
};
