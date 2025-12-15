# Edge Functions

Serverless function invocation system for running custom business logic at the edge. Execute TypeScript/JavaScript functions with global distribution, automatic scaling, and built-in authentication integration.

## Capabilities

### Function Invocation

Execute edge functions with custom payloads, headers, and configuration options.

```typescript { .api }
/**
 * Invoke a Supabase Edge Function
 * @param functionName - The name of the function to invoke
 * @param options - Function invocation options
 * @returns Promise resolving to function response or error
 */
invoke<T = any>(
  functionName: string,
  options?: FunctionInvokeOptions
): Promise<FunctionResponse<T>>;

interface FunctionInvokeOptions {
  /** Custom headers to send with the request */
  headers?: Record<string, string>;
  /** Function payload data */
  body?: any;
  /** Preferred region for function execution */
  region?: FunctionRegion;
  /** HTTP method to use (defaults to POST) */
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
}

interface FunctionResponse<T> {
  /** Function return data */
  data: T | null;
  /** Function execution error */
  error: FunctionsError | null;
}

enum FunctionRegion {
  /** Any available region (automatic selection) */
  Any = 'any',
  /** Asia Pacific (Tokyo) */
  ApNortheast1 = 'ap-northeast-1',
  /** Asia Pacific (Singapore) */
  ApSoutheast1 = 'ap-southeast-1',
  /** Asia Pacific (Mumbai) */
  ApSouth1 = 'ap-south-1',
  /** Canada (Central) */
  CaCentral1 = 'ca-central-1',
  /** Europe (Frankfurt) */
  EuCentral1 = 'eu-central-1',
  /** Europe (Ireland) */
  EuWest1 = 'eu-west-1',
  /** Europe (London) */
  EuWest2 = 'eu-west-2',
  /** South America (São Paulo) */
  SaEast1 = 'sa-east-1',
  /** US East (N. Virginia) */
  UsEast1 = 'us-east-1',
  /** US West (N. California) */
  UsWest1 = 'us-west-1',
  /** US West (Oregon) */
  UsWest2 = 'us-west-2'
}
```

**Usage Examples:**

```typescript
// Basic function invocation
const { data, error } = await supabase.functions.invoke('hello-world');

if (error) {
  console.error('Function error:', error);
} else {
  console.log('Function response:', data);
}

// Function with payload
const { data, error } = await supabase.functions.invoke('process-data', {
  body: {
    userId: '123',
    action: 'update_profile',
    data: {
      name: 'John Doe',
      email: 'john@example.com'
    }
  }
});

// Function with custom headers
const { data, error } = await supabase.functions.invoke('authenticated-function', {
  headers: {
    'Authorization': `Bearer ${userToken}`,
    'Content-Type': 'application/json',
    'X-Custom-Header': 'custom-value'
  },
  body: { message: 'Hello from client' }
});

// Function with region preference
const { data, error } = await supabase.functions.invoke('region-specific', {
  body: { data: 'process-me' },
  region: FunctionRegion.EuWest1
});

// GET request to function
const { data, error } = await supabase.functions.invoke('api-endpoint', {
  method: 'GET'
});

// TypeScript with typed response
interface ApiResponse {
  success: boolean;
  message: string;
  result: any;
}

const { data, error } = await supabase.functions.invoke<ApiResponse>('typed-function', {
  body: { input: 'test' }
});

if (data) {
  console.log('Success:', data.success);
  console.log('Message:', data.message);
  console.log('Result:', data.result);
}
```

### Error Handling

Different types of errors that can occur during function execution.

```typescript { .api }
/**
 * Base class for all function-related errors
 */
abstract class FunctionsError extends Error {
  abstract name: string;
  context?: Record<string, any>;
}

/**
 * HTTP-related errors (4xx, 5xx status codes)
 */
class FunctionsHttpError extends FunctionsError {
  name = 'FunctionsHttpError';
  status: number;
  statusText: string;
  
  constructor(message: string, status: number, statusText: string) {
    super(message);
    this.status = status;
    this.statusText = statusText;
  }
}

/**
 * Network/fetch-related errors
 */
class FunctionsFetchError extends FunctionsError {
  name = 'FunctionsFetchError';
  
  constructor(message: string) {
    super(message);
  }
}

/**
 * Relay/connection errors
 */
class FunctionsRelayError extends FunctionsError {
  name = 'FunctionsRelayError';
  
  constructor(message: string) {
    super(message);
  }
}
```

**Usage Examples:**

```typescript
const { data, error } = await supabase.functions.invoke('my-function', {
  body: { input: 'test' }
});

if (error) {
  if (error instanceof FunctionsHttpError) {
    console.error(`HTTP Error ${error.status}: ${error.statusText}`);
    console.error('Message:', error.message);
    
    // Handle specific HTTP status codes
    switch (error.status) {
      case 400:
        console.error('Bad request - check your payload');
        break;
      case 401:
        console.error('Unauthorized - check authentication');
        break;
      case 403:
        console.error('Forbidden - insufficient permissions');
        break;
      case 404:
        console.error('Function not found');
        break;
      case 500:
        console.error('Internal server error in function');
        break;
      default:
        console.error('Other HTTP error');
    }
  } else if (error instanceof FunctionsFetchError) {
    console.error('Network error:', error.message);
    // Handle network issues, retries, etc.
  } else if (error instanceof FunctionsRelayError) {
    console.error('Relay error:', error.message);
    // Handle connection issues
  } else {
    console.error('Unknown error:', error.message);
  }
}
```

