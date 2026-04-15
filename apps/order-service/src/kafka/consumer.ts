import { createConsumer, runConsumer } from '@org/shared-kafka';
import logger from '@org/shared-logger';

export const startOrderConsumer = async () => {
  try {
    const consumer = createConsumer({
      groupId: 'order-service-group',
      topics: ['flashstore.users', 'flashstore.payments']
    });

    await runConsumer(
      consumer,
      {
        groupId: 'order-service-group',
        topics: ['flashstore.users', 'flashstore.payments']
      },
      async (message) => {
        logger.info(
          { event: message.event, data: message.data },
          `Order service received event: ${message.event}`
        );

        if (message.event === 'user.registered') {
          logger.info(
            { userId: message.data.userId, email: message.data.email },
            'New user registered - order service notified'
          );
          // You can do something here, e.g., create a welcome order or just log
        }

        if (message.event === 'payment.success') {
          logger.info(
            { orderId: message.data.orderId },
            'Payment succeeded - updating order status'
          );
          // TODO: Update order status to paid
        }
      }
    );

    logger.info('👥 Order consumer started successfully');
  } catch (error: any) {
    logger.error(
      { error: error.message },
      'Failed to start order consumer'
    );
  }
};