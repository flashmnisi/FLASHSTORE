import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  user: string;
  orderItems: Array<{
    product: string;
    qty: number;
    price: number;
  }>;
  shippingAddress: {
    name: string;
    surname?: string;
    phone: string;
    city: string;
    houseNo: string;
    streetName: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: 'cash' | 'card' | 'paypal';
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  deliveryOption?: string;
  paymentData?: any;
  isPaid: boolean;
  paidAt?: Date;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
}

const orderSchema = new Schema(
  {
    user: { type: String, required: true, index: true },

    orderItems: [{
      product: { type: String, required: true },
      qty: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true, min: 0 },
    }],

    shippingAddress: {
      name: { type: String, required: true },
      surname: { type: String },
      phone: { type: String, required: true },
      city: { type: String, required: true },
      houseNo: { type: String, required: true },
      streetName: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },

    paymentMethod: { 
      type: String, 
      enum: ['cash', 'card', 'paypal'], 
      required: true 
    },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    deliveryOption: String,
    paymentData: Schema.Types.Mixed,
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    paymentStatus: { 
      type: String, 
      enum: ['Pending', 'Paid', 'Failed'], 
      default: 'Pending' 
    },
    status: { 
      type: String, 
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], 
      default: 'pending' 
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>('Order', orderSchema);