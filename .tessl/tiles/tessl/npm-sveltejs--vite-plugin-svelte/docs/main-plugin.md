# Main Plugin Configuration

Core plugin factory function that creates the Vite plugin array for handling Svelte files in development and build processes.

## Capabilities

### Svelte Plugin Factory

Creates an array of specialized Vite plugins that handle different aspects of Svelte file processing.

```typescript { .api }
/**
 * Returns a list of plugins to handle svelte files
 * plugins are named `vite-plugin-svelte:<task>`
 * 
 * @param inlineOptions - Optional configuration options
 * @returns Array of Vite plugins for Svelte file processing
 */
function svelte(inlineOptions?: Partial<Options>): Plugin[];
```

**Usage Examples:**

```javascript
// Basic usage
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default {
  plugins: [svelte()]
};

// With configuration
export default {
  plugins: [
    svelte({
      emitCss: true,
      compilerOptions: {
        dev: true,
        runes: true
      },
      preprocess: vitePreprocess({
        style: true
      })
    })
  ]
};

// Production build configuration
export default {
  plugins: [
    svelte({
      emitCss: true,
      hot: false,
      compilerOptions: {
        dev: false
      },
      prebundleSvelteLibraries: false
    })
  ]
};
```

## Plugin Options

### File Processing Options

Configure which files the plugin processes and how.

```typescript { .api }
interface FileProcessingOptions {
  /** A picomatch pattern or array of patterns specifying files to include */
  include?: Arrayable<string | RegExp>;
  /** A picomatch pattern or array of patterns specifying files to exclude */
  exclude?: Arrayable<string | RegExp>;
}
```

**Usage Examples:**

```javascript
svelte({
  include: ['src/**/*.svelte'],
  exclude: ['node_modules/**', 'src/**/*.test.svelte']
});

// Using RegExp patterns
svelte({
  include: [/\.svelte$/, /\.svelte\.ts$/],
  exclude: [/node_modules/, /\.test\./]
});
```

### CSS Handling Options

Control how Svelte component styles are processed and emitted.

```typescript { .api }
interface CssOptions {
  /** Emit Svelte styles as virtual CSS files for Vite and other plugins to process */
  emitCss?: boolean; // default: true
}
```

**Usage Examples:**

```javascript
// Enable CSS emission (default)
svelte({ emitCss: true });

// Disable CSS emission (styles remain in component)
svelte({ emitCss: false });
```

### Hot Module Replacement Options

Configure development-time hot reload behavior.

```typescript { .api }
interface HmrOptions {
  /** 
   * Enable or disable Hot Module Replacement
   * @deprecated Use compilerOptions.hmr instead
   * @default true for development, always false for production
   */
  hot?: boolean;
}
```

**Usage Examples:**

```javascript
// Preferred approach (not deprecated)
svelte({
  compilerOptions: {
    hmr: process.env.NODE_ENV === 'development'
  }
});

// Deprecated approach (still works)
svelte({
  hot: process.env.NODE_ENV === 'development'
});
```

### Preprocessor Integration Options

Control how the plugin interacts with preprocessors from other Vite plugins.

```typescript { .api }
interface PreprocessorOptions {
  /** 
   * Ignore preprocessors contributed by other Vite plugins
   * - true: ignore all plugin preprocessors
   * - string[]: ignore preprocessors from specific plugins
   * @default false
   */
  ignorePluginPreprocessors?: boolean | string[];
}
```

**Usage Examples:**

```javascript
// Ignore all plugin preprocessors
svelte({ ignorePluginPreprocessors: true });

// Ignore specific plugins
svelte({ 
  ignorePluginPreprocessors: ['vite-plugin-windicss', 'other-plugin'] 
});
```

### Dependency Optimization Options

Control automatic handling of Svelte library dependencies.

```typescript { .api }
interface DependencyOptions {
  /** 
   * Control automatic dependency reinclusion in vite.optimizeDeps
   * - true: disable all reinclusions
   * - string[]: disable reinclusions for specific dependencies
   * @default false
   */
  disableDependencyReinclusion?: boolean | string[];
  
  /** 
   * Enable dependency optimization to prebundle Svelte libraries
   * @default true for dev, false for build
   */
  prebundleSvelteLibraries?: boolean;
}
```

