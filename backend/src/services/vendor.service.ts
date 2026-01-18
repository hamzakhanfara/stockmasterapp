import { prisma } from '../prisma';
import { Vendor } from '@prisma/client';

export async function createVendor(data: { name: string; userId: string; description?: string }): Promise<Vendor> {
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
      userId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function updateVendor(id: string, data: Partial<{ name: string; userId: string; description?: string }>) {
  return prisma.vendor.update({ where: { id }, data });
}

export async function deleteVendor(id: string) {
  return prisma.vendor.delete({ where: { id } });
}

export default {
  createVendor,
  getVendorById,
  listVendors,
  updateVendor,
  deleteVendor,
};
