import mongoose from 'mongoose';
import { app } from './app';
import { connectRedis } from './config/redis';
import { startCartConsumer } from './infrastructure/kafka/consumer';
import logger from '@org/shared-logger';

import { CartCheckoutOrchestrator } from './infrastructure/checkout/cart-checkout.orchestrator';
import { OrderClient } from './infrastructure/client/order.client';
import { PaymentClient } from './infrastructure/client/payment.client';

import { CartRepositoryImpl } from './infrastructure/persistence/repositories/cart.repository.impl';
import { CartCacheRepository } from './infrastructure/cache/cart.cache';           // ← Use the correct cache class
import { CouponService } from './application/services/coupon.service';
import { CouponRepositoryImpl } from './infrastructure/persistence/repositories/coupon.repository.impl';
//import { CouponRepositoryImpl } from './infrastructure/persistence/repositories/coupon.repository.impl'; // ← New

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cart';

const start = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info('✅ MongoDB connected');

    await connectRedis();
    logger.info('✅ Redis connected');

    // ============================
    // DI SETUP - All Dependencies
    // ============================
    const orderClient = new OrderClient();
    const paymentClient = new PaymentClient();

    const cartRepo = new CartRepositoryImpl();
    const cartCache = new CartCacheRepository();           // ← Use CartCacheRepository
    const couponRepo = new CouponRepositoryImpl();         // ← New
    const couponService = new CouponService(couponRepo);   // ← Pass repository

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