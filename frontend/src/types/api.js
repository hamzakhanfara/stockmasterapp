// API Types
// User interface is now a plain JS object
// {
//   id: string,
//   clerkUserId: string,
//   email: string,
//   role: 'ADMIN' | 'STAFF' | 'VENDOR_VIEW_ONLY',
//   vendor?: Vendor | null,
//   createdAt?: string,
//   updatedAt?: string,
// }

// Vendor interface
// {
//   id: string,
//   name: string,
//   userId: string,
//   user?: User,
//   createdAt?: string,
//   updatedAt?: string,
// }

// Shelf interface
// {
//   id: string,
//   name: string,
//   status: 'ACTIVE' | 'INACTIVE',
//   vendorId: string,
//   vendor?: Vendor,
//   products?: Product[],
//   createdAt?: string,
//   updatedAt?: string,
// }

// Product interface
// {
//   id: string,
//   name: string,
//   description?: string,
//   price: number,
//   stock: number,
//   lowStockAt: number,
//   vendorId: string,
//   shelfId: string,
//   vendor?: Vendor,
//   shelf?: Shelf,
//   createdAt?: string,
//   updatedAt?: string,
// }

// Order interface
// {
//   id: string,
//   orderNumber: string,
//   status: 'DRAFT' | 'CONFIRMED' | 'CANCELLED',
//   customerName?: string,
//   totalAmount: number,
//   items?: OrderItem[],
//   createdAt?: string,
//   updatedAt?: string,
// }

// OrderItem interface
// {
//   id: string,
//   quantity: number,
//   unitPrice: number,
//   total: number,
//   productId: string,
//   orderId: string,
//   product?: Product,
// }
