# Server-Side Rendering

Vite provides comprehensive server-side rendering capabilities with module runner, environment management, SSR-specific optimizations, and seamless integration between client and server environments.

## Capabilities

### Module Runner

Create and manage module runners for executing code in SSR environments.

```typescript { .api }
/**
 * Create server-side module runner
 * @param server - Vite dev server instance  
 * @param options - Module runner options
 * @returns Promise resolving to ModuleRunner instance
 */
function createServerModuleRunner(
  server: ViteDevServer,
  options?: ServerModuleRunnerOptions
): Promise<ModuleRunner>;

interface ModuleRunner {
  /** Import and execute module */
  import<T = any>(url: string): Promise<T>;
  /** Destroy runner and cleanup */
  destroy(): Promise<void>;
  /** Clear module cache */
  clearCache(): void;
  /** Module cache */
  moduleCache: EvaluatedModules;
  /** HMR client */
  hmrClient?: HMRClient;
}
```

**Usage Examples:**

```typescript
import { createServer, createServerModuleRunner } from "vite";

// Create server and module runner
const server = await createServer({
  server: { middlewareMode: true }
});

const runner = await createServerModuleRunner(server, {
  hmr: {
    logger: console
  }
});

// Import and execute SSR module
const { render } = await runner.import('./src/entry-server.js');
const html = await render({ url: '/about' });

// Cleanup
await runner.destroy();
await server.close();
```

### Module Runner Transport

Create transport mechanisms for module runner communication.

```typescript { .api }
/**
 * Create server module runner transport
 * @param options - Transport options
 * @returns Module runner transport handlers
 */
function createServerModuleRunnerTransport(
  options?: {
    runner?: ModuleRunner;
    transport?: ModuleRunnerTransport;
  }
): ModuleRunnerTransportHandlers;

interface ModuleRunnerTransport {
  /** Connect to transport */
  connect(): void | Promise<void>;
  /** Disconnect from transport */
  disconnect(): void | Promise<void>;
  /** Send message */
  send(data: any): void | Promise<void>;
  /** Handle incoming messages */
  on(event: string, handler: Function): void;
}

interface ModuleRunnerTransportHandlers {
  /** Fetch module handler */
  fetchModule: (id: string, importer?: string) => Promise<FetchResult>;
  /** Transform handler */
  transform: (id: string, code: string) => Promise<{ code: string; map?: any }>;
}
```

### Fetch Module

Fetch and process modules for SSR execution.

```typescript { .api }
/**
 * Fetch module for SSR
 * @param server - Vite dev server
 * @param url - Module URL to fetch
 * @param importer - Importing module
 * @param options - Fetch options
 * @returns Promise resolving to fetch result
 */
function fetchModule(
  server: ViteDevServer,
  url: string,
  importer?: string,
  options?: FetchModuleOptions
): Promise<FetchResult>;

interface FetchModuleOptions {
  /** SSR mode */
  ssr?: boolean;
  /** Transform options */
  transformOptions?: TransformOptions;
}

interface FetchResult {
  /** Externalized module URL */
  externalize?: string;
  /** Module code */
  code?: string;
  /** Source map */
  map?: SourceMap;
}
```

### Runner Import

Import modules in runner context with proper error handling.

```typescript { .api }
/**
 * Import module in runner context
 * @param runner - Module runner instance
 * @param id - Module ID to import
 * @returns Promise resolving to module exports
 */
function runnerImport<T = any>(runner: ModuleRunner, id: string): Promise<T>;
```

### SSR Transform

Transform modules for SSR execution with proper module format handling.

```typescript { .api }
/**
 * Transform modules for SSR (alias for ssrTransform)
 * @param code - Source code
 * @param inMap - Input source map
 * @param url - Module URL
 * @param originalCode - Original untransformed code
 * @param options - Transform options
 * @returns Promise resolving to transform result
 */
function moduleRunnerTransform(
  code: string,
  inMap: SourceMap | null,
  url: string,
  originalCode?: string,
  options?: ModuleRunnerTransformOptions
): Promise<TransformResult>;

interface ModuleRunnerTransformOptions {
  /** SSR mode */
  ssr?: boolean;
  /** Environment name */
  environment?: string;
}
```

## SSR Configuration

### SSR Options

Configure server-side rendering behavior and optimizations.

```typescript { .api }
interface SSROptions {
  /** External packages (not bundled) */
  external?: string[];
  /** Force bundling (opposite of external) */
  noExternal?: string[] | true;
  /** SSR target environment */
  target?: SSRTarget;
  /** Resolution configuration */
  resolve?: {
    conditions?: string[];
    externalConditions?: string[];
  };
  /** Dependency optimization for SSR */
  optimizeDeps?: SsrDepOptimizationConfig;
}

interface ResolvedSSROptions extends SSROptions {
  external: string[];
  noExternal: string[] | true;
  target: SSRTarget;
  resolve: {
    conditions: string[];
    externalConditions: string[];
  };
  optimizeDeps: SsrDepOptimizationConfig;
}

type SSRTarget = 'node' | 'webworker';
```

**Usage Examples:**

