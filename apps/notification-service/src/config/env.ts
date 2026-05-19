import dotenv from 'dotenv';
dotenv.config();

export const env = {
  // Server
  PORT: Number(process.env.PORT) || 3007,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database
  MONGO_URI: process.env.MONGO_URI || 'mongodb://mongo:27017/flashstore',

  // Kafka
  KAFKA_BROKERS: process.env.KAFKA_BROKERS || 'kafka:9092',

  // Email (Nodemailer)
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  EMAIL_PORT: Number(process.env.EMAIL_PORT) || 587,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,

  // Optional: Twilio for SMS
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,

  // Optional: Firebase for Push
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
};

export default env;