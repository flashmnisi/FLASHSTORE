import logger from '@org/shared-logger';
import { OutboxModel } from '../infrastructure/persistence/database/models/outbox.model';
import { NotificationService } from '../application/services/notification.service';

export class OutboxWorker {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * Process pending events from the Outbox table
   */
  async processOutbox() {
    try {
      const pendingEvents = await OutboxModel.find({
        status: 'pending',
      }).limit(50);

      if (pendingEvents.length === 0) return;

      logger.info(`Processing ${pendingEvents.length} pending outbox events`);

      for (const outbox of pendingEvents) {
        try {
          const payload = outbox.payload;

          await this.notificationService.send({
            userId: payload.userId,
            type: payload.type,
            templateName: payload.templateName || 'default',
            templateData: payload.data || payload,
            title: payload.title,
            message: payload.message,
            channel: payload.channel,
          });

          outbox.status = 'processed';
          await outbox.save();

          logger.info('Outbox event processed successfully', { outboxId: outbox._id });
        } catch (err: any) {
          outbox.status = 'failed';
          outbox.retries = (outbox.retries || 0) + 1;
          await outbox.save();

          logger.warn('Outbox event failed', {
            outboxId: outbox._id,
            retryCount: outbox.retries,
            error: err.message,
          });
        }
      }
    } catch (error: any) {
      logger.error('Outbox worker failed', { error: error.message });
    }
  }
}