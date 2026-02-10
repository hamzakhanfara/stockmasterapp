export declare function createProduct(data: {
    name: string;
    description?: string;
    price: number;
    stock: number;
    lowStockAt?: number;
    vendorId: string;
    barcode?: string;
    category?: string;
}): Promise<{
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    category: string | null;
    price: import("@prisma/client-runtime-utils").Decimal;
    stock: number;
    lowStockAt: number;
    barcode: string | null;
    vendorId: string;
}>;
export declare function getProductById(id: string): Promise<({
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
    description: string | null;
    category: string | null;
    price: import("@prisma/client-runtime-utils").Decimal;
    stock: number;
    lowStockAt: number;
    barcode: string | null;
    vendorId: string;
}) | null>;
export declare function listProducts(filters?: {
    vendorId?: string;
    vendorIds?: string[];
    lowStockOnly?: boolean;
}): Promise<({
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
    description: string | null;
    category: string | null;
    price: import("@prisma/client-runtime-utils").Decimal;
    stock: number;
    lowStockAt: number;
    barcode: string | null;
    vendorId: string;
})[]>;
export declare function updateProduct(id: string, data: Partial<{
    name: string;
    description: string;
    price: number;
    stock: number;
    lowStockAt: number;
    vendorId: string;
    category: string;
}>): Promise<{
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
    description: string | null;
    category: string | null;
    price: import("@prisma/client-runtime-utils").Decimal;
    stock: number;
    lowStockAt: number;
    barcode: string | null;
    vendorId: string;
}>;
export declare function deleteProduct(id: string): Promise<{
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    category: string | null;
    price: import("@prisma/client-runtime-utils").Decimal;
    stock: number;
    lowStockAt: number;
    barcode: string | null;
    vendorId: string;
}>;
export declare function updateStock(id: string, delta: number): Promise<{
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
    description: string | null;
    category: string | null;
    price: import("@prisma/client-runtime-utils").Decimal;
    stock: number;
    lowStockAt: number;
    barcode: string | null;
    vendorId: string;
}>;
declare const _default: {
    createProduct: typeof createProduct;
    getProductById: typeof getProductById;
    listProducts: typeof listProducts;
    updateProduct: typeof updateProduct;
    deleteProduct: typeof deleteProduct;
    updateStock: typeof updateStock;
};
export default _default;
//# sourceMappingURL=product.service.d.ts.map