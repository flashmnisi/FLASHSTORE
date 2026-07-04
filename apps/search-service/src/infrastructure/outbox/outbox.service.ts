// apps/search-service/src/infrastructure/outbox/outbox.service.ts

import logger from '@org/shared-logger';
import { IOutboxRepository } from '../persistence/repositories/outbox.repository.impl';
import { OutboxEntity } from '../../domain/entities/outbox.entity';

export class OutboxService {
  constructor(private readonly outboxRepository: IOutboxRepository) {}

  /**
   * Write new event to Outbox
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
      });

      const saved = await this.outboxRepository.create(outbox);

      logger.info('📤 Event written to Outbox', {
        outboxId: saved.id,
        topic: event.topic,
        event: event.event,
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
   * Get pending events for processing
   */
  async getPendingEvents(limit = 50): Promise<OutboxEntity[]> {
    try {
      return this.outboxRepository.findPending(limit);
    } catch (error: any) {
      logger.error('Failed to fetch pending outbox events', {
        error: error.message,
      });
      throw error;
    }
  }

  async lockForProcessing(id: string) {
    return this.outboxRepository.lockForProcessing(id);
  }

  /**
   * Mark as successfully processed
   */
  async markAsProcessed(id: string): Promise<void> {
    try {
      await this.outboxRepository.markAsProcessed(id);
      logger.info('✅ Outbox event marked as processed', { outboxId: id });
    } catch (error: any) {
      logger.error('Failed to mark as processed', {
        outboxId: id,
        error: error.message,
      });
    }
  }

  /**
   * Mark as failed
   */
  async markAsFailed(
    id: string,
    errorMessage: string,
    retries: number
  ): Promise<void> {
    try {
      await this.outboxRepository.markAsFailed(id, errorMessage, retries);
      logger.warn('⚠️ Outbox event marked as failed', {
        outboxId: id,
        retries,
      });
    } catch (error: any) {
      logger.error('Failed to mark as failed', {
        outboxId: id,
        error: error.message,
      });
    }
  }
}
