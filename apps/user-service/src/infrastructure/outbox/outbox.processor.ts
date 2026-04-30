// apps/user-service/src/infrastructure/outbox/outbox.processor.ts

import { OutboxService } from './outbox.service';
import { outboxService } from '../../container';
import { publish } from '@org/shared-kafka';
import logger from '@org/shared-logger';

const BATCH_SIZE = 30;
const MAX_RETRIES = 5;     // ← Now properly used

export class OutboxProcessor {
  constructor(private readonly outboxService: OutboxService) {}

  start(): void {
    setInterval(() => {
      this.processPendingEvents().catch((err) => {
        logger.error('Outbox processor interval error', { error: err.message });
      });
    }, 5000);

    logger.info('🚀 Outbox Processor started (every 5s)');
  }

  private async processPendingEvents() {
    try {
      const events = await this.outboxService.getPendingEvents(BATCH_SIZE);

      for (const event of events) {
        try {
          await publish({
            topic: event.topic,
            key: event.key,
            message: {
              event: event.event,
              data: event.payload,
              timestamp: new Date().toISOString(),
            },
          });

          await this.outboxService.markAsProcessed(event._id);

          logger.info('✅ Outbox event processed', {
            event: event.event,
            outboxId: event._id,
          });

        } catch (error: any) {
          const retries = (event.retries || 0) + 1;

          // Use MAX_RETRIES constant here
          if (retries >= MAX_RETRIES) {
            logger.error('❌ Outbox event reached maximum retries', {
              event: event.event,
              outboxId: event._id,
              retries,
            });
            // Optionally move to Dead Letter Queue here later
          } else {
            logger.warn('⚠️ Outbox event failed, will retry', {
              event: event.event,
              outboxId: event._id,
              retries,
              nextRetry: retries + 1,
            });
          }

          await this.outboxService.markAsFailed(event._id, error.message, retries);
        }
      }
    } catch (error: any) {
      logger.error('❌ Outbox processor failed', { error: error.message });
    }
  }
}

// Singleton instance
export const outboxProcessor = new OutboxProcessor(outboxService);