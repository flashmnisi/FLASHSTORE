// apps/cart-service/src/infrastructure/kafka/consumer.ts

import {
  createConsumer,
  runConsumer,
  TOPICS,
  EVENTS,
} from '@org/shared-kafka';

import { CartCheckoutOrchestrator } from '../checkout/cart-checkout.orchestrator';
import logger from '@org/shared-logger';

export const startCartConsumer = async (
  orchestrator: CartCheckoutOrchestrator
) => {
  const groupId = 'cart-service-group';

  try {

    const consumer = createConsumer({
      groupId,
      serviceName: 'cart-service',

      // ✅ SUBSCRIBE TO TOPICS
      topics: [
        TOPICS.PAYMENTS,
        TOPICS.ORDERS,
      ],
    });

    await runConsumer(
      consumer,
      {
        groupId,
        topics: [
          TOPICS.PAYMENTS,
          TOPICS.ORDERS,
        ],
        serviceName: 'cart-service',
      },

      async (message: any) => {
        try {

          const eventType = message?.event;
          const data = message?.data || {};

          logger.info('📥 Cart consumer received event', {
            event: eventType,
            orderId: data.orderId,
            userId: data.userId,
          });

          switch (eventType) {

            /**
             * ====================================
             * 💳 PAYMENT EVENTS
             * ====================================
             */

            case EVENTS.PAYMENT_COMPLETED:

              logger.info('💰 Processing payment.completed', {
                orderId: data.orderId,
              });

              if (data.userId && data.orderId) {

                await orchestrator.handlePaymentSuccess(
                  data.userId,
                  data.orderId
                );
              }

              break;

            case EVENTS.PAYMENT_FAILED:

              logger.warn('❌ Processing payment.failed', {
                orderId: data.orderId,
              });

              if (data.orderId) {

                await orchestrator.handlePaymentFailure(
                  data.orderId
                );
              }

              break;

            /**
             * ====================================
             * 📦 ORDER EVENTS
             * ====================================
             */

            case EVENTS.ORDER_CANCELLED:

              logger.info('🚫 Processing order.cancelled', {
                orderId: data.orderId,
              });

              if (data.userId) {

                await orchestrator.restoreCartAfterCancellation?.(
                  data.userId,
                  data.orderId
                );
              }

              break;

            default:

              logger.warn('⚠️ Unhandled cart event', {
                event: eventType,
              });
          }

        } catch (error: any) {

          logger.error('❌ Failed to process cart event', {
            error: error.message,
            stack: error.stack,
          });

          throw error;
        }
      }
    );

    logger.info('🚀 Cart Kafka consumer started successfully');

  } catch (error: any) {

    logger.error('❌ Failed to start cart consumer', {
      error: error.message,
    });

    throw error;
  }
};