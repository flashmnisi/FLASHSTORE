// apps/cart-service/src/infrastructure/kafka/consumer.ts

import { createConsumer } from '@org/shared-kafka';
import { CartCheckoutOrchestrator } from '../checkout/cart-checkout.orchestrator';
import logger from '@org/shared-logger';

export const startCartConsumer = async (
  orchestrator: CartCheckoutOrchestrator
) => {
  const consumer = createConsumer('cart-service');

  await consumer.subscribe({ topic: 'payment.completed' });
  await consumer.subscribe({ topic: 'payment.failed' });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      try {
        const event = JSON.parse(message.value!.toString());

        logger.info('Cart received event', { topic });

        switch (topic) {
          case 'payment.completed':
            await orchestrator.handlePaymentSuccess(event.data.userId);
            break;

          case 'payment.failed':
            await orchestrator.handlePaymentFailure(event.data.orderId);
            break;
        }

      } catch (error: any) {
        logger.error('Cart consumer error', { error: error.message });
      }
    },
  });
};