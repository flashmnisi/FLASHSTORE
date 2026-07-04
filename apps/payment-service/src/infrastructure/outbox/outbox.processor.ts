// apps/payment-service/src/infrastructure/outbox/outbox.processor.ts

import { publish, sendToDLQ } from '@org/shared-kafka';

import logger from '@org/shared-logger';

import { OutboxService } from './outbox.service';

const BATCH_SIZE = 50;
const MAX_RETRIES = 5;
const INTERVAL_MS = 2000;

export class OutboxProcessor {
  private isProcessing = false;

  constructor(private readonly outboxService: OutboxService) {}

  start() {
    setInterval(async () => {
      if (this.isProcessing) {
        return;
      }

      this.isProcessing = true;

      try {
        await this.processPendingEvents();
      } catch (error: any) {
        logger.error('❌ Outbox processor failed', {
          error: error.message,
        });
      } finally {
        this.isProcessing = false;
      }
    }, INTERVAL_MS);

    logger.info('🚀 Order Outbox Processor started');
  }

  private async processPendingEvents() {
    const events = await this.outboxService.getPendingEvents(BATCH_SIZE);

    if (!events.length) {
      return;
    }

    logger.info('📦 Processing outbox events', {
      count: events.length,
    });

    for (const event of events) {
      try {
        const locked = await this.outboxService.lockForProcessing(
          event.id!.toString()
        );

        if (!locked) {
          continue;
        }

        await this.publishEvent(locked);
      } catch (error: any) {
        logger.error('Failed processing outbox event', {
          outboxId: event.id,
          error: error.message,
        });
      }
    }
  }

  private async publishEvent(event: any) {
    try {
      await publish({
        topic: event.topic,
        key: event.key,
        message: {
          event: event.event,
          data: event.payload,
          correlationId: event.correlationId,
        },
      });

      await this.outboxService.markAsProcessed(event._id.toString());

      logger.info('✅ Outbox event published', {
        outboxId: event._id,
        event: event.event,
      });
    } catch (error: any) {
      await this.handleFailure(event, error);
    }
  }

  private async handleFailure(event: any, error: any) {
    const retries = (event.retries || 0) + 1;

    if (retries >= MAX_RETRIES) {
      await sendToDLQ({
        topic: event.topic,
        event: event.event,
        payload: event.payload,
        error: error.message,
        retryCount: retries,
        correlationId: event.correlationId,
      });

      await this.outboxService.markAsFailed(
        event._id.toString(),
        error.message,
        retries
      );

      logger.error('💀 Event moved to DLQ', {
        outboxId: event._id,
        event: event.event,
      });

      return;
    }

    await this.outboxService.markAsFailed(
      event._id.toString(),
      error.message,
      retries
    );

    logger.warn('⚠️ Outbox event failed. Will retry.', {
      outboxId: event._id,
      retries,
      event: event.event,
    });
  }
}
