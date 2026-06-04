// apps/inventory-service/src/app.ts

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import inventoryRoutes from './presentation/routes/inventory.routes';

const app = express();

/**
 * =========================
 * MIDDLEWARE
 * =========================
 */
app.use(cors());
app.use(helmet());
app.use(express.json());

/**
 * =========================
 * ROUTES
 * =========================
 */
app.use('/api/inventory', inventoryRoutes);

/**
 * Health check
 */
app.get('/health', (req, res) => {
  res.json({
    service: 'inventory-service',
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

export default app;