import dotenv from 'dotenv';
import logger from '@org/shared-logger';
import { connectDB } from './config/db';
import app from './app';
 // ← This line was missing
import env from './config/env';
import { startOrderConsumer } from './kafka/consumer';

dotenv.config();

const PORT = env.PORT || 3004;

const startServer = async () => {
  try {
    await connectDB();
    
    // Start Kafka consumer to listen for events from other services
    await startOrderConsumer();

    app.listen(PORT, () => {
      logger.info(`🚀 Order Service running on http://localhost:${PORT}`);
    });
  } catch (error: any) {
    logger.error({ error: error.message }, '❌ Failed to start Order Service');
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down Order Service gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down Order Service gracefully...');
  process.exit(0);
});