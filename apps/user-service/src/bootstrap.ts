import app from './app';
import logger from '@org/shared-logger';

import { connectDB } from './infrastructure/config/database';
import { initKafka } from './infrastructure/kafka/kafka.client';
import { startOrderConsumer } from './infrastructure/kafka/consumer';
import { startOutboxWorker } from './infrastructure/workers/outbox.werker';

const PORT = process.env.PORT || 3001;

export const bootstrap = async () => {
  try {
    logger.info('🚀 Starting User Service...');

    // 1. DB FIRST
    await connectDB();

    // 2. KAFKA INIT
    await initKafka();

    // 3. START CONSUMERS
    await startOrderConsumer();

    await startOutboxWorker();

    // 4. START SERVER
    const server = app.listen(PORT, () => {
      logger.info(`🚀 User Service running on http://localhost:${PORT}`);
    });

    // 5. GRACEFUL SHUTDOWN
    const shutdown = async () => {
      logger.info('🛑 Shutting down User Service...');

      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error: any) {
  logger.error(
    {
      error: error.message,
      stack: error.stack,
      service: 'user-service',
    },
    '❌ Bootstrap failed'
  );

  process.exit(1);
}
};