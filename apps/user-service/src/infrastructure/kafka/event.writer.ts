import { OutboxRepository } from '../db/outbox.repository';

export class EventWriter {
  private repo = new OutboxRepository();

  async write(event: any) {
    await this.repo.create({
      aggregateId: event.data.userId,
      eventType: event.event, // ✅ FIX
      topic: 'flashstore.users',
      payload: {
        ...event,
        version: 1,
        service: 'user-service',
        timestamp: new Date().toISOString(),
      },
    });
  }
}