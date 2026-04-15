import mongoose, { Schema, Document } from 'mongoose';

export interface IOutbox extends Document {
  aggregateId: string;
  eventType: string;
  topic: string;
  payload: any;

  status: 'PENDING' | 'PROCESSING' | 'PROCESSED' | 'FAILED';

  retries: number;
  nextRetryAt: Date;
  lastError?: string;

  createdAt: Date;
  updatedAt: Date;
}

const OutboxSchema = new Schema<IOutbox>(
  {
    aggregateId: { type: String, required: true },

    eventType: { type: String, required: true }, // ✅ FIX

    topic: { type: String, required: true },

    payload: { type: Schema.Types.Mixed, required: true },

    status: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'PROCESSED', 'FAILED'],
      default: 'PENDING',
    },

    retries: { type: Number, default: 0 },

    nextRetryAt: { type: Date, default: Date.now }, // ✅ FIX

    lastError: { type: String },
  },
  { timestamps: true }
);

export const OutboxModel = mongoose.model<IOutbox>('Outbox', OutboxSchema);