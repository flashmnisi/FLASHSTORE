import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  address: any[];
  orders: mongoose.Types.ObjectId[];
  isAdmin: boolean;
  cart: { items: any[] };
  resetOtp?: {
    code: string;
    expiresAt: number;
    isVerified: boolean;
  };
  refreshToken?: string;
  role: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const addressSchema = new Schema({
  name: { type: String, required: true, trim: true },
  surname: { type: String, trim: true },
  phone: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  houseNo: { type: String, required: true, trim: true },
  streetName: { type: String, required: true, trim: true },
  postalCode: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
});

const cartItemSchema = new Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  count: { type: Number, required: true, min: 1, default: 1 },
});

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true 
    },
    password: { 
      type: String, 
      required: true, 
      minlength: 6,
      select: false 
    },
    address: [addressSchema],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    isAdmin: { type: Boolean, default: false },
    role: { 
      type: String, 
      enum: ['user', 'admin'], 
      default: 'user' 
    },
    cart: { 
      items: [cartItemSchema] 
    },
    resetOtp: {
      code: String,
      expiresAt: Number,
      isVerified: { type: Boolean, default: false },
    },
    refreshToken: { type: String, select: false },
  },
  { timestamps: true }
) as Schema<IUser>;

// Password hashing middleware - Most reliable pattern
userSchema.pre('save', async function (next: any) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt as string);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);