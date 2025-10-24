# Error Handling Examples

Real-world examples of using the error handling system in Tutors.

## Example 1: Course Loading Page

```svelte
<!-- src/routes/course/[courseid]/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { runeWithState, withStateManagement, CourseError } from '$lib/services/errors';
  import { courseService } from '$lib/services/course';
  import type { Course } from '@tutors/tutors-model-lib';
  
  let { data } = $props();
  
  const courseRune = runeWithState<Course | null>(null);
  
  onMount(async () => {
    await withStateManagement(courseRune, async () => {
      try {
        return await courseService.readCourse(data.courseId, fetch);
      } catch (error) {
        if (error instanceof CourseError && error.code === 'COURSE_NOT_FOUND') {
          // Handle 404 specially
          console.log('Course not found, redirecting to 404 page');
        }
        throw error; // Re-throw to be caught by withStateManagement
      }
    });
  });
</script>

{#if courseRune.loading}
  <div class="flex items-center justify-center p-8">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    <p class="ml-4 text-lg">Loading course...</p>
  </div>
{:else if courseRune.error}
  <div class="max-w-2xl mx-auto p-6">
    <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
      <h2 class="text-xl font-bold text-red-800 dark:text-red-200 mb-2">
        Failed to Load Course
      </h2>
      <p class="text-red-700 dark:text-red-300">
        {courseRune.error.message}
      </p>
      <button 
        onclick={() => window.location.reload()}
        class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Try Again
      </button>
    </div>
  </div>
{:else if courseRune.value}
  <CourseView course={courseRune.value} />
{/if}
```

## Example 2: Analytics Service with Error Recovery

```typescript
// src/lib/services/community/services/analytics-improved.svelte.ts
import { AnalyticsError, handleError, safeAsync } from '$lib/services/errors';
import type { Course, Lo } from '@tutors/tutors-model-lib';
import type { TutorsId } from '$lib/services/connect';

export const analyticsService = {
  /**
   * Records a learning event - non-critical, silent failure
   */
  learningEvent(course: Course, params: Record<string, string>, lo: Lo, student: TutorsId) {
    // Wrap in safeAsync to prevent analytics errors from breaking the app
    safeAsync(
      async () => {
        await this.reportPageLoad(course, lo, student);
      },
      undefined,
      { context: 'learningEvent', courseId: course.courseId, loId: lo.id }
    );
  },

  /**
   * Records a page load - may throw on critical errors
   */
  async reportPageLoad(course: Course, lo: Lo, student: TutorsId) {
    try {
      await storeStudentCourseLearningObjectInSupabase(course, lo.route, lo, student);
    } catch (error) {
      // Analytics failure is non-critical
      throw new AnalyticsError(
        'Failed to log page view',
        { courseId: course.courseId, loId: lo.id, userId: student.login }
      );
    }
  },

  /**
   * Updates page count with automatic error handling
   */
  updatePageCount(course: Course, lo: Lo, student: TutorsId) {
    // Fire-and-forget with automatic error handling
    safeAsync(
      async () => {
        if (student && lo.route) {
          await updateLearningRecordsDuration(course.courseId, student.login, lo.route);
          await updateCalendarDuration(formatDate(new Date()), student.login, course.courseId);
        }
      },
      undefined,
      { context: 'updatePageCount', silent: true }
    );
  }
};
```

## Example 3: Form Submission with Validation

```svelte
<!-- src/routes/profile/+page.svelte -->
<script lang="ts">
  import { ValidationError, errorHandler, toastService } from '$lib/services/errors';
  
  let email = $state('');
  let name = $state('');
  let submitting = $state(false);
  let error = $state<string | null>(null);
  
  function validateForm() {
    if (!name.trim()) {
      throw new ValidationError('Name is required', { field: 'name' });
    }
    
    if (!email.includes('@')) {
      throw new ValidationError('Invalid email format', { field: 'email' });
    }
  }
  
  const handleSubmit = errorHandler.wrap(
    async () => {
      error = null;
      submitting = true;
      
      try {
        // Validate
        validateForm();
        
        // Submit
        await updateProfile({ name, email });
        
        // Success
        toastService.success('Profile updated successfully!');
      } finally {
        submitting = false;
      }
    },
    { context: 'profileUpdate' }
  );
</script>

<form onsubmit|preventDefault={handleSubmit}>
  <div>
    <label for="name">Name</label>
    <input 
      id="name" 
      type="text" 
      bind:value={name}
      disabled={submitting}
    />
  </div>
  
  <div>
    <label for="email">Email</label>
    <input 
      id="email" 
      type="email" 
      bind:value={email}
      disabled={submitting}
    />
  </div>
  
  {#if error}
    <p class="text-red-600">{error}</p>
  {/if}
  
  <button type="submit" disabled={submitting}>
    {submitting ? 'Saving...' : 'Save Profile'}
  </button>
</form>
```

