# Build System

Vite's build system provides production-ready builds powered by Rollup with advanced optimizations, code splitting, and comprehensive asset processing. It supports both application and library builds with extensive customization options.

## Capabilities

### Build Function

Execute a production build with comprehensive optimization and bundling.

```typescript { .api }
/**
 * Execute production build
 * @param config - Inline configuration options
 * @returns Promise resolving to Rollup output(s) or watcher
 */
function build(config?: InlineConfig): Promise<RollupOutput | RollupOutput[] | RollupWatcher>;
```

**Usage Examples:**

```typescript
import { build } from "vite";

// Basic build
const output = await build({
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser'
  }
});

// Library build
await build({
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'MyLib',
      formats: ['es', 'cjs', 'umd']
    },
    rollupOptions: {
      external: ['vue', 'react'],
      output: {
        globals: {
          vue: 'Vue',
          react: 'React'
        }
      }
    }
  }
});
```

### Create Builder

Create a reusable builder instance for multiple builds.

```typescript { .api }
/**
 * Create a reusable builder instance
 * @param config - Inline configuration options
 * @returns Promise resolving to ViteBuilder instance
 */
function createBuilder(config?: InlineConfig): Promise<ViteBuilder>;

interface ViteBuilder {
  /** Execute build with optional builder-specific options */
  build(builderOptions?: BuilderOptions): Promise<RollupOutput | RollupOutput[]>;
  /** Close builder and cleanup resources */
  close(): Promise<void>;
}
```

### Build Options

Configure build behavior, output format, and optimization settings.

```typescript { .api }
interface BuildOptions {
  /** Build target environment */
  target?: 'es2015' | 'es2016' | 'es2017' | 'es2018' | 'es2019' | 'es2020' | 'es2021' | 'es2022' | 'esnext' | string[];
  /** Build polyfills */
  polyfillModulePreload?: boolean;
  /** Output directory */
  outDir?: string;
  /** Assets directory */
  assetsDir?: string;
  /** Assets inline threshold */
  assetsInlineLimit?: number;
  /** CSS code splitting */
  cssCodeSplit?: boolean;
  /** CSS target */
  cssTarget?: string | string[];
  /** CSS minify options */
  cssMinify?: boolean | 'esbuild' | 'lightningcss';
  /** Generate sourcemaps */
  sourcemap?: boolean | 'inline' | 'hidden';
  /** Rollup options */
  rollupOptions?: RollupOptions;
  /** Library build options */
  lib?: LibraryOptions;
  /** Manifest generation */
  manifest?: boolean | string;
  /** SSR manifest */
  ssrManifest?: boolean | string;
  /** SSR emit assets */
  ssrEmitAssets?: boolean;
  /** Minification */
  minify?: boolean | 'terser' | 'esbuild';
  /** Terser options */
  terserOptions?: TerserOptions;
  /** Write bundle to disk */
  write?: boolean;
  /** Empty output directory */
  emptyOutDir?: boolean | null;
  /** Report compressed size */
  reportCompressedSize?: boolean;
  /** Chunk size warning limit */
  chunkSizeWarningLimit?: number;
  /** Watch mode */
  watch?: RollupWatchOptions | null;
  /** Module preload options */
  modulePreload?: ModulePreloadOptions;
  /** Copy public directory */
  copyPublicDir?: boolean;
}

interface ResolvedBuildOptions extends Required<Omit<BuildOptions, 'rollupOptions' | 'lib'>> {
  rollupOptions: RollupOptions;
  lib: LibraryOptions | false;
}
```

### Library Build

Build libraries with multiple output formats and customization options.

```typescript { .api }
interface LibraryOptions {
  /** Entry point */
  entry: string | string[] | Record<string, string>;
  /** Library name for UMD builds */
  name?: string;
  /** Output formats */
  formats?: LibraryFormats[];
  /** Custom file names */
  fileName?: string | ((format: LibraryFormats, entryName: string) => string);
}

type LibraryFormats = 'es' | 'cjs' | 'umd' | 'iife' | 'system';
```

### Module Preload

Configure module preloading for optimal loading performance.

```typescript { .api }
interface ModulePreloadOptions {
  /** Resolve module preload dependencies */
  resolveDependencies?: ResolveModulePreloadDependenciesFn;
  /** Module preload polyfill */
  polyfill?: boolean;
}

interface ResolvedModulePreloadOptions {
  resolveDependencies: ResolveModulePreloadDependenciesFn;
  polyfill: boolean;
}

/**
 * Function to resolve module preload dependencies
 * @param filename - Source filename
 * @param deps - Array of dependency imports
 * @param context - Preload context
 * @returns Array of dependencies to preload
 */
type ResolveModulePreloadDependenciesFn = (
  filename: string,
  deps: string[],
  context: {
    importer: string;
  }
) => string[];
```

### Asset URL Rendering

Customize how built asset URLs are rendered in the output.

```typescript { .api }
/**
 * Function to render built asset URLs
 * @param filename - Asset filename
 * @param type - Asset type ('asset' | 'public')
 * @param hostId - Host module ID
 * @param hostType - Host type ('js' | 'css' | 'html')
 * @returns Rendered asset URL
 */
type RenderBuiltAssetUrl = (
  filename: string,
  type: 'asset' | 'public',
  hostId: string,
  hostType: 'js' | 'css' | 'html'
) => string | { relative?: boolean; runtime?: string } | undefined;
```

### Build Environment

Environment-specific build configuration and execution.

```typescript { .api }
interface BuildEnvironmentOptions {
  /** Output directory for this environment */
  outDir?: string;
  /** Asset handling */
  assetsInclude?: string | RegExp | (string | RegExp)[];
  /** Copy public dir */
  copyPublicDir?: boolean;
  /** Environment-specific Rollup options */
  rollupOptions?: RollupOptions;
}

interface ResolvedBuildEnvironmentOptions extends Required<BuildEnvironmentOptions> {
  /** Resolved Rollup options */
  rollupOptions: RollupOptions;
}

class BuildEnvironment {
  /** Environment name */
  name: string;
  /** Build configuration */
  config: ResolvedConfig;
  /** Execute build for this environment */
  build(): Promise<RollupOutput>;
}
```

### Builder Options

Options for builder instances and build execution.

```typescript { .api }
interface BuilderOptions {
  /** Force rebuild */
  force?: boolean;
  /** Inline config overrides */
  inlineConfig?: InlineConfig;
}

type BuildAppHook = (
  name: string
) => {
  buildApp: (builder: ViteBuilder) => Promise<void>;
} | Promise<{
  buildApp: (builder: ViteBuilder) => Promise<void>;
}>;
```

## Build Types

```typescript { .api }
type RollupOutput = rollup.RollupOutput;
type RollupOptions = rollup.RollupOptions;
type RollupWatchOptions = rollup.RollupWatchOptions;
type RollupWatcher = rollup.RollupWatcher;

interface Manifest {
  [file: string]: ManifestChunk;
}

interface ManifestChunk {
  file: string;
  name?: string;
  src?: string;
  isEntry?: boolean;
  isDynamicEntry?: boolean;
  imports?: string[];
  dynamicImports?: string[];
  css?: string[];
  assets?: string[];
}
```