# Utilities

Essential utility functions for configuration merging, logging, environment handling, and development workflows. These utilities provide the foundation for many Vite operations and are commonly used in plugins and custom tooling.

## Capabilities

### Configuration Utilities

Utilities for merging and handling Vite configurations.

```typescript { .api }
/**
 * Merge configuration objects with deep merging support
 * @param defaults - Default configuration object
 * @param overrides - Override configuration object
 * @param isRoot - Whether this is a root-level merge
 * @returns Merged configuration object
 */
function mergeConfig<T extends Record<string, any>>(
  defaults: T,
  overrides: T,
  isRoot?: boolean
): T;
```

**Usage Examples:**

```typescript
import { mergeConfig } from "vite";

// Merge configurations
const baseConfig = {
  server: {
    port: 3000,
    host: 'localhost'
  },
  build: {
    outDir: 'dist'
  }
};

const userConfig = {
  server: {
    port: 4000
  },
  plugins: []
};

const merged = mergeConfig(baseConfig, userConfig);
// Result: { server: { port: 4000, host: 'localhost' }, build: { outDir: 'dist' }, plugins: [] }
```

### Logging Utilities

Utilities for creating custom loggers and handling log output.

```typescript { .api }
/**
 * Create a custom logger instance
 * @param level - Log level threshold
 * @param options - Logger configuration options
 * @returns Logger instance
 */
function createLogger(level?: LogLevel, options?: LoggerOptions): Logger;

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

interface LogOptions {
  clear?: boolean;
  timestamp?: boolean;
}

type LogLevel = 'error' | 'warn' | 'info' | 'silent';
type LogType = 'error' | 'warn';
```

**Usage Examples:**

```typescript
import { createLogger } from "vite";

// Create custom logger
const logger = createLogger('info', {
  prefix: '[MyPlugin]',
  allowClearScreen: false
});

logger.info('Plugin initialized');
logger.warn('Deprecated API usage detected');
logger.error('Build failed');
```

### Environment Utilities

Utilities for loading and processing environment variables.

```typescript { .api }
/**
 * Load environment variables from .env files
 * @param mode - Current mode (development, production, etc.)
 * @param envDir - Directory to search for .env files
 * @param prefixes - Environment variable prefixes to include
 * @returns Object with loaded environment variables
 */
function loadEnv(
  mode: string,
  envDir: string,
  prefixes?: string | string[]
): Record<string, string>;
```

**Usage Examples:**

```typescript
import { loadEnv } from "vite";

// Load environment variables
const env = loadEnv('development', process.cwd(), 'VITE_');
// Loads variables like VITE_API_URL, VITE_DEBUG, etc.

// Load with multiple prefixes
const allEnv = loadEnv('production', './config', ['VITE_', 'APP_']);
```

### Path Utilities

Utilities for path normalization and processing.

```typescript { .api }
/**
 * Normalize file paths for cross-platform compatibility
 * @param id - File path to normalize
 * @returns Normalized path with forward slashes
 */
function normalizePath(id: string): string;
```

**Usage Examples:**

```typescript
import { normalizePath } from "vite";

// Normalize paths
const normalized = normalizePath('src\\components\\Button.tsx');
// Result: 'src/components/Button.tsx'

const absoluteNormalized = normalizePath('C:\\Users\\Dev\\project\\src\\index.ts');
// Result: 'C:/Users/Dev/project/src/index.ts'
```

### Optimization Utilities

Utilities for dependency optimization and code transformation.

```typescript { .api }
/**
 * Optimize dependencies for development
 * @param config - Resolved Vite configuration
 * @param force - Force re-optimization
 * @param asCommand - Whether running as CLI command
 * @returns Promise resolving to optimization metadata
 */
function optimizeDeps(
  config: ResolvedConfig,
  force?: boolean,
  asCommand?: boolean
): Promise<DepOptimizationMetadata>;

/**
 * Transform code using esbuild
 * @param code - Source code to transform
 * @param filename - File name for context
 * @param options - Transformation options
 * @param inMap - Input source map
 * @returns Promise resolving to transformation result
 */
function transformWithEsbuild(
  code: string,
  filename: string,
  options?: TransformOptions,
  inMap?: object
): Promise<ESBuildTransformResult>;

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

**Usage Examples:**

```typescript
import { optimizeDeps, transformWithEsbuild } from "vite";

// Force dependency optimization
await optimizeDeps(resolvedConfig, true);

// Transform TypeScript code
const result = await transformWithEsbuild(
  'const greeting: string = "Hello";',
  'greeting.ts',
  {
    loader: 'ts',
    target: 'es2020',
    format: 'esm'
  }
);

console.log(result.code); // Transformed JavaScript
```

## Import Patterns

```typescript
import { 
  mergeConfig, 
  createLogger, 
  loadEnv, 
  normalizePath,
  optimizeDeps,
  transformWithEsbuild
} from "vite";
```