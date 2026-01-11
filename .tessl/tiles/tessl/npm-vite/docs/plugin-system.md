# Plugin System

Vite's plugin system provides extensible architecture compatible with Rollup plugins. It supports hooks for all phases of development and build processes, with environment-specific plugin capabilities and comprehensive lifecycle management.

## Capabilities

### Plugin Interface

Core plugin interface extending Rollup plugins with Vite-specific hooks.

```typescript { .api }
interface Plugin extends RollupPlugin {
  /** Plugin name (required) */
  name: string;
  /** Plugin enforcement order */
  enforce?: 'pre' | 'post';
  /** When to apply plugin */
  apply?: 'build' | 'serve' | ((config: UserConfig, env: ConfigEnv) => boolean);
  /** Config modification hook */
  config?: (config: UserConfig, env: ConfigEnv) => void | UserConfig | Promise<void | UserConfig>;
  /** Config resolved hook */
  configResolved?: (config: ResolvedConfig) => void | Promise<void>;
  /** Configure server hook */
  configureServer?: (server: ViteDevServer) => void | Promise<void>;
  /** Configure preview server hook */
  configurePreviewServer?: (server: PreviewServer) => void | Promise<void>;
  /** Build start hook */
  buildStart?: (opts: InputOptions) => void | Promise<void>;
  /** Build end hook */
  buildEnd?: (err?: Error) => void | Promise<void>;
  /** Write bundle hook */
  writeBundle?: (options: OutputOptions, bundle: OutputBundle) => void | Promise<void>;
  /** Close bundle hook */
  closeBundle?: () => void | Promise<void>;
  /** Generate bundle hook */
  generateBundle?: (options: OutputOptions, bundle: OutputBundle) => void | Promise<void>;
  /** Render chunk hook */
  renderChunk?: (code: string, chunk: RenderedChunk, options: OutputOptions) => string | { code: string; map?: SourceMapInput } | null | Promise<string | { code: string; map?: SourceMapInput } | null>;
  /** Transform hook */
  transform?: (code: string, id: string) => string | { code: string; map?: SourceMapInput } | null | Promise<string | { code: string; map?: SourceMapInput } | null>;
  /** Load hook */
  load?: (id: string) => string | { code: string; map?: SourceMapInput } | null | Promise<string | { code: string; map?: SourceMapInput } | null>;
  /** Resolve ID hook */
  resolveId?: (id: string, importer?: string, options?: { custom?: any; isEntry: boolean }) => string | { id: string; external?: boolean } | null | Promise<string | { id: string; external?: boolean } | null>;
  /** Handle HMR update */
  handleHotUpdate?: (ctx: HmrContext) => Array<ModuleNode> | void | Promise<Array<ModuleNode> | void>;
}

type PluginOption = Plugin | false | null | undefined | PluginOption[];

/**
 * Plugin hook handler with context
 */
interface HookHandler<T, O> {
  handler: T;
  order?: 'pre' | 'post' | null;
  once?: boolean;
}
```

**Usage Examples:**

```typescript
import type { Plugin } from "vite";

// Basic plugin
function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    config(config, { command }) {
      if (command === 'serve') {
        config.define = config.define || {};
        config.define.__DEV__ = true;
      }
    },
    configureServer(server) {
      server.middlewares.use('/api', myApiHandler);
    }
  };
}

// Plugin with options
interface MyPluginOptions {
  prefix?: string;
  debug?: boolean;
}

function myPluginWithOptions(options: MyPluginOptions = {}): Plugin {
  return {
    name: 'my-plugin-with-options',
    enforce: 'pre',
    apply: 'build',
    transform(code, id) {
      if (options.debug) {
        console.log(`Transforming: ${id}`);
      }
      return options.prefix ? `${options.prefix}\n${code}` : code;
    }
  };
}
```

### Per-Environment Plugin

Create environment-specific plugins that can behave differently across environments.

```typescript { .api }
/**
 * Create environment-specific plugin
 * @param name - Plugin name
 * @param factory - Factory function returning environment-specific plugin
 * @returns Plugin that adapts to different environments
 */
function perEnvironmentPlugin(
  name: string,
  factory: (environment: Environment) => Plugin
): Plugin;
```

### Plugin Context

Context objects available to plugin hooks for accessing Vite functionality.

