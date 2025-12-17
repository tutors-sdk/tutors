# App State

Reactive state management for SvelteKit applications using Svelte 5 runes, providing reactive access to page data, navigation state, and update notifications.

## Capabilities

### Page State

Reactive access to current page information using Svelte 5 runes.

```typescript { .api }
/**
 * Reactive page state containing current route information and data
 * Compatible with Svelte 5 runes - automatically updates components
 */
const page: {
  url: URL;
  params: Record<string, string>;
  route: { id: string };
  status: number;
  error: App.Error | null;
  data: App.PageData;
  state: App.PageState;
  form: any;
};
```

**Usage Examples:**

```svelte
<script>
  import { page } from '$app/state';
  
  // Reactive derived values using Svelte 5 runes
  const isHomePage = $derived(page.url.pathname === '/');
  const userId = $derived(page.params.id);
  const isLoading = $derived(page.status === 202);
</script>

<!-- Automatically updates when page changes -->
<h1>Current page: {page.url.pathname}</h1>

{#if isHomePage}
  <p>Welcome to the home page!</p>
{/if}

{#if userId}
  <p>Viewing user: {userId}</p>
{/if}

{#if page.error}
  <div class="error">Error: {page.error.message}</div>
{/if}
```

### Navigation State

Reactive access to current navigation state.

```typescript { .api }
/**
 * Reactive navigation state showing current navigation if in progress
 * null when no navigation is happening
 */
const navigating: Navigation | null;
```

**Usage Examples:**

```svelte
<script>
  import { navigating } from '$app/state';
  
  // Show loading indicator during navigation
  const isNavigating = $derived(navigating !== null);
  const navigationType = $derived(navigating?.type);
</script>

{#if isNavigating}
  <div class="loading-bar">
    Navigating via {navigationType}...
    <div class="progress" />
  </div>
{/if}

<!-- Style based on navigation state -->
<main class:loading={isNavigating}>
  <slot />
</main>

<style>
  .loading-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--primary-color);
    z-index: 1000;
    animation: pulse 1s infinite;
  }
  
  .loading {
    opacity: 0.7;
    pointer-events: none;
  }
</style>
```

### Update State

Reactive access to application update availability.

```typescript { .api }
/**
 * Reactive update checker for detecting new app versions
 * Contains methods to check for and apply updates
 */
const updated: {
  current: boolean;
  check: () => Promise<boolean>;
};
```

**Usage Examples:**

```svelte
<script>
  import { updated } from '$app/state';
  
  // Check for updates periodically
  $effect(() => {
    const interval = setInterval(() => {
      updated.check();
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  });
  
  const hasUpdate = $derived(!updated.current);
</script>

{#if hasUpdate}
  <div class="update-banner">
    <p>A new version is available!</p>
    <button onclick={() => location.reload()}>
      Update Now
    </button>
  </div>
{/if}
```

## Types

```typescript { .api }
interface Page<Params = Record<string, string>> {
  url: URL;
  params: Params;
  route: { id: string };
  status: number;
  error: App.Error | null;
  data: App.PageData;
  state: App.PageState;
  form: any;
}

interface Navigation {
  from: NavigationTarget | null;
  to: NavigationTarget | null;
  type: 'form' | 'leave' | 'link' | 'goto' | 'popstate';
  willUnload: boolean;
  delta?: number;
  complete: Promise<void>;
}

interface NavigationTarget {
  params: Record<string, string>;
  route: { id: string };
  url: URL;
}

interface UpdateChecker {
  current: boolean;
  check: () => Promise<boolean>;
}
```

## Migration from Stores

The `$app/state` module replaces the older `$app/stores` module for Svelte 5 applications:

```typescript
// Old approach with stores (Svelte 4)
import { page, navigating, updated } from '$app/stores';

$: currentPath = $page.url.pathname;
$: isLoading = $navigating !== null;

// New approach with state (Svelte 5)
import { page, navigating } from '$app/state';

const currentPath = $derived(page.url.pathname);
const isLoading = $derived(navigating !== null);
```

## Best Practices

1. **Runes compatibility**: Use `$derived` for computed values based on state
2. **Effect management**: Clean up intervals and subscriptions in `$effect`
3. **Conditional rendering**: Use reactive values in template conditions
4. **Performance**: Avoid unnecessary computations by using `$derived`
5. **Update handling**: Implement graceful update notifications for users
6. **Loading states**: Show appropriate feedback during navigation
7. **Error boundaries**: Handle page errors gracefully in components
8. **State persistence**: Consider persisting important state across navigations