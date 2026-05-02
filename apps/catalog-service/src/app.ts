// apps/catalog-service/src/app.ts

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import productRoutes from './presentation/routes/product.routes';
import categoryRoutes from './presentation/routes/category.routes';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

// ====================== GLOBAL MIDDLEWARE ======================
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ====================== HEALTH CHECK ======================
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'catalog-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// ====================== ROUTES ======================
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// ====================== ERROR HANDLING ======================
app.use(errorMiddleware);

export default app;