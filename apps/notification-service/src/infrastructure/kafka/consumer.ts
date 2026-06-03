// apps/notification-service/src/infrastructure/kafka/consumer.ts

import {
  createConsumer,
  runConsumer,
  TOPICS,
  EVENTS,
} from '@org/shared-kafka';

import { NotificationService } from '../../application/services/notification.service';

import logger from '@org/shared-logger';

export const startNotificationConsumer = async (
  notificationService: NotificationService
) => {

  const groupId =
    'notification-service';

  try {

    const topics = [
      TOPICS.USERS,
      TOPICS.ORDERS,
      TOPICS.PAYMENTS,
    ];

    const consumer = createConsumer({
      groupId,
      topics,
      serviceName: groupId,
    });

    await runConsumer(
      consumer,
      {
        groupId,
        topics,
        serviceName: groupId,
      },

      async (event: any) => {

        try {

          const eventType =
            event?.event;

          const payload =
            event?.data || {};

          logger.info(
            '📥 Notification event received',
            {
              eventType,
              userId: payload.userId,
              orderId: payload.orderId,
            }
          );

          switch (eventType) {

            /**
             * ==================================
             * 👤 USER REGISTERED
             * ==================================
             */

            case EVENTS.USER_REGISTERED:

              await handleUserRegistered(
                notificationService,
                payload
              );

              break;

            /**
             * ==================================
             * 📦 ORDER CREATED
             * ==================================
             */

            case EVENTS.ORDER_CREATED:

              await handleOrderCreated(
                notificationService,
                payload
              );

              break;

            /**
             * ==================================
             * 💳 PAYMENT COMPLETED
             * ==================================
             */

            case EVENTS.PAYMENT_COMPLETED:

              await handlePaymentSuccess(
                notificationService,
                payload
              );

              break;

            /**
             * ==================================
             * ❌ PAYMENT FAILED
             * ==================================
             */

            case EVENTS.PAYMENT_FAILED:

              await handlePaymentFailed(
                notificationService,
                payload
              );

              break;

            default:

              logger.warn(
                '⚠️ Unknown notification event',
                {
                  eventType,
                }
              );
          }

        } catch (error: any) {

          logger.error(
            '❌ Failed to process notification event',
            {
              error: error.message,
              stack: error.stack,
            }
          );

          throw error;
        }
      }
    );

    logger.info(
      '✅ Notification consumer started successfully',
      {
        groupId,
        topics,
      }
    );

  } catch (error: any) {

    logger.error(
      '❌ Failed to start notification consumer',
      {
        error: error.message,
      }
    );

    throw error;
  }
};

/**
 * ============================================
 * 👤 USER REGISTERED
 * ============================================
 */

async function handleUserRegistered(
  service: NotificationService,
  payload: any
) {

  if (!payload.userId) {
    return;
  }

  await service.send({
    userId: payload.userId,

    type: EVENTS.USER_REGISTERED,

    templateName: 'welcome-email',

    templateData: payload,

    title: 'Welcome to FlashStore!',

    message:
      `Hello ${payload.name || 'there'}, welcome to FlashStore!`,

    channel: 'email',
  });
}

/**
 * ============================================
 * 📦 ORDER CREATED
 * ============================================
 */

async function handleOrderCreated(
  service: NotificationService,
  payload: any
) {

  if (!payload.userId) {

    logger.warn(
      '⚠️ order.created missing userId'
    );

    return;
  }

  const email =
    payload.email ||
    payload.userEmail;

  if (!email) {

    logger.warn(
      '⚠️ order.created missing email',
      {
        orderId: payload.orderId,
      }
    );

    return;
  }

  await service.send({
    userId: payload.userId,

    type: EVENTS.ORDER_CREATED,

    templateName: 'order-confirmation',

    templateData: {
      ...payload,
      email,
    },

    title: 'Order Confirmed',

    message:
      `Your order #${payload.orderId} has been created successfully.`,

    channel: 'email',
  });
}

/**
 * ============================================
 * 💳 PAYMENT SUCCESS
 * ============================================
 */

async function handlePaymentSuccess(
  service: NotificationService,
  payload: any
) {

  if (!payload.userId) {
    return;
  }

  await service.send({
    userId: payload.userId,

    type: EVENTS.PAYMENT_COMPLETED,

    templateName: 'payment-success',

    templateData: payload,

    title: 'Payment Successful',

    message:
      `Payment for order #${payload.orderId} was successful.`,

    channel: 'email',
  });
}

/**
 * ============================================
 * ❌ PAYMENT FAILED
 * ============================================
 */

async function handlePaymentFailed(
  service: NotificationService,
  payload: any
) {

  if (!payload.userId) {
    return;
  }

  await service.send({
    userId: payload.userId,

    type: EVENTS.PAYMENT_FAILED,

    templateName: 'payment-failed',

    templateData: payload,

    title: 'Payment Failed',

    message:
      `Payment for order #${payload.orderId} has failed.`,

    channel: 'email',
  });
}