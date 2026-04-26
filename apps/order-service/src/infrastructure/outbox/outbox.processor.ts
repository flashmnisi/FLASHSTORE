import { OutboxModel } from './outbox.model';
import { publish } from '@org/shared-kafka';
import logger from '@org/shared-logger';

const BATCH_SIZE = 50;
const MAX_RETRIES = 5;
const INTERVAL_MS = 2000;

/**
 * Send event to Outbox (Reliable Delivery)
 */
export const sendToOutbox = async (data: {
  topic: string;
  event: string;
  payload: any;
  key?: string;
  correlationId?: string;
}) => {
  try {
    await OutboxModel.create({
      topic: data.topic,
      event: data.event,
      payload: data.payload,
      key: data.key,
      status: 'pending',
      retries: 0,
      nextRetryAt: new Date(),
      correlationId: data.correlationId,
    });

    logger.info('Event saved to outbox', { 
      event: data.event, 
      topic: data.topic 
    });
  } catch (error: any) {
    logger.error('Failed to save event to outbox', {
      event: data.event,
      error: error.message,
    });
    throw error;
  }
};

/**
 * 🚀 Outbox Processor (Reliable Event Delivery)
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

      if (messages.length === 0) return;

      logger.info(`Processing ${messages.length} pending outbox messages`);

      for (const msg of messages) {
        const locked = await OutboxModel.findOneAndUpdate(
          { _id: msg._id, status: 'pending' },
          { 
            status: 'processing',
            lockedAt: new Date() 
          },
          { new: true }
        );

        if (!locked) continue; // Another worker got it

        await processMessage(locked);
      }
    } catch (error: any) {
      logger.error('Outbox processor error', { error: error.message });
    }
  }, INTERVAL_MS);

  logger.info('🚀 Order Outbox Processor started successfully');
};

/**
 * Process single outbox message
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
        correlationId: msg.correlationId,
      },
    });

    await OutboxModel.updateOne(
      { _id: msg._id },
      { status: 'processed' }
    );

    logger.info('✅ Outbox message delivered successfully', {
      event: msg.event,
      outboxId: msg._id,
    });
  } catch (error: any) {
    await handleFailure(msg, error);
  }
};

/**
 * Handle failure with exponential backoff
 */
const handleFailure = async (msg: any, error: any) => {
  const retries = (msg.retries || 0) + 1;
  const backoffMs = Math.min(1000 * Math.pow(2, retries), 60000); // max 60 seconds

  const updateData = {
    retries,
    nextRetryAt: new Date(Date.now() + backoffMs),
    status: retries >= MAX_RETRIES ? 'failed' : 'pending',
  };

  await OutboxModel.updateOne({ _id: msg._id }, updateData);

  logger.error('❌ Outbox message failed', {
    outboxId: msg._id,
    event: msg.event,
    retries,
    nextRetryInMs: backoffMs,
    error: error.message,
  });
};