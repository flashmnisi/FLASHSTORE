import mongoose, { Schema } from 'mongoose';
import { ProductProps } from '../type/Params';

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    images: [{ type: String, required: true }],
    brand: { type: String },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    quantity: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'categories', required: true },
    inStock: { type: Boolean, default: true },
    trends: { type: Boolean, default: false },
    description: { type: String },
    sale: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
  }
);

const Product = mongoose.model<ProductProps>('Product', ProductSchema); // Changed to 'Product'
export { Product };