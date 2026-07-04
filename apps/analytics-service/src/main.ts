// apps/analytics-service/src/main.ts

import dotenv from 'dotenv';
dotenv.config();

import logger from '@org/shared-logger';

import { connectDatabase } from './config/database';
import { initKafka } from './config/kafka';
import { connectRedis } from './config/redis';

import app from './app';

// ✅ NEW SINGLE CONSUMER ARCHITECTURE
import { analyticsConsumer } from './container';

const PORT = process.env.PORT || 3006;

const startServer = async () => {
  try {
    logger.info('🚀 Starting Analytics Service...');

    // 1. DB
    await connectDatabase();
    logger.info('✅ MongoDB connected');

    // 2. Redis
    await connectRedis();
    logger.info('✅ Redis connected');

    // 3. Kafka init
    await initKafka();
    logger.info('✅ Kafka initialized');

    // 4. SINGLE CONSUMER START
    await analyticsConsumer.start();
    logger.info('✅ Analytics Consumer started');

    // 5. Jobs
    logger.info('✅ Scheduler jobs started');

    // 6. API
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

// ====================== SHUTDOWN ======================

const gracefulShutdown = async (signal: string) => {
  logger.warn(`⚠️ Received ${signal}. Shutting down gracefully...`);

  try {
    logger.info('✅ Graceful shutdown completed');
    process.exit(0);
  } catch (error: any) {
    logger.error('Shutdown error', { error: error.message });
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();
