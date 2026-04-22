import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  PORT: z.string().default('3004'),

  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),

  KAFKA_BROKERS: z.string().default('kafka:9092'),
  KAFKA_CLIENT_ID: z.string().default('order-service'),

  JWT_SECRET: z.string().optional(),
});

const env = envSchema.parse(process.env);

export default env;