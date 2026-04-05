import express from 'express';
import dotenv from 'dotenv';
import logger from '@org/shared-logger';

import { initKafka } from './config/kafka';
import userRoutes from './routes/user.routes';
import { connectDB } from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Initialize connections
const initializeServices = async () => {
  await connectDB();
  await initKafka();
};

initializeServices().catch((err) => {
  logger.error('Failed to initialize services', err);
  process.exit(1);
});

// Routes
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'user-service',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  logger.info(`🚀 User Service running on http://localhost:${PORT}`);
});