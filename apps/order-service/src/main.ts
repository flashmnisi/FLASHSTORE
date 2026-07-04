// apps/order-service/src/main.ts
import dotenv from 'dotenv';
dotenv.config();

import logger from '@org/shared-logger';

import app from './app';

import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';
import { initKafka } from './config/kafka';

import { OrderConsumer } from './infrastructure/kafka/consumer';
import { PaymentCompletedHandler } from './infrastructure/kafka/handlers/payment-completed.handler';
import { PaymentFailedHandler } from './infrastructure/kafka/handlers/payment-failed.handler';
import { OrderCreatedHandler } from './infrastructure/kafka/handlers/order-created.handler';
import { OrderCancelledHandler } from './infrastructure/kafka/handlers/order-cancelled.handler';
import { OrderCompletedHandler } from './infrastructure/kafka/handlers/order-completed.handler';
import { OrderUpdatedHandler } from './infrastructure/kafka/handlers/order-updated.hander';

import { OrderRepositoryImpl } from './infrastructure/persistance/repositories/oder.repository.impl';
import { OutboxProcessor } from './infrastructure/outbox/outbox.processor';
import { OutboxService } from './infrastructure/outbox/outbox.service';
import { OutboxRepository } from './infrastructure/outbox/outbox.repository';
import { OrderService } from './application/sevices/order.service';

const PORT = process.env.PORT || 3004;

const startServer = async () => {
  try {
    logger.info('🚀 Starting Order Service...');

    // ========================= DATABASE =========================
    await connectDatabase();
    logger.info('✅ MongoDB connected');

    // ========================= REDIS =========================
    await connectRedis();
    logger.info('✅ Redis connected');

    // ========================= KAFKA =========================
    await initKafka();
    logger.info('✅ Kafka initialized');

    // ========================= DEPENDENCY INJECTION =========================
    const outboxRepository = new OutboxRepository();
    const orderRepository = new OrderRepositoryImpl();
    const outboxService = new OutboxService(outboxRepository);
    const orderService = new OrderService(orderRepository, outboxService);

    // ========================= KAFKA HANDLERS =========================
    const paymentCompletedHandler = new PaymentCompletedHandler(orderService);
    const paymentFailedHandler = new PaymentFailedHandler(orderService);
    const orderCreatedHandler = new OrderCreatedHandler();
    const orderCancelledHandler = new OrderCancelledHandler();
    const orderCompletedHandler = new OrderCompletedHandler();
    const orderUpdatedHandler = new OrderUpdatedHandler();

    // ========================= KAFKA CONSUMER =========================
    const orderConsumer = new OrderConsumer(
      paymentCompletedHandler,
      paymentFailedHandler,
      orderCreatedHandler,
      orderCancelledHandler,
      orderCompletedHandler,
      orderUpdatedHandler
    );

    await orderConsumer.start();  

    logger.info('✅ Order Consumer started successfully');

    // ========================= OUTBOX PROCESSOR =========================
    const outboxProcessor = new OutboxProcessor(outboxService);
    outboxProcessor.start();

    logger.info('✅ Order Outbox Processor started');

    // ========================= HTTP SERVER =========================
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

/** Graceful Shutdown */
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});