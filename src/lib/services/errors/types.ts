/**
 * Error handling types and interfaces
 */

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface ErrorContext {
  [key: string]: unknown;
}

export interface ErrorDetails {
  code: string;
  message: string;
  severity: ErrorSeverity;
  context?: ErrorContext;
  timestamp: Date;
  stack?: string;
}

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  dismissible?: boolean;
}

export interface RetryOptions {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  shouldRetry?: (error: Error, attempt: number) => boolean;
}

export interface ErrorHandlerOptions {
  logToConsole?: boolean;
  logToRemote?: boolean;
  showToast?: boolean;
  remoteLogger?: (error: ErrorDetails) => Promise<void>;
}

export interface RuneWithState<T> {
  value: T;
  loading: boolean;
  error: Error | null;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  reset: () => void;
}

