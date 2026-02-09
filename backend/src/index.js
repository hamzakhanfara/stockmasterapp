"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_2 = require("@clerk/express");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const vendor_routes_1 = __importDefault(require("./routes/vendor.routes"));
const shelf_routes_1 = __importDefault(require("./routes/shelf.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const order_pdf_routes_1 = __importDefault(require("./routes/order.pdf.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        // Allow localhost for development
        if (origin.includes('localhost'))
            return callback(null, true);
        // Allow all Vercel domains
        if (origin.endsWith('.vercel.app'))
            return callback(null, true);
        // Allow specific frontend URL if set
        if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Length', 'Content-Type'],
    maxAge: 86400, // 24 hours
}));
app.use(express_1.default.json());
console.log('CLERK_PUBLISHABLE_KEY=', process.env.CLERK_PUBLISHABLE_KEY);
console.log('CLERK_SECRET_KEY=', !!process.env.CLERK_SECRET_KEY);
app.use((0, express_2.clerkMiddleware)());
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
});
app.use('/api', user_routes_1.default);
app.use('/api/v1/vendors', vendor_routes_1.default);
app.use('/api/v1/shelves', shelf_routes_1.default);
app.use('/api/v1/products', product_routes_1.default);
app.use('/api/v1/orders', order_routes_1.default);
app.use('/api/v1/orders', order_pdf_routes_1.default);
console.log('Registered routes:');
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map