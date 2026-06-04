// apps/inventory-service/src/infrastructure/outbox/outbox.processor.ts

import { OutboxService } from './outbox.service';
import { publish, sendToDLQ } from '@org/shared-kafka';
import logger from '@org/shared-logger';
import { OutboxEntity } from './outbox.entity';

const BATCH_SIZE = 50;
const MAX_RETRIES = 5;
const INTERVAL_MS = 3000; // 3 seconds

export class OutboxProcessor {
  private isProcessing = false;

  constructor(private readonly outboxService: OutboxService) {}

  start(): void {
    setInterval(async () => {
      if (this.isProcessing) return;

      this.isProcessing = true;

      try {
        await this.processPendingEvents();
      } catch (error: any) {
        logger.error('❌ Outbox processor error', { error: error.message });
      } finally {
        this.isProcessing = false;
      }
    }, INTERVAL_MS);

    logger.info('🚀 Inventory Outbox Processor started (every 3s)');
  }

  private async processPendingEvents() {
    try {
      const events = await this.outboxService.getPendingEvents(BATCH_SIZE);

      if (events.length === 0) return;

      logger.info(`📦 Processing ${events.length} outbox events`);

      for (const event of events) {
        try {
          // Lock before processing
          const locked = await this.outboxService.lockForProcessing(event.id!);

          if (!locked) {
            logger.warn('Event already being processed', { outboxId: event.id });
            continue;
          }

          await this.publishEvent(locked);
        } catch (error: any) {
          logger.error('Failed to process outbox event', {
            outboxId: event.id,
            error: error.message,
          });
        }
      }
    } catch (error: any) {
      logger.error('❌ Outbox processor failed', { error: error.message });
    }
  }

  private async publishEvent(event: OutboxEntity) {
    try {
      await publish({
        topic: event.topic,
        key: event.key,
        message: {
          event: event.event,
          data: event.payload,
          correlationId: event.correlationId,
          timestamp: new Date().toISOString(),
        },
      });

      await this.outboxService.markAsProcessed(event.id!);

      logger.info('✅ Outbox event published successfully', {
        outboxId: event.id,
        event: event.event,
        topic: event.topic,
      });
    } catch (error: any) {
      await this.handleFailure(event, error);
    }
  }

  private async handleFailure(event: OutboxEntity, error: any) {
    const retries = (event.retries || 0) + 1;

    if (retries >= MAX_RETRIES) {
      logger.error('💀 Outbox event moved to DLQ after max retries', {
        outboxId: event.id,
        event: event.event,
        retries,
      });
        await sendToDLQ({
          topic: event.topic,
          event: event.event,
          payload: event.payload,
          error: error.message,
          retryCount: retries,
        });
      }

    await this.outboxService.markAsFailed(
      event.id!,
      error.message,
      retries
    );

    logger.warn('⚠️ Outbox event failed, retry scheduled', {
      outboxId: event.id,
      event: event.event,
      retries,
    });
  }
}