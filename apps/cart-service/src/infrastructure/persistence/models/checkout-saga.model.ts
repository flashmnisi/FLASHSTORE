import mongoose, { Schema } from 'mongoose';

const sagaSchema = new Schema(
  {
    userId: { type: String, required: true },

    orderId: String,
    paymentId: String,

    status: {
      type: String,
      enum: [
        'CREATED',
        'ORDER_CREATED',
        'PAYMENT_INITIATED',
        'PAYMENT_SUCCESS',
        'COMPLETED',
        'FAILED',
      ],
      default: 'CREATED',
    },

    payload: Schema.Types.Mixed,
    error: String,
  },
  { timestamps: true }
);

export const CheckoutSagaModel = mongoose.model('CheckoutSaga', sagaSchema);