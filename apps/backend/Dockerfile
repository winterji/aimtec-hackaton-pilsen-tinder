# 1. Stage: Install dependencies
FROM node:20.20.1-alpine AS deps
RUN apk add --no-cache --update openssl
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

# 2. Stage: Build the application
FROM node:20.20.1-alpine AS builder
RUN apk add --no-cache --update openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# 3. Stage: Production runner
FROM node:20.20.1-alpine AS runner
RUN apk add --no-cache --update openssl
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Copy necessary files for standalone execution
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

# Server.js is created automatically by Next.js in standalone mode
CMD ["node", "server.js"]
