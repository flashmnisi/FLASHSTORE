import mongoose from 'mongoose';
import { env } from './env';

export const connectDatabase = async () => {
  if (!env.MONGO_URI) throw new Error('MONGO_URI missing');

  await mongoose.connect(env.MONGO_URI);

  console.log('[shared-config] MongoDB connected');
};