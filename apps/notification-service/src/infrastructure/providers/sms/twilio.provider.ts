import logger from '@org/shared-logger';
import { NotificationEntity } from '../../../domain/entities/notification.entity';
import { ISmsProvider } from '../../../application/interfaces/sms.provider';
//import { ISmsProvider } from '../../interfaces/sms.provider';

export class TwilioProvider implements ISmsProvider {
  async send(notification: NotificationEntity): Promise<void> {
    // TODO: Implement real Twilio integration
    logger.info(`📱 SMS sent (placeholder) to user ${notification.userId}: ${notification.message}`);
    // In real implementation:
    // const twilio = require('twilio')(accountSid, authToken);
    // await twilio.messages.create({ ... });
  }
}