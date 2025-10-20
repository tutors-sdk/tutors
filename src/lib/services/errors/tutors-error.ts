/**
 * Custom error classes for Tutors application
 * Provides structured error handling with codes, context, and severity levels
 */

import type { ErrorContext, ErrorSeverity } from './types';

/**
 * Base error class for all Tutors-specific errors
 */
export class TutorsError extends Error {
  public readonly code: string;
  public readonly severity: ErrorSeverity;
  public readonly context?: ErrorContext;
  public readonly timestamp: Date;

  constructor(
    message: string,
    code: string,
    severity: ErrorSeverity = 'error',
    context?: ErrorContext
  ) {
    super(message);
    this.name = 'TutorsError';
    this.code = code;
    this.severity = severity;
    this.context = context;
    this.timestamp = new Date();

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TutorsError);
    }
  }

  /**
   * Returns a user-friendly error message
   */
  getUserMessage(): string {
    return this.message;
  }

  /**
   * Returns a detailed error message for logging
   */
  getDetailedMessage(): string {
    const contextStr = this.context ? JSON.stringify(this.context, null, 2) : 'None';
    return `[${this.code}] ${this.message}\nContext: ${contextStr}\nTimestamp: ${this.timestamp.toISOString()}`;
  }
}

/**
 * Network-related errors (fetch failures, timeouts, etc.)
 */
export class NetworkError extends TutorsError {
  public readonly statusCode?: number;
  public readonly url?: string;

  constructor(
    message: string,
    context?: ErrorContext & { statusCode?: number; url?: string }
  ) {
    super(message, 'NETWORK_ERROR', 'error', context);
    this.name = 'NetworkError';
    this.statusCode = context?.statusCode;
    this.url = context?.url;
  }

  getUserMessage(): string {
    if (this.statusCode === 404) {
      return 'The requested resource was not found.';
    }
    if (this.statusCode && this.statusCode >= 500) {
      return 'Server error. Please try again later.';
    }
    return 'Network error occurred. Please check your connection.';
  }
}

/**
 * Course loading and parsing errors
 */
export class CourseError extends TutorsError {
  public readonly courseId?: string;

  constructor(
    message: string,
    code: string,
    context?: ErrorContext & { courseId?: string }
  ) {
    super(message, code, 'error', context);
    this.name = 'CourseError';
    this.courseId = context?.courseId;
  }

  getUserMessage(): string {
    switch (this.code) {
      case 'COURSE_NOT_FOUND':
        return `Course "${this.courseId || 'unknown'}" not found. Please check the URL.`;
      case 'COURSE_LOAD_FAILED':
        return 'Failed to load course content. Please try again.';
      case 'TOPIC_NOT_FOUND':
        return 'The requested topic could not be found.';
      case 'LAB_NOT_FOUND':
        return 'The requested lab could not be found.';
      default:
        return this.message;
    }
  }
}

/**
 * Authentication and authorization errors
 */
export class AuthError extends TutorsError {
  constructor(message: string, code: string, context?: ErrorContext) {
    super(message, code, 'warning', context);
    this.name = 'AuthError';
  }

  getUserMessage(): string {
    switch (this.code) {
      case 'AUTH_REQUIRED':
        return 'Please sign in to access this content.';
      case 'AUTH_FAILED':
        return 'Authentication failed. Please try again.';
      case 'UNAUTHORIZED':
        return 'You do not have permission to access this content.';
      case 'SESSION_EXPIRED':
        return 'Your session has expired. Please sign in again.';
      default:
        return this.message;
    }
  }
}

/**
 * Analytics and tracking errors (non-critical)
 */
export class AnalyticsError extends TutorsError {
  constructor(message: string, context?: ErrorContext) {
    super(message, 'ANALYTICS_ERROR', 'warning', context);
    this.name = 'AnalyticsError';
  }

  getUserMessage(): string {
    // Analytics errors are usually silent for users
    return 'An error occurred while tracking your progress.';
  }
}

/**
 * Markdown parsing and rendering errors
 */
export class MarkdownError extends TutorsError {
  constructor(message: string, context?: ErrorContext) {
    super(message, 'MARKDOWN_ERROR', 'warning', context);
    this.name = 'MarkdownError';
  }

  getUserMessage(): string {
    return 'Failed to render content. Some formatting may be missing.';
  }
}

/**
 * Validation errors for user input or data integrity
 */
export class ValidationError extends TutorsError {
  public readonly field?: string;

  constructor(
    message: string,
    context?: ErrorContext & { field?: string }
  ) {
    super(message, 'VALIDATION_ERROR', 'warning', context);
    this.name = 'ValidationError';
    this.field = context?.field;
  }

  getUserMessage(): string {
    if (this.field) {
      return `Invalid value for ${this.field}: ${this.message}`;
    }
    return this.message;
  }
}

/**
 * Utility function to check if an error is a TutorsError
 */
export function isTutorsError(error: unknown): error is TutorsError {
  return error instanceof TutorsError;
}

/**
 * Utility function to convert unknown errors to TutorsError
 */
export function toTutorsError(error: unknown): TutorsError {
  if (isTutorsError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new TutorsError(
      error.message,
      'UNKNOWN_ERROR',
      'error',
      { originalError: error.name, stack: error.stack }
    );
  }

  if (typeof error === 'string') {
    return new TutorsError(error, 'UNKNOWN_ERROR');
  }

  return new TutorsError(
    'An unknown error occurred',
    'UNKNOWN_ERROR',
    'error',
    { error: String(error) }
  );
}

