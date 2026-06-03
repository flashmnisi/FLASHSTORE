import mongoose from 'mongoose';
import { app } from './app';
import { connectRedis } from './config/redis';
import { startCartConsumer } from './infrastructure/kafka/consumer';
import logger from '@org/shared-logger';

import { CartCheckoutOrchestrator } from './infrastructure/checkout/cart-checkout.orchestrator';
import { OrderClient } from './infrastructure/client/order.client';
import { PaymentClient } from './infrastructure/client/payment.client';

import { CartRepositoryImpl } from './infrastructure/persistence/repositories/cart.repository.impl';
import { CartCacheRepository } from './infrastructure/cache/cart.cache';          
import { CouponService } from './application/services/coupon.service';
import { CouponRepositoryImpl } from './infrastructure/persistence/repositories/coupon.repository.impl';
import { connectKafka } from './config/kafka';
import { OutboxProcessor } from './infrastructure/outbox/outbox.processor';
import { outboxService } from './infrastructure/container/cart.container';

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cart';

const start = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info('✅ MongoDB connected');

    await connectRedis();
    logger.info('✅ Redis connected');

    await connectKafka();
    logger.info('✅ Kafka initialized');

    // ============================
    // DI SETUP - All Dependencies
    // ============================
    const orderClient = new OrderClient();
    const paymentClient = new PaymentClient();

    const cartRepo = new CartRepositoryImpl();
    const cartCache = new CartCacheRepository();           
    const couponRepo = new CouponRepositoryImpl();         
    const couponService = new CouponService(couponRepo);   

    const orchestrator = new CartCheckoutOrchestrator(
      orderClient,
      paymentClient,
      cartRepo,
      cartCache,
      couponService
    );

    // ============================
    // Start Kafka Consumer
    // ============================
    await startCartConsumer(orchestrator);

    const outboxProcessor = new OutboxProcessor(outboxService);
    outboxProcessor.start();
    logger.info('✅ Order Outbox Processor started');

    // Start HTTP Server
    app.listen(PORT, () => {
      logger.info(`🚀 Cart Service running on http://localhost:${PORT}`);
    });

  } catch (error: any) {
    logger.error('❌ Startup failed', { error: error.message });
    process.exit(1);
  }
};

start();