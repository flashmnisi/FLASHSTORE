import { IOutboxRepository } from "../../../domain/repositories/outbox.repository";
import { OutboxModel } from "../model/outbox.model";

const MAX_RETRIES = 5;

export class OutboxRepositoryImpl implements IOutboxRepository {

  async create(outboxData: any) {
    return OutboxModel.create({
      ...outboxData,
      status: 'pending',
      retries: 0,
      nextRetryAt: new Date(),
    });
  }

  /**
   * Get events ready for processing
   */
  async findPending(limit = 50) {
    return OutboxModel.find({
      status: 'pending',
      retries: { $lt: MAX_RETRIES },
      nextRetryAt: { $lte: new Date() },
    })
      .sort({ createdAt: 1 })
      .limit(limit)
      .lean(); // ✅ important
  }

  /**
   * Lock event (prevent duplicate processing)
   */
  async lockForProcessing(id: string) {
    return OutboxModel.findOneAndUpdate(
      {
        _id: id,
        status: 'pending',
        nextRetryAt: { $lte: new Date() },
      },
      {
        $set: {
          status: 'processing',
          lockedAt: new Date(),
        },
      },
      { new: true }
    );
  }

  /**
   * Mark success
   */
  async markAsProcessed(id: string) {
    return OutboxModel.findByIdAndUpdate(id, {
      $set: {
        status: 'processed',
        processedAt: new Date(),
      },
    });
  }

  /**
   * Mark failure + exponential backoff
   */
  async markAsFailed(id: string, error: string, retries: number) {
    const delay = Math.min(1000 * Math.pow(2, retries), 60000); // max 60s
    const nextRetryAt = new Date(Date.now() + delay);

    return OutboxModel.findByIdAndUpdate(id, {
      $set: {
        status: retries >= MAX_RETRIES ? 'failed' : 'pending',
        error,                 // ✅ consistent field
        retries,
        nextRetryAt,
      },
    });
  }
}