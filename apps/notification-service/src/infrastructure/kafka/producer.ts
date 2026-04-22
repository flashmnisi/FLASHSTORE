import { publish } from '@org/shared-kafka';
import { NOTIFICATION_EVENTS } from '../../domain/events/notification.events';
import logger from '@org/shared-logger';
import { NotificationEntity } from '../../domain/entities/notification.entity';

export class NotificationProducer {
  /**
   * Publish event when a notification is successfully sent
   */
  async notificationSent(notification: NotificationEntity) {
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
          },
          source: 'notification-service',
          timestamp: new Date().toISOString(),
        },
        key: notification.userId,
      });

      logger.info(`✅ Published notification.sent event`, { 
        notificationId: notification.id, 
        userId: notification.userId 
      });
    } catch (error: any) {
      logger.error(`❌ Failed to publish notification.sent event`, { 
        error: error.message, 
        notificationId: notification.id 
      });
    }
  }

  /**
   * Publish event when notification sending fails
   */
  async notificationFailed(notification: NotificationEntity, errorMessage: string) {
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
          },
          source: 'notification-service',
          timestamp: new Date().toISOString(),
        },
        key: notification.userId,
      });

      logger.warn(`⚠️ Published notification.failed event`, { 
        notificationId: notification.id, 
        userId: notification.userId 
      });
    } catch (error: any) {
      logger.error(`Failed to publish notification.failed event`, { error: error.message });
    }
  }
}