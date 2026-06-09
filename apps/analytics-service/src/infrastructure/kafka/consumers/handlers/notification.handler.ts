// apps/analytics-service/src/infrastructure/kafka/handlers/notification.handler.ts

import logger from '@org/shared-logger';
import { EVENTS } from '@org/shared-kafka';

export class NotificationHandler {
  async handle(message: any) {
    try {
      const eventType =
        message.event ||
        message.type;

      const data =
        message.data ||
        message.payload ||
        {};

      switch (eventType) {

        case EVENTS.NOTIFICATION_SENT:

          logger.info('📧 Notification sent tracked', {
            notificationId: data.notificationId,
            userId: data.userId,
            channel: data.channel,
            type: data.type,
          });

          break;

        case EVENTS.NOTIFICATION_FAILED:

          logger.warn('📧 Notification failed tracked', {
            notificationId: data.notificationId,
            userId: data.userId,
            channel: data.channel,
            type: data.type,
            error: data.error,
          });

          break;

        default:

          logger.warn('⚠️ Unknown notification event received', {
            eventType,
            notificationId: data.notificationId,
          });
      }

    } catch (error: any) {

      logger.error('❌ Error in NotificationHandler', {
        eventType: message?.event,
        error: error.message,
      });
    }
  }
}