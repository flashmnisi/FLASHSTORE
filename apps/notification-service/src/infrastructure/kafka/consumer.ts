//apps/notification-servive/src/infrastructure/kafka/consumer.ts

import {
  subscribe,
  EVENTS,
  TOPICS,
} from '@org/shared-kafka';

import logger from '@org/shared-logger';
import { NotificationService } from '../../application/services/notification.service';

import { UserRegisteredHandler } from './handlers/handleUserRegistered';
import { OrderCreatedHandler } from './handlers/handleOrderCreated';
import { PaymentCompletedHandler } from './handlers/handlePaymentCompleted';
import { PaymentFailedHandler } from './handlers/handlePaymentFailed';

export const startNotificationConsumer = async (
  notificationService: NotificationService
) => {

  const userRegisteredHandler = new UserRegisteredHandler(notificationService);
  const orderCreatedHandler = new OrderCreatedHandler(notificationService);
  const paymentCompletedHandler = new PaymentCompletedHandler(notificationService);
  const paymentFailedHandler = new PaymentFailedHandler(notificationService);

  await subscribe(
    {
      topics: [
        TOPICS.USERS,
        TOPICS.ORDERS,
      ],
      groupId: 'notification-service',
      serviceName: 'notification-service',
    },
    async (message: any) => {
      try {

        // ✅ FIX: normalize Kafka envelope safely
        const eventType =
          message?.event ||
          message?.payload?.event?.event ||
          message?.data?.event;

        const payload =
          message?.payload?.event?.data?.data ||
          message?.payload?.event?.data ||
          message?.data?.data ||
          message?.data ||
          message;

        logger.info('📥 Notification event received', {
          eventType,
          topic: message?.topic,
        });

        switch (eventType) {

          case EVENTS.USER_REGISTERED:
            await userRegisteredHandler.handle(payload);
            break;

          case EVENTS.ORDER_CREATED:
            await orderCreatedHandler.handle(payload);
            break;

          case EVENTS.PAYMENT_COMPLETED:
            await paymentCompletedHandler.handle(payload);
            break;

          case EVENTS.PAYMENT_FAILED:
            await paymentFailedHandler.handle(payload);
            break;

          case EVENTS.NOTIFICATION_SENT:
          case EVENTS.NOTIFICATION_FAILED:
            logger.info('📬 Notification system event', payload);
            break;

          default:
            logger.warn('⚠️ Unhandled notification event', {
              eventType,
              payload,
            });
        }

      } catch (err: any) {
        logger.error('❌ Consumer processing failed', {
          error: err.message,
        });
      }
    }
  );

  logger.info('✅ Notification consumer started successfully');
};