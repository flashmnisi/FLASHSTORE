// apps/analytics-service/src/infrastructure/persistence/mongoose/models/analytics.model.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalyticsDocument extends Document {
  eventType: string;
  userId?: string;
  productId?: string;
  orderId?: string;
  metadata: Record<string, any>;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const analyticsSchema = new Schema<IAnalyticsDocument>(
  {
    eventType: { 
      type: String, 
      required: true, 
      index: true 
    },
    userId: { 
      type: String, 
      index: true 
    },
    productId: { 
      type: String, 
      index: true 
    },
    orderId: { 
      type: String, 
      index: true 
    },
    metadata: { 
      type: Schema.Types.Mixed, 
      default: {} 
    },
    timestamp: { 
      type: Date, 
      default: Date.now, 
      index: true 
    },
  },
  { 
    timestamps: true 
  }
);

// Compound indexes for common queries
analyticsSchema.index({ eventType: 1, timestamp: -1 });
analyticsSchema.index({ userId: 1, timestamp: -1 });
analyticsSchema.index({ productId: 1, timestamp: -1 });

export const AnalyticsModel = mongoose.model<IAnalyticsDocument>('Analytics', analyticsSchema);