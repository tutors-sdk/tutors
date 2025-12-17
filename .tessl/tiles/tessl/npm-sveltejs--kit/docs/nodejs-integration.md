# Node.js Integration

SvelteKit provides utilities to bridge between Node.js HTTP objects and Web API Request/Response objects, plus polyfills for web APIs in Node.js environments.

## Capabilities

### Request Conversion

Convert Node.js IncomingMessage to Web API Request.

```typescript { .api }
/**
 * Converts Node.js IncomingMessage to Web API Request object
 * @param options - Configuration object
 * @param options.request - Node.js IncomingMessage
 * @param options.base - Base URL for the application
 * @param options.bodySizeLimit - Maximum body size in bytes (optional)
 * @returns Promise resolving to Web API Request object
 */
function getRequest(options: {
  request: import('http').IncomingMessage;
  base: string;
  bodySizeLimit?: number;
}): Promise<Request>;
```

**Usage Examples:**

```typescript
import { getRequest } from '@sveltejs/kit/node';
import { createServer } from 'http';

const server = createServer(async (req, res) => {
  try {
    // Convert Node.js request to Web API Request
    const request = await getRequest({
      request: req,
      base: 'http://localhost:3000',
      bodySizeLimit: 1024 * 1024 // 1MB limit
    });
    
    // Now you can use the Web API Request
    console.log('Method:', request.method);
    console.log('URL:', request.url);
    console.log('Headers:', Object.fromEntries(request.headers));
    
    if (request.method === 'POST') {
      const body = await request.text();
      console.log('Body:', body);
    }
    
  } catch (error) {
    console.error('Request conversion failed:', error);
    res.statusCode = 400;
    res.end('Bad Request');
  }
});
```

### Response Conversion

Apply Web API Response to Node.js ServerResponse.

```typescript { .api }
/**
 * Applies Web API Response to Node.js ServerResponse
 * @param res - Node.js ServerResponse object
 * @param response - Web API Response object
 * @returns Promise that resolves when response is fully written
 */
function setResponse(res: import('http').ServerResponse, response: Response): Promise<void>;
```

**Usage Examples:**

```typescript
import { setResponse } from '@sveltejs/kit/node';
import { json } from '@sveltejs/kit';
import { createServer } from 'http';

const server = createServer(async (req, res) => {
  try {
    // Create a Web API Response
    const response = json({ 
      message: 'Hello from SvelteKit',
      timestamp: new Date().toISOString()
    });
    
    // Apply it to Node.js response
    await setResponse(res, response);
    
  } catch (error) {
    console.error('Response conversion failed:', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

### File Streaming

Convert files to ReadableStream for efficient file serving.

```typescript { .api }
/**
 * Converts a file on disk to a readable stream
 * @param file - Path to the file
 * @returns ReadableStream for the file
 * @since 2.4.0
 */
function createReadableStream(file: string): ReadableStream;
```

**Usage Examples:**

```typescript
import { createReadableStream } from '@sveltejs/kit/node';
import { join } from 'path';

// In an API endpoint
export async function GET({ params }) {
  const filename = params.filename;
  const filepath = join('uploads', filename);
  
  // Check if file exists and is safe to serve
  if (!isFileAccessible(filepath)) {
    throw error(404, 'File not found');
  }
  
  // Create stream
  const stream = createReadableStream(filepath);
  
  return new Response(stream, {
    headers: {
      'Content-Type': getMimeType(filename),
      'Content-Disposition': `attachment; filename="${filename}"`
    }
  });
}
```

### Web API Polyfills

Install web API polyfills for Node.js environments.

```typescript { .api }
/**
 * Make various web APIs available as globals in Node.js:
 * - crypto (from node:crypto webcrypto)
 * - File (from node:buffer, Node 18.13+)
 */
function installPolyfills(): void;
```

**Usage Examples:**

```typescript
// src/hooks.server.js or app.js
import { installPolyfills } from '@sveltejs/kit/node/polyfills';

// Install polyfills at application startup
installPolyfills();

// Now you can use web APIs in Node.js
export async function handle({ event, resolve }) {
  // Use crypto API
  const hash = await crypto.subtle.digest('SHA-256', 
    new TextEncoder().encode('hello world')
  );
  
  // Use File API (Node 18.13+)
  const file = new File(['content'], 'test.txt', { type: 'text/plain' });
  
  return resolve(event);
}
```

## Integration Patterns

### Custom Node.js Server

```typescript
// server.js
import { installPolyfills } from '@sveltejs/kit/node/polyfills';
import { getRequest, setResponse } from '@sveltejs/kit/node';
import { Server } from '@sveltejs/kit';
import { createServer } from 'http';
import { readFileSync } from 'fs';

// Install polyfills
installPolyfills();

// Load SvelteKit app
const manifest = JSON.parse(readFileSync('build/manifest.json', 'utf8'));
const app = new Server(manifest);

await app.init({
  env: process.env
});

