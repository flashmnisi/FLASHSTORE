// apps/cart-service/src/infrastructure/persistence/models/cart.model.ts

import mongoose, { Schema, Document } from 'mongoose';

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name?: string;
  image?: string;
}

export interface CartDocument extends Document {
  userId: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<CartItem>(
  {
    productId: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    name: String,
    image: String,
  },
  { _id: false }
);

const cartSchema = new Schema<CartDocument>(
  {
    userId: { type: String, required: true, unique: true },
    items: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true }
);

export const CartModel = mongoose.model<CartDocument>('Cart', cartSchema);