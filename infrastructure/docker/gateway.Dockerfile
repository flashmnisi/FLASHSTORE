# ==================== BUILD STAGE ====================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy everything
COPY . .

# Install deps
RUN npm ci

# Build using Nx (IMPORTANT: use correct project name)
RUN npx nx build @org/gateway --configuration=production

# ==================== RUNTIME STAGE ====================
FROM node:20-alpine

WORKDIR /app

# Copy only built output
COPY --from=builder /app/dist/apps/gateway ./dist

# Copy node_modules (so no reinstall issues)
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV PORT=3000
ENV KAFKA_BROKERS=kafka:9092

EXPOSE 3000

CMD ["node", "dist/main.js"]