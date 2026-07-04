import { NotificationEntity } from '../../domain/entities/notification.entity';

export interface IPushProvider {
  /**
   * Send notification via Push (Firebase, OneSignal, )
   */
  send(notification: NotificationEntity): Promise<void>;
}