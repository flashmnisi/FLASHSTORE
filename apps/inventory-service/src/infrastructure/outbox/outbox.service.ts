// apps/inventory-service/src/infrastructure/outbox/outbox.service.ts

import { OutboxEntity } from './outbox.entity';
import { IOutboxRepository } from '../../application/interfaces/outbox.repository';
import logger from '@org/shared-logger';

export class OutboxService {
  constructor(
    private readonly repository: IOutboxRepository
  ) {}

  async write(event: {
    topic: string;
    event: string;
    data: any;
    key?: string;
    correlationId?: string;
  }): Promise<OutboxEntity> {
    try {
      const outboxEntity = new OutboxEntity({
        topic: event.topic,
        event: event.event,
        payload: event.data,
        key: event.key,
        correlationId: event.correlationId,
        status: 'pending',
      });

      const saved = await this.repository.create(outboxEntity);

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

  async getPendingEvents(limit = 50): Promise<OutboxEntity[]> {
    return this.repository.findPending(limit);
  }

  async lockForProcessing(id: string): Promise<OutboxEntity | null> {
    return this.repository.lockForProcessing(id);
  }

  async markAsProcessed(id: string): Promise<void> {
    try {
      await this.repository.markAsProcessed(id);
    } catch (error: any) {
      logger.error('Failed to mark as processed', { outboxId: id, error: error.message });
      throw error;
    }
  }

  async markAsFailed(
    id: string,
    errorMessage: string,
    retries: number
  ): Promise<void> {
    try {
      await this.repository.markAsFailed(id, errorMessage, retries);
    } catch (error: any) {
      logger.error('Failed to mark as failed', { outboxId: id, error: error.message });
      throw error;
    }
  }
}