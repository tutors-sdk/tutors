/**
 * Centralized error handler for the Tutors application
 * Provides consistent error logging, user notifications, and optional remote tracking
 */

import { toastService } from './toast.svelte';
import { isTutorsError, toTutorsError, type TutorsError } from './tutors-error';
import type { ErrorDetails, ErrorHandlerOptions } from './types';

const defaultOptions: ErrorHandlerOptions = {
  logToConsole: true,
  logToRemote: false,
  showToast: true,
  remoteLogger: undefined
};

/**
 * Main error handler service
 */
export const errorHandler = {
  options: { ...defaultOptions },

  /**
   * Configures the error handler
   */
  configure(options: Partial<ErrorHandlerOptions>): void {
    this.options = { ...this.options, ...options };
  },

  /**
   * Main error handling method
   * Processes errors, logs them, and shows user notifications
   */
  async handle(error: unknown, context?: Record<string, unknown>): Promise<void> {
    const tutorsError = toTutorsError(error);

    // Add additional context if provided
    if (context) {
      tutorsError.context = { ...tutorsError.context, ...context };
    }

    const errorDetails = this.createErrorDetails(tutorsError);

    // Log to console in development
    if (this.options.logToConsole && import.meta.env.DEV) {
      this.logToConsole(errorDetails, tutorsError);
    }

    // Log to remote service (e.g., Sentry, LogRocket)
    if (this.options.logToRemote && this.options.remoteLogger) {
      try {
        await this.options.remoteLogger(errorDetails);
      } catch (logError) {
        console.error('Failed to log error remotely:', logError);
      }
    }

    // Show user notification based on severity
    if (this.options.showToast) {
      this.showUserNotification(tutorsError);
    }
  },

  /**
   * Handles errors specifically from async operations
   * Returns a safe default value on error
   */
  async handleAsync<T>(
    operation: () => Promise<T>,
    fallbackValue: T,
    context?: Record<string, unknown>
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      await this.handle(error, context);
      return fallbackValue;
    }
  },

  /**
   * Creates structured error details for logging
   */
  createErrorDetails(error: TutorsError): ErrorDetails {
    return {
      code: error.code,
      message: error.message,
      severity: error.severity,
      context: error.context,
      timestamp: error.timestamp,
      stack: error.stack
    };
  },

  /**
   * Logs error details to console with formatting
   */
  logToConsole(details: ErrorDetails, error: TutorsError): void {
    const emoji = {
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌',
      critical: '🔥'
    };

    console.group(`${emoji[details.severity]} ${details.code}`);
    console.error('Message:', details.message);
    console.error('Severity:', details.severity);
    console.error('Timestamp:', details.timestamp.toISOString());

    if (details.context) {
      console.error('Context:', details.context);
    }

    if (isTutorsError(error)) {
      console.error('Detailed Message:', error.getDetailedMessage());
    }

    if (details.stack) {
      console.error('Stack Trace:', details.stack);
    }

    console.groupEnd();
  },

  /**
   * Shows appropriate user notification based on error severity
   */
  showUserNotification(error: TutorsError): void {
    const message = error.getUserMessage();

    switch (error.severity) {
      case 'critical':
      case 'error':
        toastService.error(message);
        break;
      case 'warning':
        toastService.warning(message);
        break;
      case 'info':
        toastService.info(message);
        break;
    }
  },

  /**
   * Wraps a function with error handling
   * Useful for event handlers and callbacks
   */
  wrap<T extends (...args: unknown[]) => unknown>(
    fn: T,
    context?: Record<string, unknown>
  ): T {
    return ((...args: unknown[]) => {
      try {
        const result = fn(...args);
        // Handle async functions
        if (result instanceof Promise) {
          return result.catch((error) => {
            this.handle(error, context);
            throw error;
          });
        }
        return result;
      } catch (error) {
        this.handle(error, context);
        throw error;
      }
    }) as T;
  },

  /**
   * Wraps an async function with error handling
   * Returns undefined on error instead of throwing
   */
  wrapAsync<T extends (...args: unknown[]) => Promise<unknown>>(
    fn: T,
    context?: Record<string, unknown>
  ): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>> | undefined> {
    return async (...args: Parameters<T>) => {
      try {
        return await fn(...args);
      } catch (error) {
        await this.handle(error, context);
        return undefined;
      }
    };
  }
};

/**
 * Convenience function for handling errors
 */
export function handleError(error: unknown, context?: Record<string, unknown>): Promise<void> {
  return errorHandler.handle(error, context);
}

/**
 * Convenience function for wrapping async operations
 */
export async function safeAsync<T>(
  operation: () => Promise<T>,
  fallbackValue: T,
  context?: Record<string, unknown>
): Promise<T> {
  return errorHandler.handleAsync(operation, fallbackValue, context);
}

