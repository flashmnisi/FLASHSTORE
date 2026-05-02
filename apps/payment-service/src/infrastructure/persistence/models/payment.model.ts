// apps/payment-service/src/infrastructure/persistence/mongoose/models/payment.model.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IPaymentDocument extends Document {
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed';
  paymentMethod: string;
  stripePaymentIntentId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPaymentDocument>(
  {
    orderId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, uppercase: true, default: 'ZAR' },
    status: {
      type: String,
      enum: ['pending', 'processing', 'succeeded', 'failed'],
      default: 'pending',
      index: true,
    },
    paymentMethod: { type: String, default: 'card' },
    stripePaymentIntentId: { type: String, sparse: true, index: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { 
    timestamps: true,
    versionKey: false 
  }
);

export const PaymentModel = mongoose.model<IPaymentDocument>('Payment', paymentSchema);