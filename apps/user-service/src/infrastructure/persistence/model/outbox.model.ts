import mongoose, { Schema, Document } from 'mongoose';

export interface IOutbox extends Document {
  topic: string;
  event: string;
  payload: any;
  key?: string;

  status: 'pending' | 'processing' | 'processed' | 'failed';
  retries: number;
  nextRetryAt: Date;
  lockedAt?: Date;

  errorMessage?: string;

  createdAt: Date;
  updatedAt: Date;
}

const outboxSchema = new Schema<IOutbox>(
  {
    topic: { type: String, required: true },
    event: { type: String, required: true },
    payload: { type: Schema.Types.Mixed, required: true },
    key: { type: String },

    status: {
      type: String,
      enum: ['pending', 'processing', 'processed', 'failed'],
      default: 'pending',
      index: true,
    },

    retries: { type: Number, default: 0 },

    nextRetryAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    lockedAt: { type: Date },

    errorMessage: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// 🔥 Indexes (important)
outboxSchema.index({ status: 1, nextRetryAt: 1 });
outboxSchema.index({ retries: 1 });
outboxSchema.index({ createdAt: 1 });
outboxSchema.index({ topic: 1, event: 1 });

export const OutboxModel =
  mongoose.models.Outbox ||
  mongoose.model<IOutbox>('Outbox', outboxSchema);