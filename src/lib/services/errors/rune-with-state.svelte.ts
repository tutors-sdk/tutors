/**
 * Enhanced rune wrapper with loading and error state management
 * Extends the basic rune pattern with built-in state handling for async operations
 */

import type { RuneWithState } from './types';

/**
 * Creates a reactive state container with loading and error tracking
 * Perfect for managing async operations and API calls
 * 
 * @example
 * const courseRune = runeWithState<Course | null>(null);
 * 
 * async function loadCourse() {
 *   courseRune.setLoading(true);
 *   try {
 *     const course = await fetchCourse();
 *     courseRune.value = course;
 *     courseRune.setError(null);
 *   } catch (error) {
 *     courseRune.setError(error);
 *   } finally {
 *     courseRune.setLoading(false);
 *   }
 * }
 */
export function runeWithState<T>(initialValue: T): RuneWithState<T> {
  let _value = $state(initialValue);
  let _loading = $state(false);
  let _error = $state<Error | null>(null);
  const _initialValue = initialValue;

  return {
    get value(): T {
      return _value;
    },
    set value(v: T) {
      _value = v;
    },

    get loading(): boolean {
      return _loading;
    },
    set loading(v: boolean) {
      _loading = v;
    },

    get error(): Error | null {
      return _error;
    },
    set error(e: Error | null) {
      _error = e;
    },

    /**
     * Sets the loading state
     */
    setLoading(loading: boolean): void {
      _loading = loading;
    },

    /**
     * Sets the error state
     */
    setError(error: Error | null): void {
      _error = error;
    },

    /**
     * Resets the rune to its initial state
     */
    reset(): void {
      _value = _initialValue;
      _loading = false;
      _error = null;
    }
  };
}

/**
 * Wrapper for async operations that automatically manages loading and error states
 * 
 * @example
 * const courseRune = runeWithState<Course | null>(null);
 * 
 * await withStateManagement(courseRune, async () => {
 *   return await fetchCourse();
 * });
 */
export async function withStateManagement<T>(
  rune: RuneWithState<T>,
  operation: () => Promise<T>
): Promise<T | null> {
  rune.setLoading(true);
  rune.setError(null);

  try {
    const result = await operation();
    rune.value = result;
    return result;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    rune.setError(err);
    return null;
  } finally {
    rune.setLoading(false);
  }
}

/**
 * Creates a derived state that combines multiple runes' loading states
 * Useful for showing a single loading indicator for multiple operations
 */
export function combineLoading(...runes: RuneWithState<unknown>[]): boolean {
  return runes.some((rune) => rune.loading);
}

/**
 * Creates a derived state that collects all errors from multiple runes
 */
export function combineErrors(...runes: RuneWithState<unknown>[]): Error[] {
  return runes.map((rune) => rune.error).filter((error): error is Error => error !== null);
}

/**
 * Helper to check if a rune is in a success state (not loading, no error)
 */
export function isSuccess<T>(rune: RuneWithState<T>): boolean {
  return !rune.loading && rune.error === null;
}

/**
 * Helper to check if a rune has data (value is not null/undefined)
 */
export function hasData<T>(rune: RuneWithState<T>): rune is RuneWithState<NonNullable<T>> {
  return rune.value !== null && rune.value !== undefined;
}

