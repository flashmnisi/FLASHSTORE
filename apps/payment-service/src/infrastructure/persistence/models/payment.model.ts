// apps/payment-service/src/infrastructure/persistence/models/payment.model.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface PaymentDocument extends Document {
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed';
  paymentMethod: string;
  stripePaymentIntentId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<PaymentDocument>(
  {
    orderId: { type: String, required: true, index: true },
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'ZAR' },
    status: {
      type: String,
      enum: ['pending', 'succeeded', 'failed'],
      default: 'pending',
      index: true,
    },
    paymentMethod: { type: String, required: true },
    stripePaymentIntentId: { type: String, index: true },
    metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

// Helpful indexes for performance
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ stripePaymentIntentId: 1 });

export const PaymentModel = mongoose.model<PaymentDocument>(
  'Payment',
  paymentSchema
);