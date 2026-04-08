import dotenv from 'dotenv';
import logger from '@org/shared-logger';

import { connectDB } from './config/db';
import app from './app';
import { startOrderConsumer } from './events/consumers/order.consumer';
import env from './config/env';

dotenv.config();

const PORT = env.PORT || 3001;

const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Start Kafka consumer (order events)
    await startOrderConsumer();

    // 3. Start the Express server
    app.listen(PORT, () => {
      logger.info(`🚀 User Service running on http://localhost:${PORT}`);
    });

  } catch (error: any) {
    logger.error(
      { error: error.message },
      '❌ Failed to start User Service'
    );
    process.exit(1);
  }
};

// Start everything
startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down User Service gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down User Service gracefully...');
  process.exit(0);
});