import mongoose, { Schema, Document } from 'mongoose';

export interface IOutbox extends Document {
  topic: string;
  event: string;
  payload: Record<string, any>;
  key?: string;
  correlationId?: string;
  status: 'pending' | 'processing' | 'processed' | 'failed';
  retries: number;
  nextRetryAt: Date;
  lockedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const outboxSchema = new Schema<IOutbox>(
  {
    topic: { type: String, required: true },
    event: { type: String, required: true },
    payload: { type: Schema.Types.Mixed, required: true },
    key: String,
    correlationId: String,

    status: {
      type: String,
      enum: ['pending', 'processing', 'processed', 'failed'],
      default: 'pending',
      index: true,
    },

    retries: { type: Number, default: 0 },
    nextRetryAt: { type: Date, default: Date.now },
    lockedAt: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Performance indexes
outboxSchema.index({ status: 1, nextRetryAt: 1 });
outboxSchema.index({ topic: 1, event: 1 });

export const OutboxModel = mongoose.model<IOutbox>('OrderOutbox', outboxSchema);