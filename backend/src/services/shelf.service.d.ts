export declare function createShelf(data: any): Promise<{
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: import(".prisma/client").$Enums.ShelfStatus;
    vendorId: string;
}>;
export declare function getShelfById(id: string): Promise<({
    vendor: {
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
    };
} & {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: import(".prisma/client").$Enums.ShelfStatus;
    vendorId: string;
}) | null>;
export declare function listShelves(vendorId?: string): Promise<({
    vendor: {
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
    };
} & {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: import(".prisma/client").$Enums.ShelfStatus;
    vendorId: string;
})[]>;
export declare function listShelvesByVendorIds(vendorIds: string[]): Promise<({
    vendor: {
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
    };
} & {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: import(".prisma/client").$Enums.ShelfStatus;
    vendorId: string;
})[]>;
export declare function updateShelf(id: string, data: any): Promise<{
    vendor: {
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
    };
} & {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: import(".prisma/client").$Enums.ShelfStatus;
    vendorId: string;
}>;
export declare function deleteShelf(id: string): Promise<{
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: import(".prisma/client").$Enums.ShelfStatus;
    vendorId: string;
}>;
declare const _default: {
    createShelf: typeof createShelf;
    getShelfById: typeof getShelfById;
    listShelves: typeof listShelves;
    updateShelf: typeof updateShelf;
    deleteShelf: typeof deleteShelf;
};
export default _default;
//# sourceMappingURL=shelf.service.d.ts.map