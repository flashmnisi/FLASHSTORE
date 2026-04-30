// apps/user-service/src/infrastructure/persistence/mongoose/models/user.model.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  isAdmin: boolean;
  phone?: string;
  addresses: any[];           // Array of address objects
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUserDocument>(
  {
    name: { 
      type: String, 
      required: true,
      trim: true 
    },
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
      select: false   // Don't return password by default
    },
    role: { 
      type: String, 
      default: 'user',
      enum: ['user', 'admin'] 
    },
    isAdmin: { 
      type: Boolean, 
      default: false 
    },
    phone: { 
      type: String,
      trim: true 
    },
    addresses: [{
      type: Schema.Types.Mixed,     // Flexible address structure
      default: []
    }],
    refreshToken: { 
      type: String,
      select: false                 // Don't return by default
    },
  },
  { 
    timestamps: true,
    versionKey: false 
  }
);

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isAdmin: 1 });

export const UserModel = mongoose.model<IUserDocument>('User', userSchema);