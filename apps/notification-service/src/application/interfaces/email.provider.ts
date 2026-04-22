import { NotificationEntity } from '../../domain/entities/notification.entity';

export interface IEmailProvider {
  /**
   * Send notification via Email
   */
  send(notification: NotificationEntity): Promise<void>;
}