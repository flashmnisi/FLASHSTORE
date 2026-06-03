// apps/payment-service/src/infrastructure/outbox/outbox.service.ts

import { OutboxEntity } from '../../domain/entities/outbox.entity';
import logger from '@org/shared-logger';
import { IOutboxRepository } from '../persistence/repositories/outbox.repository.impl';

export class OutboxService {
  constructor(
    private readonly outboxRepository: IOutboxRepository
  ) {}

  /**
   * Write event to Outbox
   */
  async write(event: {
    topic: string;
    event: string;
    data: any;
    key?: string;
    correlationId?: string;
  }): Promise<OutboxEntity> {
    try {
      const outbox = new OutboxEntity({
        topic: event.topic,
        event: event.event,
        payload: event.data,
        key: event.key,
        correlationId: event.correlationId,
        status: 'pending',
        retries: 0,
        nextRetryAt: new Date(),
      });

      const saved = await this.outboxRepository.create(outbox);

      logger.info('📤 Event written to Outbox', {
        outboxId: saved.id,
        topic: saved.topic,
        event: saved.event,
      });

      return saved;
    } catch (error: any) {
      logger.error('❌ Failed to write to Outbox', {
        topic: event.topic,
        event: event.event,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Get pending events
   */
  async getPendingEvents(limit = 50): Promise<OutboxEntity[]> {
    return this.outboxRepository.findPending(limit);
  }

  /**
   * Lock event for processing
   */
  async lockForProcessing(id: string): Promise<OutboxEntity | null> {
    return this.outboxRepository.lockForProcessing(id);
  }

  /**
   * Mark success
   */
  async markAsProcessed(id: string): Promise<void> {
    await this.outboxRepository.markAsProcessed(id);

    logger.info('✅ Outbox processed', {
      outboxId: id,
    });
  }

  /**
   * Mark failure
   */
  async markAsFailed(
    id: string,
    errorMessage: string,
    retries: number
  ): Promise<void> {
    await this.outboxRepository.markAsFailed(
      id,
      errorMessage,
      retries
    );

    logger.warn('⚠️ Outbox failed', {
      outboxId: id,
      retries,
    });
  }
}