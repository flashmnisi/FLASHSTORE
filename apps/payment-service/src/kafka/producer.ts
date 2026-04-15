import { publish } from '@org/shared-kafka';
import logger from '@org/shared-logger';
import { TOPICS } from '../constant/topics';

export const publishPaymentEvent = async (eventType: string, data: any) => {
  try {
    await publish({
      topic: TOPICS.PAYMENTS,
      message: {
        event: eventType,
        data,
        source: 'payment-service',
        timestamp: new Date().toISOString(),
      },
      key: data.paymentIntentId || data.orderId || 'payment',
    });

    logger.info({ event: eventType, paymentIntentId: data.paymentIntentId }, `Published ${eventType} event`);
  } catch (error: any) {
    logger.error({ error: error.message, event: eventType }, 'Failed to publish payment event');
  }
};