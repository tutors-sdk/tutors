# Load Functions

SvelteKit load functions provide a way to fetch data for pages and layouts on both server and client. They run before a page is rendered and can run on the server during SSR or on the client during navigation.

## Capabilities

### Universal Load Functions

Universal load functions run on both server and client and have access to a `LoadEvent`.

```typescript { .api }
/**
 * Universal load function that runs on both server and client
 * @param event - LoadEvent containing params, url, fetch, and other utilities
 * @returns Data object or promise of data object for the page/layout
 */
type Load<
  Params = Record<string, string>,
  InputData = Record<string, any> | null,
  ParentData = Record<string, any>,
  OutputData = Record<string, any> | void
> = (event: LoadEvent<Params, InputData, ParentData>) => Promise<OutputData> | OutputData;

interface LoadEvent<
  Params = Record<string, string>,
  Data = Record<string, any> | null,
  ParentData = Record<string, any>
> {
  /** Route parameters extracted from the URL */
  params: Params;
  /** The current URL */
  url: URL;
  /** Route information */
  route: { id: string };
  /** Enhanced fetch function with server-side benefits */
  fetch: typeof fetch;
  /** Data from the corresponding .server.js file (if any) */
  data: Data;
  /** Access to parent layout data */
  parent: () => Promise<ParentData>;
  /** Declare dependencies for cache invalidation */
  depends: (...deps: string[]) => void;
  /** Set response headers (server-side only) */
  setHeaders: (headers: Record<string, string>) => void;
  /** Opt out of dependency tracking */
  untrack: <T>(fn: () => T) => T;
}
```

**Usage Examples:**

```typescript
// src/routes/blog/[slug]/+page.js
export async function load({ params, fetch, depends }) {
  // Declare dependencies for cache invalidation
  depends('blog:post');
  
  const response = await fetch(`/api/posts/${params.slug}`);
  
  if (!response.ok) {
    throw error(404, 'Post not found');
  }
  
  const post = await response.json();
  
  return {
    post,
    meta: {
      title: post.title,
      description: post.excerpt
    }
  };
}
```

### Server Load Functions

Server load functions run only on the server and have access to additional server-only features like cookies and platform.

```typescript { .api }
/**
 * Server load function that runs only on the server
 * @param event - ServerLoadEvent extending RequestEvent with load-specific utilities
 * @returns Data object or promise of data object for the page/layout
 */
type ServerLoad<
  Params = Record<string, string>,
  ParentData = Record<string, any>,
  OutputData = Record<string, any> | void
> = (event: ServerLoadEvent<Params, ParentData>) => Promise<OutputData> | OutputData;

interface ServerLoadEvent<
  Params = Record<string, string>,
  ParentData = Record<string, any>
> extends RequestEvent<Params> {
  /** Access to parent layout data */
  parent: () => Promise<ParentData>;
  /** Declare dependencies for cache invalidation */
  depends: (...deps: string[]) => void;
}
```

**Usage Examples:**

```typescript
// src/routes/dashboard/+page.server.js
import { redirect } from '@sveltejs/kit';

export async function load({ locals, cookies, url }) {
  // Check authentication
  if (!locals.user) {
    throw redirect(303, '/login');
  }
  
  // Server-side database access
  const projects = await db.projects.findMany({
    where: { userId: locals.user.id }
  });
  
  // Set cache headers
  setHeaders({
    'Cache-Control': 'private, max-age=300'
  });
  
  return {
    user: locals.user,
    projects,
    preferences: JSON.parse(cookies.get('preferences') || '{}')
  };
}
```

## Load Function Patterns

### Basic Page Load

```typescript
// src/routes/products/[id]/+page.js
export async function load({ params, fetch }) {
  const [productRes, reviewsRes] = await Promise.all([
    fetch(`/api/products/${params.id}`),
    fetch(`/api/products/${params.id}/reviews`)
  ]);
  
  if (!productRes.ok) {
    throw error(404, 'Product not found');
  }
  
  const product = await productRes.json();
  const reviews = reviewsRes.ok ? await reviewsRes.json() : [];
  
  return {
    product,
    reviews
  };
}
```

### Layout Load with Parent Data

```typescript
// src/routes/admin/+layout.server.js
export async function load({ locals, depends }) {
  // Ensure admin access
  if (!locals.user?.isAdmin) {
    throw redirect(303, '/');
  }
  
  depends('admin:stats');
  
  const stats = await getAdminStats();
  
  return {
    adminUser: locals.user,
    stats
  };
}

// src/routes/admin/users/+page.js
export async function load({ parent, fetch }) {
  const { adminUser } = await parent();
  
  const users = await fetch('/api/admin/users').then(r => r.json());
  
  return {
    users,
    canManageUsers: adminUser.permissions.includes('manage_users')
  };
}
```

