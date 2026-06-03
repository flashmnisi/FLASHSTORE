// apps/catalog-service/src/infrastructure/persistence/mongoose/models/category.model.ts

import mongoose, {
  Schema,
  Document,
} from 'mongoose';

export interface ICategoryDocument
  extends Document {

  name: string;
  slug: string;
  description?: string;

  parentId?: mongoose.Types.ObjectId;

  imageUrl?: string;

  icon?: string;

  isFeatured: boolean;

  sortOrder: number;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const categorySchema =
  new Schema<ICategoryDocument>(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
      },

      description: {
        type: String,
      },

      parentId: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
      },

      imageUrl: {
        type: String,
      },

      icon: {
        type: String,
      },

      isFeatured: {
        type: Boolean,
        default: false,
      },

      sortOrder: {
        type: Number,
        default: 0,
      },

      isActive: {
        type: Boolean,
        default: true,
      },
    },

    {
      timestamps: true,
    }
  );

/**
 * =========================
 * INDEXES
 * =========================
 */

categorySchema.index({
  slug: 1,
});

categorySchema.index({
  parentId: 1,
});

categorySchema.index({
  isActive: 1,
});

categorySchema.index({
  isFeatured: 1,
});

categorySchema.index({
  sortOrder: 1,
});

export const CategoryModel =
  mongoose.model<ICategoryDocument>(
    'Category',
    categorySchema
  );