import logger from '@org/shared-logger';
import { OutboxModel } from '../infrastructure/persistence/models/outbox.model';
import { NotificationService } from '../application/services/notification.service';

export class OutboxWorker {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * Process pending events from the Outbox table
   * This ensures reliable event delivery even if Kafka is temporarily down
   */
  async processOutbox() {
    try {
      const pendingEvents = await OutboxModel.find({
        status: 'pending'
      }).limit(50); // Process max 50 at a time

      if (pendingEvents.length === 0) return;

      logger.info(`📦 Processing ${pendingEvents.length} pending outbox events`);

      for (const outbox of pendingEvents) {
        try {
          const payload = outbox.payload;

          // Re-send the notification using the service
          await this.notificationService.send({
            userId: payload.userId,
            type: payload.type,
            title: payload.title,
            message: payload.message,
            data: payload.data,
            channel: payload.channel,
          });

          // Mark as processed
          outbox.status = 'processed';
          await outbox.save();

          logger.info(`✅ Outbox event processed successfully`, { outboxId: outbox._id });
        } catch (err: any) {
          outbox.status = 'failed';
          outbox.retryCount = (outbox.retryCount || 0) + 1;
          await outbox.save();

          logger.warn(`⚠️ Outbox event failed`, {
            outboxId: outbox._id,
            retryCount: outbox.retryCount,
            error: err.message
          });
        }
      }
    } catch (error: any) {
      logger.error('Outbox worker failed', { error: error.message });
    }
  }
}