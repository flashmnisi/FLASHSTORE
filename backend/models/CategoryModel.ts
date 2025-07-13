import mongoose, { Schema } from 'mongoose';
import { categoryParams } from '../type/Params';

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    images: [{ type: String, required: true }],
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

const CATEGORIES = mongoose.model<categoryParams>('categories', CategorySchema);
export { CATEGORIES };



