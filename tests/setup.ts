import { vi } from "vitest";

process.on("unhandledRejection", (reason: any) => {
  if (reason?.code === "ERR_MODULE_NOT_FOUND" && reason?.url?.includes("pngjs/browser")) {
    return;
  }
  throw reason;
});

const store: Record<string, string> = {};

const API_KEYS = new Set(["getItem", "setItem", "removeItem", "clear", "length", "key"]);

const localStorageMock = new Proxy(
  {
    getItem(key: string) {
      return store[key] ?? null;
    },
    setItem(key: string, value: string) {
      store[key] = String(value);
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      for (const key of Object.keys(store)) {
        delete store[key];
      }
    },
    get length() {
      return Object.keys(store).length;
    },
    key(index: number) {
      return Object.keys(store)[index] ?? null;
    }
  },
  {
    get(target: any, prop: string) {
      if (API_KEYS.has(prop)) return target[prop];
      return store[prop] ?? undefined;
    },
    set(_target: any, prop: string, value: string) {
      store[prop] = String(value);
      return true;
    },
    deleteProperty(_target: any, prop: string) {
      delete store[prop];
      return true;
    }
  }
);

vi.stubGlobal("localStorage", localStorageMock);

if (typeof document !== "undefined") {
  vi.spyOn(document.documentElement.classList, "add");
  vi.spyOn(document.documentElement.classList, "remove");
  vi.spyOn(document.documentElement, "setAttribute");
}
