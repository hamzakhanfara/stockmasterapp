"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const express_1 = require("@clerk/express");
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const prisma_1 = require("../prisma");
async function authMiddleware(req, res, next) {
    try {
        const auth = (0, express_1.getAuth)(req);
        if (!auth.userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const clerkUserId = auth.userId;
        let user = await prisma_1.prisma.user.findUnique({
            where: { clerkUserId },
            include: { vendors: true },
        });
        if (!user) {
            const clerkUser = await clerk_sdk_node_1.clerkClient.users.getUser(clerkUserId);
            const primaryEmail = clerkUser.emailAddresses.find((email) => email.id === clerkUser.primaryEmailAddressId)?.emailAddress;
            if (!primaryEmail) {
                return res.status(400).json({
                    message: "Authenticated Clerk user has no primary email",
                });
            }
            user = await prisma_1.prisma.user.create({
                data: {
                    clerkUserId,
                    email: primaryEmail,
                    role: "STAFF",
                },
                include: { vendors: true },
            });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
//# sourceMappingURL=auth.middleware.js.map