# Error Handling System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  (Components, Pages, Services)                               │
└────────────┬────────────────────────────────┬────────────────┘
             │                                │
             │ Throws errors                  │ Uses utilities
             │                                │
             ▼                                ▼
┌────────────────────────┐        ┌──────────────────────────┐
│   Custom Error Types   │        │   Network Utilities      │
│  - TutorsError         │        │  - fetchWithRetry        │
│  - NetworkError        │        │  - fetchJsonWithRetry    │
│  - CourseError         │        │  - Health checks         │
│  - AuthError           │        └──────────┬───────────────┘
│  - AnalyticsError      │                   │
│  - MarkdownError       │                   │ Uses
│  - ValidationError     │                   │
└────────────┬───────────┘                   │
             │                               │
             │ Caught by                     │
             │                               │
             ▼                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Error Handler                              │
│  - Processes all errors                                      │
│  - Logs to console (dev) / remote (prod)                     │
│  - Shows user notifications                                  │
│  - Provides function wrappers                                │
└────────────┬───────────────────────────────┬────────────────┘
             │                               │
             │ Logs                          │ Notifies
             │                               │
             ▼                               ▼
┌──────────────────────┐        ┌──────────────────────────┐
│  Logging Targets     │        │   Toast Service          │
│  - Console (dev)     │        │  - Success messages      │
│  - Sentry (prod)     │        │  - Error messages        │
│  - Custom endpoint   │        │  - Warning messages      │
└──────────────────────┘        │  - Info messages         │
                                └──────────┬───────────────┘
                                           │
                                           │ Renders
                                           │
                                           ▼
                                ┌──────────────────────────┐
                                │   ToastContainer         │
                                │   (UI Component)         │
                                └──────────────────────────┘
```

## Error Flow

### 1. Error Creation
```typescript
// Service throws structured error
throw new CourseError(
  'Course not found',
  'COURSE_NOT_FOUND',
  { courseId: 'my-course' }
);
```

### 2. Error Propagation
```typescript
// Error bubbles up to caller
try {
  await courseService.readCourse(id);
} catch (error) {
  // Error caught at appropriate level
}
```

### 3. Error Handling
```typescript
// Error processed by handler
await handleError(error, { context: 'loadCourse' });
```

### 4. User Notification
```typescript
// Toast shown to user
toastService.error('Failed to load course');
```

### 5. Error Logging
```typescript
// Error logged for debugging
console.error('[COURSE_NOT_FOUND] Course not found');
// or sent to Sentry in production
```

## State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  Component                                   │
│                                                              │
│  const courseRune = runeWithState<Course | null>(null)      │
│                                                              │
│  {#if courseRune.loading}                                   │
│    <Loading />                                              │
│  {:else if courseRune.error}                                │
│    <Error error={courseRune.error} />                       │
│  {:else if courseRune.value}                                │
│    <Content course={courseRune.value} />                    │
│  {/if}                                                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Calls
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              withStateManagement()                           │
│                                                              │
│  1. Set loading = true                                      │
│  2. Execute async operation                                 │
│  3. On success: set value, clear error                      │
│  4. On failure: set error, keep old value                   │
│  5. Set loading = false                                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Returns
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   RuneWithState                              │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │  value   │  │ loading  │  │  error   │                  │
│  │  Course  │  │  false   │  │  null    │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

## Network Retry Flow

```
┌─────────────────────────────────────────────────────────────┐
│                fetchWithRetry(url, options)                  │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
    ┌────────────────┐
    │  Attempt 1     │
    └────────┬───────┘
             │
       ┌─────▼─────┐
       │ Success?  │
       └─────┬─────┘
             │
        No   │   Yes
      ┌──────┴──────┐
      │             │
      ▼             ▼
┌───────────┐   ┌─────────┐
│ Should    │   │ Return  │
│ Retry?    │   │ Response│
└─────┬─────┘   └─────────┘
      │
 Yes  │   No
