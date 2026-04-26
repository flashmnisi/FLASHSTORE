// apps/cart-service/src/main.ts

import mongoose from 'mongoose';
import { app } from './app';
import { CheckoutSaga } from './application/saga/checkout.saga';
import { connectRedis } from './config/redis';
import { startCartConsumer } from './infrastracture/kafka/consumer';
import { startOutboxProcessor } from './infrastracture/outbox/outbox.processor';
import { SagaRepositoryImpl } from './infrastracture/persistence/repositories/saga.repository.impl';
import logger from '@org/shared-logger';

// =============================
// ENV
// =============================
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cart';

// =============================
// START SERVER
// =============================
const start = async () => {
  try {
    // =============================
    // 1. DATABASE
    // =============================
    await mongoose.connect(MONGO_URI);
    logger.info('MongoDB connected');

    // =============================
    // 2. REDIS
    // =============================
    await connectRedis();
    logger.info('Redis connected');

    // =============================
    // 3. OUTBOX WORKER
    // =============================
    startOutboxProcessor();
    logger.info('Outbox processor started');

    // =============================
    // 4. KAFKA CONSUMER
    // =============================
    startCartConsumer();
    logger.info('Kafka consumer started');

    // =============================
    // 5. SAGA ENGINE (READY)
    // =============================
    const saga = new CheckoutSaga(
      new SagaRepositoryImpl(),
      new OrderClient(),
      new PaymentClient()
    );

    logger.info('Saga engine initialized');

    // =============================
    // 6. EXPRESS SERVER
    // =============================
    app.listen(PORT, () => {
      logger.info(`Cart Service running on port ${PORT}`);
    });

  } catch (error: any) {
    logger.error('Startup failed', { error: error.message });
    process.exit(1);
  }
};

start();