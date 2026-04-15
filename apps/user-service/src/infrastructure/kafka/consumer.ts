import { createConsumer, runConsumer } from '@org/shared-kafka';
import logger from '@org/shared-logger';
import { eventRouter } from './event.router';

export const startOrderConsumer = async () => {
  try {
    const consumer = createConsumer({
      groupId: 'user-service-order-group',
      topics: ['flashstore.orders'],
    });

    await runConsumer(
      consumer,
      {
        groupId: 'user-service-order-group',
        topics: ['flashstore.orders'],
      },
      async (message: any) => {
        const { event, data, correlationId } = message;

        try {
          // ✅ Validate message
          if (!event || !data) {
            throw new Error('Invalid message format');
          }

          logger.info(
            {
              event,
              correlationId,
              orderId: data?.orderId,
              userId: data?.userId,
            },
            '📩 Event received'
          );

          // ✅ Route event
          await eventRouter(event, data);

        } catch (err: any) {
          logger.error(
            {
              error: err.message,
              event,
              data,
              correlationId,
            },
            '❌ Failed to process event'
          );

          // 🔥 FUTURE: send to DLQ
        }
      }
    );

    logger.info('👥 Order consumer started successfully in user-service');
  } catch (error: any) {
    logger.error(
      { error: error.message },
      'Failed to start order consumer'
    );
  }
};