import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  images: string[];
  isActive: boolean;
}

const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    images: [{ type: String, required: true }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Category = mongoose.model<ICategory>('Category', categorySchema);