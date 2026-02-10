export declare const listOrders: (params: Record<string, any>) => Promise<({
    items: ({
        product: {
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
        };
    } & {
        id: string;
        quantity: number;
        unitPrice: import("@prisma/client-runtime-utils").Decimal;
        total: import("@prisma/client-runtime-utils").Decimal;
        productId: string;
        orderId: string;
    })[];
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    orderNumber: string;
    status: import(".prisma/client").$Enums.OrderStatus;
    customerName: string | null;
    totalAmount: import("@prisma/client-runtime-utils").Decimal;
})[]>;
export declare const listDraftOrders: () => Promise<({
    items: {
        id: string;
        quantity: number;
        unitPrice: import("@prisma/client-runtime-utils").Decimal;
        total: import("@prisma/client-runtime-utils").Decimal;
        productId: string;
        orderId: string;
    }[];
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    orderNumber: string;
    status: import(".prisma/client").$Enums.OrderStatus;
    customerName: string | null;
    totalAmount: import("@prisma/client-runtime-utils").Decimal;
})[]>;
export declare const getOrder: (id: string) => Promise<({
    user: {
        id: string;
        clerkUserId: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
        createdAt: Date;
        updatedAt: Date;
    };
    items: ({
        product: {
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
        };
    } & {
        id: string;
        quantity: number;
        unitPrice: import("@prisma/client-runtime-utils").Decimal;
        total: import("@prisma/client-runtime-utils").Decimal;
        productId: string;
        orderId: string;
    })[];
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    orderNumber: string;
    status: import(".prisma/client").$Enums.OrderStatus;
    customerName: string | null;
    totalAmount: import("@prisma/client-runtime-utils").Decimal;
}) | null>;
export declare const createOrder: ({ userId, items }: {
    userId: string;
    items: Array<{
        productId: string;
        quantity: number;
        price: number;
    }>;
}) => Promise<{
    items: {
        id: string;
        quantity: number;
        unitPrice: import("@prisma/client-runtime-utils").Decimal;
        total: import("@prisma/client-runtime-utils").Decimal;
        productId: string;
        orderId: string;
    }[];
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    orderNumber: string;
    status: import(".prisma/client").$Enums.OrderStatus;
    customerName: string | null;
    totalAmount: import("@prisma/client-runtime-utils").Decimal;
}>;
export declare const createDraftOrder: ({ userId, items }: {
    userId: string;
    items: Array<{
        productId: string;
        quantity: number;
        price: number;
    }>;
}) => Promise<{
    items: {
        id: string;
        quantity: number;
        unitPrice: import("@prisma/client-runtime-utils").Decimal;
        total: import("@prisma/client-runtime-utils").Decimal;
        productId: string;
        orderId: string;
    }[];
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    orderNumber: string;
    status: import(".prisma/client").$Enums.OrderStatus;
    customerName: string | null;
    totalAmount: import("@prisma/client-runtime-utils").Decimal;
}>;
export declare const updateOrder: (id: string, data: Record<string, any>) => Promise<({
    items: {
        id: string;
        quantity: number;
        unitPrice: import("@prisma/client-runtime-utils").Decimal;
        total: import("@prisma/client-runtime-utils").Decimal;
        productId: string;
        orderId: string;
    }[];
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    orderNumber: string;
    status: import(".prisma/client").$Enums.OrderStatus;
    customerName: string | null;
    totalAmount: import("@prisma/client-runtime-utils").Decimal;
}) | null>;
export declare const deleteOrder: (id: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    orderNumber: string;
    status: import(".prisma/client").$Enums.OrderStatus;
    customerName: string | null;
    totalAmount: import("@prisma/client-runtime-utils").Decimal;
}>;
export declare const getOrderStats: (userId?: string) => Promise<{
    totalOrders: number;
    confirmedCount: number;
    waitingCount: number;
    draftCount: number;
    cancelledCount: number;
    totalRevenue: number | import("@prisma/client-runtime-utils").Decimal;
    revenueThisMonth: number | import("@prisma/client-runtime-utils").Decimal;
    ordersThisMonth: number;
}>;
//# sourceMappingURL=order.service.d.ts.map