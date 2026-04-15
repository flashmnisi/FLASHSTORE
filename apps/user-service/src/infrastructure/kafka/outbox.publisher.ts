import { OutboxModel } from '../db/outboxModel';

export type OutboxRouter = (eventType: string, payload: any) => Promise<void>;

export class OutboxPublisher {
  constructor(private router: OutboxRouter) {}

  async addToOutbox(eventType: string, payload: any) {
    await OutboxModel.create({
      eventType,
      payload,
      status: 'PENDING',
      retries: 0,
      nextRetryAt: new Date(),
    });
  }

  // 🔥 SAFE ATOMIC WORKER
  async processOutbox(batchSize = 20) {
    const events = await OutboxModel.find({
      status: 'PENDING',
      nextRetryAt: { $lte: new Date() },
    })
      .sort({ createdAt: 1 })
      .limit(batchSize);

    for (const event of events) {
      // 🔐 ATOMIC CLAIM (prevents double processing)
      const claimed = await OutboxModel.findOneAndUpdate(
        {
          _id: event._id,
          status: 'PENDING',
        },
        {
          $set: { status: 'PROCESSING' },
        },
        { new: true }
      );

      if (!claimed) continue; // already processed by another worker

      try {
        await this.router(event.eventType, event.payload);

        await OutboxModel.updateOne(
          { _id: event._id },
          { $set: { status: 'PROCESSED' } }
        );
      } catch (err: any) {
        const retries = event.retries + 1;

        const delay = Math.min(1000 * Math.pow(2, retries), 60000); // exponential backoff

        await OutboxModel.updateOne(
          { _id: event._id },
          {
            $set: {
              status: retries >= 5 ? 'FAILED' : 'PENDING',
              retries,
              nextRetryAt: new Date(Date.now() + delay),
              lastError: err.message,
            },
          }
        );
      }
    }
  }
}