# SvelteKit

SvelteKit is a comprehensive web application framework built on top of Svelte that provides a streamlined development experience for building modern web applications. It offers file-based routing, server-side rendering (SSR), static site generation (SSG), and client-side rendering capabilities with automatic code splitting and optimized builds. SvelteKit includes built-in TypeScript support, extensive adapter ecosystem for various deployment platforms, and integrates seamlessly with Vite for fast development and building.

## Package Information

- **Package Name**: @sveltejs/kit
- **Package Type**: npm
- **Language**: JavaScript/TypeScript
- **Installation**: `npm install @sveltejs/kit`

## Core Imports

```typescript
import { error, redirect, json, fail } from "@sveltejs/kit";
```

For Node.js server integration:

```typescript
import { getRequest, setResponse } from "@sveltejs/kit/node";
```

For Vite configuration:

```typescript
import { sveltekit } from "@sveltejs/kit/vite";
```

## Basic Usage

```typescript
// Basic page load function (+page.server.js)
import { error, json } from "@sveltejs/kit";

export async function load({ params, fetch }) {
  const response = await fetch(`/api/posts/${params.id}`);
  
  if (!response.ok) {
    throw error(404, 'Post not found');
  }
  
  return {
    post: await response.json()
  };
}

// API endpoint (+server.js)
export async function GET({ url, params }) {
  const data = { message: 'Hello World' };
  return json(data);
}

// Form action (+page.server.js)
export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const email = data.get('email');
    
    if (!email) {
      return fail(400, { message: 'Email required' });
    }
    
    // Process form...
    return { success: true };
  }
};
```

## Architecture

SvelteKit is built around several key concepts:

- **File-based routing**: Routes are defined by the filesystem structure in `src/routes`
- **Universal load functions**: Share data loading logic between server and client
- **Form actions**: Progressive enhancement for form submissions
- **Adapters**: Deploy to different platforms (Vercel, Netlify, Node.js, static, etc.)
- **Hooks**: Customize request/response handling at the application level
- **App shell**: Minimal HTML shell for client-side navigation

## Capabilities

### Error Handling

Create HTTP errors and redirects that integrate with SvelteKit's error handling system.

```typescript { .api }
function error(status: number, body: App.Error | string): never;
function isHttpError(e: unknown, status?: number): boolean;
function redirect(status: 300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308, location: string | URL): never;
function isRedirect(e: unknown): boolean;
```

[Error Handling](./error-handling.md)

### Response Creation

Create properly formatted HTTP responses for APIs and endpoints.

```typescript { .api }
function json(data: any, init?: ResponseInit): Response;
function text(body: string, init?: ResponseInit): Response;
```

[Response Creation](./response-creation.md)

### Form Actions

Handle form submissions with progressive enhancement and validation.

```typescript { .api }
function fail(status: number, data?: any): ActionFailure;
function isActionFailure(e: unknown): boolean;

interface ActionFailure<T = undefined> {
  status: number;
  data: T;
}
```

[Form Actions](./form-actions.md)

### Load Functions

Load data for pages and layouts on both server and client.

```typescript { .api }
interface LoadEvent<Params = Record<string, string>, Data = Record<string, any>, ParentData = Record<string, any>> {
  params: Params;
  url: URL;
  route: { id: string };
  fetch: typeof fetch;
  data: Data;
  parent: () => Promise<ParentData>;
  depends: (...deps: string[]) => void;
  setHeaders: (headers: Record<string, string>) => void;
  untrack: <T>(fn: () => T) => T;
}

interface ServerLoadEvent<Params = Record<string, string>, ParentData = Record<string, any>> extends RequestEvent<Params> {
  parent: () => Promise<ParentData>;
  depends: (...deps: string[]) => void;
}
```

[Load Functions](./load-functions.md)

### Request Handling

Handle incoming HTTP requests with full access to request data and server context.

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

[Request Handling](./request-handling.md)

### Node.js Integration

Convert between Node.js HTTP objects and Web API Request/Response objects.

```typescript { .api }
function getRequest(options: {
  request: import('http').IncomingMessage;
  base: string;
  bodySizeLimit?: number;
}): Promise<Request>;

function setResponse(res: import('http').ServerResponse, response: Response): Promise<void>;

function createReadableStream(file: string): ReadableStream;
```

[Node.js Integration](./nodejs-integration.md)

### Hooks

Customize request/response handling and compose multiple hooks.

```typescript { .api }
type Handle = (input: {
  event: RequestEvent;
  resolve: (event: RequestEvent, opts?: ResolveOptions) => Promise<Response>;
}) => Promise<Response>;

function sequence(...handlers: Handle[]): Handle;
```

[Hooks](./hooks.md)

### Vite Integration

Configure SvelteKit with Vite for development and building.

```typescript { .api }
function sveltekit(): Promise<import('vite').Plugin[]>;
```

[Vite Integration](./vite-integration.md)

### App State and Navigation

Access page state, handle navigation, and manage client-side routing.

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
```

[App State and Navigation](./app-state-navigation.md)

### Configuration

Configure SvelteKit behavior, adapters, and build options.

```typescript { .api }
interface Config {
  kit?: KitConfig;
}

interface KitConfig {
  adapter?: Adapter;
  alias?: Record<string, string>;
  appDir?: string;
  csp?: CSPConfig;
  csrf?: CSRFConfig;
  env?: EnvConfig;
  files?: FilesConfig;
  inlineStyleThreshold?: number;
  paths?: PathsConfig;
  prerender?: PrerenderConfig;
  serviceWorker?: ServiceWorkerConfig;
  typescript?: TypeScriptConfig;
  version?: VersionConfig;
}
```

[Configuration](./configuration.md)

### App Server

Server-side utilities and remote functions for accessing request context and executing distributed operations.

```typescript { .api }
function getRequestEvent(): RequestEvent;
function read(asset: string): ReadableStream;
function query(id: string, ...args: any[]): Promise<any>;
function prerender(id: string, ...args: any[]): Promise<any>;
function command(id: string, ...args: any[]): Promise<any>;
function form(id: string, formData: FormData): Promise<any>;
```

[App Server](./app-server.md)

### App State

Reactive state management using Svelte 5 runes for page data, navigation state, and update notifications.

```typescript { .api }
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

const navigating: Navigation | null;

const updated: {
  current: boolean;
  check: () => Promise<boolean>;
};
```

[App State](./app-state.md)

### Service Worker

Service Worker utilities for caching strategies and offline functionality.

```typescript { .api }
const build: string[];
const files: string[];
const prerendered: string[];
const version: string;
```

[Service Worker](./service-worker.md)

### URL Normalization

Normalize URLs by stripping SvelteKit-internal suffixes and trailing slashes, with utilities to restore them.

```typescript { .api }
function normalizeUrl(url: URL | string): {
  url: URL;
  wasNormalized: boolean;
  denormalize: (url?: string | URL) => URL;
};
```

### CLI Commands

SvelteKit provides command-line utilities for development and build processes.

```bash { .api }
# Synchronize generated type definitions
svelte-kit sync
```

## Global Types

```typescript { .api }
declare namespace App {
  interface Error {
    message: string;
  }
  
  interface Locals {}
  
  interface PageData {}
  
  interface PageState {}
  
  interface Platform {}
}
```