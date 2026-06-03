// apps/order-service/src/infrastructure/outbox/outbox.repository.ts

import { OutboxEntity } from '../../domain/entities/outbox.entity';
import { IOutboxRepository } from '../persistence/repositories/outbox.repository.impl';
import { OutboxModel } from './outbox.model';

export class OutboxRepository implements IOutboxRepository {

  /**
   * ==========================
   * Mapper
   * ==========================
   */
  private toEntity(doc: any): OutboxEntity {
    return new OutboxEntity({
      id: doc._id?.toString(),

      topic: doc.topic,
      event: doc.event,
      payload: doc.payload,

      key: doc.key,
      correlationId: doc.correlationId,

      status: doc.status,
      retries: doc.retries,

      errorMessage: doc.errorMessage,

      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
 
      nextRetryAt: doc.nextRetryAt,
      processedAt: doc.processedAt,
      failedAt: doc.failedAt,
      lockedAt: doc.lockedAt,
    });
  }

  /**
   * ==========================
   * Create
   * ==========================
   */
  async create(
    outbox: OutboxEntity
  ): Promise<OutboxEntity> {

    const doc = await OutboxModel.create({
      topic: outbox.topic,
      event: outbox.event,
      payload: outbox.payload,
      key: outbox.key,
      correlationId: outbox.correlationId,
      status: outbox.status,
      retries: outbox.retries,
      errorMessage: outbox.errorMessage,
      nextRetryAt: outbox.nextRetryAt,
      processedAt: outbox.processedAt,
      failedAt: outbox.failedAt,
      lockedAt: outbox.lockedAt,
    });

    return this.toEntity(doc);
  }

  /**
   * ==========================
   * Find Pending
   * ==========================
   */
  async findPending(
    limit = 50
  ): Promise<OutboxEntity[]> {

    const docs = await OutboxModel.find({
      status: 'pending',
      nextRetryAt: {
        $lte: new Date(),
      },
    })
      .sort({ createdAt: 1 })
      .limit(limit)
      .lean();

    return docs.map((doc) =>
      this.toEntity(doc)
    );
  }

  /**
   * ==========================
   * Lock For Processing
   * ==========================
   */
  async lockForProcessing(
    id: string
  ): Promise<OutboxEntity | null> {

    const doc =
      await OutboxModel.findOneAndUpdate(
        {
          _id: id,
          status: 'pending',
        },
        {
          status: 'processing',
          lockedAt: new Date(),
        },
        {
          new: true,
        }
      );

    if (!doc) {
      return null;
    }

    return this.toEntity(doc);
  }

  /**
   * ==========================
   * Mark Processed
   * ==========================
   */
  async markAsProcessed(
    id: string
  ): Promise<void> {

    await OutboxModel.findByIdAndUpdate(
      id,
      {
        status: 'processed',
        processedAt: new Date(),
        lockedAt: null,
      }
    );
  }

  /**
   * ==========================
   * Mark Failed
   * ==========================
   */
  async markAsFailed(
    id: string,
    errorMessage: string,
    retries: number
  ): Promise<void> {

    await OutboxModel.findByIdAndUpdate(
      id,
      {
        status: 'failed',
        retries,
        errorMessage,
        failedAt: new Date(),
        lockedAt: null,
      }
    );
  }
}