import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  quantity: number;
  category: string;
  inStock: boolean;
  trends: boolean;
  description: string;
  sale: boolean;
  images: string[];
}

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, min: 0 },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    category: { type: String, required: true, index: true },
    inStock: { type: Boolean, default: true },
    trends: { type: Boolean, default: false },
    description: { type: String, required: true },
    sale: { type: Boolean, default: false },
    images: [{ type: String }],
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>('Product', productSchema);