```typescript { .api }
interface ConfigPluginContext {
  /** Add watch files */
  addWatchFile(file: string): void;
  /** Get watch files */
  getWatchFiles(): string[];
}

interface MinimalPluginContextWithoutEnvironment {
  /** Emit file */
  emitFile(file: EmittedFile): string;
  /** Get file name */
  getFileName(referenceId: string): string;
  /** Get module info */
  getModuleInfo(id: string): ModuleInfo | null;
  /** Get module IDs */
  getModuleIds(): IterableIterator<string>;
  /** Parse */
  parse(input: string, options?: any): any;
  /** Resolve */
  resolve(id: string, importer?: string, options?: ResolveOptions): Promise<ResolveIdResult | null>;
  /** Set asset source */
  setAssetSource(referenceId: string, source: string | Uint8Array): void;
  /** Error */
  error(message: string | RollupError, position?: number | { column: number; line: number }): never;
  /** Warn */
  warn(message: string | RollupError, position?: number | { column: number; line: number }): void;
}
```

### Plugin Utilities

Utility interfaces and types for plugin development.

```typescript { .api }
interface PluginHookUtils {
  /** Get combined transforms */
  getCombinedSourcemap(): SourceMap;
}

/**
 * Plugin with required hook constraint
 */
type PluginWithRequiredHook<K extends keyof Plugin> = Plugin & Required<Pick<Plugin, K>>;

/**
 * Falsy plugin type for conditional plugins
 */
type FalsyPlugin = false | null | undefined;
```

### Plugin Container

Container that manages and executes plugins during development and build.

```typescript { .api }
interface PluginContainer {
  /** Build start */
  buildStart(options: InputOptions): Promise<void>;
  /** Resolve ID */
  resolveId(id: string, importer?: string, options?: ResolveOptions): Promise<string | null>;
  /** Load module */
  load(id: string, options?: { ssr?: boolean }): Promise<LoadResult | null>;
  /** Transform code */
  transform(code: string, id: string, options?: TransformOptions): Promise<TransformResult | null>;
  /** Close container */
  close(): Promise<void>;
}

interface SkipInformation {
  /** Skipped plugin names */
  skipped: Set<string>;
  /** Skip reason */
  reason: string;
}
```

## Built-in Plugin Hooks

### Configuration Hooks

Hooks for modifying and accessing configuration.

```typescript { .api }
/**
 * Modify configuration before resolution
 * @param config - User configuration
 * @param env - Configuration environment
 * @returns Modified config or void
 */
type ConfigHook = (
  config: UserConfig,
  env: ConfigEnv
) => void | UserConfig | Promise<void | UserConfig>;

/**
 * Access resolved configuration
 * @param config - Resolved configuration
 */
type ConfigResolvedHook = (config: ResolvedConfig) => void | Promise<void>;
```

### Server Hooks

Hooks for configuring development and preview servers.

```typescript { .api }
/**
 * Configure development server
 * @param server - Vite dev server instance
 */
type ConfigureServerHook = (server: ViteDevServer) => void | Promise<void>;

/**
 * Configure preview server
 * @param server - Preview server instance
 */
type ConfigurePreviewServerHook = (server: PreviewServer) => void | Promise<void>;
```

### HMR Hooks

Hooks for handling Hot Module Replacement.

```typescript { .api }
/**
 * Handle HMR update
 * @param ctx - HMR context with file and modules information
 * @returns Array of modules to update or void
 */
type HandleHotUpdateHook = (
  ctx: HmrContext
) => Array<ModuleNode> | void | Promise<Array<ModuleNode> | void>;

interface HmrContext {
  /** File path that changed */
  file: string;
  /** Timestamp of change */
  timestamp: number;
  /** Affected modules */
  modules: Set<ModuleNode>;
  /** Read file contents */
  read: () => string | Promise<string>;
  /** Vite dev server */
  server: ViteDevServer;
}
```

## Plugin Development Patterns

### Conditional Plugins

Apply plugins conditionally based on environment or configuration.

```typescript { .api }
// Environment-based application
const myPlugin = (): Plugin => ({
  name: 'my-plugin',
  apply: 'build', // Only during build
  // ... plugin implementation
});

// Function-based application
const conditionalPlugin = (): Plugin => ({
  name: 'conditional-plugin',
  apply: (config, { command, mode }) => {
    return command === 'build' && mode === 'production';
  },
  // ... plugin implementation
});
```

### Plugin Ordering

Control plugin execution order with enforcement.

```typescript { .api }
// Pre-plugins run before Vite's internal plugins
const prePlugin = (): Plugin => ({
  name: 'pre-plugin',
  enforce: 'pre',
  // ... runs early
});

// Post-plugins run after Vite's internal plugins  
const postPlugin = (): Plugin => ({
  name: 'post-plugin',
  enforce: 'post',
  // ... runs late
});
```