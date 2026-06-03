import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  validUntil: Date;
  usageLimit?: number;
  usedCount: number;
  applicableTo: string[];
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: { 
      type: String, 
      required: true, 
      unique: true, 
      uppercase: true 
    },
    type: { 
      type: String, 
      enum: ['percentage', 'fixed'], 
      required: true 
    },
    value: { 
      type: Number, 
      required: true 
    },
    minOrderAmount: Number,
    maxDiscount: Number,
    validUntil: { 
      type: Date, 
      required: true 
    },
    usageLimit: { 
      type: Number, 
      default: 0 
    },
    usedCount: { 
      type: Number, 
      default: 0 
    },
    applicableTo: [{ 
      type: String 
    }],
  },
  { 
    timestamps: true 
  }
);

export const CouponModel = mongoose.model<ICoupon>('Coupon', couponSchema);