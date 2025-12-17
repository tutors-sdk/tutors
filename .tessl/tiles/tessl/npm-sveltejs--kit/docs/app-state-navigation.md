# App State and Navigation

SvelteKit provides reactive app state and navigation utilities for managing page state, handling navigation events, and programmatically controlling client-side routing.

## Capabilities

### Page State

Reactive page state object containing current page information.

```typescript { .api }
/**
 * Reactive page state object (Svelte 5 runes)
 */
declare const page: Page;

interface Page<Params = Record<string, string>> {
  /** The URL of the current page */
  url: URL;
  /** Route parameters extracted from the URL */
  params: Params;
  /** Route information */
  route: { id: string };
  /** HTTP status code of the current page */
  status: number;
  /** Error object if page is in error state */
  error: App.Error | null;
  /** Merged data from all load functions */
  data: App.PageData;
  /** Page state for shallow routing */
  state: App.PageState;
  /** Form action result */
  form: any;
}
```

### Navigation State

Information about in-progress navigation.

```typescript { .api }
/**
 * Navigation state object
 */
declare const navigating: Navigation | null;

interface Navigation {
  /** Where navigation started from */
  from: NavigationTarget | null;
  /** Where navigation is going to */
  to: NavigationTarget | null;
  /** Type of navigation */
  type: 'form' | 'leave' | 'link' | 'goto' | 'popstate';
  /** Whether navigation will unload the page */
  willUnload: boolean;
  /** Steps for back/forward navigation */
  delta?: number;
  /** Promise that resolves when navigation completes */
  complete: Promise<void>;
}

interface NavigationTarget<Params = Record<string, string>> {
  /** Target route parameters */
  params: Params | null;
  /** Target route information */
  route: { id: string | null };
  /** Target URL */
  url: URL;
}
```

### Navigation Functions

Programmatic navigation and page management.

```typescript { .api }
/**
 * Navigate programmatically to a given route
 * @param url - Where to navigate to
 * @param options - Navigation options
 * @returns Promise that resolves when navigation completes
 */
function goto(url: string | URL, options?: {
  replaceState?: boolean;
  noScroll?: boolean;
  keepFocus?: boolean;
  invalidateAll?: boolean;
  invalidate?: (string | URL | ((url: URL) => boolean))[];
  state?: App.PageState;
}): Promise<void>;

/**
 * Invalidate specific load functions
 * @param resource - URL or identifier to invalidate
 * @returns Promise that resolves when invalidation completes
 */
function invalidate(resource: string | URL | ((url: URL) => boolean)): Promise<void>;

/**
 * Invalidate all load functions on the current page
 * @returns Promise that resolves when invalidation completes
 */
function invalidateAll(): Promise<void>;

/**
 * Preload data for a given page
 * @param href - Page to preload
 * @returns Promise with preload result
 */
function preloadData(href: string): Promise<{ type: 'loaded'; status: number; data: any } | { type: 'redirect'; location: string }>;

/**
 * Preload code modules for routes
 * @param pathname - Route pattern to preload
 * @returns Promise that resolves when modules are loaded
 */
function preloadCode(pathname: string): Promise<void>;

/**
 * Create a new history entry with page state
 * @param url - URL for the new entry
 * @param state - State object for shallow routing
 */
function pushState(url: string | URL, state: App.PageState): void;

/**
 * Replace current history entry with new state
 * @param url - URL for the current entry
 * @param state - State object for shallow routing
 */
function replaceState(url: string | URL, state: App.PageState): void;
```

### Navigation Lifecycle

Hook into navigation events for custom behavior.

```typescript { .api }
/**
 * Run callback before navigation starts
 * @param callback - Function to run before navigation
 */
function beforeNavigate(callback: (navigation: BeforeNavigate) => void): void;

/**
 * Run callback after navigation completes
 * @param callback - Function to run after navigation
 */
function afterNavigate(callback: (navigation: AfterNavigate) => void): void;

/**
 * Run callback immediately before navigation (for animations)
 * @param callback - Function to run during navigation
 * @returns Optional cleanup function
 */
function onNavigate(callback: (navigation: OnNavigate) => Promise<(() => void) | void> | (() => void) | void): void;

interface BeforeNavigate extends Navigation {
  /** Call to prevent navigation */
  cancel: () => void;
}

interface AfterNavigate extends Navigation {
  /** Type excludes 'leave' as it never completes */
  type: 'enter' | 'form' | 'link' | 'goto' | 'popstate';
  willUnload: false;
}

interface OnNavigate extends Navigation {
  /** Type excludes 'enter' and 'leave' */
  type: 'form' | 'link' | 'goto' | 'popstate';
  willUnload: false;
}
```

