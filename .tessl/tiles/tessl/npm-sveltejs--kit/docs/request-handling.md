# Request Handling

SvelteKit provides comprehensive request handling capabilities through the RequestEvent interface, which gives you access to incoming HTTP requests and allows you to interact with cookies, headers, and platform-specific features.

## Capabilities

### RequestEvent Interface

The core interface for handling HTTP requests in SvelteKit.

```typescript { .api }
/**
 * Request event object available in server load functions, actions, and API endpoints
 */
interface RequestEvent<Params = Record<string, string>> {
  /** Cookie management interface */
  cookies: Cookies;
  /** Enhanced fetch function with server-side benefits */
  fetch: typeof fetch;
  /** Get client IP address */
  getClientAddress: () => string;
  /** Server-side locals object for sharing data across handlers */
  locals: App.Locals;
  /** Route parameters extracted from URL */
  params: Params;
  /** Platform-specific context (adapter-dependent) */
  platform: Readonly<App.Platform> | undefined;
  /** The incoming HTTP request */
  request: Request;
  /** Route information */
  route: { id: string };
  /** Set response headers */
  setHeaders: (headers: Record<string, string>) => void;
  /** The request URL */
  url: URL;
  /** True if this is a data request (for load functions) */
  isDataRequest: boolean;
  /** True if this is an internal subrequest */
  isSubRequest: boolean;
}
```

### Cookie Management

Interface for managing cookies in server-side code.

```typescript { .api }
interface Cookies {
  /** Get a cookie value */
  get: (name: string, opts?: import('cookie').CookieParseOptions) => string | undefined;
  
  /** Get all cookies */
  getAll: (opts?: import('cookie').CookieParseOptions) => Array<{ name: string; value: string }>;
  
  /** Set a cookie */
  set: (
    name: string,
    value: string,
    opts: import('cookie').CookieSerializeOptions & { path: string }
  ) => void;
  
  /** Delete a cookie */
  delete: (name: string, opts: import('cookie').CookieSerializeOptions & { path: string }) => void;
  
  /** Serialize a cookie without applying it */
  serialize: (
    name: string,
    value: string,
    opts: import('cookie').CookieSerializeOptions & { path: string }
  ) => string;
}
```

## Request Handling Patterns

### API Endpoints

```typescript
// src/routes/api/users/+server.js
import { json, error } from '@sveltejs/kit';

export async function GET({ url, cookies, locals }) {
  // Check authentication
  const sessionId = cookies.get('session');
  if (!sessionId || !locals.user) {
    throw error(401, 'Unauthorized');
  }
  
  // Parse query parameters
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '10');
  
  // Fetch data
  const users = await getUsersPaginated({ page, limit });
  
  return json({
    users,
    pagination: {
      page,
      limit,
      total: users.total
    }
  });
}

export async function POST({ request, cookies, locals }) {
  if (!locals.user?.isAdmin) {
    throw error(403, 'Admin access required');
  }
  
  const userData = await request.json();
  
  // Validate input
  if (!userData.email || !userData.name) {
    throw error(400, 'Email and name are required');
  }
  
  try {
    const user = await createUser(userData);
    return json(user, { status: 201 });
  } catch (err) {
    if (err.code === 'DUPLICATE_EMAIL') {
      throw error(409, 'Email already exists');
    }
    throw error(500, 'Failed to create user');
  }
}
```

### Cookie Operations

```typescript
// src/routes/auth/login/+server.js
export async function POST({ request, cookies }) {
  const { email, password } = await request.json();
  
  const user = await authenticate(email, password);
  if (!user) {
    throw error(401, 'Invalid credentials');
  }
  
  // Set session cookie
  cookies.set('session', user.sessionId, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });
  
  // Set user preferences cookie (accessible to client)
  cookies.set('theme', user.preferences.theme, {
    path: '/',
    httpOnly: false,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 365 // 1 year
  });
  
  return json({ success: true });
}

// src/routes/auth/logout/+server.js
export async function POST({ cookies }) {
  // Clear session cookie
  cookies.delete('session', { path: '/' });
  cookies.delete('theme', { path: '/' });
  
  return json({ success: true });
}
```

### File Upload Handling

```typescript
// src/routes/api/upload/+server.js
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST({ request, locals }) {
  if (!locals.user) {
    throw error(401, 'Authentication required');
  }
  
  const formData = await request.formData();
  const file = formData.get('file');
  
  if (!file || !(file instanceof File)) {
    throw error(400, 'No file uploaded');
  }
  
  // Validate file
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw error(413, 'File too large');
  }
  
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw error(415, 'Unsupported file type');
  }
  
  // Save file
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;
    const filepath = join('uploads', filename);
    
    await writeFile(filepath, buffer);
    
    return json({
      filename,
      size: file.size,
      type: file.type,
      url: `/uploads/${filename}`
    });
  } catch (error) {
    throw error(500, 'Failed to save file');
  }
}
```

### Client IP and Headers

```typescript
// src/routes/api/visitor-info/+server.js
export async function GET({ request, getClientAddress, setHeaders }) {
  const clientIP = getClientAddress();
  const userAgent = request.headers.get('user-agent');
  const acceptLanguage = request.headers.get('accept-language');
  
  // Set CORS headers
  setHeaders({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Cache-Control': 'no-cache'
  });
  
  return json({
    ip: clientIP,
    userAgent,
    language: acceptLanguage,
    timestamp: new Date().toISOString()
  });
}
```

