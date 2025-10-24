/**
 * Network utilities with automatic retry logic and error handling
 */

import { NetworkError } from './tutors-error';
import type { RetryOptions } from './types';

const defaultRetryOptions: RetryOptions = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  shouldRetry: (error: Error, attempt: number) => {
    // Retry on network errors and 5xx server errors
    if (error instanceof NetworkError) {
      if (error.statusCode && error.statusCode >= 500) {
        return attempt < 3;
      }
      // Don't retry on 4xx client errors
      if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
        return false;
      }
    }
    return true;
  }
};

/**
 * Delays execution for a specified duration
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculates the delay for the next retry attempt using exponential backoff
 */
function calculateDelay(attempt: number, options: RetryOptions): number {
  const delay = options.initialDelay * Math.pow(options.backoffMultiplier, attempt);
  return Math.min(delay, options.maxDelay);
}

/**
 * Fetches a resource with automatic retry on failure
 */
export async function fetchWithRetry(
  url: string,
  init?: RequestInit,
  retryOptions: Partial<RetryOptions> = {}
): Promise<Response> {
  const options = { ...defaultRetryOptions, ...retryOptions };
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
    try {
      const response = await fetch(url, init);

      // Check if response is ok (status 200-299)
      if (!response.ok) {
        throw new NetworkError(
          `HTTP ${response.status}: ${response.statusText}`,
          {
            statusCode: response.status,
            url,
            attempt
          }
        );
      }

      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check if we should retry
      const shouldRetry = options.shouldRetry
        ? options.shouldRetry(lastError, attempt)
        : true;

      // If this is the last attempt or we shouldn't retry, throw the error
      if (attempt >= options.maxRetries || !shouldRetry) {
        if (error instanceof NetworkError) {
          throw error;
        }
        throw new NetworkError(
          `Failed to fetch ${url}: ${lastError.message}`,
          {
            url,
            attempt,
            originalError: lastError.message
          }
        );
      }

      // Wait before retrying with exponential backoff
      const delayMs = calculateDelay(attempt, options);
      await delay(delayMs);
    }
  }

  // This should never happen, but TypeScript needs it
  throw lastError || new Error('Unknown error during fetch');
}

/**
 * Fetches JSON data with automatic retry and type safety
 */
export async function fetchJsonWithRetry<T>(
  url: string,
  init?: RequestInit,
  retryOptions?: Partial<RetryOptions>
): Promise<T> {
  const response = await fetchWithRetry(url, init, retryOptions);

  try {
    return await response.json();
  } catch (error) {
    throw new NetworkError(
      `Failed to parse JSON response from ${url}`,
      {
        url,
        originalError: error instanceof Error ? error.message : String(error)
      }
    );
  }
}

/**
 * Parallel fetch with retry for multiple URLs
 * Returns results with error information for each request
 */
export async function fetchMultipleWithRetry<T>(
  requests: Array<{ url: string; init?: RequestInit }>,
  retryOptions?: Partial<RetryOptions>
): Promise<Array<{ data: T | null; error: Error | null; url: string }>> {
  const promises = requests.map(async ({ url, init }) => {
    try {
      const data = await fetchJsonWithRetry<T>(url, init, retryOptions);
      return { data, error: null, url };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error(String(error)),
        url
      };
    }
  });

  return Promise.all(promises);
}

/**
 * Checks if a URL is reachable (useful for health checks)
 */
export async function checkUrlHealth(
  url: string,
  timeout = 5000
): Promise<{ healthy: boolean; statusCode?: number; error?: string }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    return {
      healthy: response.ok,
      statusCode: response.status
    };
  } catch (error) {
    clearTimeout(timeoutId);

    return {
      healthy: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Creates an AbortController that automatically times out
 */
export function createTimeoutController(timeoutMs: number): {
  controller: AbortController;
  cleanup: () => void;
} {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  return {
    controller,
    cleanup: () => clearTimeout(timeoutId)
  };
}

