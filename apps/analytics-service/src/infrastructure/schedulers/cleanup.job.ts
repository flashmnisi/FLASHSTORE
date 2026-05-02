// apps/analytics-service/src/infrastructure/schedulers/cleanup.job.ts

import cron from 'node-cron';
import logger from '@org/shared-logger';
import { IEventLogRepository } from '../../domain/repositories/event-log.repository';

export class CleanupJob {
  constructor(private readonly eventLogRepository: IEventLogRepository) {}

  /**
   * Start cleanup job
   */
  start() {
    // Run every day at 01:00 AM
    cron.schedule('0 1 * * *', async () => {
      await this.cleanupOldEvents();
    });

    logger.info('✅ Cleanup Job scheduled (daily at 01:00)');
  }

  private async cleanupOldEvents() {
    try {
      const daysToKeep = 90; // Keep last 90 days of processed events
      const deletedCount = await this.eventLogRepository.cleanupOldEvents(daysToKeep);

      if (deletedCount > 0) {
        logger.info(`🧹 Cleaned up ${deletedCount} old processed events`);
      } else {
        logger.debug('No old events to clean up');
      }
    } catch (error: any) {
      logger.error('Cleanup job failed', {
        error: error.message,
      });
    }
  }
}
