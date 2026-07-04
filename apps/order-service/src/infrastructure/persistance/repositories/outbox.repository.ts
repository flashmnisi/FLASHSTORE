// apps/order-service/src/infrastructure/persistance/repositories/outbox.repository.ts

import { OutboxEntity } from '../../../domain/entities/outbox.entity';

export interface IOutboxRepository {
  create(outbox: OutboxEntity): Promise<OutboxEntity>;

  findPending(limit?: number): Promise<OutboxEntity[]>;

  lockForProcessing(id: string): Promise<OutboxEntity | null>;

  markAsProcessed(id: string): Promise<void>;

  markAsFailed(
    id: string,
    errorMessage: string,
    retries: number
  ): Promise<void>;
}
