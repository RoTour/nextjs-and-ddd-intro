type Callback = (payload: unknown) => void;

export class EventEmitter {
  private listeners: Record<string, Callback[]> = {};

  public on(eventType: string, callback: Callback): void {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType].push(callback);
  }

  public off(eventType: string, callback: Callback): void {
    if (!this.listeners[eventType]) return;
    this.listeners[eventType] = this.listeners[eventType].filter(
      (cb) => cb !== callback,
    );
  }

  public emit(eventType: string, payload: unknown): void {
    if (!this.listeners[eventType]) return;
    this.listeners[eventType].forEach((callback) => {
      try {
        callback(payload);
      } catch (e) {
        console.error(`Error in event listener for ${eventType}:`, e);
      }
    });
  }
}
