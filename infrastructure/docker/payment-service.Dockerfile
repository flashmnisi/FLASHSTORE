# ==================== BUILD STAGE ====================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy everything (as you prefer)
COPY . .

# Install dependencies
RUN npm ci

# Build the payment service
RUN npx nx build payment-service --configuration=production

# ==================== RUNTIME STAGE ====================
FROM node:20-alpine

WORKDIR /app

# Copy built output
COPY --from=builder /app/dist/apps/payment-service ./dist

# Copy node_modules
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV PORT=3005
ENV KAFKA_BROKERS=kafka:9092
ENV MONGO_URI=mongodb://mongo:27017/flashstore
# Stripe keys will be passed from docker-compose or .env

EXPOSE 3005

CMD ["node", "dist/main.js"]