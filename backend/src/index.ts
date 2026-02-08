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

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL || '',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});