## Usage Patterns

### Basic Page State Access

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import { page } from '$app/state';
  
  // Reactive access to page state
  $: currentPath = page.url.pathname;
  $: isHomePage = currentPath === '/';
  $: pageTitle = page.data.title || 'Default Title';
</script>

<nav>
  <a href="/" class:active={isHomePage}>Home</a>
  <a href="/about" class:active={currentPath === '/about'}>About</a>
  <a href="/blog" class:active={currentPath.startsWith('/blog')}>Blog</a>
</nav>

<main>
  <h1>{pageTitle}</h1>
  <slot />
</main>

<style>
  .active {
    font-weight: bold;
    color: blue;
  }
</style>
```

### Navigation State and Loading

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import { navigating } from '$app/state';
  
  // Show loading indicator during navigation
  $: isLoading = navigating !== null;
</script>

{#if isLoading}
  <div class="loading-bar">
    Navigating to {navigating.to?.url.pathname}...
  </div>
{/if}

<slot />

<style>
  .loading-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: blue;
    color: white;
    padding: 0.5rem;
    text-align: center;
    z-index: 1000;
  }
</style>
```

### Programmatic Navigation

```svelte
<!-- src/routes/login/+page.svelte -->
<script>
  import { goto, invalidateAll } from '$app/navigation';
  import { page } from '$app/state';
  
  async function handleLogin(event) {
    const formData = new FormData(event.target);
    const response = await fetch('/api/login', {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      // Invalidate all data and redirect
      await invalidateAll();
      
      // Redirect to intended page or dashboard
      const redirectTo = page.url.searchParams.get('redirectTo') || '/dashboard';
      await goto(redirectTo);
    }
  }
  
  function handleCancel() {
    // Go back without scroll/focus changes
    goto('/', { 
      replaceState: true,
      noScroll: true,
      keepFocus: true 
    });
  }
</script>

<form on:submit|preventDefault={handleLogin}>
  <input name="email" type="email" required />
  <input name="password" type="password" required />
  <button type="submit">Login</button>
  <button type="button" on:click={handleCancel}>Cancel</button>
</form>
```

