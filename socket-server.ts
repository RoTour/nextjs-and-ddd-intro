// /Users/rotour/projects/back-to-react/socket-server.ts
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { parse } from "url";

/**
 * This is a standalone WebSocket server.
 * It runs as a separate process from your Next.js application.
 *
 * Responsibilities:
 * 1. Manage persistent WebSocket connections with clients (browsers).
 * 2. Provide an HTTP endpoint for the Next.js backend to send messages that need to be broadcasted.
 */

// 1. Create a standard Node.js HTTP server.
// This server will handle both regular HTTP requests for broadcasting and WebSocket upgrade requests.
const server = http.createServer((req, res) => {
  const { pathname } = parse(req.url || "", true);

  // 2. Define an HTTP endpoint for your Next.js backend to call.
  // When your backend wants to notify all clients of an update, it will send a POST request here.
  if (req.method === "POST" && pathname === "/broadcast") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      console.log(
        `[HTTP] Received message to broadcast: ${body.substring(0, 100)}...`,
      );
      // Once the full message is received, broadcast it to all connected clients.
      broadcast(body);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Broadcasted successfully" }));
    });
  } else {
    // For any other HTTP request, return a 404.
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Not Found" }));
  }
});

// 3. Attach the WebSocket server to the HTTP server.
const wss = new WebSocketServer({ server });

wss.on("connection", (ws: WebSocket, req) => {
  const clientIp = req.socket.remoteAddress;
  console.log(`[WebSocket] Client connected: ${clientIp}`);

  ws.on("message", (message: Buffer) => {
    console.log(
      `[WebSocket] Received message from client: ${message.toString()}`,
    );
    // You can add logic here to handle messages sent from the client if needed.
  });

  ws.on("close", () => {
    console.log(`[WebSocket] Client disconnected: ${clientIp}`);
  });

  ws.on("error", (error) => {
    console.error("[WebSocket] Error: ", error);
  });
});

/**
 * Sends a message to every connected and ready WebSocket client.
 * @param message The message to broadcast.
 */
function broadcast(message: string) {
  let clientCount = 0;
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
      clientCount++;
    }
  });
  console.log(`[Broadcast] Sent message to ${clientCount} client(s).`);
}

const port = 3001;
server.listen(port, () => {
  console.log(
    `🚀 Standalone WebSocket server listening on ws://localhost:${port}`,
  );
  console.log(
    `📢 Broadcast endpoint is available at http://localhost:${port}/broadcast`,
  );
});
