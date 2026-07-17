import { beforeAll, afterEach, afterAll, vi } from "vitest";
import { setupServer } from "msw/node";
import { handlers } from "./mocks/handlers";
import "@testing-library/jest-dom/vitest";

// Setup MSW (Mock Service Worker) server for API mocking
export const server = setupServer(...handlers);

beforeAll(() => {
  // Start MSW server to intercept network requests
  server.listen({ onUnhandledRequest: "error" });

  // Note: KaTeX emits a "quirks mode" warning in happy-dom environment
  // This is harmless - KaTeX works fine, it just detects the test environment
  // The warning cannot be suppressed as it's emitted during module import

  // Mock SvelteKit environment variables
  globalThis.__SVELTEKIT_APP_VERSION__ = "test";
  globalThis.__SVELTEKIT_DEV__ = false;

  // Mock $app/environment
  vi.mock("$app/environment", () => ({
    browser: false,
    dev: false,
    building: false,
    version: "test"
  }));

  // Proxy-based localStorage mock supports both standard API and direct property access
  // (e.g. localStorage.courseVisits = "..." which the source code uses)
  const store: Record<string, string> = {};
  const API_KEYS = new Set(["getItem", "setItem", "removeItem", "clear", "length", "key"]);
  const localStorageMock = new Proxy(
    {
      getItem(key: string) { return store[key] ?? null; },
      setItem(key: string, value: string) { store[key] = String(value); },
      removeItem(key: string) { delete store[key]; },
      clear() { for (const key of Object.keys(store)) delete store[key]; },
      get length() { return Object.keys(store).length; },
      key(index: number) { return Object.keys(store)[index] ?? null; }
    },
    {
      get(target: any, prop: string) {
        if (API_KEYS.has(prop)) return typeof target[prop] === "function" ? target[prop].bind(target) : target[prop];
        return store[prop] ?? undefined;
      },
      set(_target: any, prop: string, value: string) { store[prop] = String(value); return true; },
      deleteProperty(_target: any, prop: string) { delete store[prop]; return true; }
    }
  );

  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
    writable: true,
    configurable: true
  });

  // Mock sessionStorage
  Object.defineProperty(window, "sessionStorage", {
    value: localStorageMock,
    writable: true,
    configurable: true
  });

  // Mock window.matchMedia (for theme detection)
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  });

  // Spies for theme-related DOM mutations
  if (typeof document !== "undefined") {
    vi.spyOn(document.documentElement.classList, "add");
    vi.spyOn(document.documentElement.classList, "remove");
    vi.spyOn(document.documentElement, "setAttribute");
  }
});

afterEach(() => {
  // Reset MSW handlers after each test
  server.resetHandlers();

  // Clear all mocks
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});

afterAll(() => {
  // Clean up MSW server
  server.close();
});
