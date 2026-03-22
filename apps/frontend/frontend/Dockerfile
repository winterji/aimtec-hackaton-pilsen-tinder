# 1. Stage: Install dependencies
FROM node:20.20.1-alpine AS deps
WORKDIR /app

COPY package*.json ./

RUN npm install

# 2. Stage: Build the application
FROM node:20.20.1-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 3. Stage: Production runner
FROM node:20.20.1-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy necessary files for standalone execution
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3002
ENV PORT=3002

# Server.js is created automatically by Next.js in standalone mode
CMD ["node", "server.js"]
