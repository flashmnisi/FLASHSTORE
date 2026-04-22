// apps/payment-service/src/infrastructure/outbox/outbox.processor.ts

import { OutboxModel } from './outbox.model';
import { publish } from '@org/shared-kafka';
import logger from '@org/shared-logger';

export const sendToOutbox = async (data: {
  topic: string;
  event: string;
  payload: any;
  key?: string;
}) => {
  await OutboxModel.create({
    topic: data.topic,
    event: data.event,
    payload: data.payload,
    key: data.key,
  });
};

/**
 * 🔥 Background worker to publish events
 */
export const startOutboxProcessor = () => {
  setInterval(async () => {
    const messages = await OutboxModel.find({
      status: 'pending',
    }).limit(50);

    for (const msg of messages) {
      try {
        await publish({
          topic: msg.topic,
          key: msg.key,
          message: {
            event: msg.event,
            data: msg.payload,
          },
        });

        msg.status = 'processed';
        await msg.save();

        logger.info('Outbox message sent', {
          event: msg.event,
          id: msg._id,
        });

      } catch (error: any) {
        msg.retries += 1;

        if (msg.retries > 5) {
          msg.status = 'failed';
        }

        await msg.save();

        logger.error('Outbox publish failed', {
          error: error.message,
          retries: msg.retries,
        });
      }
    }
  }, 3000); // every 3s
};