# @sveltejs/adapter-auto

Automatically chooses the SvelteKit adapter for your current environment, if possible. This adapter analyzes environment variables to detect deployment platforms and automatically installs and configures the appropriate platform-specific adapter.

## Package Information

- **Package Name**: @sveltejs/adapter-auto
- **Package Type**: npm
- **Language**: JavaScript (with TypeScript definitions)
- **Installation**: `npm install -D @sveltejs/adapter-auto`

## Core Imports

```javascript
import adapter from '@sveltejs/adapter-auto';
```

For CommonJS (not recommended as this is an ESM package):

```javascript
const adapter = require('@sveltejs/adapter-auto').default;
```

## Basic Usage

```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter()
  }
};

export default config;
```

## Architecture

The adapter uses a detection system with the following components:

- **Environment Detection**: Analyzes environment variables to identify deployment platforms
- **Auto-Installation**: Automatically installs the appropriate platform adapter if not found
- **Adapter Delegation**: Passes control to the detected platform-specific adapter
- **Fallback Handling**: Provides warnings when no supported environment is detected
- **Package Manager Support**: Works with npm, pnpm, yarn, bun, and deno

## Capabilities

### Main Adapter Function

The primary export that creates a SvelteKit adapter with automatic platform detection.

```javascript { .api }
/**
 * Creates a SvelteKit adapter that automatically detects the deployment environment
 * @returns {Adapter} SvelteKit adapter with auto-detection capabilities
 */
export default function(): Adapter;
```

### Supported Platform Detection

The adapter automatically detects these deployment environments using an internal configuration array:

**Supported Platforms:**

1. **Vercel**: Detected via `VERCEL` environment variable
   - Installs: `@sveltejs/adapter-vercel@5`

2. **Cloudflare Pages**: Detected via `CF_PAGES` environment variable
   - Installs: `@sveltejs/adapter-cloudflare@7`

3. **Netlify**: Detected via `NETLIFY` environment variable
   - Installs: `@sveltejs/adapter-netlify@5`

4. **Azure Static Web Apps**: Detected via `GITHUB_ACTION_REPOSITORY` === 'Azure/static-web-apps-deploy'
   - Installs: `svelte-adapter-azure-swa@0.20`

5. **AWS via SST**: Detected via `SST` environment variable
   - Installs: `svelte-kit-sst@2`

6. **Google Cloud Run**: Detected via `GCP_BUILDPACKS` environment variable
   - Installs: `@sveltejs/adapter-node@5`

### Package Manager Support

Supports automatic installation using any of these package managers:

The adapter uses internal command templates to install adapters with the detected package manager.

The adapter automatically detects the package manager by looking for lockfiles in this priority order:
1. `pnpm-lock.yaml` → pnpm
2. `yarn.lock` → yarn  
3. `package-lock.json` → npm
4. `bun.lockb` or `bun.lock` → bun
5. `deno.lock` → deno

### Error Handling

The adapter handles several error scenarios:

1. **Peer Dependency Resolution Errors**: When the target adapter package cannot be found
2. **Installation Errors**: When automatic installation of the adapter fails
3. **Unsupported Feature Errors**: When attempting to use features not supported by adapter-auto (like the `read` function)

The adapter includes internal error handling that provides context-aware error messages when unsupported features are used.

## Types