### Request Body Parsing

```typescript
// src/routes/api/webhook/+server.js
export async function POST({ request }) {
  const contentType = request.headers.get('content-type');
  
  let data;
  if (contentType?.includes('application/json')) {
    data = await request.json();
  } else if (contentType?.includes('application/x-www-form-urlencoded')) {
    const formData = await request.formData();
    data = Object.fromEntries(formData);
  } else if (contentType?.includes('text/')) {
    data = await request.text();
  } else {
    data = await request.arrayBuffer();
  }
  
  // Process webhook data
  await processWebhook(data);
  
  return json({ received: true });
}
```

### Platform-Specific Features

```typescript
// Example with Cloudflare Workers
export async function GET({ platform, request }) {
  if (platform?.env) {
    // Access Cloudflare Workers environment
    const kv = platform.env.MY_KV_NAMESPACE;
    const cached = await kv.get('cached-data');
    
    if (cached) {
      return json(JSON.parse(cached));
    }
  }
  
  // Fallback behavior
  const data = await fetchFreshData();
  
  if (platform?.env?.MY_KV_NAMESPACE) {
    // Cache for 1 hour
    await platform.env.MY_KV_NAMESPACE.put(
      'cached-data', 
      JSON.stringify(data),
      { expirationTtl: 3600 }
    );
  }
  
  return json(data);
}
```

## Advanced Request Handling

### Middleware Pattern with Locals

```typescript
// src/hooks.server.js
export async function handle({ event, resolve }) {
  // Parse session from cookie
  const sessionId = event.cookies.get('session');
  if (sessionId) {
    const user = await getUserBySessionId(sessionId);
    event.locals.user = user;
  }
  
  // Add request ID for logging
  event.locals.requestId = crypto.randomUUID();
  
  // Log request
  console.log(`${event.locals.requestId}: ${event.request.method} ${event.url.pathname}`);
  
  const response = await resolve(event);
  
  // Add request ID to response header
  response.headers.set('X-Request-ID', event.locals.requestId);
  
  return response;
}

// Now available in all server functions
export async function load({ locals }) {
  console.log(`Request ID: ${locals.requestId}`);
  
  if (locals.user) {
    return { user: locals.user };
  }
  
  throw redirect(303, '/login');
}
```

### Rate Limiting

```typescript
// src/routes/api/limited/+server.js
const rateLimits = new Map();

export async function POST({ getClientAddress, request }) {
  const clientIP = getClientAddress();
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10;
  
  // Clean old entries
  const cutoff = now - windowMs;
  const requests = rateLimits.get(clientIP) || [];
  const recentRequests = requests.filter(time => time > cutoff);
  
  if (recentRequests.length >= maxRequests) {
    throw error(429, 'Too many requests');
  }
  
  // Record this request
  recentRequests.push(now);
  rateLimits.set(clientIP, recentRequests);
  
  // Process request
  const data = await request.json();
  const result = await processLimitedOperation(data);
  
  return json(result);
}
```

### Content Negotiation

```typescript
// src/routes/api/data/+server.js
export async function GET({ request, url }) {
  const accept = request.headers.get('accept') || '';
  const format = url.searchParams.get('format');
  
  const data = await getData();
  
  if (format === 'csv' || accept.includes('text/csv')) {
    const csv = convertToCSV(data);
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="data.csv"'
      }
    });
  }
  
  if (format === 'xml' || accept.includes('application/xml')) {
    const xml = convertToXML(data);
    return new Response(xml, {
      headers: { 'Content-Type': 'application/xml' }
    });
  }
  
  // Default to JSON
  return json(data);
}
```

### WebSocket Handling

```typescript
// src/routes/api/websocket/+server.js
export async function GET({ request, locals }) {
  if (!locals.user) {
    throw error(401, 'Authentication required');
  }
  
  const upgrade = request.headers.get('upgrade');
  if (upgrade !== 'websocket') {
    throw error(400, 'Expected websocket upgrade');
  }
  
  // This is adapter-specific - example for Node.js
  const { socket, response } = Deno.upgradeWebSocket(request);
  
  socket.onopen = () => {
    console.log('WebSocket connection opened');
  };
  
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    // Handle WebSocket message
    handleWebSocketMessage(message, locals.user);
  };
  
  socket.onclose = () => {
    console.log('WebSocket connection closed');
  };
  
  return response;
}
```

## Best Practices

1. **Validate input thoroughly**: Check all request data before processing
2. **Handle errors gracefully**: Use appropriate HTTP status codes and error messages
3. **Secure cookie handling**: Use `httpOnly`, `secure`, and appropriate `sameSite` settings
4. **Rate limiting**: Implement rate limiting for public APIs
5. **Authentication checks**: Verify user permissions before sensitive operations
6. **Content type handling**: Parse request bodies based on Content-Type header
7. **Response headers**: Set appropriate caching and security headers
8. **Logging**: Log requests and errors for debugging and monitoring
9. **Platform features**: Leverage adapter-specific features when available
10. **Resource cleanup**: Properly handle file uploads and cleanup temporary resources