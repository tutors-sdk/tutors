<script lang="ts">
  import { 
    toastService, 
    CourseError, 
    NetworkError,
    ValidationError,
    runeWithState,
    withStateManagement,
    fetchJsonWithRetry,
    handleError,
    errorHandler
  } from '$lib/services/errors';
  import ErrorBoundary from '$lib/ui/components/ErrorBoundary.svelte';
  
  // State management demo
  const dataRune = runeWithState<string | null>(null);
  
  // Toast demos
  function showSuccessToast() {
    toastService.success('Operation completed successfully! 🎉');
  }
  
  function showErrorToast() {
    toastService.error('Something went wrong. Please try again.');
  }
  
  function showWarningToast() {
    toastService.warning('This action may have side effects.');
  }
  
  function showInfoToast() {
    toastService.info('Did you know? You can dismiss these by clicking the X.');
  }
  
  // Error type demos
  async function throwCourseError() {
    try {
      throw new CourseError(
        'Demo course not found',
        'COURSE_NOT_FOUND',
        { courseId: 'demo-course-123' }
      );
    } catch (error) {
      await handleError(error, { context: 'courseErrorDemo' });
    }
  }
  
  async function throwNetworkError() {
    try {
      throw new NetworkError(
        'Failed to connect to server',
        { statusCode: 500, url: 'https://demo.tutors.dev' }
      );
    } catch (error) {
      await handleError(error, { context: 'networkErrorDemo' });
    }
  }
  
  async function throwValidationError() {
    try {
      throw new ValidationError(
        'Email must be valid',
        { field: 'email', value: 'invalid-email' }
      );
    } catch (error) {
      await handleError(error, { context: 'validationErrorDemo' });
    }
  }
  
  // State management demo
  async function simulateDataLoad() {
    await withStateManagement(dataRune, async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      return 'Data loaded successfully!';
    });
  }
  
  async function simulateDataLoadError() {
    await withStateManagement(dataRune, async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      throw new Error('Failed to load data from server');
    });
  }
  
  // Network retry demo
  async function testNetworkRetry() {
    toastService.info('Testing network retry with exponential backoff...');
    try {
      // This will fail and retry
      await fetchJsonWithRetry(
        'https://httpstat.us/500', // Always returns 500
        {},
        { maxRetries: 3, initialDelay: 500 }
      );
    } catch (error) {
      await handleError(error, { context: 'retryDemo' });
    }
  }
  
  // Wrapped function demo
  const safeOperation = errorHandler.wrap(
    async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      throw new Error('This error is caught by the wrapper!');
    },
    { context: 'wrappedFunction' }
  );
  
  let errorBoundaryKey = $state(0);
  let shouldThrowInBoundary = $state(false);
  
  function triggerErrorBoundary() {
    shouldThrowInBoundary = true;
    errorBoundaryKey++; // Force re-render
  }
  
  function resetErrorBoundary() {
    shouldThrowInBoundary = false;
    errorBoundaryKey++;
  }
</script>

