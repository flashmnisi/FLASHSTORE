// apps/order-service/src/infrastructure/kafka/consumer.ts

import {
  createConsumer,
  runConsumer,
  TOPICS,
  EVENTS,
} from '@org/shared-kafka';

import logger from '@org/shared-logger';
import { OrderService } from '../../application/sevices/order.service';

export const startOrderConsumer = async (
  orderService: OrderService
) => {
  const groupId = 'order-service-group';

  try {
    const consumer = createConsumer({
      groupId,
      topics: [
        TOPICS.PAYMENTS,
        TOPICS.ORDERS,
      ],
      serviceName: 'order-service',
    });

    logger.info('📥 Starting Order Kafka Consumer', {
      groupId,
      topics: [TOPICS.PAYMENTS, TOPICS.ORDERS],
    });

    await runConsumer(
      consumer,
      {
        groupId,
        topics: [
          TOPICS.PAYMENTS,
          TOPICS.ORDERS,
        ],
        serviceName: 'order-service',
      },
      async (event: any) => {
        try {
          const eventType = event?.event;
          const data = event?.data || {};

          if (!eventType) {
            logger.warn('⚠️ Received malformed Kafka event', {
              event,
            });
            return;
          }

          logger.info('📨 Order service received event', {
            event: eventType,
            orderId: data.orderId,
            userId: data.userId,
          });

          switch (eventType) {
            /**
             * ============================
             * 💳 PAYMENT EVENTS
             * ============================
             */

            case EVENTS.PAYMENT_COMPLETED:
              logger.info('💰 Processing payment.completed', {
                orderId: data.orderId,
              });

              await orderService.handlePaymentCompleted(data);

              logger.info('✅ Payment completed processed', {
                orderId: data.orderId,
              });

              break;

            case EVENTS.PAYMENT_FAILED:
              logger.info('❌ Processing payment.failed', {
                orderId: data.orderId,
              });

              await orderService.handlePaymentFailed(data);

              logger.info('✅ Payment failed processed', {
                orderId: data.orderId,
              });

              break;

            /**
             * ============================
             * 📦 ORDER EVENTS
             * ============================
             */

            case EVENTS.ORDER_CREATED:
              logger.info('📦 Processing order.created', {
                orderId: data.orderId,
                userId: data.userId,
                totalAmount: data.totalAmount,
              });

              // Optional:
              // await orderService.handleOrderCreated(data);

              break;

            case EVENTS.ORDER_UPDATED:
              logger.info('📝 Processing order.updated', {
                orderId: data.orderId,
              });

              break;

            case EVENTS.ORDER_CANCELLED:
              logger.info('🚫 Processing order.cancelled', {
                orderId: data.orderId,
              });

              break;

            case EVENTS.ORDER_COMPLETED:
              logger.info('🎉 Processing order.completed', {
                orderId: data.orderId,
              });

              break;

            default:
              logger.warn('⚠️ Unhandled Kafka event in order-service', {
                event: eventType,
              });
          }
        } catch (error: any) {
          logger.error('❌ Failed to process Kafka event', {
            error: error.message,
            stack: error.stack,
          });

          throw error;
        }
      }
    );

    logger.info('✅ Order Kafka Consumer started successfully', {
      groupId,
    });

  } catch (error: any) {
    logger.error('❌ Failed to start Order Kafka Consumer', {
      error: error.message,
      groupId,
    });

    throw error;
  }
};