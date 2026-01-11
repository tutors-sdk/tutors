# Vite

Vite is a next-generation frontend build tool that significantly improves the frontend development experience. It consists of two major parts: a dev server that serves source files over native ES modules with rich built-in features and lightning-fast Hot Module Replacement (HMR), and a build command that bundles code with Rollup, pre-configured to output highly optimized static assets for production.

## Package Information

- **Package Name**: vite
- **Package Type**: npm
- **Language**: TypeScript
- **Installation**: `npm install vite`

## Core Imports

```typescript
import { defineConfig, createServer, build } from "vite";
```

For CommonJS:

```javascript
const { defineConfig, createServer, build } = require("vite");
```

## Basic Usage

```typescript
import { defineConfig, createServer } from "vite";

// Define configuration
const config = defineConfig({
  root: "./src",
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: "../dist"
  }
});

// Create development server
const server = await createServer(config);
await server.listen();
console.log(`Dev server running at ${server.resolvedUrls?.local[0]}`);
```

## Architecture

Vite is built around several key components:

- **Configuration System**: Flexible configuration with `defineConfig()` supporting multiple environments and modes
- **Development Server**: Fast dev server with native ES modules and instant HMR 
- **Build System**: Production builds powered by Rollup with optimizations
- **Plugin System**: Extensible architecture compatible with Rollup plugins
- **Environment Management**: Support for different environments (client, server, etc.)
- **Module Processing**: Advanced module resolution, CSS processing, and asset handling

## Capabilities

### Configuration

Core configuration system for defining build options, server settings, and plugin configurations. Supports environment-specific settings and TypeScript integration.

```typescript { .api }
function defineConfig(config: UserConfig): UserConfig;
function defineConfig(configFn: UserConfigFn): UserConfigFn;
function defineConfig(configObj: UserConfigFnObject): UserConfigFnObject;

interface UserConfig {
  root?: string;
  base?: string;
  mode?: string;
  define?: Record<string, any>;
  plugins?: PluginOption[];
  server?: ServerOptions;
  build?: BuildOptions;
  preview?: PreviewOptions;
  ssr?: SSROptions;
  optimizeDeps?: DepOptimizationOptions;
  environments?: Record<string, EnvironmentOptions>;
}
```

[Configuration](./configuration.md)

### Development Server

Development server with native ES modules, instant server start, and lightning-fast HMR. Supports middleware, proxy configuration, and file serving options.

```typescript { .api }
function createServer(config?: InlineConfig): Promise<ViteDevServer>;

interface ViteDevServer {
  listen(port?: number, isRestart?: boolean): Promise<ViteDevServer>;
  close(): Promise<void>;
  restart(forceOptimize?: boolean): Promise<void>;
  ws: WebSocketServer;
  middlewares: Connect.Server;
  httpServer: HttpServer | null;
  resolvedUrls: ResolvedServerUrls | null;
}
```

[Development Server](./dev-server.md)

### Build System

Production build system powered by Rollup with advanced optimizations, code splitting, and asset processing. Supports library builds and custom output formats.

```typescript { .api }
function build(config?: InlineConfig): Promise<RollupOutput | RollupOutput[] | RollupWatcher>;
function createBuilder(config?: InlineConfig): Promise<ViteBuilder>;

interface ViteBuilder {
  build(config?: BuilderOptions): Promise<RollupOutput | RollupOutput[]>;
  close(): Promise<void>;
}
```

[Build System](./build-system.md)

### Preview Server

Preview server for testing production builds locally with the same behavior as the production environment.

```typescript { .api }
function preview(config?: InlineConfig): Promise<PreviewServer>;

interface PreviewServer {
  listen(port?: number): Promise<PreviewServer>;
  close(): Promise<void>;
  printUrls(): void;
  resolvedUrls: ResolvedServerUrls | null;
}
```

### Plugin System

Extensible plugin architecture compatible with Rollup plugins. Supports hooks for all phases of development and build processes.

```typescript { .api }
interface Plugin extends RollupPlugin {
  name: string;
  enforce?: 'pre' | 'post';
  apply?: 'build' | 'serve' | ((config: UserConfig, env: ConfigEnv) => boolean);
  config?: (config: UserConfig, env: ConfigEnv) => void | UserConfig | Promise<void | UserConfig>;
  configResolved?: (config: ResolvedConfig) => void | Promise<void>;
  configureServer?: (server: ViteDevServer) => void | Promise<void>;
  buildStart?: (opts: InputOptions) => void | Promise<void>;
  buildEnd?: (err?: Error) => void | Promise<void>;
}

type PluginOption = Plugin | false | null | undefined | PluginOption[];
```

[Plugin System](./plugin-system.md)

### Module Resolution

Advanced module resolution with support for aliases, conditions, and custom resolvers. Handles ES modules, CommonJS, and various asset types.

