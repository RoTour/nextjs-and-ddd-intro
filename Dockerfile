# -----------------------------------------------------------------------------
# This Dockerfile is configured for projects using pnpm with Node.js
# -----------------------------------------------------------------------------

# Use a specific Node.js version for reproducibility
FROM node:20-slim AS base
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl

# -----------------------------------------------------------------------------
# DEPS STAGE: Install node_modules
# -----------------------------------------------------------------------------
FROM base AS deps
# Copy only package manager files to leverage Docker cache
COPY package.json pnpm-lock.yaml* ./
# Using --frozen-lockfile is best practice for CI/CD to ensure the lockfile is used.
RUN pnpm install --frozen-lockfile

# -----------------------------------------------------------------------------
# BUILDER STAGE: Build the application
# -----------------------------------------------------------------------------
FROM base AS builder
WORKDIR /app
# Copy installed node_modules from the deps stage
COPY --from=deps /app/node_modules ./node_modules
# Copy the rest of the application source code
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# ENV NEXT_TELEMETRY_DISABLED=1

# Run build steps
ARG WEBSOCKET_URL
ENV WEBSOCKET_URL=${WEBSOCKET_URL}
RUN pnpm run prisma:generate
RUN pnpm run build

# -----------------------------------------------------------------------------
# RUNNER STAGE: Run the production application
# -----------------------------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

# ENV NEXT_TELEMETRY_DISABLED=1

ENV NODE_ENV=production \
  PORT=3000 \
  HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Run the server using Node.js
CMD ["node", "server.js"]