┌─────┴─────┐
│           │
▼           ▼
┌────────┐  ┌─────────┐
│ Wait   │  │ Throw   │
│ delay  │  │ Error   │
└────┬───┘  └─────────┘
     │
     ▼
┌────────────────┐
│  Attempt 2     │
│ (delay * 2)    │
└────────┬───────┘
         │
         ▼
    (repeat until max retries)
```

## Component Integration

### Error Boundary Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                      Page/Route                              │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              ErrorBoundary                            │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │           Component Tree                        │ │  │
│  │  │                                                 │ │  │
│  │  │  Error thrown here                             │ │  │
│  │  │        │                                        │ │  │
│  │  │        ▼                                        │ │  │
│  │  │  Caught by ErrorBoundary                       │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  │                                                       │  │
│  │  Shows fallback UI instead of crashing               │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Service Layer Integration

### Before Error Handling System

```typescript
// ❌ Problematic patterns
async function readCourse(id: string) {
  try {
    const response = await fetch(`https://${id}.netlify.app/tutors.json`);
    const course = await response.json();
    return course;
  } catch (error) {
    console.log('Error:', error); // Lost in console
    return null; // Silent failure
  }
}
```

### After Error Handling System

```typescript
// ✅ Improved patterns
async function readCourse(id: string): Promise<Course> {
  try {
    return await fetchJsonWithRetry<Course>(
      `https://${id}.netlify.app/tutors.json`,
      {},
      { maxRetries: 3 }
    );
  } catch (error) {
    if (error instanceof NetworkError && error.statusCode === 404) {
      throw new CourseError(
        'Course not found',
        'COURSE_NOT_FOUND',
        { courseId: id }
      );
    }
    throw error; // Proper error propagation
  }
}
```

## Error Severity Levels

```
┌─────────────┬──────────────────┬─────────────────┬───────────────┐
│   Severity  │   Toast Type     │   Logging       │   Examples    │
├─────────────┼──────────────────┼─────────────────┼───────────────┤
│   info      │   Blue info      │   Console only  │   Tips,       │
│             │   toast          │   (dev)         │   suggestions │
├─────────────┼──────────────────┼─────────────────┼───────────────┤
│   warning   │   Yellow         │   Console +     │   Analytics   │
│             │   warning toast  │   optional      │   failures,   │
│             │                  │   remote        │   degraded    │
│             │                  │                 │   features    │
├─────────────┼──────────────────┼─────────────────┼───────────────┤
│   error     │   Red error      │   Console +     │   Network     │
│             │   toast          │   remote        │   failures,   │
│             │                  │   (prod)        │   missing     │
│             │                  │                 │   resources   │
├─────────────┼──────────────────┼─────────────────┼───────────────┤
│   critical  │   Red error      │   Console +     │   Auth        │
│             │   toast +        │   remote +      │   failures,   │
│             │   persistent     │   alert         │   data        │
│             │                  │                 │   corruption  │
└─────────────┴──────────────────┴─────────────────┴───────────────┘
```

## Type Hierarchy

```
Error (native)
  │
  └── TutorsError
        │
        ├── NetworkError
        │     └── Used for: fetch failures, HTTP errors, timeouts
        │
        ├── CourseError
        │     └── Used for: course loading, topic/lab/LO not found
        │
        ├── AuthError
        │     └── Used for: authentication, authorization failures
        │
        ├── AnalyticsError
        │     └── Used for: tracking failures (non-critical)
        │
        ├── MarkdownError
        │     └── Used for: content parsing, rendering issues
        │
        └── ValidationError
              └── Used for: form validation, data integrity
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      User Action                             │
│               (Click, Navigate, Submit)                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Component Handler                          │
│            (Wrapped with errorHandler.wrap)                  │
└────────────┬───────────────────────────────┬────────────────┘
             │                               │
             │ Success                       │ Error
             │                               │
             ▼                               ▼
