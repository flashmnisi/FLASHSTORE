// apps/catalog-service/src/app.ts

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';

import productRoutes from './presentation/routes/product.routes';
import categoryRoutes from './presentation/routes/category.routes';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

// ====================== UPLOADS FOLDER ======================
const uploadDir = path.join(process.cwd(), 'uploads/products');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✅ Created uploads/products directory');
}

// ====================== MIDDLEWARE ======================
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ====================== HEALTH ======================
app.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'catalog-service',
  });
});

// ====================== ROUTES (Match Gateway) ======================
app.use('/api/catalog/products', productRoutes);
app.use('/api/catalog/categories', categoryRoutes);

app.use(errorMiddleware);

export default app;