## Example 4: Multiple Parallel Course Loads

```typescript
// src/lib/services/course/bulk-loader.ts
import { fetchMultipleWithRetry, CourseError } from '$lib/services/errors';
import type { Course } from '@tutors/tutors-model-lib';

export async function loadMultipleCourses(courseIds: string[]) {
  const requests = courseIds.map(id => ({
    url: `https://${id}.netlify.app/tutors.json`,
    init: { method: 'GET' }
  }));
  
  const results = await fetchMultipleWithRetry<Course>(requests, {
    maxRetries: 2,
    initialDelay: 500
  });
  
  // Separate successes and failures
  const loaded: Course[] = [];
  const failed: Array<{ courseId: string; error: Error }> = [];
  
  results.forEach(({ data, error, url }, index) => {
    const courseId = courseIds[index];
    
    if (error) {
      failed.push({ courseId, error });
      console.error(`Failed to load ${courseId}:`, error);
    } else if (data) {
      loaded.push(data);
    }
  });
  
  return { loaded, failed };
}

// Usage
const { loaded, failed } = await loadMultipleCourses([
  'course-1',
  'course-2',
  'course-3'
]);

console.log(`Loaded ${loaded.length} courses`);
if (failed.length > 0) {
  console.warn(`Failed to load ${failed.length} courses`);
}
```

## Example 5: Protected Route with Auth Error

```typescript
// src/routes/admin/+page.ts
import { AuthError } from '$lib/services/errors';
import { tutorsId } from '$lib/runes.svelte';
import { redirect } from '@sveltejs/kit';

export async function load() {
  // Check authentication
  if (!tutorsId.value?.login) {
    throw new AuthError(
      'Authentication required to access this page',
      'AUTH_REQUIRED'
    );
  }
  
  // Check authorization
  if (!isAdmin(tutorsId.value)) {
    throw new AuthError(
      'You do not have permission to access this page',
      'UNAUTHORIZED',
      { userId: tutorsId.value.login }
    );
  }
  
  return {
    user: tutorsId.value
  };
}
```

## Example 6: Markdown Rendering with Error Recovery

```typescript
// src/lib/services/markdown/markdown-improved.svelte.ts
import { MarkdownError, handleError } from '$lib/services/errors';
import type { Course, Lab, Note } from '@tutors/tutors-model-lib';

export const markdownService = {
  /**
   * Converts lab markdown with error handling
   */
  convertLabToHtml(course: Course, lab: Lab, refreshOnly: boolean = false) {
    try {
      lab.summary = convertMdToHtml(lab.summary, currentCodeTheme.value);
      
      const url = lab.route.replace(`/lab/${course.courseId}`, course.courseUrl);
      
      lab?.los?.forEach((step, index) => {
        try {
          if (course.courseUrl && !refreshOnly) {
            step.contentMd = filter(step.contentMd, url);
          }
          step.contentHtml = convertMdToHtml(step.contentMd, currentCodeTheme.value);
          step.parentLo = lab;
          step.type = "step";
        } catch (error) {
          // Log error but continue with other steps
          handleError(
            new MarkdownError(
              `Failed to convert step ${index} markdown`,
              { labId: lab.id, stepIndex: index, error: String(error) }
            ),
            { context: 'convertLabToHtml' }
          );
          
          // Set fallback content
          step.contentHtml = `<p>Error rendering step content</p>`;
        }
      });
      
    } catch (error) {
      throw new MarkdownError(
        'Failed to convert lab markdown',
        { labId: lab.id, error: String(error) }
      );
    }
  }
};
```

## Example 7: Health Check Before Course Load

```typescript
// src/lib/services/course/health-check.ts
import { checkUrlHealth, NetworkError } from '$lib/services/errors';

