// /Users/rotour/projects/back-to-react/src/ui/context/WebSocketContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { EventEmitter } from "../lib/EventEmitter";

type Callback = (data: unknown) => void;

interface WebSocketContextType {
  socket: WebSocket | null;
  subscribe: (eventType: string, callback: Callback) => void;
  unsubscribe: (eventType: string, callback: Callback) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined,
);

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const eventEmitter = useMemo(() => new EventEmitter(), []);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:3001`);

    ws.onopen = () => {
      console.log("WebSocket connection established");
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type && message.payload) {
          eventEmitter.emit(message.type, message.payload);
        }
      } catch (e) {
        console.error("Failed to parse WebSocket message:", event.data, e);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setSocket(null);
    };

    return () => {
      ws.close();
    };
  }, [eventEmitter]);

  const contextValue = useMemo(
    () => ({
      socket,
      subscribe: eventEmitter.on.bind(eventEmitter),
      unsubscribe: eventEmitter.off.bind(eventEmitter),
    }),
    [socket, eventEmitter],
  );

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
