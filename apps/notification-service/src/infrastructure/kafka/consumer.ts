import { createConsumer, runConsumer } from '@org/shared-kafka';
import logger from '@org/shared-logger';
import { NotificationService } from '../../application/services/notification.service';
import { NotificationType } from '../../domain/entities/notification.entity';

export const startNotificationConsumer = async (notificationService: NotificationService) => {
  try {
    const consumer = createConsumer({
      groupId: 'notification-service-group',
      topics: [
        'flashstore.users',     
        'flashstore.orders',     
        'flashstore.payments',   
      ],
    });

    await runConsumer(
      consumer,
      {
        groupId: 'notification-service-group',
        topics: ['flashstore.users', 'flashstore.orders', 'flashstore.payments'],
      },
      async (message: any) => {
        logger.info(`📥 Notification Consumer received event: ${message.event}`);

        try {
          switch (message.event) {
            case 'user.registered':
              await notificationService.send({
                userId: message.data.userId,
                type: 'user.registered',
                title: 'Welcome to Flashstore!',
                message: `Hello ${message.data.name || 'there'}, thank you for joining us!`,
                data: message.data,
                channel: 'email',
              });
              break;

            case 'order.created':
              await notificationService.send({
                userId: message.data.userId,
                type: 'order.created',
                title: 'Order Confirmed',
                message: `Your order #${message.data.orderId} has been placed successfully.`,
                data: message.data,
                channel: 'email',
              });
              break;

            case 'payment.success':
              await notificationService.send({
                userId: message.data.userId,
                type: 'payment.success',
                title: 'Payment Successful',
                message: `Payment for order #${message.data.orderId} was successful.`,
                data: message.data,
                channel: 'email',
              });
              break;

            case 'payment.failed':
              await notificationService.send({
                userId: message.data.userId,
                type: 'payment.failed',
                title: 'Payment Failed',
                message: `Payment for order #${message.data.orderId} failed. Please try again.`,
                data: message.data,
                channel: 'email',
              });
              break;

            default:
              logger.info(`Unknown event received: ${message.event}`);
          }
        } catch (err: any) {
          logger.error(`Failed to process event ${message.event}`, { error: err.message });
        }
      }
    );

    logger.info('👥 Notification Kafka consumer started successfully');
  } catch (error: any) {
    logger.error('Failed to start notification consumer', { error: error.message });
  }
};