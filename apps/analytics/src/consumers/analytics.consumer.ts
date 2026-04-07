import { createConsumer, runConsumer } from '@org/shared-kafka';
import logger from '@org/shared-logger';
import { analyticsService } from '../services/analytics.service';

export const startAnalyticsConsumer = async () => {
  const start = async () => {
    try {
      const consumer = createConsumer({
        groupId: 'analytics-service-group',
        topics: ['flashstore.events'],
      });

      await runConsumer(
        consumer,
        {
          groupId: 'analytics-service-group',
          topics: ['flashstore.events'],
        },
        async (rawMessage) => {
          try {
            // 🔥 Always parse safely
            const parsed =
              typeof rawMessage === 'string'
                ? JSON.parse(rawMessage)
                : rawMessage;

            logger.info(
              {
                event: parsed.event,
                service: parsed.source || 'unknown',
              },
              '📩 Analytics received event'
            );

            await analyticsService.storeEvent(parsed);
          } catch (err: any) {
            logger.error(
              { error: err.message, rawMessage },
              '❌ Failed to process Kafka message'
            );
          }
        }
      );

      logger.info('👥 Analytics consumer started successfully');
    } catch (error: any) {
      logger.error(
        { error: error.message },
        '❌ Consumer failed — retrying in 5s...'
      );

      // 🔥 RETRY (CRITICAL)
      setTimeout(start, 5000);
    }
  };

  await start();
};