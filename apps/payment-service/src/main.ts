import app from './app';
import mongoose from 'mongoose';
import logger from './utils/logger';
import env from './config/env';
import { PaymentConsumer } from './infrastructure/kafka/consumer';
import { startOutboxProcessor } from './infrastructure/outbox/outbox.processor';

const PORT = env.PORT || 3005;

async function bootstrap() {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info('MongoDB connected');

    const consumer = new PaymentConsumer(paymentService);

     await consumer.start();
     await startOutboxProcessor();

    app.listen(PORT, () => {
      logger.info(`💳 Payment Service running on http://localhost:${PORT}`);
    });
  } catch (error: any) {
    logger.error('Failed to start payment service', {
      error: error.message,
    });
    process.exit(1);
  }
}

bootstrap();