<div class="container mx-auto max-w-5xl p-6">
  <div class="mb-8">
    <h1 class="text-4xl font-bold mb-2">Error Handling System Demo</h1>
    <p class="text-gray-600 dark:text-gray-400">
      Test all the error handling features of the Tutors platform
    </p>
  </div>

  <!-- Toast Notifications -->
  <section class="mb-8 rounded-lg border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
    <h2 class="text-2xl font-bold mb-4">🔔 Toast Notifications</h2>
    <p class="mb-4 text-gray-600 dark:text-gray-400">
      Click any button to see different types of toast notifications
    </p>
    <div class="flex flex-wrap gap-3">
      <button
        onclick={showSuccessToast}
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
      >
        Success Toast
      </button>
      <button
        onclick={showErrorToast}
        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Error Toast
      </button>
      <button
        onclick={showWarningToast}
        class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
      >
        Warning Toast
      </button>
      <button
        onclick={showInfoToast}
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Info Toast
      </button>
    </div>
  </section>

  <!-- Error Types -->
  <section class="mb-8 rounded-lg border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
    <h2 class="text-2xl font-bold mb-4">🎯 Custom Error Types</h2>
    <p class="mb-4 text-gray-600 dark:text-gray-400">
      Test different error types with proper context and user messages
    </p>
    <div class="flex flex-wrap gap-3">
      <button
        onclick={throwCourseError}
        class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
      >
        Throw CourseError
      </button>
      <button
        onclick={throwNetworkError}
        class="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
      >
        Throw NetworkError
      </button>
      <button
        onclick={throwValidationError}
        class="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition"
      >
        Throw ValidationError
      </button>
      <button
        onclick={safeOperation}
        class="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
      >
        Wrapped Function
      </button>
    </div>
  </section>

  <!-- State Management -->
  <section class="mb-8 rounded-lg border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
    <h2 class="text-2xl font-bold mb-4">📊 State Management (runeWithState)</h2>
    <p class="mb-4 text-gray-600 dark:text-gray-400">
      Automatic loading and error state management for async operations
    </p>
    <div class="flex flex-wrap gap-3 mb-4">
      <button
        onclick={simulateDataLoad}
        disabled={dataRune.loading}
        class="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition disabled:opacity-50"
      >
        Load Data (Success)
      </button>
      <button
        onclick={simulateDataLoadError}
        disabled={dataRune.loading}
        class="px-4 py-2 bg-rose-500 text-white rounded hover:bg-rose-600 transition disabled:opacity-50"
      >
        Load Data (Error)
      </button>
      <button
        onclick={() => dataRune.reset()}
        class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
      >
        Reset State
      </button>
    </div>
    
    <!-- State Display -->
    <div class="rounded bg-gray-100 dark:bg-gray-900 p-4 font-mono text-sm">
      {#if dataRune.loading}
        <div class="flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          Loading...
        </div>
      {:else if dataRune.error}
        <div class="text-red-600 dark:text-red-400">
          ❌ Error: {dataRune.error.message}
        </div>
      {:else if dataRune.value}
        <div class="text-green-600 dark:text-green-400">
          ✅ {dataRune.value}
        </div>
      {:else}
        <div class="text-gray-500">
          No data loaded yet. Click a button above to test.
        </div>
      {/if}
    </div>
  </section>

  <!-- Network Retry -->
  <section class="mb-8 rounded-lg border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
    <h2 class="text-2xl font-bold mb-4">🔄 Network Retry with Exponential Backoff</h2>
    <p class="mb-4 text-gray-600 dark:text-gray-400">
      Automatic retry on network failures with exponential backoff (500ms → 1s → 2s)
    </p>
    <button
      onclick={testNetworkRetry}
      class="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition"
    >
      Test Network Retry
    </button>
    <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
      Check the browser console to see retry attempts and delays
    </p>
  </section>

  <!-- Error Boundary -->
  <section class="mb-8 rounded-lg border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
    <h2 class="text-2xl font-bold mb-4">🛡️ Error Boundary</h2>
    <p class="mb-4 text-gray-600 dark:text-gray-400">
      Catches component errors and shows fallback UI instead of crashing
    </p>
    <div class="flex gap-3 mb-4">
      <button
        onclick={triggerErrorBoundary}
        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Trigger Error in Component
      </button>
      <button
        onclick={resetErrorBoundary}
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
      >
        Reset Error Boundary
      </button>
    </div>
    
    <ErrorBoundary key={errorBoundaryKey}>
      {#snippet children()}
        <div class="rounded bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4">
          {#if shouldThrowInBoundary}
            {(() => { throw new Error('Component error caught by ErrorBoundary!') })()}
          {:else}
            <p class="text-green-800 dark:text-green-200">
              ✅ Component is working normally. Click "Trigger Error" to test the error boundary.
            </p>
          {/if}
        </div>
      {/snippet}
    </ErrorBoundary>
  </section>

  <!-- Documentation -->
  <section class="rounded-lg border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
    <h2 class="text-2xl font-bold mb-4">📚 Documentation</h2>
    <p class="mb-4 text-gray-600 dark:text-gray-400">
      Learn more about the error handling system
    </p>
    <ul class="space-y-2">
      <li>
        <a 
          href="https://github.com/tutors-sdk/tutors/blob/feature/error-handling-system/ERROR_HANDLING_IMPLEMENTATION.md"
          target="_blank"
          class="text-blue-600 dark:text-blue-400 hover:underline"
        >
          📖 Implementation Guide
        </a>
      </li>
      <li>
        <a 
          href="https://github.com/tutors-sdk/tutors/blob/feature/error-handling-system/src/lib/services/errors/README.md"
          target="_blank"
          class="text-blue-600 dark:text-blue-400 hover:underline"
        >
          📘 API Documentation
        </a>
      </li>
      <li>
        <a 
          href="https://github.com/tutors-sdk/tutors/blob/feature/error-handling-system/src/lib/services/errors/EXAMPLES.md"
          target="_blank"
          class="text-blue-600 dark:text-blue-400 hover:underline"
        >
          💡 Usage Examples
        </a>
      </li>
      <li>
        <a 
          href="https://github.com/tutors-sdk/tutors/blob/feature/error-handling-system/src/lib/services/errors/ARCHITECTURE.md"
          target="_blank"
          class="text-blue-600 dark:text-blue-400 hover:underline"
        >
          🏗️ Architecture Diagrams
        </a>
      </li>
    </ul>
  </section>

  <!-- Open Console Reminder -->
  <div class="mt-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4">
    <p class="text-blue-800 dark:text-blue-200">
      💡 <strong>Tip:</strong> Open the browser console (F12) to see detailed error logs with context, stack traces, and timing information.
    </p>
  </div>
</div>

