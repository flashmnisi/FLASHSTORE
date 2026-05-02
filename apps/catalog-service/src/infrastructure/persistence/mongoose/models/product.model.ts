// apps/catalog-service/src/infrastructure/persistence/mongoose/models/product.model.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IProductDocument extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  categoryId: mongoose.Types.ObjectId;
  brand?: string;
  images: string[];
  tags: string[];
  inStock: boolean;
  stockQuantity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    currency: { 
      type: String, 
      enum: ['ZAR', 'USD', 'EUR', 'GBP'], 
      default: 'ZAR' 
    },
    categoryId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Category', 
      required: true 
    },
    brand: { type: String, trim: true },
    images: [{ type: String }],
    tags: [{ type: String }],
    inStock: { type: Boolean, default: true },
    stockQuantity: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for performance
productSchema.index({ slug: 1 });
productSchema.index({ categoryId: 1 });
productSchema.index({ isActive: 1, inStock: 1 });
productSchema.index({ price: 1 });
productSchema.index({ tags: 1 });

export const ProductModel = mongoose.model<IProductDocument>('Product', productSchema);