import { NotificationEntity } from '../../domain/entities/notification.entity';

export interface IPushProvider {
  /**
   * Send notification via Push (Firebase, OneSignal, etc.)
   */
  send(notification: NotificationEntity): Promise<void>;
}