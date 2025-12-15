# @tailwindcss/vite

@tailwindcss/vite is a Vite plugin for Tailwind CSS v4 that provides seamless integration with the Vite build tool. It handles candidate scanning from source files, CSS generation in both development and production modes, and CSS optimization including minification.

## Package Information

- **Package Name**: @tailwindcss/vite
- **Package Type**: npm
- **Language**: TypeScript
- **Installation**: `npm install @tailwindcss/vite`

## Core Imports

```typescript
import tailwindcss from "@tailwindcss/vite";
```

For CommonJS:

```javascript
const tailwindcss = require("@tailwindcss/vite").default;
```

When working with Vite plugin types:

```typescript
import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite';
import tailwindcss from "@tailwindcss/vite";
```

## Basic Usage

```typescript
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    // ... other plugins
  ],
});
```

## Architecture

The plugin is built around a three-phase approach:

- **Scan Phase**: Configures Vite server and resolves build configuration
- **Serve Phase**: Handles CSS generation during development with hot module replacement
- **Build Phase**: Processes CSS for production with optimization and minification

The plugin automatically detects CSS files that should be processed by Tailwind CSS and transforms them through the Tailwind compilation pipeline.

## Capabilities

### Main Plugin Function

Creates a Vite plugin array for Tailwind CSS v4 integration. The function takes no parameters and returns three plugins that handle different phases of the build process.

```typescript { .api }
/**
 * Creates a Vite plugin array for Tailwind CSS v4 integration
 * @returns Array of three Vite plugins handling scan, serve, and build phases
 */
declare function tailwindcss(): Plugin[];

export default tailwindcss;
```

## Types

```typescript { .api }
// Types imported from 'vite' package
interface Plugin {
  name: string;
  enforce?: 'pre' | 'post';
  apply?: 'build' | 'serve' | ((config: any, env: { command: string, mode: string }) => boolean);
  configureServer?: (server: ViteDevServer) => void;
  configResolved?: (config: ResolvedConfig) => void;
  transform?: (code: string, id: string, options?: any) => any | Promise<any>;
}

interface ViteDevServer {
  // Vite development server instance used in configureServer hook
}

interface ResolvedConfig {
  // Vite resolved configuration containing build settings, resolvers, and options
  root: string;
  build: {
    cssMinify: boolean | string;
    ssr: boolean | string;
  };
  css: {
    devSourcemap?: boolean;
  };
  createResolver: (options: any) => (id: string, base: string, skipSelf?: boolean, ssr?: boolean) => Promise<string | false | undefined>;
  resolve: any;
}
```

## Plugin Implementation Details

The returned plugin array contains three plugins:

1. **@tailwindcss/vite:scan** - Pre-enforcement plugin that:
   - Configures the Vite development server
   - Resolves Vite configuration
   - Sets up CSS and JavaScript module resolvers

2. **@tailwindcss/vite:generate:serve** - Development mode plugin that:
   - Transforms CSS files during development
   - Integrates with Vite's file watching system
   - Supports source maps for debugging

3. **@tailwindcss/vite:generate:build** - Production build plugin that:
   - Transforms CSS files for production builds
   - Applies CSS optimization and minification
   - Generates optimized source maps

## CSS File Detection

The plugin automatically processes CSS files that match these criteria:

- Files with `.css` extension
- Files with `&lang.css` query parameter
- Files matching inline style ID pattern (`?index=\d+\.css$`)

The plugin excludes:

- Special Vite queries (`?worker`, `?sharedworker`, `?raw`, `?url`)
- CommonJS proxy files (`?commonjs-proxy`)
- Files in the `.vite` directory

## Dependencies

The plugin leverages several Tailwind CSS workspace packages:

- **@tailwindcss/node**: Core compilation functions and utilities
- **@tailwindcss/oxide**: Fast candidate scanning
- **tailwindcss**: Main Tailwind CSS package

## Peer Dependencies

- **vite**: `^5.2.0 || ^6 || ^7` - Required Vite version for compatibility