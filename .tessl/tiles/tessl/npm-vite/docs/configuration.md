# Configuration

Vite's configuration system provides flexible options for customizing development and build behavior. The configuration supports TypeScript with full type safety and can be environment-specific.

## Capabilities

### Define Configuration

Creates a Vite configuration with TypeScript support and intelligent defaults.

```typescript { .api }
/**
 * Define Vite configuration with TypeScript support
 * @param config - Configuration object, function, or function object
 * @returns The same configuration with proper typing
 */
function defineConfig(config: UserConfig): UserConfig;
function defineConfig(configFn: UserConfigFn): UserConfigFn;
function defineConfig(configObj: UserConfigFnObject): UserConfigFnObject;

interface UserConfig {
  /** Project root directory (default: process.cwd()) */
  root?: string;
  /** Base public path (default: '/') */
  base?: string;
  /** App mode (default: 'development' for serve, 'production' for build) */
  mode?: string;
  /** Define global constants */
  define?: Record<string, any>;
  /** Plugin array */
  plugins?: PluginOption[];
  /** Server options */
  server?: ServerOptions;
  /** Build options */
  build?: BuildOptions;
  /** Preview server options */
  preview?: PreviewOptions;
  /** SSR options */
  ssr?: SSROptions;
  /** Dependency optimization options */
  optimizeDeps?: DepOptimizationOptions;
  /** Environment-specific configurations */
  environments?: Record<string, EnvironmentOptions>;
  /** Resolve options */
  resolve?: ResolveOptions;
  /** CSS options */
  css?: CSSOptions;
  /** JSON options */
  json?: JsonOptions;
  /** ESBuild options */
  esbuild?: ESBuildOptions;
  /** Worker options */
  worker?: WorkerOptions;
  /** HTML transformation options */
  html?: HtmlOptions;
  /** Asset inclusion test function */
  assetsInclude?: string | RegExp | (string | RegExp)[] | ((file: string) => boolean);
  /** Custom logger instance */
  customLogger?: Logger;
  /** Log level */
  logLevel?: LogLevel;
  /** Clear screen */
  clearScreen?: boolean;
  /** Environment files directory */
  envDir?: string;
  /** Environment variable prefix */
  envPrefix?: string | string[];
  /** App type */
  appType?: AppType;
  /** Legacy options */
  legacy?: LegacyOptions;
  /** Experimental options */
  experimental?: ExperimentalOptions;
  /** Future options */
  future?: FutureOptions;
}

type UserConfigFn = (env: ConfigEnv) => UserConfig | Promise<UserConfig>;
type UserConfigFnObject = { config: UserConfigFn };
type UserConfigExport = UserConfig | Promise<UserConfig> | UserConfigFn;
```

**Usage Examples:**

```typescript
import { defineConfig } from "vite";

// Object configuration
export default defineConfig({
  root: './src',
  base: '/my-app/',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: '../dist',
    sourcemap: true
  }
});

// Function configuration
export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production';
  
  return {
    define: {
      __DEV__: !isProduction
    },
    server: {
      port: isProduction ? 8080 : 3000
    }
  };
});
```

### Load Configuration from File

Loads and resolves Vite configuration from the filesystem.

```typescript { .api }
/**
 * Load configuration from file
 * @param configEnv - Configuration environment context
 * @param configFile - Path to config file (optional)
 * @param configRoot - Config root directory (default: process.cwd())
 * @param logLevel - Log level for config loading
 * @param customLogger - Custom logger instance
 * @param configLoader - Config loader type ('bundle' | 'runner' | 'native', default: 'bundle')
 * @returns Promise resolving to config result or null
 */
function loadConfigFromFile(
  configEnv: ConfigEnv,
  configFile?: string,
  configRoot: string = process.cwd(),
  logLevel?: LogLevel,
  customLogger?: Logger,
  configLoader: 'bundle' | 'runner' | 'native' = 'bundle'
): Promise<{
  path: string;
  config: UserConfig;
  dependencies: string[];
} | null>;
```

### Resolve Configuration

Resolves the final configuration with all defaults and environment-specific values applied.

```typescript { .api }
/**
 * Resolve final configuration
 * @param config - Inline configuration
 * @param command - Command being run ('build' | 'serve')
 * @param defaultMode - Default mode if not specified
 * @returns Promise resolving to resolved configuration
 */
function resolveConfig(
  inlineConfig: InlineConfig,
  command: 'build' | 'serve',
  defaultMode?: string,
  defaultNodeEnv?: string,
  isPreview?: boolean
): Promise<ResolvedConfig>;

interface ResolvedConfig {
  /** Resolved root directory */
  root: string;
  /** Resolved base path */
  base: string;
  /** Resolved mode */
  mode: string;
  /** Command being executed */
  command: 'build' | 'serve';
  /** Whether in production mode */
  isProduction: boolean;
  /** Resolved plugins array */
  plugins: readonly Plugin[];
  /** Resolved server options */
  server: ResolvedServerOptions;
  /** Resolved build options */
  build: ResolvedBuildOptions;
  /** Environment variables */
  env: Record<string, any>;
  /** Logger instance */
  logger: Logger;
  /** Package.json content */
  packageCache: Map<string, PackageData>;
  /** Whether build is for SSR */
  isSsrBuild?: boolean;
  /** Public directory */
  publicDir: string;
  /** Cache directory */
  cacheDir: string;
  /** Temporary directory */
  tempDir: string;
  /** Asset file names */
  assetsInclude: (file: string) => boolean;
}
```

### Sort User Plugins

Sorts user plugins according to their enforcement order.

```typescript { .api }
/**
 * Sort user plugins by enforcement order
 * @param plugins - Array of plugin options
 * @returns Tuple with sorted plugin arrays [pre, normal, post]
 */
function sortUserPlugins(
  plugins: (Plugin | Plugin[])[] | undefined
): [Plugin[], Plugin[], Plugin[]];
```

## Configuration Types

```typescript { .api }
interface ConfigEnv {
  /** Command being executed */
  command: 'build' | 'serve';
  /** Current mode */
  mode: string;
  /** Whether this is an SSR build */
  isSsrBuild?: boolean;
  /** Whether this is preview mode */
  isPreview?: boolean;
}

interface InlineConfig extends UserConfig {
  /** Override config file location */
  configFile?: string | false;
}

type AppType = 'spa' | 'mpa' | 'custom';

interface EnvironmentOptions {
  /** Resolve options for this environment */
  resolve?: ResolveOptions;
  /** Define constants for this environment */
  define?: Record<string, any>;
}

interface DevEnvironmentOptions extends EnvironmentOptions {
  /** Hot update options */
  hot?: boolean | HmrOptions;
}

interface LegacyOptions {
  /** Support legacy browsers */
  buildSsrCjsExternalHeuristics?: boolean;
  /** Proxied FS write operations */
  proxiedFSWrites?: boolean;
}

interface ExperimentalOptions {
  /** Skip SSR transform */
  skipSsrTransform?: boolean;
  /** Hmr partial accept */
  hmrPartialAccept?: boolean;
}

interface FutureOptions {
  /** Remove export static image */
  removeExportStatic?: boolean;
}
```