# ==================== BUILD STAGE ====================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy everything (as you requested)
COPY . .

# Install dependencies
RUN npm ci

# Build the notification service
RUN npx nx build notification-service --configuration=production

# ==================== RUNTIME STAGE ====================
FROM node:20-alpine

WORKDIR /app

# Copy built output
COPY --from=builder /app/dist/apps/notification-service ./dist

# Copy node_modules
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV PORT=3007
ENV KAFKA_BROKERS=kafka:9092

EXPOSE 3007

CMD ["node", "dist/main.js"]