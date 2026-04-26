import dotenv from 'dotenv';
dotenv.config();

import logger from '@org/shared-logger';
import app from './app';
import { connectDatabase } from './config/database';
import { startOrderConsumer } from './infrastructure/kafka/consumer';

// Import necessary classes for DI


//import { OrderService } from './application/services/order.service';
//import { OrderRepositoryImpl } from './infrastructure/persistence/repositories/order.repository.impl';
//import { OrderProducer } from './infrastructure/kafka/producer';
import { OrderService } from './application/sevices/order.service';
import { OrderRepositoryImpl } from './infrastructure/persistance/repositories/oder.repository.impl';

const PORT = process.env.PORT || 3004;

const startServer = async () => {
  try {
    logger.info('🚀 Starting Order Service...');

    // 1. Initialize Database
    await connectDatabase();

    // 2. Dependency Injection Setup
    const orderRepository = new OrderRepositoryImpl();
    

    const orderService = new OrderService(orderRepository);

    // 3. Start Kafka Consumer (pass orderService)
    await startOrderConsumer(orderService);

    // 4. Start HTTP Server
    app.listen(PORT, () => {
      logger.info(`🚀 Order Service running on http://localhost:${PORT}`);
    });

  } catch (error: any) {
    logger.error('❌ Failed to start Order Service', { 
      error: error.message 
    });
    process.exit(1);
  }
};

startServer();

// Graceful Shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down Order Service gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down Order Service gracefully...');
  process.exit(0);
});