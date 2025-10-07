// /Users/rotour/projects/back-to-react/src/infrastructure/broadcasting/IBroadcaster.ts

/**
 * Defines the contract for a component that can broadcast a payload string.
 * This allows for different broadcasting strategies (e.g., HTTP, gRPC, etc.)
 * to be used interchangeably.
 */
export interface IBroadcaster {
  broadcast(payload: string): Promise<void>;
}
