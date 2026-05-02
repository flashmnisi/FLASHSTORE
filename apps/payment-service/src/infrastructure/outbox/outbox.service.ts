// apps/payment-service/src/infrastructure/outbox/outbox.service.ts

import { IOutboxRepository } from '../../domain/repositories/outbox.repository';
import logger from '@org/shared-logger';

export class OutboxService {
  constructor(private readonly outboxRepository: IOutboxRepository) {}

  /**
   * Write a new event to the Outbox (reliable delivery)
   */
  async write(event: {
    topic: string;
    event: string;
    payload: any;
    key?: string;
  }) {
    try {
      const outboxEntry = await this.outboxRepository.create({
        topic: event.topic,
        event: event.event,
        payload: event.payload,
        key: event.key,
        status: 'pending',
        retries: 0,
      });

      logger.info('Event written to Outbox', {
        event: event.event,
        outboxId: outboxEntry._id || outboxEntry.id,
        topic: event.topic,
      });

      return outboxEntry;
    } catch (error: any) {
      logger.error('Failed to write event to Outbox', {
        event: event.event,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Get pending events for processing
   */
  async getPendingEvents(limit = 50) {
    try {
      return await this.outboxRepository.findPending(limit);
    } catch (error: any) {
      logger.error('Failed to fetch pending outbox events', { error: error.message });
      throw error;
    }
  }

  /**
   * Mark event as successfully processed
   */
  async markAsProcessed(id: string): Promise<void> {
    try {
      await this.outboxRepository.markAsProcessed(id);
    } catch (error: any) {
      logger.error('Failed to mark outbox event as processed', { id, error: error.message });
    }
  }

  /**
   * Mark event as failed with retry count
   */
  async markAsFailed(id: string, errorMessage: string, retries: number): Promise<void> {
    try {
      await this.outboxRepository.markAsFailed(id, errorMessage, retries);
    } catch (error: any) {
      logger.error('Failed to mark outbox event as failed', { 
        id, 
        retries, 
        error: errorMessage 
      });
    }
  }
}