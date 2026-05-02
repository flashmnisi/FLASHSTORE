// apps/payment-service/src/infrastructure/outbox/outbox.processor.ts

import { OutboxModel } from './outbox.model';
import { publish } from '@org/shared-kafka';
import { sendToDLQ } from '@org/shared-kafka';
import logger from '@org/shared-logger';

const BATCH_SIZE = 50;
const MAX_RETRIES = 5;
const POLL_INTERVAL = 2000; // 2 seconds
const LOCK_TIMEOUT = 30000; // 30 seconds

let isRunning = true;

/**
 * Write event to Outbox
 */
export const sendToOutbox = async (data: {
  topic: string;
  event: string;
  payload: any;
  key?: string;
}) => {
  try {
    const outboxEntry = await OutboxModel.create({
      topic: data.topic,
      event: data.event,
      payload: data.payload,
      key: data.key,
      status: 'pending',
      retries: 0,
      nextRetryAt: new Date(),
    });

    logger.info('Event written to Outbox', {
      event: data.event,
      outboxId: outboxEntry._id,
    });

    return outboxEntry;
  } catch (error: any) {
    logger.error('Failed to write to Outbox', {
      event: data.event,
      error: error.message,
    });
    throw error;
  }
};

/**
 * Start the Outbox Processor
 */
export const startOutboxProcessor = () => {
  logger.info('🚀 Outbox Processor started');

  const interval = setInterval(async () => {
    if (!isRunning) return;

    try {
      await reclaimStuckMessages();
      await processPendingBatch();
    } catch (error: any) {
      logger.error('Outbox processor error', { error: error.message });
    }
  }, POLL_INTERVAL);

  // Graceful shutdown
  const shutdown = () => {
    logger.warn('🛑 Shutting down Outbox Processor...');
    isRunning = false;
    clearInterval(interval);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

/**
 * Process a batch of pending events
 */
const processPendingBatch = async () => {
  const messages = await OutboxModel.find({
    status: 'pending',
    nextRetryAt: { $lte: new Date() },
  })
    .sort({ createdAt: 1 })
    .limit(BATCH_SIZE)
    .lean();

  if (messages.length === 0) return;

  await Promise.allSettled(
    messages.map(async (msg) => {
      const locked = await OutboxModel.findOneAndUpdate(
        { _id: msg._id, status: 'pending' },
        { 
          status: 'processing',
          lockedAt: new Date() 
        },
        { new: true }
      );

      if (!locked) return; // already being processed

      await processSingleMessage(locked);
    })
  );
};

/**
 * Process a single outbox message
 */
const processSingleMessage = async (msg: any) => {
  try {
    await publish({
      topic: msg.topic,
      key: msg.key || msg.payload?.orderId || msg.payload?.userId,
      message: {
        event: msg.event,
        data: msg.payload,
        timestamp: new Date().toISOString(),
      },
    });

    await OutboxModel.updateOne(
      { _id: msg._id },
      { 
        status: 'processed',
        $unset: { lockedAt: '' }
      }
    );

    logger.info('✅ Outbox message processed', {
      id: msg._id,
      event: msg.event,
    });

  } catch (error: any) {
    await handleFailure(msg, error);
  }
};

/**
 * HANDLE FAILURE + RETRY + DLQ
 */
const handleFailure = async (msg: any, error: any) => {
  const retries = (msg.retries || 0) + 1;
  const backoffMs = Math.min(1000 * Math.pow(2, retries), 60000);

  const update: any = {
    retries,
    nextRetryAt: new Date(Date.now() + backoffMs),
    $unset: { lockedAt: '' },
  };

  if (retries >= MAX_RETRIES) {
    update.status = 'failed';

    // ✅ Correct DLQ call - match the expected DLQEvent shape
await sendToDLQ({
  topic: msg.topic,
  event: msg.event,
  payload: msg.payload,
  error: error,
  retryCount: retries,
  serviceName: 'payment-service',
  correlationId: msg.payload?.metadata?.correlationId,
});

    logger.error('💀 Message moved to DLQ', {
      id: msg._id,
      event: msg.event,
      retries,
    });
  } else {
    update.status = 'pending';

    logger.warn('⚠️ Outbox message failed, retry scheduled', {
      id: msg._id,
      event: msg.event,
      retries,
      backoffMs,
    });
  }

  await OutboxModel.updateOne({ _id: msg._id }, update);
};
/**
 * Reclaim messages stuck in 'processing' state
 */
const reclaimStuckMessages = async () => {
  const timeout = new Date(Date.now() - LOCK_TIMEOUT);

  const result = await OutboxModel.updateMany(
    {
      status: 'processing',
      lockedAt: { $lt: timeout },
    },
    {
      status: 'pending',
      $unset: { lockedAt: '' },
    }
  );

  if (result.modifiedCount > 0) {
    logger.warn('♻️ Reclaimed stuck outbox messages', {
      count: result.modifiedCount,
    });
  }
};