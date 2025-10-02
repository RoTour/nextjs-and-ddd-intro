import { DomainEventPublisher } from "@/domain/common/events/DomainEventPublisher";
import { WebSocketServer } from "ws";
import { GridUpdateBroadcaster } from "./listeners/GridUpdateBroadcaster";

const wss = new WebSocketServer({ port: 3001 });

wss.on("connection", (ws, req) => {
  const ip = req.socket;
  console.log(`New client conencted: ${ip}`);

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

export function broadcast(message: string) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

DomainEventPublisher.subscribe(new GridUpdateBroadcaster(broadcast));
