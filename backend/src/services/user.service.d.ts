import { Request, Response } from 'express';
export declare function getCurrentUser(req: Request): any;
export declare function getCurrentUserHandler(req: Request, res: Response): Response<any, Record<string, any>>;
export declare function updateUserRole(userId: string, role: string): Promise<{
    id: string;
    clerkUserId: string;
    email: string;
    role: import(".prisma/client").$Enums.UserRole;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function listUsers(): Promise<({
    vendors: {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        category: string | null;
        contactName: string | null;
        contactNumber: string | null;
        contactEmail: string | null;
        userId: string;
    }[];
} & {
    id: string;
    clerkUserId: string;
    email: string;
    role: import(".prisma/client").$Enums.UserRole;
    createdAt: Date;
    updatedAt: Date;
})[]>;
declare const _default: {
    getCurrentUser: typeof getCurrentUser;
    getCurrentUserHandler: typeof getCurrentUserHandler;
    updateUserRole: typeof updateUserRole;
    listUsers: typeof listUsers;
};
export default _default;
//# sourceMappingURL=user.service.d.ts.map