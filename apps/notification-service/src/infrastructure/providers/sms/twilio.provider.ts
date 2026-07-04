import logger from '@org/shared-logger';
import { NotificationEntity } from '../../../domain/entities/notification.entity';
import { ISmsProvider } from '../../../application/interfaces/sms.provider';

export class TwilioProvider implements ISmsProvider {
  async send(notification: NotificationEntity): Promise<void> {
    logger.info(`📱 SMS sent (placeholder) to user ${notification.userId}: ${notification.message}`);
  }
}