import { OutboxRepository } from '../db/outbox.repository';
import { publish } from '@org/shared-kafka';
import logger from '@org/shared-logger';

const repo = new OutboxRepository();

export const startOutboxWorker = () => {
  setInterval(async () => {
    const events = await repo.findPending();

    for (const event of events) {
      try {
        await publish({
          topic: event.topic,
          message: {
            event: event.eventType, // ✅ FIX
            data: event.payload,
            source: 'user-service',
          },
        });

        await repo.markAsSent(event._id.toString()); // ✅ FIX

        logger.info(
          { event: event.eventType },
          '✅ Event published from outbox'
        );
      } catch (err: any) {
        await repo.markAsFailed(event._id.toString()); // ✅ FIX

        logger.error(
          { error: err.message },
          '❌ Failed to publish outbox event'
        );
      }
    }
  }, 5000);
};