// apps/inventory-service/src/main.ts

import dotenv from 'dotenv';
dotenv.config();

import logger from '@org/shared-logger';

import app from './app';
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';
import { initKafka } from './config/kafka';

import { startInventoryConsumer } from './infrastructure/kafka/consumer';
import { OutboxProcessor } from './infrastructure/outbox/outbox.processor';

import {
  outboxService,
  inventoryService,
  reservationService,
} from './container';

// Import Handlers
import { OrderCreatedHandler } from './infrastructure/kafka/handlers/order-created.handler';
//import { PaymentSuccessHandler } from './infrastructure/kafka/handlers/payment-success.handler';
import { PaymentFailedHandler } from './infrastructure/kafka/handlers/payment-failed.handler';
import { PaymentSuccessHandler } from './infrastructure/kafka/handlers/payment-completed.handler';

const PORT = process.env.PORT || 3008;

const startServer = async () => {
  try {
    logger.info('🚀 Starting Inventory Service...');

    await connectDatabase();
    logger.info('✅ MongoDB connected');

    await connectRedis();
    logger.info('✅ Redis connected');

    await initKafka();
    logger.info('✅ Kafka initialized');

    // ====================== HANDLERS ======================
    const orderCreatedHandler =
  new OrderCreatedHandler(
    reservationService
  );

const paymentFailedHandler =
  new PaymentFailedHandler(
    reservationService
  );

const paymentSuccessHandler =
  new PaymentSuccessHandler(
    inventoryService
  );

    // ====================== START CONSUMER ======================
    await startInventoryConsumer(
      orderCreatedHandler,
      paymentSuccessHandler,
      paymentFailedHandler
    );

    logger.info('✅ Inventory Kafka consumer started');

    // ====================== OUTBOX PROCESSOR ======================
    const outboxProcessor = new OutboxProcessor(outboxService);
    outboxProcessor.start();

    logger.info('✅ Outbox processor started');

    // ====================== START SERVER ======================
    app.listen(PORT, () => {
      logger.info(`🚀 Inventory Service running on http://localhost:${PORT}`);
    });

  } catch (error: any) {
    logger.error('❌ Failed to start Inventory Service', {
      error: error.message,
    });
    process.exit(1);
  }
};

startServer();

/** Graceful Shutdown */
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down...');
  process.exit(0);
});