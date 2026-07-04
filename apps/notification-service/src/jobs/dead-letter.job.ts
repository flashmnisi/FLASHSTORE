import logger from '@org/shared-logger';
import { OutboxModel } from '../infrastructure/persistence/database/models/outbox.model';

export class DeadLetterJob {
  /**
   * Move permanently failed notifications to dead-letter after max retries
   * Run every 5 minutes
   */
  async processDeadLetters() {
    try {
      const maxRetries = 5;

      const result = await OutboxModel.updateMany(
        {
          status: 'failed',
          retryCount: { $gte: maxRetries },
        },
        {
          $set: {
            status: 'dead_letter',
            movedToDeadLetterAt: new Date(),
          },
        }
      );

      if (result.modifiedCount > 0) {
        logger.warn(
          `Moved ${result.modifiedCount} notifications to dead-letter queue`
        );
      }
    } catch (error: any) {
      logger.error('Dead letter job failed', { error: error.message });
    }
  }
}
