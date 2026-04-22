import { OutboxModel } from './outbox.model';
import { publish } from '@org/shared-kafka';
import logger from '@org/shared-logger';

const BATCH_SIZE = 50;
const MAX_RETRIES = 5;
const INTERVAL_MS = 2000;

export const sendToOutbox = async (data: {
  topic: string;
  event: string;
  payload: any;
  key?: string;
}) => {
  await OutboxModel.create({
    ...data,
    status: 'pending',
    retries: 0,
    nextRetryAt: new Date(),
  });
};

/**
 * 🚀 Outbox Worker (Event Delivery Guarantee)
 */
export const startOrderOutboxProcessor = () => {
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
      logger.error('Order Outbox processor error', {
        error: error.message,
      });
    }
  }, INTERVAL_MS);

  logger.info('🚀 Order Outbox Processor started');
};

/**
 * Process single message
 */
const processMessage = async (msg: any) => {
  try {
    await publish({
      topic: msg.topic,
      key: msg.key,
      message: {
        event: msg.event,
        data: msg.payload,
        timestamp: new Date().toISOString(),
      },
    });

    await OutboxModel.updateOne(
      { _id: msg._id },
      { status: 'processed' }
    );

    logger.info('📤 Order outbox delivered', {
      event: msg.event,
      id: msg._id,
    });
  } catch (error: any) {
    await handleFailure(msg, error);
  }
};

/**
 * Retry + Backoff Strategy (Exponential)
 */
const handleFailure = async (msg: any, error: any) => {
  const retries = msg.retries + 1;

  const backoffMs = Math.min(1000 * 2 ** retries, 60000);

  const update: any = {
    retries,
    nextRetryAt: new Date(Date.now() + backoffMs),
    status: retries >= MAX_RETRIES ? 'failed' : 'pending',
  };

  await OutboxModel.updateOne({ _id: msg._id }, update);

  logger.error('❌ Order Outbox failed', {
    id: msg._id,
    retries,
    error: error.message,
    nextRetryInMs: backoffMs,
  });
};