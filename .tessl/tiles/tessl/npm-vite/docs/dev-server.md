# Development Server

Vite's development server provides instant server start, native ES modules, and lightning-fast Hot Module Replacement (HMR). It includes middleware support, proxy configuration, and comprehensive file serving capabilities.

## Capabilities

### Create Server

Creates a Vite development server instance.

```typescript { .api }
/**
 * Create a Vite development server
 * @param config - Inline configuration options
 * @returns Promise resolving to ViteDevServer instance
 */
function createServer(config?: InlineConfig): Promise<ViteDevServer>;

interface ViteDevServer {
  /** The resolved vite config object */
  config: ResolvedConfig;
  /** Connect middleware stack */
  middlewares: Connect.Server;
  /** Underlying HTTP server (null in middleware mode) */
  httpServer: HttpServer | null;
  /** Chokidar watcher instance */
  watcher: FSWatcher;
  /** WebSocket server for HMR */
  ws: WebSocketServer;
  /** Hot channel (alias to server.environments.client.hot) */
  hot: NormalizedHotChannel;
  /** Plugin container */
  pluginContainer: PluginContainer;
  /** Module execution environments */
  environments: Record<'client' | 'ssr' | (string & {}), DevEnvironment>;
  /** Module graph for tracking dependencies */
  moduleGraph: ModuleGraph;
  /** Resolved server URLs */
  resolvedUrls: ResolvedServerUrls | null;
  /** Transform request without HTTP pipeline */
  transformRequest(url: string, options?: TransformOptions): Promise<TransformResult | null>;
  /** Warm up URLs for caching */
  warmupRequest(url: string, options?: TransformOptions): Promise<void>;
  /** Apply HTML transforms */
  transformIndexHtml(url: string, html: string, originalUrl?: string): Promise<string>;
  /** Transform module code into SSR format */
  ssrTransform(code: string, inMap: SourceMap | null, url: string, originalCode?: string): Promise<TransformResult | null>;
  /** Load URL as instantiated module for SSR */
  ssrLoadModule(url: string, opts?: { fixStacktrace?: boolean }): Promise<Record<string, any>>;
  /** Fix SSR stack trace */
  ssrRewriteStacktrace(stack: string): string;
  /** Mutate SSR error by rewriting stacktrace */
  ssrFixStacktrace(e: Error): void;
  /** Trigger HMR for a module */
  reloadModule(module: ModuleNode): Promise<void>;
  /** Start the server */
  listen(port?: number, isRestart?: boolean): Promise<ViteDevServer>;
  /** Stop the server */
  close(): Promise<void>;
  /** Print server URLs */
  printUrls(): void;
  /** Bind CLI shortcuts */
  bindCLIShortcuts(options?: BindCLIShortcutsOptions): void;
  /** Restart the server */
  restart(forceOptimize?: boolean): Promise<void>;
}
```

**Usage Examples:**

```typescript
import { createServer } from "vite";

// Basic server
const server = await createServer({
  server: {
    port: 3000,
    host: 'localhost'
  }
});

await server.listen();
console.log('Server running at:', server.resolvedUrls?.local[0]);

// Server with middleware
const server2 = await createServer();
server2.middlewares.use('/api', (req, res, next) => {
  if (req.url === '/api/health') {
    res.end('OK');
  } else {
    next();
  }
});

await server2.listen(4000);
```

### Server Configuration

Configure server behavior, ports, proxy, and middleware options.

```typescript { .api }
interface ServerOptions {
  /** Server host (default: 'localhost') */
  host?: string | boolean;
  /** Server port (default: 5173) */
  port?: number;
  /** Strictly enforce port */
  strictPort?: boolean;
  /** HTTPS options */
  https?: boolean | HttpsOptions;
  /** Open browser on server start */
  open?: boolean | string | OpenOptions;
  /** Proxy rules */
  proxy?: Record<string, string | ProxyOptions>;
  /** CORS options */
  cors?: boolean | CorsOptions;
  /** Headers to send */
  headers?: OutgoingHttpHeaders;
  /** File system serving options */
  fs?: FileSystemServeOptions;
  /** Origin checking */
  origin?: string;
  /** Force dependency pre-bundling */
  force?: boolean;
  /** HMR options */
  hmr?: boolean | HmrOptions;
  /** Watch options */
  watch?: WatchOptions;
  /** Middleware mode */
  middlewareMode?: boolean | 'html' | 'ssr';
  /** Middleware options */
  middlewareOptions?: {
    /** Base path for middleware */
    base?: string;
  };
}

interface ResolvedServerOptions extends ServerOptions {
  host: string | undefined;
  port: number;
  https: boolean;
  open: boolean;
  proxy: Record<string, ProxyOptions> | undefined;
  cors: CorsOptions | boolean;
  fs: Required<FileSystemServeOptions>;
  hmr: HmrOptions | boolean;
  watch: WatchOptions;
  middlewareMode: boolean | 'html' | 'ssr';
}
```

