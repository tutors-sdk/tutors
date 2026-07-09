import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';
import '@testing-library/jest-dom/vitest';

// Setup MSW (Mock Service Worker) server for API mocking
export const server = setupServer(...handlers);

beforeAll(() => {
  // Start MSW server to intercept network requests
  server.listen({ onUnhandledRequest: 'error' });

  // Note: KaTeX emits a "quirks mode" warning in happy-dom environment
  // This is harmless - KaTeX works fine, it just detects the test environment
  // The warning cannot be suppressed as it's emitted during module import

  // Mock SvelteKit environment variables
  globalThis.__SVELTEKIT_APP_VERSION__ = 'test';
  globalThis.__SVELTEKIT_DEV__ = false;

  // Mock $app/environment
  vi.mock('$app/environment', () => ({
    browser: false,
    dev: false,
    building: false,
    version: 'test'
  }));

  // Mock localStorage
  const localStorageMock: Storage = {
    length: 0,
    key: vi.fn(),
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  };

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
    configurable: true
  });

  // Mock sessionStorage
  Object.defineProperty(window, 'sessionStorage', {
    value: localStorageMock,
    writable: true,
    configurable: true
  });

  // Mock window.matchMedia (for theme detection)
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
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