```typescript { .api }
function createIdResolver(config: ResolvedConfig): Promise<IdResolver>;

interface ResolveOptions {
  alias?: AliasOptions;
  conditions?: string[];
  mainFields?: string[];
  extensions?: string[];
  preserveSymlinks?: boolean;
}
```

[Module Resolution](./module-resolution.md)

### CSS Processing

Comprehensive CSS processing with support for preprocessors, CSS modules, PostCSS, and advanced optimizations.

```typescript { .api }
function preprocessCSS(
  code: string,
  filename: string,
  config: ResolvedConfig
): Promise<PreprocessCSSResult>;

interface CSSOptions {
  modules?: CSSModulesOptions;
  preprocessorOptions?: {
    sass?: SassPreprocessorOptions;
    scss?: SassPreprocessorOptions;
    less?: LessPreprocessorOptions;
    stylus?: StylusPreprocessorOptions;
  };
  postcss?: PostCSSOptions;
  devSourcemap?: boolean;
}
```

[CSS Processing](./css-processing.md)

### Server-Side Rendering

Server-side rendering capabilities with module runner, environment management, and SSR-specific optimizations.

```typescript { .api }
function createServerModuleRunner(
  server: ViteDevServer,
  options?: ServerModuleRunnerOptions
): Promise<ModuleRunner>;

interface SSROptions {
  external?: string[];
  noExternal?: string[] | true;
  target?: SSRTarget;
  resolve?: {
    conditions?: string[];
    externalConditions?: string[];
  };
  optimizeDeps?: SsrDepOptimizationConfig;
}
```

[Server-Side Rendering](./ssr.md)

### Hot Module Replacement

Hot Module Replacement system with WebSocket communication, client-server coordination, and plugin integration.

```typescript { .api }
function createServerHotChannel(): ServerHotChannel;

interface HmrOptions {
  port?: number;
  host?: string;
  clientPort?: number;
  overlay?: boolean;
}

interface HotPayload {
  type: 'connected' | 'update' | 'full-reload' | 'prune' | 'error' | 'custom';
}
```

[Hot Module Replacement](./hmr.md)

### Utility Functions

Essential utility functions for configuration, logging, and development workflows.

```typescript { .api }
function mergeConfig<T extends Record<string, any>>(
  defaults: T,
  overrides: T,
  isRoot?: boolean
): T;

function createLogger(level?: LogLevel, options?: LoggerOptions): Logger;

function loadEnv(
  mode: string,
  envDir: string,
  prefixes?: string | string[]
): Record<string, string>;

function normalizePath(id: string): string;

function optimizeDeps(
  config: ResolvedConfig,
  force?: boolean,
  asCommand?: boolean
): Promise<DepOptimizationMetadata>;

function transformWithEsbuild(
  code: string,
  filename: string,
  options?: TransformOptions,
  inMap?: object
): Promise<ESBuildTransformResult>;
```

[Utilities](./utilities.md)

## Core Types

```typescript { .api }
interface ConfigEnv {
  command: 'build' | 'serve';
  mode: string;
  isSsrBuild?: boolean;
  isPreview?: boolean;
}

interface ResolvedConfig {
  root: string;
  base: string;
  mode: string;
  command: 'build' | 'serve';
  isProduction: boolean;
  plugins: readonly Plugin[];
  server: ResolvedServerOptions;
  build: ResolvedBuildOptions;
  env: Record<string, any>;
  logger: Logger;
}

type UserConfigFn = (env: ConfigEnv) => UserConfig | Promise<UserConfig>;
type UserConfigExport = UserConfig | Promise<UserConfig> | UserConfigFn;

interface Logger {
  info(msg: string, options?: LogOptions): void;
  warn(msg: string, options?: LogOptions): void;
  error(msg: string, options?: LogOptions): void;
  clearScreen(type: LogType): void;
  hasErrorLogged(error: Error): boolean;
  hasWarned: boolean;
}

interface LoggerOptions {
  prefix?: string;
  allowClearScreen?: boolean;
  customLogger?: Logger;
}

interface DepOptimizationMetadata {
  hash: string;
  processing: boolean;
  discovered: Record<string, string>;
  chunks: Record<string, string>;
}

interface ESBuildTransformResult {
  code: string;
  map: any;
  warnings: any[];
}

type LogLevel = 'error' | 'warn' | 'info' | 'silent';
type LogType = 'error' | 'warn';
interface LogOptions {
  clear?: boolean;
  timestamp?: boolean;
}

interface TransformOptions {
  loader?: 'js' | 'jsx' | 'ts' | 'tsx';
  target?: string;
  format?: 'esm' | 'cjs' | 'iife';
  platform?: 'browser' | 'node' | 'neutral';
  define?: Record<string, string>;
  jsx?: 'transform' | 'preserve';
  jsxFactory?: string;
  jsxFragment?: string;
}
```