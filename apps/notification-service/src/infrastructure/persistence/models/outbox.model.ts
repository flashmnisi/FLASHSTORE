import mongoose, { Schema, Document } from 'mongoose';

export interface IOutbox extends Document {
  payload: Record<string, any>;
  status: 'pending' | 'processed' | 'failed' | 'dead_letter';
  retryCount: number;
  movedToDeadLetterAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OutboxSchema = new Schema<IOutbox>(
  {
    payload: {
      type: Schema.Types.Mixed,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processed', 'failed', 'dead_letter'],
      default: 'pending',
      index: true,
    },
    retryCount: {
      type: Number,
      default: 0,
    },
    movedToDeadLetterAt: Date,
  },
  { timestamps: true }
);

// Indexes for better performance
OutboxSchema.index({ status: 1, retryCount: 1 });
OutboxSchema.index({ createdAt: 1 });

export const OutboxModel = mongoose.model<IOutbox>('Outbox', OutboxSchema);