```typescript { .api }
/**
 * SvelteKit Adapter interface - returned by the default export function
 */
interface Adapter {
  /** The name of the adapter, using for logging. Will typically correspond to the package name. */
  name: string;
  /** This function is called after SvelteKit has built your app. */
  adapt(builder: Builder): MaybePromise<void>;
  /** Checks called during dev and build to determine whether specific features will work in production with this adapter. */
  supports?: {
    /** Test support for `read` from `$app/server`. */
    read?(details: { config: any; route: { id: string } }): boolean;
  };
  /** Creates an `Emulator`, which allows the adapter to influence the environment during dev, build and prerendering. */
  emulate?(): MaybePromise<Emulator>;
}

/**
 * SvelteKit Builder interface (from @sveltejs/kit)
 * This object is passed to the `adapt` function of adapters.
 * It contains various methods and properties that are useful for adapting the app.
 */
interface Builder {
  /** Print messages to the console. `log.info` and `log.minor` are silent unless Vite's `logLevel` is `info`. */
  log: Logger;
  /** Remove `dir` and all its contents. */
  rimraf(dir: string): void;
  /** Create `dir` and any required parent directories. */
  mkdirp(dir: string): void;

  /** The fully resolved Svelte config. */
  config: ValidatedConfig;
  /** Information about prerendered pages and assets, if any. */
  prerendered: Prerendered;
  /** An array of all routes (including prerendered) */
  routes: RouteDefinition[];

  /** Find all the assets imported by server files belonging to `routes` */
  findServerAssets(routes: RouteDefinition[]): string[];
  /** Generate a fallback page for a static webserver to use when no route is matched. Useful for single-page apps. */
  generateFallback(dest: string): Promise<void>;
  /** Generate a module exposing build-time environment variables as `$env/dynamic/public`. */
  generateEnvModule(): void;
  /** Generate a server-side manifest to initialise the SvelteKit server with. */
  generateManifest(opts: { relativePath: string; routes?: RouteDefinition[] }): string;

  /** Resolve a path to the `name` directory inside `outDir`, e.g. `/path/to/.svelte-kit/my-adapter`. */
  getBuildDirectory(name: string): string;
  /** Get the fully resolved path to the directory containing client-side assets, including the contents of your `static` directory. */
  getClientDirectory(): string;
  /** Get the fully resolved path to the directory containing server-side code. */
  getServerDirectory(): string;
  /** Get the application path including any configured `base` path, e.g. `my-base-path/_app`. */
  getAppPath(): string;

  /** Write client assets to `dest`. */
  writeClient(dest: string): string[];
  /** Write prerendered files to `dest`. */
  writePrerendered(dest: string): string[];
  /** Write server-side code to `dest`. */
  writeServer(dest: string): string[];
  /** Copy a file or directory. */
  copy(
    from: string,
    to: string,
    opts?: {
      filter?(basename: string): boolean;
      replace?: Record<string, string>;
    }
  ): string[];

  /** Compress files in `directory` with gzip and brotli, where appropriate. Generates `.gz` and `.br` files alongside the originals. */
  compress(directory: string): Promise<void>;
}

/**
 * Logger interface used by Builder.log
 */
interface Logger {
  (msg: string): void;
  success(msg: string): void;
  error(msg: string): void;
  warn(msg: string): void;
  minor(msg: string): void;
  info(msg: string): void;
}

/**
 * A collection of functions that influence the environment during dev, build and prerendering
 */
interface Emulator {
  /** A function that is called with the current route `config` and `prerender` option and returns an `App.Platform` object */
  platform?(details: { config: any; prerender: PrerenderOption }): MaybePromise<App.Platform>;
}

/** Helper type for values that may or may not be wrapped in a Promise */
type MaybePromise<T> = T | Promise<T>;

/** Configuration interfaces and other supporting types are imported from @sveltejs/kit */
interface ValidatedConfig extends Record<string, any> {}
interface Prerendered extends Record<string, any> {}
interface RouteDefinition extends Record<string, any> {}
type PrerenderOption = boolean | 'auto'
```

## Installation Behavior

When a supported environment is detected:

1. **Check for existing adapter**: Attempts to resolve the platform-specific adapter as a peer dependency
2. **Auto-install if missing**: If not found, automatically installs the adapter using the detected package manager
3. **Import and configure**: Imports the installed adapter and configures it
4. **Delegate control**: Passes the build process to the platform-specific adapter
5. **Provide feedback**: Logs detected environment and suggests manual installation for better performance

## Error Messages

The adapter provides helpful error messages in various scenarios:

- **Peer dependency resolution**: "Could not resolve peer dependency..."
- **Installation failure**: "Could not install [adapter]. Please install it yourself..."
- **Unsupported environment**: "Could not detect a supported production environment..."
- **Unsupported features**: "The read function imported from $app/server only works in certain environments..."