export async function validateCourseUrl(courseUrl: string): Promise<boolean> {
  const health = await checkUrlHealth(
    `https://${courseUrl}/tutors.json`,
    5000
  );
  
  if (!health.healthy) {
    console.warn(`Course URL ${courseUrl} is not healthy:`, health.error);
    return false;
  }
  
  return true;
}

// Usage in course service
async function getOrLoadCourse(courseId: string) {
  const courseUrl = `${courseId}.netlify.app`;
  
  // Quick health check before attempting full load
  const isHealthy = await validateCourseUrl(courseUrl);
  if (!isHealthy) {
    throw new NetworkError(
      'Course server is not responding',
      { url: courseUrl }
    );
  }
  
  // Proceed with course load
  // ...
}
```

## Example 8: Global Error Configuration

```typescript
// src/hooks.client.ts
import { errorHandler } from '$lib/services/errors';
import { browser } from '$app/environment';

if (browser) {
  // Configure error handler on client side
  errorHandler.configure({
    logToConsole: import.meta.env.DEV,
    logToRemote: import.meta.env.PROD,
    showToast: true,
    remoteLogger: async (errorDetails) => {
      // Example: Send to Sentry
      // Sentry.captureException(errorDetails);
      
      // Or custom endpoint
      if (import.meta.env.PROD) {
        await fetch('/api/errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(errorDetails)
        });
      }
    }
  });
  
  // Global error handler for uncaught errors
  window.addEventListener('error', (event) => {
    errorHandler.handle(event.error, {
      context: 'globalErrorHandler',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });
  
  // Global promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    errorHandler.handle(event.reason, {
      context: 'unhandledPromiseRejection'
    });
  });
}
```

## Example 9: Testing Error Scenarios

```typescript
// src/lib/services/course/__tests__/course.test.ts
import { describe, it, expect, vi } from 'vitest';
import { courseServiceImproved } from '../services/course-improved.svelte';
import { CourseError, NetworkError } from '$lib/services/errors';

describe('Course Service Error Handling', () => {
  it('should throw CourseError when course not found', async () => {
    const mockFetch = vi.fn().mockRejectedValue(
      new NetworkError('Not found', { statusCode: 404 })
    );
    
    await expect(
      courseServiceImproved.getOrLoadCourse('nonexistent', mockFetch)
    ).rejects.toThrow(CourseError);
    
    await expect(
      courseServiceImproved.getOrLoadCourse('nonexistent', mockFetch)
    ).rejects.toMatchObject({
      code: 'COURSE_NOT_FOUND'
    });
  });
  
  it('should retry on server error', async () => {
    const mockFetch = vi.fn()
      .mockRejectedValueOnce(new NetworkError('Server error', { statusCode: 500 }))
      .mockRejectedValueOnce(new NetworkError('Server error', { statusCode: 500 }))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'test-course' })
      });
    
    const course = await courseServiceImproved.getOrLoadCourse('test', mockFetch);
    
    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(course.id).toBe('test-course');
  });
  
  it('should handle malformed response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => { throw new Error('Invalid JSON'); }
    });
    
    await expect(
      courseServiceImproved.getOrLoadCourse('test', mockFetch)
    ).rejects.toThrow(NetworkError);
  });
});
```

## Key Takeaways

1. **Always use specific error types** - Makes debugging and handling easier
2. **Add context to errors** - Include relevant IDs, URLs, and state
3. **Use `safeAsync` for non-critical operations** - Prevents crashes from analytics, logging, etc.
4. **Implement loading/error states with `runeWithState`** - Better UX
5. **Configure retry logic appropriately** - Don't retry 4xx errors
6. **Test error scenarios** - Ensure your error handling works as expected
7. **Show user-friendly messages** - Use toast notifications
8. **Log detailed errors in dev, report them in prod** - Balance debugging with privacy

