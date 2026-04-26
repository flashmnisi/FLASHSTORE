import mongoose, { Schema } from 'mongoose';

const templateSchema = new Schema(
  {
    name: { type: String, required: true, index: true },
    version: { type: Number, default: 1 },
    channel: { type: String, enum: ['email', 'sms', 'push'], required: true },

    subject: { type: String },
    body: { type: String, required: true },

    variables: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

templateSchema.index({ name: 1, version: -1, channel: 1 });

export const TemplateModel = mongoose.model('NotificationTemplate', templateSchema);