## Advanced Function Patterns

### Authentication Integration

```typescript
// Invoke function with user authentication
const invokeWithAuth = async (functionName: string, payload: any) => {
  // Get current session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session) {
    console.error('No active session');
    return { data: null, error: new Error('Authentication required') };
  }

  // Invoke function with auth token
  return supabase.functions.invoke(functionName, {
    headers: {
      'Authorization': `Bearer ${session.access_token}`
    },
    body: payload
  });
};

// Usage
const { data, error } = await invokeWithAuth('user-specific-function', {
  action: 'get_user_data'
});
```

### Retry Logic

```typescript
// Function invocation with retry logic
const invokeWithRetry = async (
  functionName: string,
  options: FunctionInvokeOptions,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<FunctionResponse<any>> => {
  let lastError: FunctionsError | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const { data, error } = await supabase.functions.invoke(functionName, options);
      
      if (!error) {
        return { data, error: null };
      }

      lastError = error;

      // Only retry on network errors or 5xx status codes
      if (error instanceof FunctionsHttpError && error.status < 500) {
        break; // Don't retry client errors
      }

      if (attempt < maxRetries) {
        console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    } catch (err) {
      lastError = err as FunctionsError;
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      }
    }
  }

  return { data: null, error: lastError };
};

// Usage
const { data, error } = await invokeWithRetry(
  'unreliable-function',
  { body: { data: 'test' } },
  3,
  1000
);
```

### Batch Function Execution

```typescript
// Execute multiple functions concurrently
const executeBatch = async (functionCalls: Array<{
  name: string;
  options?: FunctionInvokeOptions;
}>) => {
  const promises = functionCalls.map(call =>
    supabase.functions.invoke(call.name, call.options)
  );

  const results = await Promise.allSettled(promises);

  return results.map((result, index) => ({
    functionName: functionCalls[index].name,
    success: result.status === 'fulfilled' && !result.value.error,
    data: result.status === 'fulfilled' ? result.value.data : null,
    error: result.status === 'fulfilled' ? result.value.error : result.reason
  }));
};

// Usage
const results = await executeBatch([
  { name: 'function-1', options: { body: { id: 1 } } },
  { name: 'function-2', options: { body: { id: 2 } } },
  { name: 'function-3', options: { body: { id: 3 } } }
]);

results.forEach((result, index) => {
  if (result.success) {
    console.log(`Function ${result.functionName} succeeded:`, result.data);
  } else {
    console.error(`Function ${result.functionName} failed:`, result.error);
  }
});
```

### Streaming Responses

```typescript
// Handle streaming responses (if your function returns streaming data)
const handleStreamingFunction = async (functionName: string, payload: any) => {
  try {
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: payload,
      headers: {
        'Accept': 'text/stream'
      }
    });

    if (error) {
      console.error('Streaming function error:', error);
      return;
    }

    // Handle streaming data (implementation depends on function response format)
    if (typeof data === 'string') {
      const lines = data.split('\n');
      lines.forEach(line => {
        if (line.trim()) {
          try {
            const jsonData = JSON.parse(line);
            console.log('Streamed data:', jsonData);
          } catch {
            console.log('Streamed text:', line);
          }
        }
      });
    }
  } catch (err) {
    console.error('Streaming error:', err);
  }
};
```

### Function Response Caching

```typescript
// Simple in-memory cache for function responses
class FunctionCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  async invoke<T>(
    functionName: string,
    options: FunctionInvokeOptions = {},
    cacheTTL: number = 300000 // 5 minutes default
  ): Promise<FunctionResponse<T>> {
    const cacheKey = this.getCacheKey(functionName, options);
    const cached = this.cache.get(cacheKey);

    // Return cached response if still valid
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      console.log('Returning cached response for', functionName);
      return { data: cached.data, error: null };
    }

    // Invoke function
    const { data, error } = await supabase.functions.invoke<T>(functionName, options);

    // Cache successful responses
    if (!error && data !== null) {
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        ttl: cacheTTL
      });
    }

    return { data, error };
  }

  private getCacheKey(functionName: string, options: FunctionInvokeOptions): string {
    return `${functionName}:${JSON.stringify(options)}`;
  }

  clearCache(): void {
    this.cache.clear();
  }

  clearExpired(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp >= value.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Usage
const functionCache = new FunctionCache();

const { data, error } = await functionCache.invoke(
  'expensive-calculation',
  { body: { input: 'complex-data' } },
  600000 // Cache for 10 minutes
);
```

### Function Development Integration

```typescript
// Helper for local development with Edge Functions
const isDevelopment = process.env.NODE_ENV === 'development';
const EDGE_FUNCTION_URL = isDevelopment 
  ? 'http://localhost:54321/functions/v1' 
  : undefined;

// Create client with local functions URL for development
const supabaseClient = isDevelopment
  ? createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          'x-forwarded-host': 'localhost:3000'
        }
      }
    })
  : supabase;

// Function invocation wrapper that logs in development
const invokeFunction = async (functionName: string, options?: FunctionInvokeOptions) => {
  if (isDevelopment) {
    console.log(`Invoking function: ${functionName}`, options);
  }

  const startTime = Date.now();
  const { data, error } = await supabaseClient.functions.invoke(functionName, options);
  const duration = Date.now() - startTime;

  if (isDevelopment) {
    console.log(`Function ${functionName} completed in ${duration}ms`);
    if (error) {
      console.error('Function error:', error);
    } else {
      console.log('Function response:', data);
    }
  }

  return { data, error };
};
```