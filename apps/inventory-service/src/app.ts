// apps/inventory-service/src/app.ts

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import {
  metricsMiddleware,
  metricsRouter,
} from '@org/shared-metrics';

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

// ====================== PROMETHEUS ======================

app.use(metricsMiddleware('inventory-service'));

app.use('/metrics', metricsRouter);

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