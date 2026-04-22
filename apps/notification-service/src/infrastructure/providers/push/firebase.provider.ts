import logger from '@org/shared-logger';
import { NotificationEntity } from '../../../domain/entities/notification.entity';
import { IPushProvider } from '../../interfaces/push.provider';

export class FirebaseProvider implements IPushProvider {
  async send(notification: NotificationEntity): Promise<void> {
    // TODO: Implement Firebase Cloud Messaging
    logger.info(`🔔 Push notification sent (placeholder) to user ${notification.userId}`);
  }
}