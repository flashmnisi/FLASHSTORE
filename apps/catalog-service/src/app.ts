import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import productRoutes from './modules/product/product.routes';
import categoryRoutes from './modules/category/category.routes';

const app = express();

// Global middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'catalog-service',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

export default app;