### Conditional Loading

```typescript
// src/routes/search/+page.js
export async function load({ url, fetch, depends }) {
  const query = url.searchParams.get('q');
  
  if (!query) {
    return { results: [], query: '' };
  }
  
  depends(`search:${query}`);
  
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  const results = await response.json();
  
  return {
    results,
    query
  };
}
```

### Error Handling in Load Functions

```typescript
// src/routes/posts/[slug]/+page.server.js
export async function load({ params, fetch }) {
  try {
    const response = await fetch(`/api/posts/${params.slug}`);
    
    if (response.status === 404) {
      throw error(404, {
        message: 'Post not found',
        slug: params.slug
      });
    }
    
    if (!response.ok) {
      throw error(500, 'Failed to load post');
    }
    
    const post = await response.json();
    
    // Check if post is published
    if (!post.published && !locals.user?.isAdmin) {
      throw error(403, 'Post not published');
    }
    
    return { post };
  } catch (err) {
    if (err.status) throw err; // Re-throw SvelteKit errors
    
    console.error('Load error:', err);
    throw error(500, 'Internal server error');
  }
}
```

### Streaming and Parallel Loading

```typescript
// src/routes/dashboard/+layout.server.js
export async function load({ locals }) {
  // Load critical data immediately
  const user = locals.user;
  
  // Stream non-critical data
  const analyticsPromise = loadAnalytics(user.id);
  const notificationsPromise = loadNotifications(user.id);
  
  return {
    user,
    // These promises will be resolved by the client
    analytics: analyticsPromise,
    notifications: notificationsPromise
  };
}
```

## Advanced Load Patterns

### Dependency Management

```typescript
// src/routes/blog/+page.js
export async function load({ fetch, depends, url }) {
  const page = parseInt(url.searchParams.get('page') || '1');
  const category = url.searchParams.get('category');
  
  // Track dependencies for cache invalidation
  depends('blog:posts');
  if (category) depends(`blog:category:${category}`);
  
  const posts = await fetch(`/api/posts?page=${page}&category=${category || ''}`)
    .then(r => r.json());
  
  return { posts, page, category };
}

// Invalidate from elsewhere:
// import { invalidate } from '$app/navigation';
// await invalidate('blog:posts');
```

### Untracked Operations

```typescript
export async function load({ url, untrack, fetch }) {
  // This won't trigger reloads when URL changes
  const theme = untrack(() => url.searchParams.get('theme')) || 'light';
  
  const data = await fetch('/api/data').then(r => r.json());
  
  return { data, theme };
}
```

### Progressive Enhancement

```typescript
// src/routes/search/+page.server.js
export async function load({ url }) {
  const query = url.searchParams.get('q');
  
  if (!query) {
    return { results: [], query: '' };
  }
  
  // Server-side search for initial page load
  const results = await searchDatabase(query);
  
  return {
    results,
    query,
    serverRendered: true
  };
}

// src/routes/search/+page.js
export async function load({ data, fetch, url }) {
  // If we have server data, use it
  if (data.serverRendered) {
    return data;
  }
  
  // Client-side search for navigation
  const query = url.searchParams.get('q');
  if (!query) return { results: [], query: '' };
  
  const results = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
    .then(r => r.json());
  
  return { results, query };
}
```

## Load Function Utilities

### Using Fetch

The `fetch` function in load functions has enhanced capabilities:

```typescript
export async function load({ fetch }) {
  // Inherits cookies and headers from the page request
  const response = await fetch('/api/user/profile');
  
  // Can make relative requests on the server
  const posts = await fetch('/api/posts').then(r => r.json());
  
  // Internal requests go directly to handlers
  const internal = await fetch('/api/internal').then(r => r.json());
  
  return { profile: await response.json(), posts, internal };
}
```

### Setting Headers

```typescript
// src/routes/api-docs/+page.server.js
export async function load({ setHeaders, fetch }) {
  const docs = await fetch('/api/docs').then(r => r.json());
  
  // Cache for 1 hour
  setHeaders({
    'Cache-Control': 'public, max-age=3600',
    'Vary': 'Accept-Encoding'
  });
  
  return { docs };
}
```

## Best Practices

1. **Use server load for sensitive data**: Database queries, API keys, user sessions
2. **Use universal load for public data**: Data that can be safely exposed to the client
3. **Handle errors appropriately**: Use `error()` for user-facing errors, log unexpected errors
4. **Minimize waterfalls**: Use `Promise.all()` for parallel requests
5. **Use dependencies wisely**: Only depend on data that should trigger reloads
6. **Consider caching**: Set appropriate cache headers for static data
7. **Keep load functions fast**: Users expect pages to load quickly
8. **Use parent() efficiently**: Call `parent()` after your own data fetching to avoid waterfalls