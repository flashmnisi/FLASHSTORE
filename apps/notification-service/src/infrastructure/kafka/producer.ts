import { publish } from '@org/shared-kafka';
import { NOTIFICATION_EVENTS } from '../../domain/events/notification.events';
import logger from '@org/shared-logger';
import { NotificationEntity } from '../../domain/entities/notification.entity';

export class NotificationProducer {

  /**
   * ✅ Publish Notification Sent Event
   */
  async notificationSent(notification: NotificationEntity): Promise<void> {
    try {
      await publish({
        topic: 'flashstore.notifications',
        message: {
          event: NOTIFICATION_EVENTS.NOTIFICATION_SENT,
          data: {
            notificationId: notification.id,
            userId: notification.userId,
            type: notification.type,
            channel: notification.channel,
            title: notification.title,
            status: notification.status,
          },
          metadata: {
            source: 'notification-service',
            timestamp: new Date().toISOString(),
          },
        },
        key: notification.userId,   // Good for partitioning
      });

      logger.info('✅ notification.sent event published', {
        notificationId: notification.id,
        userId: notification.userId,
        type: notification.type,
        channel: notification.channel,
      });

    } catch (err: any) {
      logger.error('❌ Failed to publish notification.sent event', {
        notificationId: notification.id,
        userId: notification.userId,
        error: err.message,
      });
    }
  }

  /**
   * ❌ Publish Notification Failed Event
   */
  async notificationFailed(
    notification: NotificationEntity,
    errorMessage: string
  ): Promise<void> {
    try {
      await publish({
        topic: 'flashstore.notifications',
        message: {
          event: NOTIFICATION_EVENTS.NOTIFICATION_FAILED,
          data: {
            notificationId: notification.id,
            userId: notification.userId,
            type: notification.type,
            channel: notification.channel,
            error: errorMessage,
            title: notification.title,
          },
          metadata: {
            source: 'notification-service',
            timestamp: new Date().toISOString(),
          },
        },
        key: notification.userId,
      });

      logger.warn('⚠️ notification.failed event published', {
        notificationId: notification.id,
        userId: notification.userId,
        type: notification.type,
        error: errorMessage,
      });

    } catch (err: any) {
      logger.error('❌ Failed to publish notification.failed event', {
        notificationId: notification.id,
        userId: notification.userId,
        error: err.message,
      });
    }
  }
}