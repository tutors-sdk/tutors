<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import { errorHandler } from '$lib/services/errors/error-handler';

  interface Props {
    children: Snippet;
    fallback?: Snippet<[Error]>;
    onError?: (error: Error) => void;
    context?: Record<string, unknown>;
  }

  let { children, fallback, onError, context }: Props = $props();

  let error = $state<Error | null>(null);
  let errorInfo = $state<string>('');

  // In Svelte 5, we don't have a built-in error boundary like React
  // But we can catch errors during mount and wrap async operations
  onMount(() => {
    // Set up global error handler for unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      handleError(event.reason);
      event.preventDefault();
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  });

  function handleError(err: unknown) {
    const errorObj = err instanceof Error ? err : new Error(String(err));
    error = errorObj;
    errorInfo = errorObj.stack || '';

    // Log to error handler
    errorHandler.handle(errorObj, context);

    // Call custom error handler if provided
    if (onError) {
      onError(errorObj);
    }
  }

  function resetError() {
    error = null;
    errorInfo = '';
  }
</script>

{#if error}
  {#if fallback}
    {@render fallback(error)}
  {:else}
    <!-- Default error UI -->
    <div class="mx-auto max-w-2xl rounded-lg border border-red-300 bg-red-50 p-6 dark:border-red-700 dark:bg-red-900/20">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <span class="text-2xl" aria-hidden="true">⚠️</span>
        </div>
        <div class="ml-3 flex-1">
          <h3 class="text-lg font-medium text-red-800 dark:text-red-200">
            Something went wrong
          </h3>
          <div class="mt-2 text-sm text-red-700 dark:text-red-300">
            <p>{error.message}</p>
          </div>
          {#if import.meta.env.DEV && errorInfo}
            <details class="mt-4">
              <summary class="cursor-pointer text-sm font-medium text-red-800 dark:text-red-200">
                Error details (dev only)
              </summary>
              <pre class="mt-2 overflow-auto rounded bg-red-100 p-2 text-xs text-red-900 dark:bg-red-950 dark:text-red-100">{errorInfo}</pre>
            </details>
          {/if}
          <div class="mt-4">
            <button
              onclick={resetError}
              class="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-700 dark:hover:bg-red-600"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
{:else}
  {@render children()}
{/if}

