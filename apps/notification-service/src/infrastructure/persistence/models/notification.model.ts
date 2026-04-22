import mongoose, { Schema } from 'mongoose';

const notificationSchema = new Schema({
  userId: { type: String, required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: { type: Schema.Types.Mixed },
  status: { type: String, default: 'pending' },
  channel: { type: String, required: true },
}, { timestamps: true });

export const NotificationModel = mongoose.model('Notification', notificationSchema);