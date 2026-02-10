export declare function createVendor(data: {
    name: string;
    userId: string;
    description?: string;
    category?: string;
    contactName?: string;
    contactNumber?: string;
    contactEmail?: string;
}): Promise<{
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
}>;
export declare function getVendorById(id: string): Promise<{
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
} | null>;
export declare function listVendors(): Promise<{
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
}[]>;
export declare function listVendorsByUserId(userId: string): Promise<{
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
}[]>;
export declare function updateVendor(id: string, data: Partial<{
    name: string;
    userId: string;
    description?: string;
    category?: string;
    contactName?: string;
    contactNumber?: string;
    contactEmail?: string;
}>): Promise<{
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
}>;
export declare function deleteVendor(id: string): Promise<{
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
}>;
export declare function getVendorStats(vendorId: string): Promise<{
    totalSales: number;
    totalOrders: number;
    productsSold: number;
    salesChange: number;
    ordersChange: number;
    productsSoldChange: number;
}>;
declare const _default: {
    createVendor: typeof createVendor;
    getVendorById: typeof getVendorById;
    listVendors: typeof listVendors;
    updateVendor: typeof updateVendor;
    deleteVendor: typeof deleteVendor;
    getVendorStats: typeof getVendorStats;
};
export default _default;
//# sourceMappingURL=vendor.service.d.ts.map