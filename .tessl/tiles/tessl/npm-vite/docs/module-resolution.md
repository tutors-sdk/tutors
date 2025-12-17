# Module Resolution

Vite's module resolution system provides advanced module resolution with support for aliases, conditions, custom resolvers, and various asset types. It handles ES modules, CommonJS, and provides comprehensive path resolution capabilities.

## Capabilities

### ID Resolver

Create a module ID resolver with customizable resolution logic.

```typescript { .api }
/**
 * Create module ID resolver
 * @param config - Resolved Vite configuration
 * @returns Promise resolving to IdResolver instance
 */
function createIdResolver(config: ResolvedConfig): Promise<IdResolver>;

interface IdResolver {
  /** Resolve module ID */
  resolve(id: string, importer?: string, options?: ResolveOptions): Promise<string | undefined>;
}
```

### Resolve Options

Configure module resolution behavior including aliases, conditions, and extensions.

```typescript { .api }
interface ResolveOptions {
  /** Path aliases */
  alias?: AliasOptions;
  /** Dedupe dependencies */
  dedupe?: string[];
  /** Resolve conditions */
  conditions?: string[];
  /** Main fields to check */
  mainFields?: string[];
  /** File extensions to try */
  extensions?: string[];
  /** External packages */
  external?: string[];
  /** Preserve symlinks */
  preserveSymlinks?: boolean;
  /** Prefer relative imports */
  preferRelative?: boolean;
}

interface InternalResolveOptions extends ResolveOptions {
  /** Root directory */
  root?: string;
  /** Is production build */
  isProduction?: boolean;
  /** Is require call */
  isRequire?: boolean;
  /** SSR target */
  ssrTarget?: SSRTarget;
  /** Package cache */
  packageCache?: Map<string, any>;
  /** ID only resolution */
  idOnly?: boolean;
  /** Scan flag */
  scan?: boolean;
}
```

**Usage Examples:**

```typescript
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      '@': './src',
      '@components': './src/components',
      '@utils': './src/utils'
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
    conditions: ['import', 'module', 'browser', 'default'],
    mainFields: ['browser', 'module', 'main'],
    dedupe: ['react', 'react-dom']
  }
});
```

### Alias Configuration

Configure path aliases for cleaner imports and module resolution.

```typescript { .api }
type AliasOptions = readonly Alias[] | Record<string, string>;

interface Alias {
  /** Find pattern (string or regex) */
  find: string | RegExp;
  /** Replacement path */
  replacement: string;
  /** Custom resolver function */
  customResolver?: ResolverFunction | ResolverObject;
}

/**
 * Custom alias resolver function
 */
type ResolverFunction = (
  id: string,
  importer?: string,
  options?: ResolveOptions
) => string | undefined | Promise<string | undefined>;

interface ResolverObject {
  buildStart?: () => void;
  resolveId: ResolverFunction;
}

/**
 * Function to map aliases
 */
type MapToFunction<T> = T | ((id: string) => T);
```

### File Pattern Matching

Utilities for filtering and matching file patterns.

```typescript { .api }
/**
 * Create file filter function
 * @param include - Patterns to include
 * @param exclude - Patterns to exclude  
 * @param options - Filter options
 * @returns Filter function
 */
function createFilter(
  include?: FilterPattern,
  exclude?: FilterPattern,
  options?: {
    resolve?: string | false | null;
  }
): (id: string | unknown) => boolean;

type FilterPattern = string | RegExp | (string | RegExp)[];
```

### Path Utilities

Utility functions for path normalization and manipulation.

```typescript { .api }
/**
 * Normalize file path separators
 * @param id - Path to normalize
 * @returns Normalized path
 */
function normalizePath(id: string): string;

/**
 * Check if request is for CSS
 * @param request - Request path or URL
 * @returns Whether request is for CSS file
 */
function isCSSRequest(request: string): boolean;
```

### Asset Detection

Functions to detect and handle different asset types.

```typescript { .api }
/**
 * Check if file is an asset
 * @param file - File path
 * @param assetsInclude - Asset inclusion patterns
 * @returns Whether file is treated as asset
 */
function isAsset(file: string, assetsInclude?: (file: string) => boolean): boolean;

/**
 * Check if request is for static asset
 * @param url - Request URL
 * @returns Whether URL is for static asset
 */
function isStaticAsset(url: string): boolean;
```

### Workspace Root Detection

Find the workspace root directory for monorepo setups.

```typescript { .api }
/**
 * Search for workspace root directory
 * @param current - Current directory to start search
 * @param root - Project root directory
 * @returns Workspace root path
 */
function searchForWorkspaceRoot(current: string, root?: string): string;
```

## Resolution Types

```typescript { .api }
interface ResolvedUrl {
  /** Resolved URL */
  url: string;
  /** Original URL */
  pathname: string;
  /** Query string */
  search: string;
  /** URL hash */
  hash: string;
}

/**
 * Resolution result
 */
interface ResolvedResult {
  /** Resolved ID */
  id: string;
  /** Whether module is external */
  external?: boolean;
  /** Module metadata */
  meta?: Record<string, any>;
}

/**
 * Module resolution function type
 */
type ResolveFn = (
  id: string,
  importer?: string,
  options?: {
    custom?: any;
    isEntry?: boolean;
    skipSelf?: boolean;
  }
) => Promise<string | undefined>;
```

## Asset Type Detection

Built-in asset type detection for various file formats.

```typescript { .api }
/**
 * Default asset extensions supported by Vite
 */
const KNOWN_ASSET_TYPES = [
  // images
  'apng', 'bmp', 'png', 'jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'gif', 'svg', 'ico', 'webp', 'avif', 'cur', 'jxl',
  // media
  'mp4', 'webm', 'ogg', 'mp3', 'wav', 'flac', 'aac', 'opus', 'mov', 'm4a', 'vtt',
  // fonts
  'woff', 'woff2', 'eot', 'ttf', 'otf',
  // other
  'webmanifest', 'pdf', 'txt'
];

/**
 * Check if file extension is a known asset type
 * @param ext - File extension
 * @returns Whether extension is a known asset type
 */
function isKnownAssetType(ext: string): boolean;
```

## Advanced Resolution Patterns

### Conditional Exports

Support for package.json conditional exports.

```typescript { .api }
/**
 * Default conditions for different targets
 */
const DEFAULT_CLIENT_CONDITIONS = ['import', 'module', 'browser', 'default'];
const DEFAULT_SERVER_CONDITIONS = ['import', 'module', 'node', 'default'];
const DEFAULT_EXTERNAL_CONDITIONS = ['import', 'module', 'node', 'default'];

/**
 * Default main fields for different targets  
 */
const DEFAULT_CLIENT_MAIN_FIELDS = ['browser', 'module', 'jsnext:main', 'jsnext'];
const DEFAULT_SERVER_MAIN_FIELDS = ['module', 'jsnext:main', 'jsnext', 'main'];
```

### External Dependencies

Handle external dependencies that should not be bundled.

```typescript { .api }
/**
 * Check if module should be externalized
 * @param id - Module ID
 * @param external - External configuration
 * @param isProduction - Whether in production build
 * @returns Whether module is external
 */
function isExternal(
  id: string,
  external: string[] | ((id: string) => boolean),
  isProduction: boolean
): boolean;
```