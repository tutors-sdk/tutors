/**
 * Mock implementation of PartySocket for testing WebSocket functionality.
 * Provides methods to simulate WebSocket events and inspect sent messages.
 */
export class MockPartySocket {
  room: string;
  host: string;
  listeners = new Map<string, Function[]>();
  sentMessages: string[] = [];
  readyState: number = 1; // OPEN

  constructor(config: { host: string; room: string }) {
    this.host = config.host;
    this.room = config.room;
  }

  send(data: string) {
    this.sentMessages.push(data);
  }

  addEventListener(event: string, handler: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(handler);
  }

  removeEventListener(event: string, handler: Function) {
    const handlers = this.listeners.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  close() {
    this.readyState = 3; // CLOSED
    this.simulateClose();
  }

  // Test helpers: simulate WebSocket events

  simulateMessage(data: any) {
    const handlers = this.listeners.get('message') || [];
    handlers.forEach(h => h({ data: JSON.stringify(data) }));
  }

  simulateOpen() {
    this.readyState = 1; // OPEN
    const handlers = this.listeners.get('open') || [];
    handlers.forEach(h => h({}));
  }

  simulateClose() {
    this.readyState = 3; // CLOSED
    const handlers = this.listeners.get('close') || [];
    handlers.forEach(h => h({}));
  }

  simulateError(error: any) {
    const handlers = this.listeners.get('error') || [];
    handlers.forEach(h => h(error));
  }
}
