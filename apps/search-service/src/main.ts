// apps/search-service/src/main.ts

import app from './app';
import env from './config/env';
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';
import { getElasticClient } from './config/elastic';
import { initProductIndex } from './config/init-index';
import { startSearchConsumer } from './infrastructure/kafka/consumer';

import logger from '@org/shared-logger';

const startServer = async () => {
  try {
    logger.info('🚀 Starting Search Service...');

    // 1. Database
    await connectDatabase();
    logger.info('✅ MongoDB connected');

    // 2. Redis
    await connectRedis();
    logger.info('✅ Redis connected');

    // 3. Elasticsearch
    const elasticClient = getElasticClient();
    await elasticClient.ping();
    await initProductIndex();
    logger.info('✅ Elasticsearch connected and index initialized');

    // 4. Kafka Consumer
    await startSearchConsumer();
    logger.info('✅ Kafka consumer started');

    // 5. Start HTTP Server
    app.listen(env.PORT, () => {
      logger.info(`🚀 Search Service running on http://localhost:${env.PORT}`);
    });

  } catch (error: any) {
    logger.error('❌ Failed to start Search Service', {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};

// Graceful Shutdown
const gracefulShutdown = async (signal: string) => {
  logger.warn(`⚠️ Received ${signal}. Shutting down gracefully...`);

  try {
    // Add cleanup logic here later (close connections)
    const elasticClient = getElasticClient();
    await elasticClient.close?.();

    logger.info('✅ Graceful shutdown completed');
    process.exit(0);
  } catch (error: any) {
    logger.error('❌ Error during shutdown', { error: error.message });
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Start the server
startServer();