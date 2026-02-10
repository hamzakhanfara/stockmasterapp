import { prisma } from '../prisma';

export async function createProduct(data: {
  name: string;
  description?: string;
  price: number;
  stock: number;
  lowStockAt?: number;
  vendorId: string;
  barcode?: string;
  category?: string;
}) {
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
  vendorIds?: string[];
  lowStockOnly?: boolean;
}) {
  const where: any = {};
  
  // If vendorIds array is provided, use it (for multi-tenancy)
  if (filters?.vendorIds) {
    // If empty array, return no products
    if (filters.vendorIds.length === 0) {
      return [];
    }
    where.vendorId = { in: filters.vendorIds };
  } else if (filters?.vendorId) {
    where.vendorId = filters.vendorId;
  }
  
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
    category: string;
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
