// apps/inventory-service/src/infrastructure/outbox/outbox.repository.impl.ts

import { OutboxEntity } from '../../outbox/outbox.entity';
import { OutboxModel } from '../../outbox/outbox.model';
import { IOutboxRepository } from '../../../application/interfaces/outbox.repository';

export class OutboxRepositoryImpl implements IOutboxRepository {
  private toEntity(doc: any): OutboxEntity {
    return new OutboxEntity({
      id: doc._id?.toString(),
      topic: doc.topic,
      event: doc.event,
      payload: doc.payload,
      key: doc.key,
      correlationId: doc.correlationId,
      status: doc.status,
      retries: doc.retries || 0,
      errorMessage: doc.errorMessage,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      nextRetryAt: doc.nextRetryAt,
      processedAt: doc.processedAt,
      failedAt: doc.failedAt,
      lockedAt: doc.lockedAt,
    });
  }

  async create(outbox: OutboxEntity): Promise<OutboxEntity> {
    const doc = await OutboxModel.create({
      topic: outbox.topic,
      event: outbox.event,
      payload: outbox.payload,
      key: outbox.key,
      correlationId: outbox.correlationId,
      status: outbox.status,
      retries: outbox.retries,
      nextRetryAt: outbox.nextRetryAt || new Date(),
    });

    return this.toEntity(doc);
  }

  async findPending(limit = 50): Promise<OutboxEntity[]> {
    const docs = await OutboxModel.find({
      status: 'pending',
      nextRetryAt: { $lte: new Date() },
    })
      .sort({ createdAt: 1 })
      .limit(limit)
      .lean();

    return docs.map((doc) => this.toEntity(doc));
  }

  async lockForProcessing(id: string): Promise<OutboxEntity | null> {
    const doc = await OutboxModel.findOneAndUpdate(
      { _id: id, status: 'pending' },
      { status: 'processing', lockedAt: new Date() },
      { new: true }
    );

    return doc ? this.toEntity(doc) : null;
  }

  async markAsProcessed(id: string): Promise<void> {
    await OutboxModel.findByIdAndUpdate(id, {
      status: 'processed',
      processedAt: new Date(),
      lockedAt: null,
    });
  }

  async markAsFailed(
    id: string,
    errorMessage: string,
    retries: number
  ): Promise<void> {
    await OutboxModel.findByIdAndUpdate(id, {
      status: 'failed',
      errorMessage,
      retries,
      failedAt: new Date(),
      lockedAt: null,
    });
  }
}
