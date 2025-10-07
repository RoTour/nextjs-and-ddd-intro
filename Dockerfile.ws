FROM oven/bun:1
ARG WEBSOCKET_URL
ENV WEBSOCKET_URL=${WEBSOCKET_URL}

WORKDIR /app
COPY package.json .

RUN bun install
COPY socket-server.ts .

EXPOSE 3001
CMD bun run socket-server.ts