┌──────────────────────┐        ┌──────────────────────────┐
│   Update UI          │        │   Error Handler          │
│   Show success       │        │   - Log error            │
│   toast              │        │   - Show error toast     │
└──────────────────────┘        │   - Track error          │
                                └──────────┬───────────────┘
                                           │
                                           ▼
                                ┌──────────────────────────┐
                                │   User sees:             │
                                │   - Error message        │
                                │   - Retry option         │
                                │   - Fallback UI          │
                                └──────────────────────────┘
```

## Configuration Layers

```
┌─────────────────────────────────────────────────────────────┐
│               Application Bootstrap                          │
│                                                              │
│  errorHandler.configure({                                   │
│    logToConsole: dev,                                       │
│    logToRemote: prod,                                       │
│    showToast: true,                                         │
│    remoteLogger: sentryLogger                               │
│  })                                                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Service Level                              │
│                                                              │
│  const courseService = {                                    │
│    async readCourse() {                                     │
│      try {                                                  │
│        return await fetchWithRetry(url, {}, {               │
│          maxRetries: 3,                                     │
│          initialDelay: 1000                                 │
│        })                                                   │
│      } catch (error) {                                      │
│        throw new CourseError(...)                           │
│      }                                                      │
│    }                                                        │
│  }                                                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Component Level                             │
│                                                              │
│  const courseRune = runeWithState<Course | null>(null)      │
│                                                              │
│  await withStateManagement(courseRune, async () => {        │
│    return await courseService.readCourse(id)                │
│  })                                                         │
└─────────────────────────────────────────────────────────────┘
```

## Key Design Principles

### 1. **Fail Fast, Fail Loud**
- Errors are immediately caught and reported
- No silent failures
- Clear error messages

### 2. **User First**
- User-friendly error messages
- Automatic retries for transient failures
- Clear loading states

### 3. **Developer Friendly**
- Type-safe error handling
- Rich context for debugging
- Consistent patterns

### 4. **Progressive Enhancement**
- Works with existing code
- Can be adopted incrementally
- No breaking changes

### 5. **Separation of Concerns**
- Error creation (services)
- Error handling (error handler)
- Error presentation (components)

## Performance Considerations

### Minimal Overhead
- Error objects are lightweight
- Retry logic only activates on failure
- Toast rendering is optimized

### Memory Management
- Toasts auto-dismiss
- Old errors are garbage collected
- No memory leaks

### Network Efficiency
- Smart retry strategies
- Exponential backoff
- Cancel-able requests

## Security Considerations

### Error Messages
- User-friendly messages (no technical details)
- Full details only in logs
- No sensitive data in error context

### Error Logging
- Sanitize before sending to remote
- PII protection
- Configurable log levels

## Testing Strategy

### Unit Tests
```typescript
describe('CourseError', () => {
  it('should create error with context', () => {
    const error = new CourseError('Not found', 'COURSE_NOT_FOUND', { id: '123' });
    expect(error.code).toBe('COURSE_NOT_FOUND');
    expect(error.context?.id).toBe('123');
  });
});
```

### Integration Tests
```typescript
describe('fetchWithRetry', () => {
  it('should retry on 500 error', async () => {
    // Mock fetch to fail twice then succeed
    // Assert retry count
  });
});
```

### E2E Tests
```typescript
test('shows error toast on course load failure', async () => {
  // Navigate to course page
  // Mock network failure
  // Assert toast is shown
  // Assert error message is correct
});
```

## Monitoring and Observability

### Metrics to Track
- Error rate by type
- Retry success rate
- Average time to recovery
- User-facing errors vs system errors

### Dashboards
- Error trends over time
- Most common error codes
- Error distribution by severity
- Geographic error patterns

### Alerts
- Critical error spikes
- Repeated failures
- Service degradation
- Unusual error patterns

