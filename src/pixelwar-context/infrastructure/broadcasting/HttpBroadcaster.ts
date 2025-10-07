// /Users/rotour/projects/back-to-react/src/infrastructure/broadcasting/HttpBroadcaster.ts
import { IBroadcaster } from "./IBroadcaster";

/**
 * An implementation of IBroadcaster that sends the payload
 * to a specified HTTP endpoint.
 */
export class HttpBroadcaster implements IBroadcaster {
  private readonly broadcastUrl: string;

  constructor() {
    // Use an environment variable for the server URL, with a fallback for local development.
    const baseUrl = process.env.WEBSOCKET_URL || "NO_URL_PROVIDED";
    this.broadcastUrl = `${baseUrl}/broadcast`;

    console.log(`HttpBroadcaster initialized with URL: ${this.broadcastUrl}`);
  }

  async broadcast(payload: string): Promise<void> {
    console.log(`HttpBroadcaster: Sending payload to ${this.broadcastUrl}`);
    try {
      const response = await fetch(this.broadcastUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      });

      if (!response.ok) {
        console.error(
          `HttpBroadcaster: Failed to broadcast. Status: ${response.status}`,
        );
        // In a production app, you might want to throw a specific error here
        // to be caught by an upstream error handler.
      }
    } catch (error) {
      console.error(
        "HttpBroadcaster: An unexpected error occurred during broadcast:",
        error,
      );
      // Or re-throw a custom infrastructure error.
    }
  }
}
