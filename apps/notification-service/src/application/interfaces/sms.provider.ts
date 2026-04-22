import { NotificationEntity } from '../../domain/entities/notification.entity';

export interface ISmsProvider {
  /**
   * Send notification via SMS
   */
  send(notification: NotificationEntity): Promise<void>;
}