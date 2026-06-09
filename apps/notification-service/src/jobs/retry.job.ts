// apps/notification-service/src/infrastructure/jobs/retry-job.ts

import logger from '@org/shared-logger';
import { OutboxModel } from '../infrastructure/persistence/database/models/outbox.model';
import { NotificationService } from '../application/services/notification.service';

export class RetryJob {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * Retry failed notifications from the outbox (Improved)
   */
  async processFailedNotifications() {
    try {
      const failedNotifications = await OutboxModel.find({
        status: 'failed',
        retries: { $lt: 3 },           // Reduced max retries
      })
        .sort({ createdAt: 1 })
        .limit(15);

      if (failedNotifications.length === 0) return;

      logger.info(`🔄 Retrying ${failedNotifications.length} failed notifications`);

      for (const outbox of failedNotifications) {
        try {
          const payload = outbox.payload || {};

          // ====================== SKIP PERMANENT FAILURES ======================
          const templateData = payload.templateData || payload.data || payload;
          
          if (payload.channel === 'email' && !templateData?.email) {
            logger.warn('⛔ Skipping permanent failure (missing email)', {
              outboxId: outbox._id,
              notificationId: payload.notificationId,
              userId: payload.userId,
            });

            await this.markAsPermanentlyFailed(outbox._id, 'Missing recipient email');
            continue;
          }

          // ====================== RETRY ======================
          await this.notificationService.send({
            userId: payload.userId,
            type: payload.type,
            templateName: payload.templateName || 'default-notification',
            templateData: templateData,
            title: payload.title,
            message: payload.message,
            channel: payload.channel || 'email',
            data: payload.data,
          });

          // Mark as successfully processed
          await OutboxModel.updateOne(
            { _id: outbox._id },
            {
              status: 'processed',
              retries: (outbox.retries || 0) + 1,
              processedAt: new Date(),
              errorMessage: null,
            }
          );

          logger.info('✅ Retry successful', { 
            outboxId: outbox._id,
            type: payload.type,
          });

        } catch (err: any) {
          const newRetryCount = (outbox.retries || 0) + 1;

          await OutboxModel.updateOne(
            { _id: outbox._id },
            {
              retries: newRetryCount,
              errorMessage: err.message,
              lastAttemptAt: new Date(),
            }
          );

          logger.warn('⚠️ Retry attempt failed', {
            outboxId: outbox._id,
            retries: newRetryCount,
            error: err.message,
          });
        }
      }
    } catch (error: any) {
      logger.error('❌ Retry job failed', { error: error.message });
    }
  }

  /**
   * Mark hopeless notifications as permanently failed
   */
  private async markAsPermanentlyFailed(outboxId: any, reason: string) {
    await OutboxModel.updateOne(
      { _id: outboxId },
      {
        status: 'permanently_failed',
        errorMessage: reason,
        processedAt: new Date(),
      }
    );
  }
}