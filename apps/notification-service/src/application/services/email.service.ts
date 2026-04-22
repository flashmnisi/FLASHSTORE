import { NotificationEntity } from '../../domain/entities/notification.entity';

export interface IEmailProvider {
  send(notification: NotificationEntity): Promise<void>;
}