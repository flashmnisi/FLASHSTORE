// apps/analytics-service/src/main.ts

import dotenv from 'dotenv';
dotenv.config();

import logger from '@org/shared-logger';

import { connectDatabase } from './config/database';
import { initKafka } from './config/kafka';
import { connectRedis } from './config/redis';

import app from './app';

// Import from container
import { 
  analyticsConsumers,
  aggregationJob,
  cleanupJob 
} from './container';

const PORT = process.env.PORT || 3006;

const startServer = async () => {
  try {
    logger.info('🚀 Starting Analytics Service...');

    // 1. Connect to MongoDB
    await connectDatabase();
    logger.info('✅ MongoDB connected');

    // 2. Connect to Redis
    await connectRedis();
    logger.info('✅ Redis connected');

    // 3. Initialize Kafka
    await initKafka();
    logger.info('✅ Kafka initialized');

    // 4. Start Kafka Consumers
    await analyticsConsumers.startAll();
    logger.info('✅ All Kafka Consumers started');

    // 5. Start Background Schedulers
    aggregationJob.start();
    cleanupJob.start();
    logger.info('✅ Scheduler jobs (Aggregation + Cleanup) started');

    // 6. Start Express Server
    app.listen(PORT, () => {
      logger.info(`🚀 Analytics Service running on http://localhost:${PORT}`);
    });

  } catch (error: any) {
    logger.error('❌ Failed to start Analytics Service', {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};

// ====================== GRACEFUL SHUTDOWN ======================
const gracefulShutdown = async (signal: string) => {
  logger.warn(`⚠️ Received ${signal}. Shutting down gracefully...`);

  try {
    // Optional: stop schedulers if they have stop methods
    logger.info('✅ Graceful shutdown completed');
    process.exit(0);
  } catch (error: any) {
    logger.error('Error during shutdown', { error: error.message });
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start the application
startServer();