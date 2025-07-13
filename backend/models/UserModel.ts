import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../type/Params';

const cartItemSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  count: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
});

const addressSchema = new Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true },
  surname: { type: String, trim: true }, // Optional
  phone: { type: String, required: [true, 'Phone is required'], trim: true },
  city: { type: String, required: [true, 'City is required'], trim: true },
  houseNo: { type: String, required: [true, 'House number is required'], trim: true },
  streetName: { type: String, required: [true, 'Street name is required'], trim: true },
  postalCode: { type: String, required: [true, 'Postal code is required'], trim: true },
  country: { type: String, required: [true, 'Country is required'], trim: true },
});

const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    address: [addressSchema],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
    cart: {
      items: [cartItemSchema],
    },
    resetOtp: {
      code: String,
      expiresAt: Number,
      isVerified: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema); 

export { User };