// apps/user-service/src/infrastructure/outbox/outbox.service.ts

import { IOutboxRepository } from '../../domain/repositories/outbox.repository';
import logger from '@org/shared-logger';

export class OutboxService {
  constructor(private readonly outboxRepository: IOutboxRepository) {}

  async write(event: {
    event: string;
    data: any;
    key?: string;
    topic?: string;
  }) {
    try {
      const outboxEntry = await this.outboxRepository.create({
        topic: event.topic || 'flashstore.users',
        event: event.event,
        payload: event.data,
        key: event.key,
        status: 'pending',
        retries: 0,
      });

      logger.info('Event written to Outbox', {
        event: event.event,
        outboxId: outboxEntry._id || outboxEntry.id,
      });

      return outboxEntry;
    } catch (error: any) {
      logger.error('Failed to write to Outbox', {
        event: event.event,
        error: error.message,
      });
      throw error;
    }
  }

  async getPendingEvents(limit = 50) {
    return this.outboxRepository.findPending(limit);
  }

  async markAsProcessed(id: string): Promise<void> {
    await this.outboxRepository.markAsProcessed(id);
  }

  async markAsFailed(id: string, errorMessage: string, retries: number): Promise<void> {
    await this.outboxRepository.markAsFailed(id, errorMessage, retries);
  }
}

// Do NOT instantiate here — we'll do it in main.ts with DI
// export const outboxService = new OutboxService(...);