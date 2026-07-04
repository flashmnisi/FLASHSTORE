// apps/inventory-service/src/infrastructure/outbox/outbox.model.ts

import { Schema, model } from 'mongoose';

const OutboxSchema = new Schema(
  {
    topic: {
      type: String,
      required: true,
      index: true,
    },

    event: {
      type: String,
      required: true,
    },

    payload: {
      type: Schema.Types.Mixed,
      required: true,
    },

    key: String,

    correlationId: String,

    status: {
      type: String,
      enum: ['pending', 'processing', 'processed', 'failed'],
      default: 'pending',
      index: true,
    },

    retries: {
      type: Number,
      default: 0,
    },

    errorMessage: String,

    nextRetryAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    processedAt: Date,

    failedAt: Date,

    lockedAt: Date,
  },
  {
    timestamps: true,
  }
);

export const OutboxModel = model('InventoryOutbox', OutboxSchema);
