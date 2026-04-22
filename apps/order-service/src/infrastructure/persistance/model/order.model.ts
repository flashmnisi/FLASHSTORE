import mongoose, { Schema } from 'mongoose';

const orderItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    userId: { type: String, required: true },

    items: { type: [orderItemSchema], required: true },

    totalAmount: { type: Number, required: true },

    currency: { type: String, default: 'ZAR' },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },

    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },

    idempotencyKey: {
      type: String,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance (important at scale)
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

export const OrderModel = mongoose.model('Order', orderSchema);