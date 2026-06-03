import app from './app';
import { connectDB } from './config/db';
import { initKafka } from './config/kafka';
import { startAnalyticsConsumer } from './consumers/analytics.consumer';
import logger from '@org/shared-logger';

const PORT = process.env.PORT || 3007;

const start = async () => {
  await connectDB();
  await initKafka();
  await startAnalyticsConsumer();

  app.listen(PORT, () => {
    logger.info(`🚀 Analytics Service running on http://localhost:${PORT}`);
  });
};

start().catch((err) => {
  logger.error('Failed to start analytics service',{ error: err.message });
  process.exit(1);
});
