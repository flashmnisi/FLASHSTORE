// apps/analytics-service/src/infrastructure/persistence/mongoose/models/metric.model.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IMetricDocument extends Document {
  metricType: string;
  value: number;
  date: Date;
  dimensions: Record<string, string>;
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
      required: true 
    },
    date: { 
      type: Date, 
      required: true, 
      index: true 
    },
    dimensions: { 
      type: Schema.Types.Mixed, 
      default: {} 
    },
  },
  { 
    timestamps: true 
  }
);

// Important indexes for time-series queries
metricSchema.index({ metricType: 1, date: -1 });
metricSchema.index({ metricType: 1, 'dimensions.categoryId': 1, date: -1 });

export const MetricModel = mongoose.model<IMetricDocument>('Metric', metricSchema);