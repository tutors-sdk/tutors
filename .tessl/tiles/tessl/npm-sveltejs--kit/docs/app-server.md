# App Server

Server-side utilities and remote functions for SvelteKit applications, including access to the current request context and remote function execution.

## Capabilities

### Request Context

Access the current RequestEvent from anywhere in server-side code.

```typescript { .api }
/**
 * Get the current RequestEvent during server-side execution
 * @returns The current RequestEvent
 * @throws Error if called outside of request context
 * @since 2.20.0
 */
function getRequestEvent(): RequestEvent;
```

**Usage Examples:**

```typescript
import { getRequestEvent } from '$app/server';

// In a utility function called during request handling
export function getCurrentUser() {
  const event = getRequestEvent();
  const sessionId = event.cookies.get('session');
  
  if (!sessionId) {
    throw error(401, 'Not authenticated');
  }
  
  return getUserFromSession(sessionId);
}

// In a service that needs request context
export class LoggingService {
  static log(message: string) {
    const event = getRequestEvent();
    console.log(`[${event.url.pathname}] ${message}`);
  }
}
```

### Asset Reading

Read imported assets from the filesystem during server-side execution.

```typescript { .api }
/**
 * Read an imported asset from the filesystem
 * @param asset - The asset to read (from import)
 * @returns ReadableStream of the asset content
 * @since 2.4.0
 */
function read(asset: string): ReadableStream;
```

**Usage Examples:**

```typescript
import { read } from '$app/server';
import templateFile from '../templates/email.html?url';

export async function GET() {
  // Read the imported template file
  const stream = read(templateFile);
  const template = await new Response(stream).text();
  
  // Process template with data
  const html = template.replace('{{title}}', 'Welcome!');
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}
```

### Remote Functions

Execute remote functions for distributed computing and server communication.

```typescript { .api }
/**
 * Execute a remote query function
 * @param id - The function identifier
 * @param args - Arguments to pass to the function
 * @returns Promise resolving to function result
 */
function query(id: string, ...args: any[]): Promise<any>;

/**
 * Execute a remote prerender function
 * @param id - The function identifier
 * @param args - Arguments to pass to the function
 * @returns Promise resolving to prerender result
 */
function prerender(id: string, ...args: any[]): Promise<any>;

/**
 * Execute a remote command function
 * @param id - The function identifier
 * @param args - Arguments to pass to the function
 * @returns Promise resolving to command result
 */
function command(id: string, ...args: any[]): Promise<any>;

/**
 * Execute a remote form function
 * @param id - The function identifier
 * @param formData - Form data to process
 * @returns Promise resolving to form result
 */
function form(id: string, formData: FormData): Promise<any>;
```

**Usage Examples:**

```typescript
import { query, command, prerender } from '$app/server';

// Remote database query
export async function load() {
  const users = await query('getUserList', { 
    limit: 10, 
    active: true 
  });
  
  return { users };
}

// Remote command execution
export const actions = {
  deploy: async ({ request }) => {
    const formData = await request.formData();
    const environment = formData.get('environment');
    
    const result = await command('deployApp', {
      environment,
      timestamp: Date.now()
    });
    
    return { success: true, deployId: result.id };
  }
};

// Remote prerendering
export async function entries() {
  const routes = await prerender('generateRoutes', {
    includeStatic: true,
    locale: 'en'
  });
  
  return routes.map(route => ({ slug: route.slug }));
}
```

## Types

```typescript { .api }
interface RequestEvent<Params = Record<string, string>> {
  cookies: Cookies;
  fetch: typeof fetch;
  getClientAddress: () => string;
  locals: App.Locals;
  params: Params;
  platform: Readonly<App.Platform> | undefined;
  request: Request;
  route: { id: string };
  setHeaders: (headers: Record<string, string>) => void;
  url: URL;
  isDataRequest: boolean;
  isSubRequest: boolean;
}
```

## Best Practices

1. **Context awareness**: Only call `getRequestEvent()` during request handling
2. **Error handling**: Wrap remote function calls in try-catch blocks
3. **Asset validation**: Verify imported assets exist before reading
4. **Security**: Validate remote function parameters to prevent injection
5. **Performance**: Cache remote function results when appropriate
6. **Logging**: Use request context for structured logging
7. **Timeout handling**: Set appropriate timeouts for remote calls
8. **Fallback strategies**: Implement fallbacks for remote function failures