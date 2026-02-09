import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { prisma } from "../prisma";

/**
 * Type Prisma avec vendors inclus (one-to-many)
 */
type UserWithVendors = any;

interface AuthenticatedRequest extends Request {
  user: UserWithVendors;
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const auth = getAuth(req);

    if (!auth.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const clerkUserId = auth.userId;

    let user: UserWithVendors | null =
      await prisma.user.findUnique({
        where: { clerkUserId },
        include: { vendors: true },
      });

    if (!user) {
      const clerkUser = await clerkClient.users.getUser(clerkUserId);

      const primaryEmail = clerkUser.emailAddresses.find(
        (email) => email.id === clerkUser.primaryEmailAddressId
      )?.emailAddress;

      if (!primaryEmail) {
        return res.status(400).json({
          message: "Authenticated Clerk user has no primary email",
        });
      }

      user = await prisma.user.create({
        data: {
          clerkUserId,
          email: primaryEmail,
          role: "STAFF",
        },
        include: { vendors: true },
      });
    }

    (req as AuthenticatedRequest).user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


