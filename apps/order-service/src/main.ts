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
import { startOrderOutboxProcessor } from './infrastructure/outbox/outbox.processor';

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
    const orderRepository = new OrderRepositoryImpl();

    const orderService = new OrderService(orderRepository);

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
    startOrderOutboxProcessor();

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
