// apps/notification-service/src/infrastructure/jobs/retry-job.ts

import logger from '@org/shared-logger';
import { OutboxModel } from '../infrastructure/persistence/database/models/outbox.model';
import { NotificationService } from '../application/services/notification.service';

export class RetryJob {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * Retry failed notifications from the outbox
   */
  async processFailedNotifications() {
    try {
      const failedNotifications = await OutboxModel.find({
        status: 'failed',
        retries: { $lt: 5 },        // ← Use 'retries' (correct field)
      }).limit(20);

      if (failedNotifications.length === 0) return;

      logger.info(`🔄 Retrying ${failedNotifications.length} failed notifications`);

      for (const outbox of failedNotifications) {
        try {
          const payload = outbox.payload;

          await this.notificationService.send({
            userId: payload.userId,
            type: payload.type,
            templateName: payload.templateName || 'default-notification',
            templateData: payload.data || payload.templateData || payload,
            title: payload.title,
            message: payload.message,
            channel: payload.channel || 'email',
          });

          // Mark as processed
          await OutboxModel.updateOne(
            { _id: outbox._id },
            {
              status: 'processed',
              retries: (outbox.retries || 0) + 1,
              processedAt: new Date(),
            }
          );

          logger.info('✅ Retry successful for notification', { 
            outboxId: outbox._id,
            notificationType: payload.type,
          });

        } catch (err: any) {
          // Increment retry count on failure
          await OutboxModel.updateOne(
            { _id: outbox._id },
            {
              retries: (outbox.retries || 0) + 1,
              errorMessage: err.message,
            }
          );

          logger.warn('⚠️ Retry failed for notification', {
            outboxId: outbox._id,
            retries: (outbox.retries || 0) + 1,
            error: err.message,
          });
        }
      }
    } catch (error: any) {
      logger.error('❌ Retry job failed', { error: error.message });
    }
  }
}