### Navigation Lifecycle Hooks

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import { beforeNavigate, afterNavigate, onNavigate } from '$app/navigation';
  import { page } from '$app/state';
  
  let isUnsavedChanges = false;
  
  // Prevent navigation if there are unsaved changes
  beforeNavigate(({ to, cancel }) => {
    if (isUnsavedChanges && to?.url.pathname !== page.url.pathname) {
      if (!confirm('You have unsaved changes. Are you sure you want to leave?')) {
        cancel();
      }
    }
  });
  
  // Log navigation for analytics
  afterNavigate(({ from, to, type }) => {
    console.log(`Navigated from ${from?.url.pathname} to ${to?.url.pathname} via ${type}`);
    
    // Send to analytics
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: to?.url.pathname
      });
    }
  });
  
  // Handle page transitions
  onNavigate((navigation) => {
    if (!document.startViewTransition) return;
    
    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>
```

### Shallow Routing with State

```svelte
<!-- src/routes/gallery/+page.svelte -->
<script>
  import { pushState, replaceState } from '$app/navigation';
  import { page } from '$app/state';
  
  export let data;
  
  let selectedImage = null;
  
  // Restore state from page.state
  $: if (page.state.selectedImage && !selectedImage) {
    selectedImage = page.state.selectedImage;
  }
  
  function selectImage(image) {
    selectedImage = image;
    
    // Update URL and state without full navigation
    pushState(`/gallery?image=${image.id}`, {
      selectedImage: image
    });
  }
  
  function closeModal() {
    selectedImage = null;
    
    // Go back to gallery without image parameter
    replaceState('/gallery', {});
  }
</script>

<div class="gallery">
  {#each data.images as image}
    <img 
      src={image.thumbnail}
      alt={image.alt}
      on:click={() => selectImage(image)}
    />
  {/each}
</div>

{#if selectedImage}
  <div class="modal" on:click={closeModal}>
    <img src={selectedImage.fullsize} alt={selectedImage.alt} />
  </div>
{/if}
```

### Data Invalidation

```svelte
<!-- src/routes/admin/posts/+page.svelte -->
<script>
  import { invalidate, invalidateAll } from '$app/navigation';
  import { page } from '$app/state';
  
  export let data;
  
  async function deletePost(postId) {
    const response = await fetch(`/api/posts/${postId}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      // Invalidate specific dependency
      await invalidate('posts:list');
      
      // Or invalidate all data on the page
      // await invalidateAll();
    }
  }
  
  async function refreshData() {
    // Invalidate based on URL pattern
    await invalidate((url) => url.pathname.startsWith('/api/posts'));
  }
  
  // Auto-refresh every 30 seconds
  let interval;
  onMount(() => {
    interval = setInterval(() => {
      invalidate('posts:list');
    }, 30000);
  });
  
  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<button on:click={refreshData}>Refresh</button>

{#each data.posts as post}
  <article>
    <h2>{post.title}</h2>
    <p>{post.excerpt}</p>
    <button on:click={() => deletePost(post.id)}>Delete</button>
  </article>
{/each}
```

### Preloading

```svelte
<!-- src/routes/blog/+page.svelte -->
<script>
  import { preloadData, preloadCode } from '$app/navigation';
  
  export let data;
  
  function handleMouseEnter(href) {
    // Preload data when user hovers over link
    preloadData(href);
  }
  
  function preloadBlogRoutes() {
    // Preload code for blog routes
    preloadCode('/blog/*');
  }
</script>

<div class="posts">
  {#each data.posts as post}
    <article>
      <h2>
        <a 
          href="/blog/{post.slug}"
          on:mouseenter={() => handleMouseEnter(`/blog/${post.slug}`)}
        >
          {post.title}
        </a>
      </h2>
      <p>{post.excerpt}</p>
    </article>
  {/each}
</div>

<button on:click={preloadBlogRoutes}>
  Preload Blog Routes
</button>
```

### Error Handling with Navigation

```svelte
<!-- src/routes/+error.svelte -->
<script>
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  
  function goHome() {
    goto('/', { replaceState: true });
  }
  
  function goBack() {
    history.back();
  }
  
  function retry() {
    // Retry by reloading current page
    goto(page.url, { invalidateAll: true });
  }
</script>

<div class="error-page">
  <h1>Error {page.status}</h1>
  <p>{page.error?.message || 'An error occurred'}</p>
  
  <div class="actions">
    <button on:click={retry}>Try Again</button>
    <button on:click={goBack}>Go Back</button>
    <button on:click={goHome}>Go Home</button>
  </div>
</div>
```

### Legacy Store Support (Svelte 4)

```svelte
<!-- For Svelte 4 compatibility -->
<script>
  import { page, navigating } from '$app/stores';
  
  // Use as stores with $ prefix
  $: currentPath = $page.url.pathname;
  $: isLoading = $navigating !== null;
</script>

<div class:loading={isLoading}>
  Current page: {currentPath}
</div>
```

## Best Practices

1. **Use reactive statements**: Leverage Svelte's reactivity with page state
2. **Handle navigation errors**: Always handle potential navigation failures
3. **Prevent unwanted navigation**: Use `beforeNavigate` to prevent data loss
4. **Optimize preloading**: Preload data on hover or based on user behavior
5. **Manage state carefully**: Use shallow routing for temporary UI state
6. **Clean up**: Remove event listeners and intervals in component cleanup
7. **Handle loading states**: Show appropriate loading indicators during navigation
8. **Accessibility**: Ensure navigation changes are announced to screen readers
9. **Performance**: Use invalidation strategically to avoid unnecessary data fetching
10. **Analytics**: Track navigation events for user behavior insights