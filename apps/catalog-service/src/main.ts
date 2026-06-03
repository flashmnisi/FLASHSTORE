// apps/catalog-service/src/main.ts

import dotenv from 'dotenv';
dotenv.config();

import logger from '@org/shared-logger';

import { connectDatabase } from './config/database';
import { initKafka } from './config/kafka';
import { connectRedis } from './config/radis';

import app from './app';
import { OutboxProcessor } from './infrastructure/outbox/outbox.processor';
import { outboxService } from './container';

const PORT = process.env.PORT || 3002;

const startServer = async () => {
  try {
    logger.info('🚀 Starting Catalog Service...');

    // 1. Connect to MongoDB
    await connectDatabase();
    logger.info('✅ MongoDB connected');

    // 2. Connect to Redis
    await connectRedis();
    logger.info('✅ Redis connected');

    // 3. Initialize Kafka
    await initKafka();
    logger.info('✅ Kafka initialized');

    const outboxProcessor = new OutboxProcessor(outboxService);
    outboxProcessor.start();
    logger.info('✅ Order Outbox Processor started');

    // 4. Start Express Server
    app.listen(PORT, () => {
      logger.info(`🚀 Catalog Service running on http://localhost:${PORT}`);
    });

  } catch (error: any) {
    logger.error('❌ Failed to start Catalog Service', {
      error: error.message,
    });
    process.exit(1);
  }
};

// ====================== GRACEFUL SHUTDOWN ======================
const gracefulShutdown = async (signal: string) => {
  logger.warn(`⚠️ Received ${signal}. Shutting down gracefully...`);

  try {
    // Add cleanup if needed
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