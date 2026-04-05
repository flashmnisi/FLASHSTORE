# ==================== BUILD STAGE ====================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npx nx build analytics-service --configuration=production

# ==================== RUNTIME STAGE ====================
FROM node:20-alpine

WORKDIR /app

# Install only production deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy built output
COPY --from=builder /app/dist/apps/analytics-service ./dist/apps/analytics-service

ENV NODE_ENV=production
ENV PORT=3007
ENV KAFKA_BROKERS=kafka:9092
ENV MONGO_URI=mongodb://mongo:27017/flashstore-analytics

EXPOSE 3007

# Security
RUN addgroup -S app && adduser -S app -G app
USER app

CMD ["node", "dist/main.js"]