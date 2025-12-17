# Configuration Management

Utilities for loading and parsing Svelte configuration files in various build scenarios. This module provides functions to discover, load, and process Svelte configuration files that integrate with Vite's configuration system.

## Capabilities

### Svelte Config Loading

Load and parse Svelte configuration files with automatic discovery and validation.

```typescript { .api }
/**
 * Loads and parses Svelte configuration files
 * @param viteConfig - Optional Vite user configuration for context
 * @param inlineOptions - Optional inline plugin options that may affect config loading
 * @returns Promise resolving to parsed Svelte config or undefined if no config found
 */
function loadSvelteConfig(
  viteConfig?: UserConfig,
  inlineOptions?: Partial<Options>
): Promise<Partial<SvelteConfig> | undefined>;
```

**Usage Examples:**

```javascript
import { loadSvelteConfig } from '@sveltejs/vite-plugin-svelte';

// Basic usage - auto-discover config file
const config = await loadSvelteConfig();
console.log(config?.compilerOptions);

// With Vite config context
const viteConfig = { root: './src' };
const config = await loadSvelteConfig(viteConfig);

// With inline options
const config = await loadSvelteConfig(viteConfig, {
  configFile: './custom.svelte.config.js'
});

// Disable config file loading
const config = await loadSvelteConfig(viteConfig, {
  configFile: false
});
```

## Configuration File Discovery

### Supported Config File Names

The system automatically discovers Svelte configuration files in the following order:

```typescript { .api }
const knownSvelteConfigNames: string[] = [
  'svelte.config.js',
  'svelte.config.ts', 
  'svelte.config.mjs',
  'svelte.config.mts'
];
```

**File Discovery Process:**

1. Checks for custom `configFile` in inline options
2. Searches project root for known config file names
3. Uses the first found file if multiple exist (with warning)
4. Returns undefined if no config file found

### Custom Config File Paths

Specify custom configuration file locations:

```javascript
// Relative to Vite root
const config = await loadSvelteConfig(viteConfig, {
  configFile: './config/svelte.config.js'
});

// Absolute path
const config = await loadSvelteConfig(viteConfig, {
  configFile: '/path/to/project/svelte.config.js'
});

// Disable config loading entirely
const config = await loadSvelteConfig(viteConfig, {
  configFile: false
});
```

## Configuration File Formats

### JavaScript Configuration

```javascript
// svelte.config.js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/vite-plugin-svelte').SvelteConfig} */
export default {
  extensions: ['.svelte'],
  preprocess: vitePreprocess({
    style: true
  }),
  compilerOptions: {
    runes: true,
    dev: process.env.NODE_ENV === 'development'
  },
  vitePlugin: {
    emitCss: true,
    inspector: true
  },
  onwarn(warning, defaultHandler) {
    // Custom warning handling
    if (warning.code === 'css-unused-selector') return;
    defaultHandler(warning);
  }
};
```

### TypeScript Configuration

```typescript
// svelte.config.ts
import type { SvelteConfig } from '@sveltejs/vite-plugin-svelte';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config: SvelteConfig = {
  extensions: ['.svelte'],
  preprocess: vitePreprocess({
    style: true,
    script: false
  }),
  compilerOptions: {
    runes: true,
    hydratable: true
  },
  vitePlugin: {
    emitCss: true,
    hot: true,
    inspector: {
      holdMode: true,
      showToggleButton: 'always'
    }
  }
};

export default config;
```

### ESM Configuration

```javascript
// svelte.config.mjs
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  preprocess: vitePreprocess(),
  compilerOptions: {
    runes: true
  }
};
```

### Dynamic Configuration

```javascript
// svelte.config.js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

export default {
  preprocess: vitePreprocess({
    style: {
      css: {
        devSourcemap: isDev,
        minify: isProd
      }
    }
  }),
  compilerOptions: {
    dev: isDev,
    hydratable: isProd,
    runes: true
  },
  vitePlugin: {
    emitCss: true,
    hot: isDev,
    inspector: isDev,
    prebundleSvelteLibraries: isDev
  },
  onwarn(warning, defaultHandler) {
    // Ignore certain warnings in production
    if (isProd && ['css-unused-selector', 'a11y-missing-attribute'].includes(warning.code)) {
      return;
    }
    defaultHandler(warning);
  }
};
```

## Configuration Validation

### Error Handling

The configuration loader includes comprehensive error handling:

```javascript
try {
  const config = await loadSvelteConfig(viteConfig, options);
  if (!config) {
    console.log('No Svelte config found, using defaults');
  }
} catch (error) {
  console.error('Failed to load Svelte config:', error.message);
  // Handle configuration loading errors
}
```

### Configuration Validation

The loader validates configuration structure and provides meaningful error messages for common issues:

- Invalid export format (must export default)
- Missing or malformed configuration objects  
- File system errors (missing files, permission issues)
- Module resolution errors

## Integration Patterns

### Build Tool Integration

Integrate configuration loading into custom build tools:

```javascript
// Custom build script
import { loadSvelteConfig } from '@sveltejs/vite-plugin-svelte';

async function buildProject() {
  const viteConfig = await loadViteConfig();
  const svelteConfig = await loadSvelteConfig(viteConfig);
  
  // Use configuration to customize build process
  const shouldMinify = !svelteConfig?.compilerOptions?.dev;
  const preprocessors = svelteConfig?.preprocess || [];
  
  // Custom build logic here
}
```

### Testing Configuration

Load configuration in test environments:

```javascript
// test-utils.js
import { loadSvelteConfig } from '@sveltejs/vite-plugin-svelte';

export async function setupSvelteTest() {
  const config = await loadSvelteConfig({
    root: process.cwd()
  }, {
    configFile: './svelte.config.test.js'
  });
  
  return config;
}
```

### Development Tools Integration

Use configuration loading in development tools:

```javascript
// dev-tool.js
import { loadSvelteConfig } from '@sveltejs/vite-plugin-svelte';

async function analyzeSvelteProject() {
  const config = await loadSvelteConfig();
  
  // Analyze project based on configuration
  const extensions = config?.extensions || ['.svelte'];
  const hasPreprocessors = Boolean(config?.preprocess);
  const isRunesEnabled = config?.compilerOptions?.runes;
  
  return {
    extensions,
    hasPreprocessors,
    isRunesEnabled
  };
}
```

## Configuration Merging

The configuration system merges options from multiple sources in priority order:

1. **Inline options** (highest priority)
2. **Svelte config file** 
3. **Default values** (lowest priority)

This allows for flexible configuration overrides while maintaining sensible defaults.

```javascript
// Example of configuration precedence
const finalConfig = {
  // Defaults
  extensions: ['.svelte'],
  emitCss: true,
  
  // Overridden by svelte.config.js
  ...svelteConfigFile,
  
  // Overridden by inline options
  ...inlineOptions
};
```