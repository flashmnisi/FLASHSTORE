import { createConsumer, runConsumer } from "@org/shared-kafka";
import logger from "@org/shared-logger";
import { analyticsService } from "../services/analytics.service";

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

export const startAnalyticsConsumer = async () => {
  try {
    console.log('⏳ Waiting for Kafka topics to be ready...');
    await sleep(10000); // 10 seconds delay

    const consumer = createConsumer({
      groupId: 'analytics-service-group',
      topics: ['flashstore.events']
    });

    await runConsumer(
      consumer,
      {
        groupId: 'analytics-service-group',
        topics: ['flashstore.events']
      },
      async (message) => {
        logger.info('Analytics service received event',
          { event: message.event, service: message.service }
        );

        await analyticsService.storeEvent(message);
      }
    );

    logger.info('👥 Analytics consumer started successfully');
  } catch (error: any) {
    logger.error('Failed to start analytics consumer',{ error: error.message });
  }
};