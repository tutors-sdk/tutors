# Hooks

SvelteKit hooks provide a way to intercept and customize request/response handling at the application level. The `sequence` function allows you to compose multiple hooks together.

## Capabilities

### Hook Composition

Compose multiple handle functions with middleware-like behavior.

```typescript { .api }
/**
 * A helper function for sequencing multiple handle calls in a middleware-like manner.
 * The behavior for the handle options is as follows:
 * - transformPageChunk is applied in reverse order and merged
 * - preload is applied in forward order, the first option "wins"
 * - filterSerializedResponseHeaders behaves the same as preload
 * @param handlers - Array of handle functions to sequence
 * @returns Combined handle function
 */
function sequence(...handlers: Handle[]): Handle;
```

### Handle Hook Type

The core hook type for request/response interception.

```typescript { .api }
/**
 * The handle hook runs every time the SvelteKit server receives a request
 * and determines the response. It receives an event object representing
 * the request and a function called resolve, which renders the route
 * and generates a Response.
 */
type Handle = (input: {
  event: RequestEvent;
  resolve: (event: RequestEvent, opts?: ResolveOptions) => Promise<Response>;
}) => Promise<Response>;

interface ResolveOptions {
  /** Applies custom transforms to HTML chunks */
  transformPageChunk?: (input: { html: string; done: boolean }) => Promise<string | undefined> | string | undefined;
  /** Determines which headers should be included in serialized responses */
  filterSerializedResponseHeaders?: (name: string, value: string) => boolean;
  /** Determines what should be added to the <head> tag to preload resources */
  preload?: (input: { type: 'font' | 'css' | 'js' | 'asset'; path: string }) => boolean;
}
```

## Hook Patterns

### Basic Authentication Hook

```typescript
// src/hooks.server.js
import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
  // Parse session from cookie
  const sessionId = event.cookies.get('session');
  
  if (sessionId) {
    const user = await getUserBySessionId(sessionId);
    event.locals.user = user;
  }
  
  // Protect admin routes
  if (event.url.pathname.startsWith('/admin')) {
    if (!event.locals.user?.isAdmin) {
      throw redirect(303, '/login');
    }
  }
  
  // Protect authenticated routes
  if (event.url.pathname.startsWith('/dashboard')) {
    if (!event.locals.user) {
      throw redirect(303, '/login');
    }
  }
  
  return resolve(event);
}
```

### Request Logging Hook

```typescript
// src/hooks.server.js
export async function handle({ event, resolve }) {
  const startTime = Date.now();
  const requestId = crypto.randomUUID();
  
  // Add request ID to locals
  event.locals.requestId = requestId;
  
  console.log(`[${requestId}] ${event.request.method} ${event.url.pathname}`);
  
  const response = await resolve(event);
  
  const duration = Date.now() - startTime;
  console.log(`[${requestId}] ${response.status} ${duration}ms`);
  
  // Add request ID to response headers
  response.headers.set('X-Request-ID', requestId);
  
  return response;
}
```

### CORS Hook

```typescript
// src/hooks.server.js
export async function handle({ event, resolve }) {
  // Handle preflight requests
  if (event.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400'
      }
    });
  }
  
  const response = await resolve(event);
  
  // Add CORS headers to all responses
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return response;
}
```

### Content Security Policy Hook

```typescript
// src/hooks.server.js
export async function handle({ event, resolve }) {
  const response = await resolve(event, {
    transformPageChunk: ({ html }) => {
      // Generate nonce for inline scripts
      const nonce = crypto.randomUUID();
      
      // Add nonce to inline scripts
      html = html.replace(
        /<script>/g,
        `<script nonce="${nonce}">`
      );
      
      return html;
    }
  });
  
  // Set CSP header
  response.headers.set(
    'Content-Security-Policy',
    `default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'unsafe-inline';`
  );
  
  return response;
}
```

### Multiple Hooks with Sequence

```typescript
// src/hooks.server.js
import { sequence } from '@sveltejs/kit/hooks';

// Individual hook functions
async function authHook({ event, resolve }) {
  const sessionId = event.cookies.get('session');
  if (sessionId) {
    event.locals.user = await getUserBySessionId(sessionId);
  }
  return resolve(event);
}

async function loggingHook({ event, resolve }) {
  const start = Date.now();
  console.log(`→ ${event.request.method} ${event.url.pathname}`);
  
  const response = await resolve(event);
  
  const duration = Date.now() - start;
  console.log(`← ${response.status} ${duration}ms`);
  
  return response;
}

async function corsHook({ event, resolve }) {
  if (event.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }
  
  const response = await resolve(event);
  response.headers.set('Access-Control-Allow-Origin', '*');
  
  return response;
}

async function securityHook({ event, resolve }) {
  const response = await resolve(event);
  
  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  return response;
}

// Combine all hooks
export const handle = sequence(
  loggingHook,    // Runs first
  authHook,       // Runs second
  corsHook,       // Runs third
  securityHook    // Runs last
);
```

