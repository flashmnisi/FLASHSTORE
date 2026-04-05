import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalyticsEvent extends Document {
  event: string;
  userId?: string;
  service: string;
  timestamp: Date;
  metadata: Record<string, any>;
  ip?: string;
  userAgent?: string;
}

const analyticsEventSchema = new Schema({
  event: { type: String, required: true, index: true },
  userId: { type: String, index: true },
  service: { type: String, required: true },
  timestamp: { type: Date, default: Date.now, index: true },
  metadata: { type: Schema.Types.Mixed, default: {} },
  ip: String,
  userAgent: String,
});

export const AnalyticsEvent = mongoose.model<IAnalyticsEvent>('AnalyticsEvent', analyticsEventSchema);