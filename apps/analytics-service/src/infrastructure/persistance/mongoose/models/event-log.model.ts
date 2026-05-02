// apps/analytics-service/src/infrastructure/persistence/mongoose/models/event-log.model.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IEventLogDocument extends Document {
  eventType: string;
  sourceService: string;
  payload: Record<string, any>;
  processed: boolean;
  processedAt?: Date;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const eventLogSchema = new Schema<IEventLogDocument>(
  {
    eventType: { 
      type: String, 
      required: true, 
      index: true 
    },
    sourceService: { 
      type: String, 
      required: true, 
      index: true 
    },
    payload: { 
      type: Schema.Types.Mixed, 
      required: true 
    },
    processed: { 
      type: Boolean, 
      default: false, 
      index: true 
    },
    processedAt: { 
      type: Date 
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

// Indexes for efficient querying
eventLogSchema.index({ processed: 1, timestamp: 1 });
eventLogSchema.index({ sourceService: 1, eventType: 1 });

export const EventLogModel = mongoose.model<IEventLogDocument>('EventLog', eventLogSchema);