import { IOutbox, OutboxModel } from './outboxModel';

export class OutboxRepository {
  async create(event: {
    aggregateId: string;
    topic: string;
    eventType: string;
    payload: any;
  }): Promise<IOutbox> {
    return OutboxModel.create({
      aggregateId: event.aggregateId,
      topic: event.topic,
      eventType: event.eventType,
      payload: event.payload,
    });
  }

  async findPending(limit = 50): Promise<IOutbox[]> {
    return OutboxModel.find({
      status: 'PENDING',
      nextRetryAt: { $lte: new Date() },
    })
      .limit(limit)
      .sort({ createdAt: 1 });
  }

  async markAsSent(id: string) {
    return OutboxModel.findByIdAndUpdate(id, {
      status: 'PROCESSED',
    });
  }

  async markAsFailed(id: string) {
    return OutboxModel.findByIdAndUpdate(id, {
      $inc: { retries: 1 },
      status: 'FAILED',
    });
  }
}