import { vi } from "vitest";

export class MockPartySocket {
  host: string;
  room: string;
  private listeners = new Map<string, ((...args: any[]) => void)[]>();

  constructor(opts: { host: string; room: string }) {
    this.host = opts.host;
    this.room = opts.room;
  }

  addEventListener(event: string, handler: (...args: any[]) => void) {
    const handlers = this.listeners.get(event) || [];
    handlers.push(handler);
    this.listeners.set(event, handlers);
  }

  removeEventListener(event: string, handler: (...args: any[]) => void) {
    const handlers = this.listeners.get(event) || [];
    this.listeners.set(
      event,
      handlers.filter((h) => h !== handler)
    );
  }

  send = vi.fn();

  simulateMessage(data: unknown) {
    const handlers = this.listeners.get("message") || [];
    handlers.forEach((h) => h({ data: JSON.stringify(data) }));
  }

  close = vi.fn();
}
