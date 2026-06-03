// infrastructure/persistence/database/models/outbox.model.ts

import mongoose from 'mongoose';

const OutboxSchema = new mongoose.Schema(
  {
    topic: String,
    event: String,
    payload: Object,
    key: String,
    correlationId: String,

    status: {
      type: String,
      enum: [
        'pending',
        'processing',
        'processed',
        'failed',
      ],
      default: 'pending',
    },

    retries: {
      type: Number,
      default: 0,
    },

    errorMessage: String,

    nextRetryAt: Date,

    processedAt: Date,

    failedAt: Date,

    lockedAt: Date,
  },
  {
    timestamps: true,
  }
);

export const OutboxModel =
  mongoose.model(
    'Outbox',
    OutboxSchema
  );