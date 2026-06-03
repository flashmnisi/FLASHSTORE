// apps/analytics-service/src/infrastructure/persistence/mongoose/models/metric.model.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IMetricDocument extends Document {
  metricType: string;
  value: number;
  date: string;           // Store as YYYY-MM-DD string
  dimensions: Record<string, any>;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const metricSchema = new Schema<IMetricDocument>(
  {
    metricType: { 
      type: String, 
      required: true, 
      index: true 
    },
    value: { 
      type: Number, 
      required: true,
      default: 0 
    },
    date: { 
      type: String, 
      required: true, 
      index: true 
    },
    dimensions: { 
      type: Schema.Types.Mixed, 
      default: {} 
    },
    metadata: { 
      type: Schema.Types.Mixed, 
      default: {} 
    },
  },
  { 
    timestamps: true 
  }
);

metricSchema.index({ metricType: 1, date: 1 });

export const MetricModel = mongoose.model<IMetricDocument>('Metric', metricSchema);