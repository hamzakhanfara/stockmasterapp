import { Request, Response } from 'express';
import { prisma } from '../prisma';

export function getCurrentUser(req: Request) {
  return (req as any).user ?? null;
}

export function getCurrentUserHandler(req: Request, res: Response) {
  const user = getCurrentUser(req);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  return res.json({ success: true, user });
}

export async function updateUserRole(userId: string, role: string) {
  return prisma.user.update({ where: { id: userId }, data: { role: role as any } });
}

export async function listUsers() {
  return prisma.user.findMany({ include: { vendors: true } });
}

export default {
  getCurrentUser,
  getCurrentUserHandler,
  updateUserRole,
  listUsers,
};
