import { createConsumer } from '@org/shared-kafka';
import { CartCheckoutOrchestrator } from '../checkout/cart-checkout.orchestrator';
import logger from '@org/shared-logger';

export const startCartConsumer = async (
  orchestrator: CartCheckoutOrchestrator
) => {
  try {
    const consumer = createConsumer({
      groupId: 'cart-service-group',
      serviceName: 'cart-service',           // ← Required
      topics: ['payment.completed', 'payment.failed'],
    });

    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        try {
          if (!message.value) return;

          const event = JSON.parse(message.value.toString());

          logger.info('📥 Cart consumer received event', { 
            topic, 
            event: event.event 
          });

          switch (topic) {
            case 'payment.completed':
              if (event.data?.userId) {
                await orchestrator.handlePaymentSuccess(
                  event.data.userId,
                  event.data.orderId || ''   // ← Pass orderId if available
                );
              }
              break;

            case 'payment.failed':
              if (event.data?.orderId) {
                await orchestrator.handlePaymentFailure(event.data.orderId);
              }
              break;

            default:
              logger.warn('Unhandled event in cart consumer', { topic });
          }
        } catch (error: any) {
          logger.error('Failed to process cart event', {
            topic,
            error: error.message,
          });
        }
      },
    });

    logger.info('🚀 Cart Kafka consumer started successfully', { 
      groupId: 'cart-service-group' 
    });

  } catch (error: any) {
    logger.error('Failed to start Cart Kafka consumer', {
      error: error.message,
    });
  }
};