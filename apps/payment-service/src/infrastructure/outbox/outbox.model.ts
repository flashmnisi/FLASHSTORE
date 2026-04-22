// apps/payment-service/src/infrastructure/outbox/outbox.model.ts

import mongoose, { Schema } from 'mongoose';

const outboxSchema = new Schema(
  {
    topic: { type: String, required: true },
    event: { type: String, required: true },
    payload: { type: Schema.Types.Mixed, required: true },
    key: String,

    status: {
      type: String,
      enum: ['pending', 'processing', 'processed', 'failed'],
      default: 'pending',
    },

    retries: { type: Number, default: 0 },

    nextRetryAt: { type: Date, default: Date.now }, // 🔥 backoff support
    lockedAt: { type: Date },                       // 🔥 concurrency lock
  },
  { timestamps: true }
);

export const OutboxModel = mongoose.model('Outbox', outboxSchema);