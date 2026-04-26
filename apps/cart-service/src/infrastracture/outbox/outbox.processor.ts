// apps/cart-service/src/infrastructure/outbox/outbox.processor.ts

import logger from '@org/shared-logger';
import { OutboxModel } from './outbox.model';
import { publish } from '@org/shared-kafka';

const BATCH_SIZE = 50;
const MAX_RETRIES = 5;
const POLL_INTERVAL = 2000;

/**
 * 📤 Add message to outbox
 */
export const sendToOutbox = async (data: {
  topic: string;
  event: string;
  payload: any;
  key?: string;
}) => {
  await OutboxModel.create({
    ...data,
    nextRetryAt: new Date(),
  });
};

/**
 * 🚀 Start processor
 */
export const startOutboxProcessor = () => {
  setInterval(async () => {
    try {
      const messages = await OutboxModel.find({
        status: 'pending',
        nextRetryAt: { $lte: new Date() },
      })
        .limit(BATCH_SIZE)
        .lean();

      for (const msg of messages) {
        const locked = await OutboxModel.findOneAndUpdate(
          {
            _id: msg._id,
            status: 'pending',
          },
          {
            status: 'processing',
            lockedAt: new Date(),
          },
          { new: true }
        );

        if (!locked) continue;

        await processMessage(locked);
      }

    } catch (error: any) {
      logger.error('Outbox processor error', {
        error: error.message,
      });
    }
  }, POLL_INTERVAL);
};

/**
 * 🔁 Process message
 */
const processMessage = async (msg: any) => {
  try {
    await publish({
      topic: msg.topic,
      key: msg.key,
      message: {
        event: msg.event,
        data: msg.payload,
      },
    });

    await OutboxModel.updateOne(
      { _id: msg._id },
      { status: 'processed' }
    );

    logger.info('Outbox sent', {
      id: msg._id,
      event: msg.event,
    });

  } catch (error: any) {
    await handleFailure(msg, error);
  }
};

/**
 * 💥 Retry logic (exponential backoff)
 */
const handleFailure = async (msg: any, error: any) => {
  const retries = msg.retries + 1;

  const backoffMs = Math.min(1000 * 2 ** retries, 60000);

  const update: any = {
    retries,
    nextRetryAt: new Date(Date.now() + backoffMs),
  };

  if (retries >= MAX_RETRIES) {
    update.status = 'failed';
  } else {
    update.status = 'pending';
  }

  await OutboxModel.updateOne({ _id: msg._id }, update);

  logger.error('Outbox failed', {
    id: msg._id,
    retries,
    nextRetryInMs: backoffMs,
    error: error.message,
  });
};