```typescript
export default defineConfig({
  ssr: {
    external: ['some-large-lib'],
    noExternal: ['@my-org/shared-components'],
    target: 'node',
    resolve: {
      conditions: ['node', 'import', 'module', 'default'],
      externalConditions: ['node']
    }
  }
});
```

### SSR Dependency Optimization

Configure dependency optimization specifically for SSR builds.

```typescript { .api }
interface SsrDepOptimizationConfig {
  /** Dependencies to pre-bundle */
  include?: string[];
  /** Dependencies to exclude from pre-bundling */
  exclude?: string[];
  /** Additional esbuild options */
  esbuildOptions?: any;
}
```

## Module Runner Options

### Runner Configuration

Configure module runner behavior and environment.

```typescript { .api }
interface ModuleRunnerOptions {
  /** Root directory */
  root?: string;
  /** Fetch function for modules */
  fetch: FetchFunction;
  /** Source map support */
  sourcemapInterceptor?: 'prepareStackTrace' | 'node' | InterceptorOptions | false;
  /** Module evaluator */
  evaluator?: ModuleEvaluator;
  /** HMR configuration */
  hmr?: ModuleRunnerHmr;
  /** Environment name */
  environment?: string;
}

interface ServerModuleRunnerOptions extends Omit<ModuleRunnerOptions, 'fetch'> {
  /** Fetch function override */
  fetch?: FetchFunction;
  /** Transport configuration */
  transport?: ModuleRunnerTransport;
}

/**
 * Function to fetch modules
 */
type FetchFunction = (
  id: string,
  importer?: string,
  options?: FetchFunctionOptions
) => Promise<FetchResult>;

interface FetchFunctionOptions {
  /** Whether this is an SSR request */
  ssr?: boolean;
}
```

### Module Evaluator

Configure how modules are evaluated in the runner environment.

```typescript { .api }
interface ModuleEvaluator {
  /** Evaluate module code */
  runInlinedModule(
    context: ModuleRunnerContext,
    code: string,
    id: string
  ): Promise<any>;
  /** Run external module */
  runExternalModule(filepath: string): Promise<any>;
}

interface ModuleRunnerContext {
  /** Module runner instance */
  runner: ModuleRunner;
  /** Module filename */
  filename: string;
  /** Module URL */
  url: string;
}

class ESModulesEvaluator implements ModuleEvaluator {
  runInlinedModule(context: ModuleRunnerContext, code: string, id: string): Promise<any>;
  runExternalModule(filepath: string): Promise<any>;
}
```

### HMR for Module Runner

Configure Hot Module Replacement for module runner environments.

```typescript { .api }
interface ModuleRunnerHmr {
  /** HMR logger */
  logger?: HMRLogger;
  /** Connection configuration */
  connection?: 'ws' | ModuleRunnerHMRConnection;
}

interface ModuleRunnerHMRConnection {
  /** Create connection */
  connect(): void | Promise<void>;
  /** Disconnect */
  disconnect(): void | Promise<void>;
  /** Send data */
  send(data: any): void | Promise<void>;
  /** Handle incoming data */
  on(event: string, handler: (data: any) => void): void;
}

interface HMRLogger {
  error(msg: string | Error): void;
  debug(...msg: any[]): void;
}
```

## Advanced SSR Patterns

### Import Meta

Create appropriate import.meta objects for different environments.

```typescript { .api }
/**
 * Create default import.meta object
 * @param url - Module URL
 * @param context - Runner context
 * @returns import.meta object
 */
function createDefaultImportMeta(url: string, context?: ModuleRunnerContext): ModuleRunnerImportMeta;

/**
 * Create Node.js-specific import.meta object
 * @param url - Module URL
 * @param context - Runner context
 * @returns import.meta object with Node.js features
 */  
function createNodeImportMeta(url: string, context?: ModuleRunnerContext): ModuleRunnerImportMeta;

interface ModuleRunnerImportMeta {
  url: string;
  env: Record<string, any>;
  hot?: {
    accept(): void;
    decline(): void;
    dispose(cb: () => void): void;
    invalidate(): void;
  };
  glob?: ImportGlobFunction;
}
```

### Evaluated Modules

Manage and track evaluated modules in the runner.

```typescript { .api }
class EvaluatedModules {
  /** Normalize module ID */
  static normalizeModuleId(id: string): string;
  /** Get evaluated module */
  get(id: string): EvaluatedModuleNode | undefined;
  /** Set evaluated module */
  set(id: string, mod: EvaluatedModuleNode): void;
  /** Delete module */
  delete(id: string): boolean;
  /** Clear all modules */
  clear(): void;
  /** Invalidate module */
  invalidate(id: string): void;
}

interface EvaluatedModuleNode {
  /** Module exports */
  exports: any;
  /** Module meta */
  meta: SSRImportMetadata;
  /** Evaluation promise */
  promise?: Promise<any>;
  /** Error during evaluation */
  error?: Error;
}

interface SSRImportMetadata {
  /** Module URL */
  url: string;
  /** Module timestamp */
  timestamp: number;
  /** Hot context */
  hot?: {
    accept(): void;
    decline(): void;
    dispose(cb: () => void): void;
    invalidate(): void;
  };
}
```