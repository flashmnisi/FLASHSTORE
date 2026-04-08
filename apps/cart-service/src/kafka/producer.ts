import { publish } from '@org/shared-kafka';
import logger from '@org/shared-logger';
import { TOPICS } from '../constant/topics';

export const publishCartEvent = async (eventType: string, data: any) => {
  try {
    await publish({
      topic: TOPICS.CART,
      message: {
        event: eventType,
        data,
        source: 'cart-service',
        timestamp: new Date().toISOString(),
      },
      key: data.userId || 'cart',
    });

    logger.info({ event: eventType, userId: data.userId }, `Published ${eventType} event`);
  } catch (error: any) {
    logger.error({ error: error.message, event: eventType }, 'Failed to publish cart event');
  }
};