const server = createServer(async (req, res) => {
  try {
    // Convert Node.js request to Web API
    const request = await getRequest({
      request: req,
      base: `http://${req.headers.host}`,
      bodySizeLimit: 10 * 1024 * 1024 // 10MB
    });
    
    // Get SvelteKit response
    const response = await app.respond(request, {
      getClientAddress: () => {
        return req.socket.remoteAddress || '127.0.0.1';
      }
    });
    
    // Convert Web API response to Node.js
    await setResponse(res, response);
    
  } catch (error) {
    console.error('Server error:', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

### Express.js Integration

```typescript
// server.js
import { installPolyfills } from '@sveltejs/kit/node/polyfills';
import { getRequest, setResponse } from '@sveltejs/kit/node';
import { Server } from '@sveltejs/kit';
import express from 'express';

installPolyfills();

const app = express();
const manifest = JSON.parse(readFileSync('build/manifest.json', 'utf8'));
const svelteKit = new Server(manifest);

await svelteKit.init({ env: process.env });

// Serve static files
app.use(express.static('build/client'));

// SvelteKit handler
app.use(async (req, res, next) => {
  try {
    const request = await getRequest({
      request: req,
      base: `${req.protocol}://${req.get('host')}`,
      bodySizeLimit: 10 * 1024 * 1024
    });
    
    const response = await svelteKit.respond(request, {
      getClientAddress: () => req.ip || req.socket.remoteAddress
    });
    
    await setResponse(res, response);
  } catch (error) {
    next(error);
  }
});

app.listen(3000);
```

### File Streaming

Converts a file on disk to a ReadableStream for efficient file serving.

```typescript { .api }
/**
 * Converts a file on disk to a readable stream
 * @param file - Path to the file on disk
 * @returns ReadableStream for the file
 * @since 2.4.0
 */
function createReadableStream(file: string): ReadableStream;
```

### Web API Polyfills

Installs Web API polyfills in Node.js environments.

```typescript { .api }
/**
 * Installs web API polyfills for Node.js environments
 * Adds support for crypto, File, FormData, and other web APIs
 */
function installPolyfills(): void;
```

**Import Path:**

```typescript
import { installPolyfills } from '@sveltejs/kit/node/polyfills';
```

**Usage Examples:**

```typescript
// At application startup
import { installPolyfills } from '@sveltejs/kit/node/polyfills';

installPolyfills();

// Now you can use web APIs in Node.js
const encoder = new TextEncoder();
const data = encoder.encode('Hello World');
```

### File Upload with Streams

```typescript
// src/routes/api/upload/+server.js
import { createReadableStream } from '@sveltejs/kit/node';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { join } from 'path';

export async function POST({ request }) {
  const contentType = request.headers.get('content-type');
  
  if (!contentType?.startsWith('multipart/form-data')) {
    throw error(400, 'Expected multipart/form-data');
  }
  
  const formData = await request.formData();
  const file = formData.get('file');
  
  if (!file || !(file instanceof File)) {
    throw error(400, 'No file provided');
  }
  
  // Save file using streams for memory efficiency
  const uploadPath = join('uploads', `${Date.now()}-${file.name}`);
  const writeStream = createWriteStream(uploadPath);
  
  try {
    // Convert File to ReadableStream and pipe to file
    const reader = file.stream().getReader();
    const readableStream = new ReadableStream({
      start(controller) {
        function pump() {
          return reader.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }
            controller.enqueue(value);
            return pump();
          });
        }
        return pump();
      }
    });
    
    // Use pipeline for proper error handling
    await pipeline(
      Readable.fromWeb(readableStream),
      writeStream
    );
    
    return json({
      message: 'File uploaded successfully',
      filename: file.name,
      size: file.size,
      path: uploadPath
    });
    
  } catch (error) {
    console.error('Upload failed:', error);
    throw error(500, 'Upload failed');
  }
}
```

### Custom Asset Serving

```typescript
// src/routes/assets/[...path]/+server.js
import { createReadableStream } from '@sveltejs/kit/node';
import { stat } from 'fs/promises';
import { join, extname } from 'path';

const ASSETS_DIR = 'static/assets';
const MIME_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain'
};

export async function GET({ params, request, setHeaders }) {
  const path = params.path;
  const filepath = join(ASSETS_DIR, path);
  
  // Security: prevent directory traversal
  if (path.includes('..') || !filepath.startsWith(ASSETS_DIR)) {
    throw error(403, 'Access denied');
  }
  
  try {
    const stats = await stat(filepath);
    
    if (!stats.isFile()) {
      throw error(404, 'File not found');
    }
    
    // Check if-modified-since header
    const ifModifiedSince = request.headers.get('if-modified-since');
    if (ifModifiedSince) {
      const modifiedSince = new Date(ifModifiedSince);
      if (stats.mtime <= modifiedSince) {
        return new Response(null, { status: 304 });
      }
    }
    
    // Determine content type
    const ext = extname(filepath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    
    // Set caching headers
    setHeaders({
      'Content-Type': contentType,
      'Content-Length': stats.size.toString(),
      'Last-Modified': stats.mtime.toUTCString(),
      'Cache-Control': 'public, max-age=3600', // 1 hour
      'ETag': `"${stats.mtime.getTime()}-${stats.size}"`
    });
    
    // Create and return stream
    const stream = createReadableStream(filepath);
    return new Response(stream);
    
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw error(404, 'File not found');
    }
    throw error(500, 'Failed to serve file');
  }
}
```

## Best Practices

1. **Install polyfills early**: Call `installPolyfills()` at application startup
2. **Handle body size limits**: Set appropriate `bodySizeLimit` to prevent memory issues
3. **Error handling**: Always wrap conversion calls in try-catch blocks
4. **Stream large files**: Use `createReadableStream()` for efficient file serving
5. **Security**: Validate file paths and prevent directory traversal attacks
6. **Headers**: Preserve important headers during conversion
7. **Memory management**: Use streams for large file operations
8. **Client IP**: Properly extract client IP addresses from request objects
9. **Content types**: Set appropriate MIME types for file responses
10. **Caching**: Implement proper caching headers for static assets