### Advanced HTML Transformation

```typescript
// src/hooks.server.js
export async function handle({ event, resolve }) {
  return resolve(event, {
    transformPageChunk: ({ html, done }) => {
      // Only transform the final chunk
      if (!done) return html;
      
      // Add analytics script
      if (event.url.pathname !== '/admin') {
        html = html.replace(
          '</head>',
          `  <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
          <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          </script>
        </head>`
        );
      }
      
      // Minify HTML in production
      if (process.env.NODE_ENV === 'production') {
        html = html.replace(/>\s+</g, '><').trim();
      }
      
      return html;
    }
  });
}
```

### Rate Limiting Hook

```typescript
// src/hooks.server.js
const rateLimitMap = new Map();

export async function handle({ event, resolve }) {
  const clientIP = event.getClientAddress();
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 100;
  
  // Get or create rate limit data for this IP
  const ipData = rateLimitMap.get(clientIP) || { requests: [], blocked: false };
  
  // Remove old requests outside the window
  ipData.requests = ipData.requests.filter(time => time > now - windowMs);
  
  // Check if rate limit exceeded
  if (ipData.requests.length >= maxRequests) {
    ipData.blocked = true;
    rateLimitMap.set(clientIP, ipData);
    
    return new Response('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': '60',
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': '0'
      }
    });
  }
  
  // Record this request
  ipData.requests.push(now);
  ipData.blocked = false;
  rateLimitMap.set(clientIP, ipData);
  
  const response = await resolve(event);
  
  // Add rate limit headers
  const remaining = Math.max(0, maxRequests - ipData.requests.length);
  response.headers.set('X-RateLimit-Limit', maxRequests.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  
  return response;
}
```

### Database Connection Hook

```typescript
// src/hooks.server.js
import { connectToDatabase, closeDatabaseConnection } from '$lib/database';

let dbConnection = null;

export async function handle({ event, resolve }) {
  // Ensure database connection
  if (!dbConnection) {
    dbConnection = await connectToDatabase();
  }
  
  // Add database to locals
  event.locals.db = dbConnection;
  
  try {
    return await resolve(event);
  } catch (error) {
    // Log database errors
    if (error.code?.startsWith('DB_')) {
      console.error('Database error:', error);
    }
    throw error;
  }
}

// Cleanup on process exit
process.on('SIGTERM', async () => {
  if (dbConnection) {
    await closeDatabaseConnection(dbConnection);
  }
});
```

## Error Handling Hooks

### Server Error Hook

```typescript
// src/hooks.server.js
export async function handleError({ error, event, status, message }) {
  const errorId = crypto.randomUUID();
  
  // Log error with context
  console.error(`[${errorId}] ${status} ${message}`, {
    error: error.stack,
    url: event.url.toString(),
    userAgent: event.request.headers.get('user-agent'),
    timestamp: new Date().toISOString()
  });
  
  // Send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    await sendToErrorTracking({
      errorId,
      error,
      context: {
        url: event.url.toString(),
        method: event.request.method,
        userAgent: event.request.headers.get('user-agent')
      }
    });
  }
  
  // Return user-friendly error
  return {
    message: process.env.NODE_ENV === 'development' ? message : 'Internal error',
    errorId
  };
}
```

### Client Error Hook

```typescript
// src/hooks.client.js
export async function handleError({ error, event, status, message }) {
  // Log client-side errors
  console.error('Client error:', error);
  
  // Send to analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'exception', {
      description: message,
      fatal: status >= 500
    });
  }
  
  return {
    message: 'Something went wrong'
  };
}
```

## Best Practices

1. **Order matters**: Use `sequence()` to control hook execution order
2. **Error handling**: Always handle errors gracefully in hooks
3. **Performance**: Keep hooks fast as they run on every request
4. **Security**: Use hooks for authentication, CORS, and security headers
5. **Logging**: Add request logging and error tracking
6. **Database connections**: Manage database connections in hooks
7. **Rate limiting**: Implement rate limiting for public APIs
8. **Clean up**: Properly clean up resources on process exit
9. **Environment awareness**: Adjust behavior based on development/production
10. **Transform carefully**: Use `transformPageChunk` sparingly for performance