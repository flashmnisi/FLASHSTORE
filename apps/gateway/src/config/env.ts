import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: Number(process.env.PORT) || 3000,
  KAFKA_BROKERS: process.env.KAFKA_BROKERS || 'kafka:9092',
};

export default env;

// import dotenv from 'dotenv';
// dotenv.config();

// export const config = {
//   port: process.env.PORT || 3000,
//   kafkaBrokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
//   environment: process.env.NODE_ENV || 'development',
//   // Add more later: redis, db, jwt secret, etc.
// };

// export default config;