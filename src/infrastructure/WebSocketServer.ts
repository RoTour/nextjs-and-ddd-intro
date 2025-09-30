import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3001 });

wss.on("connection", (ws, req) => {
  const ip = req.socket;
  console.log(`New client conencted: ${ip}`, ip);

  ws.on("message", (message: string) => {
    console.log(`Received message: ${message}`);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`Echo: ${message}`);
      }
    });
  });
  ws.on("close", () => {
    console.log(`Client disconnected: ${ip}`);
  });
  ws.on("error", (error) => {
    console.log("WebSocket error: ", error);
  });
});
