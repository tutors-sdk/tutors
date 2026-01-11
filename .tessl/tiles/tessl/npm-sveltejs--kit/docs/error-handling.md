# Error Handling

SvelteKit provides utilities for creating HTTP errors and redirects that integrate seamlessly with the framework's error handling system.

## Capabilities

### Error Function

Throws an HTTP error that SvelteKit will handle appropriately, returning an error response without invoking the `handleError` hook.

```typescript { .api }
/**
 * Throws an error with a HTTP status code and an optional message.
 * When called during request handling, this will cause SvelteKit to
 * return an error response without invoking `handleError`.
 * @param status - HTTP status code (must be 400-599)
 * @param body - Error body that conforms to App.Error type or string
 * @throws HttpError - Instructs SvelteKit to initiate HTTP error handling
 * @throws Error - If the provided status is invalid
 */
function error(status: number, body: App.Error | string): never;
```

**Usage Examples:**

```typescript
import { error } from '@sveltejs/kit';

// In a load function
export async function load({ params }) {
  const post = await getPost(params.id);
  
  if (!post) {
    throw error(404, 'Post not found');
  }
  
  if (!post.published) {
    throw error(403, 'Post not published');
  }
  
  return { post };
}

// In an API endpoint
export async function GET({ params }) {
  const user = await getUser(params.id);
  
  if (!user) {
    throw error(404, {
      message: 'User not found',
      code: 'USER_NOT_FOUND'
    });
  }
  
  return json(user);
}
```

### HTTP Error Type Guard

Checks whether an error was thrown by the `error()` function, with optional status filtering.

```typescript { .api }
/**
 * Checks whether this is an error thrown by error().
 * @param e - The object to check
 * @param status - Optional status code to filter for
 * @returns Type predicate indicating if e is an HttpError
 */
function isHttpError(e: unknown, status?: number): boolean;
```

**Usage Examples:**

```typescript
import { isHttpError, error } from '@sveltejs/kit';

try {
  await someOperation();
} catch (e) {
  if (isHttpError(e)) {
    console.log('HTTP error occurred:', e.status, e.body);
    throw e; // Re-throw to let SvelteKit handle it
  }
  
  if (isHttpError(e, 404)) {
    console.log('Specific 404 error occurred');
  }
  
  // Handle other error types
  throw error(500, 'Internal server error');
}
```

### Redirect Function

Throws a redirect that SvelteKit will handle by returning a redirect response.

```typescript { .api }
/**
 * Redirect a request. When called during request handling, SvelteKit will return a redirect response.
 * Make sure you're not catching the thrown redirect, which would prevent SvelteKit from handling it.
 * @param status - HTTP redirect status code (300-308)
 * @param location - The location to redirect to
 * @throws Redirect - Instructs SvelteKit to redirect to the specified location
 * @throws Error - If the provided status is invalid
 */
function redirect(status: 300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308, location: string | URL): never;
```

**Common Status Codes:**
- `303 See Other`: Redirect as a GET request (often used after a form POST)
- `307 Temporary Redirect`: Redirect will keep the request method
- `308 Permanent Redirect`: Redirect will keep the request method, SEO transferred

**Usage Examples:**

```typescript
import { redirect } from '@sveltejs/kit';

// In a load function
export async function load({ url, locals }) {
  if (!locals.user) {
    throw redirect(303, '/login');
  }
  
  return { user: locals.user };
}

// In a form action
export const actions = {
  login: async ({ request, cookies }) => {
    const data = await request.formData();
    const user = await authenticate(data);
    
    if (user) {
      cookies.set('session', user.sessionId, { path: '/' });
      throw redirect(303, '/dashboard');
    }
    
    return fail(400, { message: 'Invalid credentials' });
  }
};

// Conditional redirects
export async function load({ params, url }) {
  const slug = params.slug;
  
  if (slug !== slug.toLowerCase()) {
    throw redirect(301, `/blog/${slug.toLowerCase()}`);
  }
  
  return {};
}
```

### Redirect Type Guard

Checks whether an error was thrown by the `redirect()` function.

```typescript { .api }
/**
 * Checks whether this is a redirect thrown by redirect().
 * @param e - The object to check
 * @returns Type predicate indicating if e is a Redirect
 */
function isRedirect(e: unknown): boolean;
```

**Usage Examples:**

```typescript
import { isRedirect, redirect } from '@sveltejs/kit';

try {
  await processRequest();
} catch (e) {
  if (isRedirect(e)) {
    console.log('Redirect to:', e.location);
    throw e; // Re-throw to let SvelteKit handle it
  }
  
  // Handle other error types
  console.error('Unexpected error:', e);
}
```

## Error Classes

### HttpError

The error class thrown by `error()`. Generally you don't construct this directly.

```typescript { .api }
interface HttpError {
  /** HTTP status code (400-599) */
  status: number;
  /** Error content conforming to App.Error */
  body: App.Error;
  toString(): string;
}
```

### Redirect

The redirect class thrown by `redirect()`. Generally you don't construct this directly.

```typescript { .api }
interface Redirect {
  /** HTTP status code (300-308) */
  status: 300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308;
  /** The location to redirect to */
  location: string;
}
```

## Error Handling Best Practices

1. **Use appropriate status codes**: 404 for not found, 403 for forbidden, 400 for bad request, etc.
2. **Don't catch thrown errors/redirects**: Let SvelteKit handle them unless you need to add logging
3. **Provide helpful error messages**: Users and developers should understand what went wrong
4. **Use redirects for state changes**: After successful form submissions, use 303 redirects
5. **Handle errors at appropriate levels**: Use load functions for page-level errors, endpoints for API errors