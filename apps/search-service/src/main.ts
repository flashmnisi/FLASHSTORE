// apps/search-service/src/main.ts

import app from './app';
import env from './config/env';
import { connectDB } from './config/database';
import { startKafkaConsumer } from './infrastructure/kafka/consumer';
import { elasticClient } from './config/elastic';
import logger from './utils/logger';

const startServer = async () => {
  try {
    // =============================
    // 1. CONNECT DATABASE (Mongo/Redis if used)
    // =============================
    await connectDB();
    logger.info('✅ Database connected');

    // =============================
    // 2. CONNECT ELASTICSEARCH
    // =============================
    await elasticClient.ping();
    logger.info('✅ Elasticsearch connected');

    // =============================
    // 3. START KAFKA CONSUMER
    // =============================
    await startKafkaConsumer();
    logger.info('✅ Kafka consumer started');

    // =============================
    // 4. START HTTP SERVER
    // =============================
    app.listen(env.PORT, () => {
      logger.info(`🚀 Search Service running on port ${env.PORT}`);
    });

  } catch (error: any) {
    logger.error('❌ Failed to start service', {
      error: error.message,
      stack: error.stack,
    });

    process.exit(1);
  }
};

// =============================
// GRACEFUL SHUTDOWN 🔥
// =============================
const shutdown = async (signal: string) => {
  logger.warn(`⚠️ Received ${signal}. Shutting down...`);

  try {
    // Close DB, Kafka, etc if needed
    process.exit(0);
  } catch (error: any) {
    logger.error('Shutdown error', { error: error.message });
    process.exit(1);
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// =============================
// START
// =============================
startServer();