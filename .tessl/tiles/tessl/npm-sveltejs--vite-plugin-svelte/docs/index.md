# Svelte Vite Plugin

The official Vite plugin for integrating Svelte components into Vite-based development workflows. It enables seamless compilation, bundling, and hot module replacement (HMR) for Svelte components within Vite projects. The plugin handles Svelte component preprocessing, supports advanced configuration options for customizing the Svelte compilation process, integrates with the Svelte Inspector for debugging, and provides optimal build performance through Vite's native ES modules and fast bundling capabilities.

## Package Information

- **Package Name**: @sveltejs/vite-plugin-svelte
- **Package Type**: npm
- **Language**: JavaScript/TypeScript
- **Installation**: `npm install @sveltejs/vite-plugin-svelte`

## Core Imports

```javascript
import { svelte } from '@sveltejs/vite-plugin-svelte';
```

Additional utilities:

```javascript
import { svelte, vitePreprocess, loadSvelteConfig } from '@sveltejs/vite-plugin-svelte';
```

Standalone Inspector Plugin:

```javascript
import { svelteInspector } from '@sveltejs/vite-plugin-svelte-inspector';
```

## Basic Usage

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [
    svelte({
      // Plugin options
      emitCss: true,
      hot: !process.env.VITEST,
      compilerOptions: {
        dev: !process.env.VITEST
      }
    })
  ]
});
```

```javascript
// svelte.config.js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  preprocess: vitePreprocess({
    style: true,
    script: false // Not needed for TypeScript in Svelte 5+
  }),
  compilerOptions: {
    runes: true
  }
};
```

## Architecture

The plugin is built around several key components:

- **Plugin Factory**: The main `svelte()` function returns an array of specialized Vite plugins
- **Configuration System**: Loads and merges Svelte configuration from various sources
- **Preprocessing Pipeline**: Handles TypeScript and CSS preprocessing via Vite
- **Compilation Engine**: Compiles Svelte components with hot reload support
- **Dependency Optimization**: Automatically handles Svelte library dependencies
- **Inspector Integration**: Provides development-time debugging via Svelte Inspector

## Capabilities

### Main Plugin Function

Creates the Vite plugin array for handling Svelte files in development and build processes.

```typescript { .api }
function svelte(inlineOptions?: Partial<Options>): Plugin[];

interface Options extends Omit<SvelteConfig, 'vitePlugin'>, PluginOptionsInline {}

interface PluginOptionsInline extends PluginOptions {
  /** Path to svelte config file, either absolute or relative to Vite root */
  configFile?: string | false;
}
```

[Main Plugin Configuration](./main-plugin.md)

### Vite Preprocessing

Svelte preprocessor that uses Vite's transformation pipeline for processing script and style blocks within Svelte components.

```typescript { .api }
function vitePreprocess(opts?: VitePreprocessOptions): PreprocessorGroup;

interface VitePreprocessOptions {
  /** Preprocess script blocks with vite pipeline (default: false) */
  script?: boolean;
  /** Preprocess style blocks with vite pipeline */
  style?: boolean | InlineConfig | ResolvedConfig;
}
```

[Vite Preprocessing](./vite-preprocessing.md)

### Configuration Loading

Utility for loading and parsing Svelte configuration files in custom build scenarios.

```typescript { .api }
function loadSvelteConfig(
  viteConfig?: UserConfig,
  inlineOptions?: Partial<Options>
): Promise<Partial<SvelteConfig> | undefined>;
```

[Configuration Management](./configuration.md)

### Inspector Plugin

Standalone development-time debugging tool for interactive Svelte component inspection in the browser.

```typescript { .api }
function svelteInspector(options?: Partial<InspectorOptions>): Plugin;

interface InspectorOptions {
  /** Key combo to toggle inspector (default: 'alt-x') */
  toggleKeyCombo?: string;
  /** Keyboard navigation keys */
  navKeys?: {
    parent: string;
    child: string; 
    next: string;
    prev: string;
  };
  /** Key to open editor (default: 'Enter') */
  openKey?: string;
  /** Keys to close inspector (default: ['Backspace', 'Escape']) */
  escapeKeys?: string[];
  /** Auto-disable on key release (default: true) */
  holdMode?: boolean;
  /** When to show toggle button (default: 'active') */
  showToggleButton?: 'always' | 'active' | 'never';
  /** Toggle button position (default: 'top-right') */
  toggleButtonPos?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  /** Inject custom styles when active */
  customStyles?: boolean;
}
```

[Inspector Plugin](./inspector-plugin.md)

## Core Types

```typescript { .api }
interface PluginOptions {
  /** Files to include (picomatch patterns) */
  include?: Arrayable<string | RegExp>;
  /** Files to exclude (picomatch patterns) */
  exclude?: Arrayable<string | RegExp>;
  /** Emit Svelte styles as virtual CSS files (default: true) */
  emitCss?: boolean;
  /** Enable/disable Hot Module Replacement (deprecated, use compilerOptions.hmr) */
  hot?: boolean;
  /** Ignore preprocessors from other plugins */
  ignorePluginPreprocessors?: boolean | string[];
  /** Control automatic dependency optimization */
  disableDependencyReinclusion?: boolean | string[];
  /** Enable Svelte library prebundling (default: true for dev, false for build) */
  prebundleSvelteLibraries?: boolean;
  /** Configure Svelte Inspector */
  inspector?: InspectorOptions | boolean;
  /** Dynamic compiler options function */
  dynamicCompileOptions?: (data: {
    filename: string;
    code: string;
    compileOptions: Partial<CompileOptions>;
  }) => Promise<Partial<CompileOptions> | void> | Partial<CompileOptions> | void;
  /** Experimental features */
  experimental?: ExperimentalOptions;
}

interface SvelteConfig {
  /** File extensions to compile (default: ['.svelte']) */
  extensions?: string[];
  /** Preprocessors for Svelte source code */
  preprocess?: Arrayable<PreprocessorGroup>;
  /** Svelte compiler options */
  compilerOptions?: Omit<CompileOptions, 'filename' | 'format' | 'generate'>;
  /** Warning handler function */
  onwarn?: (warning: Warning, defaultHandler: (warning: Warning) => void) => void;
  /** Plugin-specific options */
  vitePlugin?: PluginOptions;
}

interface ExperimentalOptions {
  /** Send compiler warnings to browser via WebSocket */
  sendWarningsToBrowser?: boolean;
  /** Disable svelte field resolve warnings */
  disableSvelteResolveWarnings?: boolean;
  /** Disable api.sveltePreprocess deprecation warnings */
  disableApiSveltePreprocessWarnings?: boolean;
  /** Module compilation options */
  compileModule?: CompileModuleOptions;
}

interface CompileModuleOptions {
  /** Required filename infixes (default: ['.svelte.']) */
  infixes?: string[];
  /** Module extensions (default: ['.ts', '.js']) */
  extensions?: string[];
  /** Include patterns */
  include?: Arrayable<string | RegExp>;
  /** Exclude patterns */
  exclude?: Arrayable<string | RegExp>;
}

type Arrayable<T> = T | T[];
```