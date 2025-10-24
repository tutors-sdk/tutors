# Error Handling System

A comprehensive error handling infrastructure for the Tutors application providing structured errors, automatic retry logic, toast notifications, and state management.

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Custom Error Types](#custom-error-types)
- [Error Handler](#error-handler)
- [Toast Notifications](#toast-notifications)
- [Network Utilities](#network-utilities)
- [State Management](#state-management)
- [Components](#components)
- [Migration Guide](#migration-guide)
- [Best Practices](#best-practices)

## Features

✅ **Custom Error Types** - Structured errors with codes, severity, and context  
✅ **Centralized Error Handling** - Consistent logging and user notifications  
✅ **Toast Notifications** - User-friendly error messages  
✅ **Automatic Retry Logic** - Network requests with exponential backoff  
✅ **State Management** - Runes with built-in loading/error states  
✅ **Error Boundaries** - Graceful component failure handling  
✅ **TypeScript Support** - Full type safety throughout  

## Quick Start

### 1. Basic Error Handling

```typescript
import { CourseError, handleError } from '$lib/services/errors';

try {
  const course = await fetchCourse(courseId);
  if (!course) {
    throw new CourseError('Course not found', 'COURSE_NOT_FOUND', { courseId });
  }
} catch (error) {
  // Centralized error handling - logs and shows toast
  await handleError(error, { context: 'loadCourse' });
}
```

### 2. Network Requests with Retry

```typescript
import { fetchJsonWithRetry } from '$lib/services/errors';

const course = await fetchJsonWithRetry<Course>(
  'https://example.netlify.app/tutors.json',
  { method: 'GET' },
  { 
    maxRetries: 3,
    initialDelay: 1000 
  }
);
```

### 3. State Management with Loading/Error States

```typescript
import { runeWithState, withStateManagement } from '$lib/services/errors';

const courseRune = runeWithState<Course | null>(null);

await withStateManagement(courseRune, async () => {
  return await fetchCourse(courseId);
});

// In your component
{#if courseRune.loading}
  <p>Loading...</p>
{:else if courseRune.error}
  <p>Error: {courseRune.error.message}</p>
{:else if courseRune.value}
  <CourseView course={courseRune.value} />
{/if}
```

### 4. Toast Notifications

```typescript
import { toastService } from '$lib/services/errors';

// Show success message
toastService.success('Course loaded successfully!');

// Show error message
toastService.error('Failed to load course');

// Show warning
toastService.warning('Some content may be outdated');

// Show info
toastService.info('New features available');
```

## Custom Error Types

### Available Error Classes

#### `TutorsError` - Base Error Class
Base class for all Tutors-specific errors.

```typescript
throw new TutorsError(
  'Something went wrong',
  'ERROR_CODE',
  'error', // severity: 'info' | 'warning' | 'error' | 'critical'
  { customContext: 'data' }
);
```

#### `NetworkError` - Network Failures
For fetch failures, timeouts, and HTTP errors.

```typescript
throw new NetworkError(
  'Failed to fetch course',
  { statusCode: 500, url: 'https://...' }
);
```

#### `CourseError` - Course Loading Issues
For course, topic, lab, and learning object errors.

```typescript
throw new CourseError(
  'Topic not found',
  'TOPIC_NOT_FOUND',
  { courseId, topicId }
);
```

Error codes:
- `COURSE_NOT_FOUND`
- `COURSE_LOAD_FAILED`
- `TOPIC_NOT_FOUND`
- `LAB_NOT_FOUND`
- `LO_NOT_FOUND`

#### `AuthError` - Authentication Issues
For auth and authorization failures.

```typescript
throw new AuthError(
  'Session expired',
  'SESSION_EXPIRED'
);
```

Error codes:
- `AUTH_REQUIRED`
- `AUTH_FAILED`
- `UNAUTHORIZED`
- `SESSION_EXPIRED`

#### `AnalyticsError` - Tracking Failures
For non-critical analytics errors (usually silent).

```typescript
throw new AnalyticsError(
  'Failed to log event',
  { event: 'page_view' }
);
```

#### `MarkdownError` - Content Rendering Issues
For markdown parsing and rendering errors.

```typescript
throw new MarkdownError(
  'Failed to parse markdown',
  { content: '...' }
);
```

#### `ValidationError` - Data Validation
For input validation failures.

```typescript
throw new ValidationError(
  'Invalid email format',
  { field: 'email' }
);
```

### Error Utilities

```typescript
import { isTutorsError, toTutorsError } from '$lib/services/errors';

// Check if error is a TutorsError
if (isTutorsError(error)) {
  console.log(error.code);
}

// Convert unknown error to TutorsError
const tutorsError = toTutorsError(unknownError);
```

## Error Handler

### Configuration

```typescript
import { errorHandler } from '$lib/services/errors';

// Configure globally (e.g., in hooks.server.ts)
errorHandler.configure({
  logToConsole: true,
  logToRemote: true,
  showToast: true,
  remoteLogger: async (errorDetails) => {
    // Send to Sentry, LogRocket, etc.
    await sendToSentry(errorDetails);
  }
});
```

### Usage

```typescript
// Basic error handling
await errorHandler.handle(error, { context: 'userAction' });

// Async operation with fallback
const result = await errorHandler.handleAsync(
  async () => await riskyOperation(),
  fallbackValue,
  { context: 'riskyOp' }
);

// Wrap function with error handling
const safeFunction = errorHandler.wrap(
  async () => await fetchData(),
  { context: 'fetchData' }
);
```

## Network Utilities

### Fetch with Retry

```typescript
import { fetchWithRetry } from '$lib/services/errors';

const response = await fetchWithRetry(
  'https://api.example.com/data',
  { 
    method: 'POST',
    body: JSON.stringify(data)
  },
  {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
    shouldRetry: (error, attempt) => {
      // Custom retry logic
      return attempt < 3 && error instanceof NetworkError;
    }
  }
);
```

### Fetch JSON with Retry

```typescript
import { fetchJsonWithRetry } from '$lib/services/errors';

const data = await fetchJsonWithRetry<MyType>(
  'https://api.example.com/data.json'
);
```

### Multiple Parallel Requests

```typescript
import { fetchMultipleWithRetry } from '$lib/services/errors';

const results = await fetchMultipleWithRetry<Course>([
  { url: 'https://course1.netlify.app/tutors.json' },
  { url: 'https://course2.netlify.app/tutors.json' },
  { url: 'https://course3.netlify.app/tutors.json' }
]);

results.forEach(({ data, error, url }) => {
  if (error) {
    console.error(`Failed to fetch ${url}:`, error);
  } else {
    console.log(`Successfully fetched ${url}:`, data);
  }
});
```

### Health Check

```typescript
import { checkUrlHealth } from '$lib/services/errors';

const health = await checkUrlHealth(
  'https://api.example.com/health',
  5000 // timeout in ms
);

if (health.healthy) {
  console.log('API is healthy');
} else {
  console.error('API is down:', health.error);
}
```

## State Management

### Create Rune with State

```typescript
import { runeWithState } from '$lib/services/errors';

const courseRune = runeWithState<Course | null>(null);

// Access state
console.log(courseRune.value);    // Current value
console.log(courseRune.loading);  // Loading state
console.log(courseRune.error);    // Error state

// Update state
courseRune.value = newCourse;
courseRune.setLoading(true);
courseRune.setError(new Error('Failed'));
courseRune.reset(); // Reset to initial state
```

### Automatic State Management

```typescript
import { runeWithState, withStateManagement } from '$lib/services/errors';

const courseRune = runeWithState<Course | null>(null);

// Automatically handles loading/error states
await withStateManagement(courseRune, async () => {
  return await fetchCourse(courseId);
});

// courseRune.loading is now false
// courseRune.error is set if operation failed
// courseRune.value is set if operation succeeded
```

### Combine Multiple Runes

```typescript
import { combineLoading, combineErrors, isSuccess } from '$lib/services/errors';

const course1 = runeWithState<Course | null>(null);
const course2 = runeWithState<Course | null>(null);

// Check if any rune is loading
const anyLoading = combineLoading(course1, course2);

// Get all errors
const allErrors = combineErrors(course1, course2);

// Check if rune is successful
if (isSuccess(course1)) {
  console.log('Course 1 loaded successfully');
}
```

## Components

### ToastContainer

Already added to the root layout. Displays all toast notifications.

### ErrorBoundary

Wrap components to catch and handle errors gracefully.

```svelte
<script>
  import ErrorBoundary from '$lib/ui/components/ErrorBoundary.svelte';
  
  function handleError(error: Error) {
    console.log('Component error:', error);
  }
</script>

<ErrorBoundary onError={handleError} context={{ page: 'course-view' }}>
  {#snippet children()}
    <CourseContent />
  {/snippet}
  
  {#snippet fallback(error)}
    <div class="error-fallback">
      <h2>Oops! Something went wrong</h2>
      <p>{error.message}</p>
      <button onclick={() => window.location.reload()}>
        Reload Page
      </button>
    </div>
  {/snippet}
</ErrorBoundary>
```

## Migration Guide

### Step 1: Update Existing Services

Replace `console.log` and `console.error` with proper error handling:

**Before:**
```typescript
try {
  const response = await fetch(url);
  const data = await response.json();
  return data;
} catch (error) {
  console.error('Failed to fetch:', error);
  return null;
}
```

**After:**
```typescript
import { fetchJsonWithRetry, CourseError } from '$lib/services/errors';

try {
  return await fetchJsonWithRetry<Course>(url);
} catch (error) {
  throw new CourseError(
    'Failed to load course',
    'COURSE_LOAD_FAILED',
    { url }
  );
}
```

### Step 2: Remove Non-Null Assertions

**Before:**
```typescript
const topic = course.topicIndex.get(topicId);
return topic!; // Unsafe!
```

**After:**
```typescript
const topic = course.topicIndex.get(topicId);
if (!topic) {
  throw new CourseError('Topic not found', 'TOPIC_NOT_FOUND', { topicId });
}
return topic;
```

### Step 3: Add State Management

**Before:**
```typescript
let course = $state<Course | null>(null);

async function loadCourse() {
  course = await fetchCourse(id);
}
```

**After:**
```typescript
import { runeWithState, withStateManagement } from '$lib/services/errors';

const courseRune = runeWithState<Course | null>(null);

async function loadCourse() {
  await withStateManagement(courseRune, async () => {
    return await fetchCourse(id);
  });
}
```

### Step 4: Wrap User Actions

```typescript
import { errorHandler } from '$lib/services/errors';

// Wrap event handlers
const handleSubmit = errorHandler.wrap(
  async () => {
    await submitForm();
  },
  { context: 'formSubmit' }
);
```

## Best Practices

### 1. Use Specific Error Types

```typescript
// ❌ Bad
throw new Error('Not found');

// ✅ Good
throw new CourseError('Course not found', 'COURSE_NOT_FOUND', { courseId });
```

### 2. Add Context

```typescript
// ❌ Bad
throw new CourseError('Failed to load');

// ✅ Good
throw new CourseError(
  'Failed to load course',
  'COURSE_LOAD_FAILED',
  { courseId, userId, timestamp: Date.now() }
);
```

### 3. Choose Appropriate Severity

```typescript
// Analytics failure - non-critical
throw new AnalyticsError('Failed to track event'); // severity: 'warning'

// Course not loading - critical for user
throw new CourseError('Course not found', 'COURSE_NOT_FOUND'); // severity: 'error'
```

### 4. Don't Swallow Errors

```typescript
// ❌ Bad
try {
  await riskyOperation();
} catch (error) {
  // Silent failure
}

// ✅ Good
try {
  await riskyOperation();
} catch (error) {
  await handleError(error, { context: 'riskyOperation' });
  // Or re-throw if caller should handle
  throw error;
}
```

### 5. Use State Management for UI

```typescript
// ❌ Bad - Manual state management
let loading = $state(false);
let error = $state<Error | null>(null);
let data = $state<Course | null>(null);

async function load() {
  loading = true;
  try {
    data = await fetchCourse();
    error = null;
  } catch (e) {
    error = e;
  } finally {
    loading = false;
  }
}

// ✅ Good - Use runeWithState
const courseRune = runeWithState<Course | null>(null);
await withStateManagement(courseRune, () => fetchCourse());
```

### 6. Retry Strategically

```typescript
// Retry network failures and server errors
await fetchWithRetry(url, {}, {
  shouldRetry: (error, attempt) => {
    if (error instanceof NetworkError) {
      // Don't retry 404s
      if (error.statusCode === 404) return false;
      // Retry server errors
      if (error.statusCode && error.statusCode >= 500) return true;
    }
    return attempt < 3;
  }
});
```

## Examples

See `course-improved.svelte.ts` for a complete example of refactoring an existing service to use the error handling system.

## Future Enhancements

- [ ] Integration with Sentry or similar error tracking
- [ ] Error analytics dashboard
- [ ] Offline error queue
- [ ] Custom error recovery strategies
- [ ] i18n support for error messages

