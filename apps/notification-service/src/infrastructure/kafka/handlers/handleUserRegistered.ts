// apps/notification-service/src/infrastructure/kafka/handlers/handleUserRegistered.ts

import { NotificationService } from '../../../application/services/notification.service';
import logger from '@org/shared-logger';

export class UserRegisteredHandler {
  constructor(private readonly notificationService: NotificationService) {}

  async handle(rawMessage: any) {
    try {
      const message = rawMessage?.data?.data || rawMessage?.data || rawMessage;
      const user = message?.data || message;

      if (!user?.userId || !user?.email) {
        logger.warn('⚠️ user.registered missing required fields', { user });
        return;
      }

      await this.notificationService.send({
        userId: user.userId,
        type: 'user.registered',
        templateName: 'welcome-email',
        templateData: {
          name: user.name || 'Valued Customer',
          email: user.email,
        },
        title: 'Welcome to Flashstore!',
        message: `Hello ${user.name || 'there'}, thank you for joining us.`,
        channel: 'email',
      });

      logger.info('✅ Welcome notification sent', { userId: user.userId });
    } catch (error: any) {
      logger.error('❌ UserRegisteredHandler failed', { error: error.message });
    }
  }
}
