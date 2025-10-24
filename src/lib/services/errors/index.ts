/**
 * Error handling system for Tutors
 *
 * This module provides a comprehensive error handling infrastructure including:
 * - Custom error classes with codes and context
 * - Centralized error handler with logging and notifications
 * - Toast notification system
 * - Network utilities with retry logic
 * - Enhanced state management with loading/error tracking
 *
 * @example Basic usage
 * ```typescript
 * import { CourseError, handleError } from '$lib/services/errors';
 *
 * try {
 *   const course = await fetchCourse(courseId);
 * } catch (error) {
 *   throw new CourseError('Course not found', 'COURSE_NOT_FOUND', { courseId });
 * }
 * ```
 *
 * @example With state management
 * ```typescript
 * import { runeWithState, withStateManagement } from '$lib/services/errors';
 *
 * const courseRune = runeWithState<Course | null>(null);
 *
 * await withStateManagement(courseRune, async () => {
 *   return await fetchCourse(courseId);
 * });
 *
 * // Access state properties
 * if (courseRune.loading) // show loading spinner
 * if (courseRune.error) // show error message
 * if (courseRune.value) // show course content
 * ```
 *
 * @example With network utilities
 * ```typescript
 * import { fetchJsonWithRetry } from '$lib/services/errors';
 *
 * const course = await fetchJsonWithRetry<Course>(
 *   'https://example.com/course.json',
 *   { method: 'GET' },
 *   { maxRetries: 3 }
 * );
 * ```
 */

// Error classes
export { TutorsError, NetworkError, CourseError, AuthError, AnalyticsError, MarkdownError, ValidationError, isTutorsError, toTutorsError } from "./tutors-error";

// Error handler
export { errorHandler, handleError, safeAsync } from "./error-handler";

// Toast notifications
export { toastService } from "./toast.svelte";

// Network utilities
export { fetchWithRetry, fetchJsonWithRetry, fetchMultipleWithRetry, checkUrlHealth, createTimeoutController } from "./network-utils";

// State management
export { runeWithState, withStateManagement, combineLoading, combineErrors, isSuccess, hasData } from "./rune-with-state.svelte";

// Types
export type { ErrorSeverity, ErrorContext, ErrorDetails, ToastNotification, RetryOptions, ErrorHandlerOptions, RuneWithState } from "./types";
