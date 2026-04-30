// apps/user-service/src/main.ts

import app from './app';
import env from './config/env';

import { connectDatabase } from './config/database';
import { connectRedis, disconnectRedis } from './config/redis';
import { initializeKafka } from './infrastructure/kafka/index';
import { outboxProcessor } from './infrastructure/outbox/outbox.processor';

import './container';                    // Initialize all services (UserService, AuthService, etc.)

import logger from '@org/shared-logger';

const startServer = async () => {
  try {
    logger.info('🚀 Starting User Service...');

    // 1. Connect to Database
    await connectDatabase();

    // 2. Connect to Redis
    await connectRedis();

    // 3. Initialize Kafka + Consumers
    await initializeKafka();

    // 4. Start Outbox Processor
    outboxProcessor.start();

    logger.info('✅ All infrastructure components initialized successfully');

    // 5. Start Express Server
    app.listen(env.PORT, () => {
      logger.info(`🚀 User Service is running on http://localhost:${env.PORT}`);
    });

  } catch (error: any) {
    logger.error('❌ Failed to start User Service', { 
      error: error.message 
    });
    process.exit(1);
  }
};

// ====================== GRACEFUL SHUTDOWN ======================
const gracefulShutdown = async (signal: string) => {
  logger.warn(`⚠️ Received ${signal}. Shutting down gracefully...`);

  try {
    await disconnectRedis();        // Close Redis connection
    // You can add more cleanup here (Kafka, DB, etc.)
    logger.info('✅ Graceful shutdown completed');
    process.exit(0);
  } catch (error: any) {
    logger.error('Error during graceful shutdown', { error: error.message });
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Start the application
startServer();