**Usage Examples:**

```javascript
// Disable all dependency reinclusion
svelte({ disableDependencyReinclusion: true });

// Disable for specific hybrid packages
svelte({ 
  disableDependencyReinclusion: ['@routify/router', 'some-hybrid-package'] 
});

// Control prebundling
svelte({
  prebundleSvelteLibraries: process.env.NODE_ENV === 'development'
});
```

### Inspector Integration Options

Configure Svelte Inspector for development debugging.

```typescript { .api }
interface InspectorOptions {
  /** 
   * Toggle or configure Svelte Inspector
   * @default unset for dev, always false for build
   */
  inspector?: InspectorOptions | boolean;
}
```

**Usage Examples:**

```javascript
// Enable inspector (default in development)
svelte({ inspector: true });

// Disable inspector
svelte({ inspector: false });

// Configure inspector options
svelte({
  inspector: {
    toggleKeyCombo: 'control-shift',
    holdMode: true,
    showToggleButton: 'always'
  }
});
```

### Dynamic Compilation Options

Provide per-file dynamic compiler configuration.

```typescript { .api }
interface DynamicCompileOptions {
  /** 
   * Function to update compilerOptions before compilation
   * @param data - Compilation context data
   * @returns Partial compiler options to merge
   */
  dynamicCompileOptions?: (data: {
    filename: string;
    code: string;
    compileOptions: Partial<CompileOptions>;
  }) => Promise<Partial<CompileOptions> | void> | Partial<CompileOptions> | void;
}
```

**Usage Examples:**

```javascript
svelte({
  dynamicCompileOptions({ filename, compileOptions }) {
    // Enable runes mode for specific files
    if (filename.includes('.runes.svelte')) {
      return { runes: true };
    }
    
    // Different settings for test files
    if (filename.includes('.test.svelte')) {
      return { 
        dev: true,
        hydratable: false 
      };
    }
  }
});

// Async dynamic options
svelte({
  async dynamicCompileOptions({ filename, code }) {
    const config = await loadFileSpecificConfig(filename);
    return config.compilerOptions;
  }
});
```

### Configuration File Options

Control Svelte configuration file loading.

```typescript { .api }
interface ConfigFileOptions {
  /** 
   * Path to svelte config file, absolute or relative to Vite root
   * Set to false to ignore svelte config file
   */
  configFile?: string | false;
}
```

**Usage Examples:**

```javascript
// Use custom config file path
svelte({ configFile: './config/svelte.config.js' });

// Use absolute path
svelte({ configFile: '/path/to/project/custom.svelte.config.js' });

// Ignore svelte config file completely
svelte({ configFile: false });
```

## Experimental Features

### Experimental Options

Features that may have breaking changes in future releases.

```typescript { .api }
interface ExperimentalOptions {
  /** Send websocket message with svelte compiler warnings during dev */
  sendWarningsToBrowser?: boolean;
  /** Disable svelte field resolve warnings */
  disableSvelteResolveWarnings?: boolean;
  /** Disable api.sveltePreprocess deprecation warnings */
  disableApiSveltePreprocessWarnings?: boolean;
  /** Module compilation configuration */
  compileModule?: CompileModuleOptions;
}

interface CompileModuleOptions {
  /** Infix that must be present in filename (default: ['.svelte.']) */
  infixes?: string[];
  /** Module extensions (default: ['.ts', '.js']) */
  extensions?: string[];
  /** Include patterns */
  include?: Arrayable<string | RegExp>;
  /** Exclude patterns */
  exclude?: Arrayable<string | RegExp>;
}
```

**Usage Examples:**

```javascript
svelte({
  experimental: {
    // Send warnings to browser console during development
    sendWarningsToBrowser: true,
    
    // Suppress specific warning types
    disableSvelteResolveWarnings: true,
    disableApiSveltePreprocessWarnings: true,
    
    // Configure module compilation
    compileModule: {
      infixes: ['.svelte.', '.component.'],
      extensions: ['.ts', '.js', '.mjs'],
      include: ['src/modules/**'],
      exclude: ['**/*.test.*']
    }
  }
});
```