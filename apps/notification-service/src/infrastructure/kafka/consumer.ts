import { createConsumer, runConsumer } from '@org/shared-kafka';
import { NotificationService } from '../../application/services/notification.service';
import logger from '@org/shared-logger';

export const startNotificationConsumer = async (
  notificationService: NotificationService
) => {
  const groupId = 'notification-service';

  try {
    const consumer = createConsumer({
      groupId,
      topics: ['flashstore.users', 'flashstore.orders', 'flashstore.payments'],
      serviceName: groupId,
    });

    await runConsumer(
      consumer,
      {
        groupId,
        topics: ['flashstore.users', 'flashstore.orders', 'flashstore.payments'],
        serviceName: groupId,
      },
      async (message: any) => {
        logger.info('📥 Notification event received', { 
          event: message.event 
        });

        try {
          switch (message.event) {
            case 'user.registered':
              await notificationService.send({
                userId: message.data.userId,
                type: 'user.registered',
                templateName: 'welcome-email',           // ← Required
                templateData: message.data,              // ← Required
                title: 'Welcome to Flashstore!',
                message: `Hello ${message.data.name || 'there'}, welcome to Flashstore!`,
                channel: 'email',
              });
              break;

            case 'order.created':
              await notificationService.send({
                userId: message.data.userId,
                type: 'order.created',
                templateName: 'order-confirmation',      // ← Required
                templateData: message.data,
                title: 'Order Confirmed',
                message: `Your order #${message.data.orderId} has been created successfully.`,
                channel: 'email',
              });
              break;

            case 'payment.success':
              await notificationService.send({
                userId: message.data.userId,
                type: 'payment.success',
                templateName: 'payment-success',
                templateData: message.data,
                title: 'Payment Successful',
                message: `Payment for order #${message.data.orderId} was successful.`,
                channel: 'email',
              });
              break;

            case 'payment.failed':
              await notificationService.send({
                userId: message.data.userId,
                type: 'payment.failed',
                templateName: 'payment-failed',
                templateData: message.data,
                title: 'Payment Failed',
                message: `Payment for order #${message.data.orderId} has failed. Please try again.`,
                channel: 'email',
              });
              break;

            default:
              logger.warn('Unknown event received', { 
                event: message.event 
              });
          }
        } catch (err: any) {
          logger.error('Failed to process notification event', {
            event: message.event,
            error: err.message,
            userId: message.data?.userId,
          });
        }
      }
    );

    logger.info('👥 Notification consumer started successfully', { groupId });

  } catch (err: any) {
    logger.error('Failed to start notification consumer', {
      error: err.message,
      groupId,
    });
  }
};