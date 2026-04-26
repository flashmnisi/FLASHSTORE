import mongoose, { Schema, Document } from 'mongoose';

export interface NotificationDocument extends Document {
  userId: string;
  type: string;

  templateName: string;
  templateData: any;

  title?: string;
  message?: string;

  status: 'pending' | 'sent' | 'failed';
  channel: 'email' | 'sms' | 'push';

  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<NotificationDocument>(
  {
    userId: { type: String, required: true, index: true },

    type: { type: String, required: true },

    templateName: { type: String, required: true },
    templateData: { type: Schema.Types.Mixed },

    title: { type: String },
    message: { type: String },

    status: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending',
      index: true,
    },

    channel: {
      type: String,
      enum: ['email', 'sms', 'push'],
      required: true,
    },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, createdAt: -1 });

export const NotificationModel = mongoose.model<NotificationDocument>(
  'Notification',
  notificationSchema
);