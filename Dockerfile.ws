# --- Stage 1: Build dependencies ---
FROM oven/bun:1 AS builder

WORKDIR /app
# COPY package.json .

# Install ONLY production dependencies
RUN bun add ws

# --- Stage 2: Create the final, small image ---
FROM oven/bun:1-slim

WORKDIR /app

# Copy the pruned node_modules from the builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy your application code
COPY socket-server.ts .

EXPOSE 3001
CMD ["bun", "run", "socket-server.ts"]
