import express from 'express';
import dotenv from 'dotenv';
import logger from '@org/shared-logger';
import { connectDB } from './config/db';
import orderRoutes from './routes/order.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json());

app.use('/api/orders', orderRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'order-service' });
});

const start = async () => {
  await connectDB();

  app.listen(PORT, () => {
    logger.info(`🚀 Order Service running on http://localhost:${PORT}`);
  });
};

start().catch((err) => {
  logger.error({ error: err.message }, 'Failed to start order-service');
  process.exit(1);
});
