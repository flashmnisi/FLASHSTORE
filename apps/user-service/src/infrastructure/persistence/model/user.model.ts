import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role: { type: String, default: 'user' },
  isAdmin: { type: Boolean, default: false },
}, { timestamps: true });

export const UserModel = mongoose.model('User', userSchema);