### File System Serving

Control which files can be served and how file system access is managed.

```typescript { .api }
interface FileSystemServeOptions {
  /** Allow serving files outside root */
  strict?: boolean;
  /** Allowed directories */
  allow?: string[];
  /** Deny patterns */
  deny?: string[];
  /** Case sensitive file names */
  caseSensitive?: boolean | 'auto';
}

/**
 * Check if file serving is allowed
 * @param filename - File path to check
 * @param server - Vite dev server instance
 * @returns Whether file can be served
 */
function isFileServingAllowed(filename: string, server: ViteDevServer): boolean;

/**
 * Check if file loading is allowed
 * @param filename - File path to check  
 * @param server - Vite dev server instance
 * @returns Whether file can be loaded
 */
function isFileLoadingAllowed(filename: string, server: ViteDevServer): boolean;
```

### Server URLs Resolution

Resolve and format server URLs for different network interfaces.

```typescript { .api }
interface ResolvedServerUrls {
  /** Local URLs (localhost) */
  local: string[];
  /** Network URLs (LAN) */
  network: string[];
}
```

### Proxy Configuration

Configure proxy rules for API requests and external services.

```typescript { .api }
interface ProxyOptions {
  /** Target URL to proxy to */
  target?: string;
  /** Change origin header */
  changeOrigin?: boolean;
  /** Rewrite path */
  pathRewrite?: Record<string, string> | ((path: string) => string);
  /** Proxy WebSocket */
  ws?: boolean;
  /** Configure proxy agent */
  agent?: any;
  /** Custom request headers */
  headers?: Record<string, string>;
  /** Proxy timeout */
  timeout?: number;
  /** Secure proxy */
  secure?: boolean;
  /** Configure response handler */
  configure?: (proxy: any, options: ProxyOptions) => void;
}
```

### HTTP Send

Send HTTP responses with proper headers and caching.

```typescript { .api }
/**
 * Send HTTP response with appropriate headers
 * @param req - HTTP request
 * @param res - HTTP response  
 * @param content - Response content
 * @param type - Content type
 * @param options - Send options
 */
function send(
  req: IncomingMessage,
  res: ServerResponse,
  content: string | Buffer,
  type: string,
  options: SendOptions
): void;

interface SendOptions {
  /** Enable etag header */
  etag?: string;
  /** Cache control header */
  cacheControl?: string;
  /** Additional headers */
  headers?: OutgoingHttpHeaders;
  /** Source map */
  map?: SourceMap | null;
}
```

## Server Types

```typescript { .api }
type HttpServer = http.Server | http2.Http2SecureServer;

interface HttpsOptions {
  key?: string | Buffer | Array<string | Buffer>;
  cert?: string | Buffer | Array<string | Buffer>;
  ca?: string | Buffer | Array<string | Buffer>;
  pfx?: string | Buffer | Array<string | Buffer>;
  passphrase?: string;
}

interface OpenOptions {
  /** URL or pathname to open */
  url?: string;
  /** Browser app name */
  app?: string | readonly string[];
  /** Wait for app */
  wait?: boolean;
}

type ServerHook = (
  server: ViteDevServer
) => (() => void) | void | Promise<(() => void) | void>;

interface CommonServerOptions {
  /** Server port */
  port?: number;
  /** Server host */
  host?: string | boolean;
  /** HTTPS configuration */
  https?: boolean | HttpsOptions;
  /** Open browser */
  open?: boolean | string | OpenOptions;
  /** Proxy configuration */
  proxy?: Record<string, string | ProxyOptions>;
  /** CORS configuration */
  cors?: boolean | CorsOptions;
  /** Custom headers */
  headers?: OutgoingHttpHeaders;
}
```