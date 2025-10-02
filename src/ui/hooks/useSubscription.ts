import { useEffect } from "react";
import { useWebSocket } from "../context/WebSocketContext";

type Callback = (payload: unknown) => void;

/**
 * A custom hook to subscribe to a WebSocket event.
 * It automatically handles subscribing on mount and unsubscribing on unmount.
 */
export const useSubscription = (eventType: string, callback: Callback) => {
  const { subscribe, unsubscribe } = useWebSocket();

  useEffect(() => {
    // Subscribe when the component mounts or the callback changes
    subscribe(eventType, callback);

    // Unsubscribe when the component unmounts
    return () => {
      unsubscribe(eventType, callback);
    };
  }, [subscribe, unsubscribe, eventType, callback]);
};
