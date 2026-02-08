import 'dotenv/config';
import express from "express";
import cors from "cors";
import { clerkMiddleware } from '@clerk/express';
import userRoutes from './routes/user.routes';
import vendorRoutes from './routes/vendor.routes';
import shelfRoutes from './routes/shelf.routes';
import productRoutes from './routes/product.routes';
import orderPdfRoutes from './routes/order.pdf.routes';
import orderRoutes from './routes/order.routes';

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost for development
    if (origin.includes('localhost')) return callback(null, true);
    
    // Allow all Vercel domains
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    
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
app.use(express.json());
console.log('CLERK_PUBLISHABLE_KEY=', process.env.CLERK_PUBLISHABLE_KEY);
console.log('CLERK_SECRET_KEY=', !!process.env.CLERK_SECRET_KEY);
app.use(clerkMiddleware());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});
app.use('/api', userRoutes);
app.use('/api/v1/vendors', vendorRoutes);
app.use('/api/v1/shelves', shelfRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/orders', orderPdfRoutes);
console.log('Registered routes:');
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});