import logger from '@org/shared-logger';
import { OutboxModel } from '../infrastructure/persistence/models/outbox.model';
import { NotificationService } from '../application/services/notification.service';

export class RetryJob {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * Retry failed notifications from the outbox
   * Run every 30 seconds or via cron
   */
  async processFailedNotifications() {
    try {
      const failedNotifications = await OutboxModel.find({
        status: 'failed',
        retryCount: { $lt: 5 },   // max 5 retries
      }).limit(20);

      if (failedNotifications.length === 0) return;

      logger.info(`🔄 Retrying ${failedNotifications.length} failed notifications`);

      for (const outbox of failedNotifications) {
        try {
          const payload = outbox.payload;

          // Call notificationService with correct shape (templateName + templateData)
          await this.notificationService.send({
            userId: payload.userId,
            type: payload.type,
            templateName: payload.templateName || 'default-notification',
            templateData: payload.data || payload,
            title: payload.title,
            message: payload.message,
            channel: payload.channel,
          });

          // Mark as processed
          outbox.status = 'processed';
          outbox.retryCount = (outbox.retryCount || 0) + 1;
          await outbox.save();

          logger.info('✅ Retry successful for notification', { 
            outboxId: outbox._id 
          });

        } catch (err: any) {
          outbox.retryCount = (outbox.retryCount || 0) + 1;
          await outbox.save();

          logger.warn('⚠️ Retry failed for notification', {
            outboxId: outbox._id,
            retryCount: outbox.retryCount,
            error: err.message,
          });
        }
      }
    } catch (error: any) {
      logger.error('Retry job failed', { error: error.message });
    }
  }
}