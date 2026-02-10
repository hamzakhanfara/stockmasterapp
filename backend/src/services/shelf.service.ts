import { prisma } from '../prisma';

export async function createShelf(data: any) {
  return prisma.shelf.create({ data });
}

export async function getShelfById(id: string) {
  return prisma.shelf.findUnique({
    where: { id },
    include: { vendor: true },
  });
}

export async function listShelves(vendorId?: string) {
  const where = vendorId ? { vendorId } : {};
  return prisma.shelf.findMany({
    where,
    include: { vendor: true },
  });
}

export async function listShelvesByVendorIds(vendorIds: string[]) {
  return prisma.shelf.findMany({
    where: {
      vendorId: {
        in: vendorIds,
      },
    },
    include: { vendor: true },
  });
}

export async function updateShelf(
  id: string,
  data: any
) {
  return prisma.shelf.update({
    where: { id },
    data,
    include: { vendor: true },
  });
}

export async function deleteShelf(id: string) {
  return prisma.shelf.delete({ where: { id } });
}

export default {
  createShelf,
  getShelfById,
  listShelves,
  updateShelf,
  deleteShelf,
};
