// apps/payment-service/src/main.ts

import dotenv from 'dotenv';
dotenv.config();

import logger from '@org/shared-logger';

import { connectDatabase } from './config/database';
import { initKafka } from './config/kafka';
import { OutboxProcessor } from './infrastructure/outbox/outbox.processor';
import { outboxService, paymentConsumer } from './container';

import app from './app';

const PORT = process.env.PORT || 3005;

const startServer = async () => {
  try {
    logger.info('🚀 Starting Payment Service...');

    // 1. Connect to MongoDB
    await connectDatabase();
    logger.info('✅ MongoDB connected successfully');

    // 2. Initialize Kafka
    await initKafka();
    logger.info('✅ Kafka client initialized');

    // 3. Start Outbox Processor (reliable event delivery)
   // create processor
const outboxProcessor = new OutboxProcessor(outboxService);

// start processor
outboxProcessor.start();

    logger.info('✅ Payment Outbox Processor started');

    // 4. Start Kafka Consumer (listens to Order Service events)
    await paymentConsumer.start();
    logger.info('✅ Payment Consumer started and listening for events');

    // 5. Start Express HTTP Server
    app.listen(PORT, () => {
      logger.info(`🚀 Payment Service is running on http://localhost:${PORT}`);
    });

  } catch (error: any) {
    logger.error('❌ Failed to start Payment Service', {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};

// ====================== GRACEFUL SHUTDOWN ======================
const gracefulShutdown = (signal: string) => {
  logger.warn(`⚠️ Received ${signal}. Shutting down gracefully...`);

  // You can add more cleanup here (e.g., close Kafka consumer, Redis, etc.)
  setTimeout(() => {
    logger.info('✅ Graceful shutdown completed');
    process.exit(0);
  }, 1500);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start the application
startServer();