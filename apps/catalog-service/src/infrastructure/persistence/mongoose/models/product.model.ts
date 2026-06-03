// apps/catalog-service/src/infrastructure/persistence/mongoose/models/product.model.ts

import mongoose, {
  Schema,
  Document,
} from 'mongoose';

export interface IProductDocument
  extends Document {

  name: string;

  slug: string;

  description: string;

  price: number;

  currency: string;

  /**
   * Main category
   */
  categoryId: mongoose.Types.ObjectId;

  /**
   * Optional nested category
   */
  subCategoryId?: mongoose.Types.ObjectId;

  brand?: string;

  images: string[];

  tags: string[];

  /**
   * Marketing flags
   */
  isFeatured: boolean;

  isHotDeal: boolean;

  isNewArrival: boolean;

  /**
   * Discount %
   */
  discountPercentage: number;

  /**
   * Inventory
   */
  inStock: boolean;

  stockQuantity: number;

  /**
   * Visibility
   */
  isActive: boolean;

  /**
   * Ratings
   */
  averageRating: number;

  totalReviews: number;

  /**
   * Analytics
   */
  views: number;

  salesCount: number;

  createdAt: Date;

  updatedAt: Date;
}

const productSchema =
  new Schema<IProductDocument>(
    {
      /**
       * Basic Info
       */
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
        trim: true,
      },

      description: {
        type: String,
        required: true,
      },

      /**
       * Pricing
       */
      price: {
        type: Number,
        required: true,
        min: 0,
      },

      currency: {
        type: String,
        enum: [
          'ZAR',
          'USD',
          'EUR',
          'GBP',
        ],
        default: 'ZAR',
      },

      /**
       * Categories
       */
      categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
      },

      subCategoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
      },

      /**
       * Branding
       */
      brand: {
        type: String,
        trim: true,
      },

      /**
       * Images
       */
      images: [
        {
          type: String,
        },
      ],

      /**
       * Search tags
       */
      tags: [
        {
          type: String,
          lowercase: true,
          trim: true,
        },
      ],

      /**
       * Marketing
       */
      isFeatured: {
        type: Boolean,
        default: false,
      },

      isHotDeal: {
        type: Boolean,
        default: false,
      },

      isNewArrival: {
        type: Boolean,
        default: false,
      },

      discountPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },

      /**
       * Inventory
       */
      inStock: {
        type: Boolean,
        default: true,
      },

      stockQuantity: {
        type: Number,
        default: 0,
        min: 0,
      },

      /**
       * Visibility
       */
      isActive: {
        type: Boolean,
        default: true,
      },

      /**
       * Ratings
       */
      averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },

      totalReviews: {
        type: Number,
        default: 0,
      },

      /**
       * Analytics
       */
      views: {
        type: Number,
        default: 0,
      },

      salesCount: {
        type: Number,
        default: 0,
      },
    },

    {
      timestamps: true,
    }
  );

/**
 * =====================================
 * INDEXES
 * =====================================
 */

productSchema.index({
  slug: 1,
});

productSchema.index({
  categoryId: 1,
});

productSchema.index({
  subCategoryId: 1,
});

productSchema.index({
  isFeatured: 1,
});

productSchema.index({
  isHotDeal: 1,
});

productSchema.index({
  isNewArrival: 1,
});

productSchema.index({
  isActive: 1,
  inStock: 1,
});

productSchema.index({
  price: 1,
});

productSchema.index({
  brand: 1,
});

productSchema.index({
  tags: 1,
});

productSchema.index({
  averageRating: -1,
});

productSchema.index({
  salesCount: -1,
});

export const ProductModel =
  mongoose.model<IProductDocument>(
    'Product',
    productSchema
  );