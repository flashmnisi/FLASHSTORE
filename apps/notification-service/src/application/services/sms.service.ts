import { NotificationEntity } from '../../domain/entities/notification.entity';
import { ISmsProvider } from '../interfaces/sms.provider';

export class SmsService {
  constructor(private readonly smsProvider: ISmsProvider) {}

  async send(notification: NotificationEntity): Promise<void> {
    await this.smsProvider.send(notification);
  }
}