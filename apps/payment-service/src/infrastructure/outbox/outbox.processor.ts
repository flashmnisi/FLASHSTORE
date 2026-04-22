import { OutboxModel } from './outbox.model';
import { publish } from '@org/shared-kafka';
import { sendToDLQ } from '@org/shared-kafka';
import logger from '@org/shared-logger';

// =============================
// CONFIG
// =============================
const BATCH_SIZE = 50;
const MAX_RETRIES = 5;
const POLL_INTERVAL = 2000; // 2s
const LOCK_TIMEOUT = 30000; // 30s

let isRunning = true;

// =============================
// CREATE OUTBOX EVENT
// =============================
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
    nextRetryAt: new Date(),
    status: 'pending',
    retries: 0,
  });
};

// =============================
// START PROCESSOR
// =============================
export const startOutboxProcessor = () => {
  logger.info('🚀 Outbox processor started');

  const interval = setInterval(async () => {
    if (!isRunning) return;

    try {
      // =============================
      // 1. Recover stuck messages
      // =============================
      await reclaimStuckMessages();

      // =============================
      // 2. Fetch pending messages
      // =============================
      const messages = await OutboxModel.find({
        status: 'pending',
        nextRetryAt: { $lte: new Date() },
      })
        .sort({ createdAt: 1 }) // 🔥 preserves order
        .limit(BATCH_SIZE)
        .lean();

      if (!messages.length) return;

      // =============================
      // 3. Process in parallel (safe)
      // =============================
      await Promise.allSettled(
        messages.map(async (msg) => {
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

          if (!locked) return; // already taken

          await processMessage(locked);
        })
      );

    } catch (error: any) {
      logger.error('Outbox processor error', {
        error: error.message,
      });
    }
  }, POLL_INTERVAL);

  // =============================
  // Graceful shutdown
  // =============================
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  const shutdown = async () => {
    logger.warn('🛑 Shutting down outbox processor...');
    isRunning = false;
    clearInterval(interval);
  };
};

// =============================
// PROCESS SINGLE MESSAGE
// =============================
const processMessage = async (msg: any) => {
  try {
    await publish({
      topic: msg.topic,
      key: msg.key || msg.payload?.orderId || msg.payload?.userId,
      message: {
        event: msg.event,
        data: msg.payload,
      },
    });

    await OutboxModel.updateOne(
      { _id: msg._id },
      {
        status: 'processed',
        $unset: { lockedAt: '' },
      }
    );

    logger.info('✅ Outbox sent', {
      id: msg._id,
      event: msg.event,
    });

  } catch (error: any) {
    await handleFailure(msg, error);
  }
};

// =============================
// HANDLE FAILURE + RETRY + DLQ
// =============================
const handleFailure = async (msg: any, error: any) => {
  const retries = msg.retries + 1;

  // Exponential backoff
  const backoffMs = Math.min(1000 * 2 ** retries, 60000);

  const update: any = {
    retries,
    nextRetryAt: new Date(Date.now() + backoffMs),
    $unset: { lockedAt: '' },
  };

  if (retries >= MAX_RETRIES) {
    update.status = 'failed';

    // =============================
    // Send to DLQ
    // =============================
    await sendToDLQ({
      topic: msg.topic,
      key: msg.key,
      message: msg.payload,
      error: error.message,
    });

    logger.error('💀 Sent to DLQ', {
      id: msg._id,
      retries,
      error: error.message,
    });

  } else {
    update.status = 'pending';
  }

  await OutboxModel.updateOne({ _id: msg._id }, update);

  logger.warn('⚠️ Outbox retry scheduled', {
    id: msg._id,
    retries,
    nextRetryInMs: backoffMs,
  });
};

// =============================
// RECOVER STUCK MESSAGES
// =============================
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