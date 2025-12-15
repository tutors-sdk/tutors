# Response Creation

SvelteKit provides utilities for creating properly formatted HTTP responses with correct headers for APIs and endpoints.

## Capabilities

### JSON Response

Creates a JSON Response object with proper Content-Type and Content-Length headers.

```typescript { .api }
/**
 * Create a JSON Response object from the supplied data.
 * @param data - The value that will be serialized as JSON
 * @param init - Options such as status and headers that will be added to the response
 * @returns Response object with JSON content
 */
function json(data: any, init?: ResponseInit): Response;
```

**Automatic Headers:**
- `Content-Type: application/json`
- `Content-Length: <calculated-size>`

**Usage Examples:**

```typescript
import { json } from '@sveltejs/kit';

// Basic JSON response
export async function GET() {
  const data = { message: 'Hello World', timestamp: Date.now() };
  return json(data);
}

// JSON response with custom status and headers
export async function POST({ request }) {
  const body = await request.json();
  const result = await processData(body);
  
  return json(result, {
    status: 201,
    headers: {
      'Location': `/api/items/${result.id}`,
      'Cache-Control': 'no-cache'
    }
  });
}

// Error response
export async function DELETE({ params }) {
  const success = await deleteItem(params.id);
  
  if (!success) {
    return json(
      { error: 'Item not found' },
      { status: 404 }
    );
  }
  
  return json({ success: true });
}

// Complex data structures
export async function GET() {
  const users = await getUsers();
  
  return json({
    users,
    meta: {
      count: users.length,
      page: 1,
      hasMore: false
    }
  });
}
```

### Text Response

Creates a text Response object with proper Content-Length header.

```typescript { .api }
/**
 * Create a Response object from the supplied body.
 * @param body - The value that will be used as-is
 * @param init - Options such as status and headers that will be added to the response
 * @returns Response object with text content
 */
function text(body: string, init?: ResponseInit): Response;
```

**Automatic Headers:**
- `Content-Length: <calculated-size>`

**Usage Examples:**

```typescript
import { text } from '@sveltejs/kit';

// Plain text response
export async function GET() {
  return text('Hello, World!');
}

// Text with custom content type
export async function GET() {
  const csvData = generateCSV();
  
  return text(csvData, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="data.csv"'
    }
  });
}

// XML response
export async function GET() {
  const xmlData = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>My Blog</title>
    <description>Blog posts</description>
  </channel>
</rss>`;

  return text(xmlData, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
}

// Custom status codes
export async function POST({ request }) {
  const body = await request.text();
  
  if (!body.trim()) {
    return text('Empty body not allowed', { status: 400 });
  }
  
  await processText(body);
  return text('Processed successfully', { status: 201 });
}
```

## Response Patterns

### API Endpoints

```typescript
// GET /api/posts/[id]/+server.js
import { json, error } from '@sveltejs/kit';

export async function GET({ params }) {
  const post = await getPost(params.id);
  
  if (!post) {
    throw error(404, 'Post not found');
  }
  
  return json(post);
}

export async function PUT({ params, request }) {
  const updates = await request.json();
  const post = await updatePost(params.id, updates);
  
  return json(post);
}

export async function DELETE({ params }) {
  await deletePost(params.id);
  return json({ success: true });
}
```

### File Downloads

```typescript
import { text } from '@sveltejs/kit';

export async function GET({ params }) {
  const reportData = await generateReport(params.id);
  
  return text(reportData, {
    headers: {
      'Content-Type': 'text/plain',
      'Content-Disposition': `attachment; filename="report-${params.id}.txt"`
    }
  });
}
```

### Streaming Responses

For large responses, you can create streaming responses:

```typescript
export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      // Stream data
      controller.enqueue('chunk 1\n');
      controller.enqueue('chunk 2\n');
      controller.close();
    }
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain',
      'Transfer-Encoding': 'chunked'
    }
  });
}
```

### CORS Headers

```typescript
import { json } from '@sveltejs/kit';

export async function GET() {
  const data = { message: 'API response' };
  
  return json(data, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
```

## Response Types

### ResponseInit Interface

```typescript { .api }
interface ResponseInit {
  status?: number;
  statusText?: string;
  headers?: HeadersInit;
}

type HeadersInit = Headers | string[][] | Record<string, string>;
```

### Response Object

Both `json()` and `text()` return standard Web API Response objects:

```typescript { .api }
interface Response {
  readonly body: ReadableStream | null;
  readonly bodyUsed: boolean;
  readonly headers: Headers;
  readonly ok: boolean;
  readonly redirected: boolean;
  readonly status: number;
  readonly statusText: string;
  readonly type: ResponseType;
  readonly url: string;
  
  arrayBuffer(): Promise<ArrayBuffer>;
  blob(): Promise<Blob>;
  clone(): Response;
  formData(): Promise<FormData>;
  json(): Promise<any>;
  text(): Promise<string>;
}
```

## Best Practices

1. **Use appropriate response helpers**: `json()` for APIs, `text()` for plain text
2. **Set proper status codes**: 200 for success, 201 for created, 400 for bad request, etc.
3. **Include relevant headers**: Content-Type, Cache-Control, CORS headers when needed
4. **Handle errors gracefully**: Return error responses with helpful messages
5. **Consider performance**: Use streaming for large responses
6. **Validate input**: Check request data before processing and return appropriate errors