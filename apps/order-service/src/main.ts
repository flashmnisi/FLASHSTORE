// apps/order-service/src/main.ts

import dotenv from 'dotenv';
dotenv.config();

import logger from '@org/shared-logger';

import app from './app';

import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';
import { initKafka } from './config/kafka';

import { startOrderConsumer } from './infrastructure/kafka/consumer';
//import { startOrderOutboxProcessor } from './infrastructure/outbox/outbox.publisher';

import { OrderService } from './application/sevices/order.service';
import { OrderRepositoryImpl } from './infrastructure/persistance/repositories/oder.repository.impl';
import { OutboxProcessor } from './infrastructure/outbox/outbox.processor';
import { OutboxService } from './infrastructure/outbox/outbox.service';
import { OutboxRepository } from './infrastructure/outbox/outbox.repository';
//import { OutboxRepository } from './infrastructure/persistance/repositories/outbox.repository';

const PORT = process.env.PORT || 3004;

const startServer = async () => {
  try {
    logger.info('🚀 Starting Order Service...');

    /**
     * =========================
     * DATABASE
     * =========================
     */
    await connectDatabase();

    logger.info('✅ MongoDB connected');

    /**
     * =========================
     * REDIS
     * =========================
     */
    await connectRedis();

    logger.info('✅ Redis connected');

    /**
     * =========================
     * KAFKA
     * =========================
     */
    await initKafka();

    logger.info('✅ Kafka initialized');

    /**
     * =========================
     * DEPENDENCY INJECTION
     * =========================
     */
    const outboxRepository = new OutboxRepository();
    const orderRepository = new OrderRepositoryImpl();
    const outboxService = new OutboxService(outboxRepository);
    

    const orderService = new OrderService(orderRepository,outboxService);

    /**
     * =========================
     * KAFKA CONSUMERS
     * =========================
     */
    await startOrderConsumer(orderService);

    logger.info('✅ Order Consumer started');

    /**
     * =========================
     * OUTBOX PROCESSOR
     * =========================
     */
    // create outbox service (depends on your repo)


// create processor
const outboxProcessor = new OutboxProcessor(outboxService);

// start processor
outboxProcessor.start();

    logger.info('✅ Order Outbox Processor started');

    /**
     * =========================
     * HTTP SERVER
     * =========================
     */
    app.listen(PORT, () => {
      logger.info(`🚀 Order Service running on http://localhost:${PORT}`);
    });

  } catch (error: any) {
    logger.error('❌ Failed to start Order Service', {
      error: error.message,
      stack: error.stack,
    });

    process.exit(1);
  }
};

startServer();

/**
 * =========================
 * GRACEFUL SHUTDOWN
 * =========================
 */

process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down Order Service gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down Order Service gracefully...');
  process.exit(0);
});
