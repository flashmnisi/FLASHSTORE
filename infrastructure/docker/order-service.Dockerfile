# ==================== BUILD STAGE ====================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy everything (same style as your gateway)
COPY . .

# Install deps
RUN npm ci

# Build using Nx (use correct project name)
RUN npx nx build order-service --configuration=production

# ==================== RUNTIME STAGE ====================
FROM node:20-alpine

WORKDIR /app

# Copy only built output
COPY --from=builder /app/dist/apps/order-service ./dist

# Copy node_modules (same style as your gateway)
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV PORT=3004
ENV KAFKA_BROKERS=kafka:9092

EXPOSE 3004

CMD ["node", "dist/main.js"]