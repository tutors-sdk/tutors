# Vite Integration

SvelteKit integrates seamlessly with Vite for development and building. The `sveltekit()` function returns the necessary Vite plugins to enable SvelteKit functionality.

## Capabilities

### SvelteKit Vite Plugin

Returns the complete set of Vite plugins needed for SvelteKit development and building.

```typescript { .api }
/**
 * Returns the SvelteKit Vite plugins
 * @returns Promise resolving to array of Vite plugins
 */
function sveltekit(): Promise<import('vite').Plugin[]>;
```

**Usage Examples:**

```typescript
// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()]
});
```

### Advanced Vite Configuration

```typescript
// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  
  // Development server configuration
  server: {
    port: 3000,
    host: true, // Listen on all addresses
    fs: {
      allow: ['..'] // Allow accessing parent directories
    }
  },
  
  // Build configuration
  build: {
    target: 'esnext',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Create separate chunks for large dependencies
          'vendor': ['lodash', 'date-fns'],
          'ui-lib': ['@ui/components']
        }
      }
    }
  },
  
  // Dependency optimization
  optimizeDeps: {
    include: ['some-cjs-package']
  },
  
  // Environment variables
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  }
});
```

## Virtual Modules

SvelteKit provides several virtual modules through the Vite integration:

### App Modules

```typescript { .api }
// $app/environment - Runtime environment information
declare module '$app/environment' {
  export const browser: boolean;
  export const dev: boolean;
  export const building: boolean;
  export const version: string;
}

// $app/forms - Form enhancement utilities
declare module '$app/forms' {
  export function enhance(form: HTMLFormElement, submit?: SubmitFunction): { destroy(): void };
  export function deserialize(result: string): ActionResult;
  export function applyAction(result: ActionResult): Promise<void>;
}

// $app/navigation - Client-side navigation
declare module '$app/navigation' {
  export function goto(url: string | URL, opts?: GotoOptions): Promise<void>;
  export function invalidate(resource: string | URL | ((url: URL) => boolean)): Promise<void>;
  export function invalidateAll(): Promise<void>;
  export function preloadData(href: string): Promise<any>;
  export function preloadCode(pathname: string): Promise<void>;
  export function beforeNavigate(callback: (navigation: BeforeNavigate) => void): void;
  export function afterNavigate(callback: (navigation: AfterNavigate) => void): void;
  export function onNavigate(callback: (navigation: OnNavigate) => void): void;
  export function pushState(url: string | URL, state: any): void;
  export function replaceState(url: string | URL, state: any): void;
}

// $app/paths - URL path utilities
declare module '$app/paths' {
  export const base: string;
  export const assets: string;
  export function resolve(...args: any[]): string;
  export function asset(file: string): string;
}

// $app/state - Reactive app state (Svelte 5)
declare module '$app/state' {
  export const page: Page;
  export const navigating: Navigation | null;
  export const updated: { current: boolean; check(): Promise<boolean> };
}

// $app/stores - Svelte stores (legacy)
declare module '$app/stores' {
  export const page: Readable<Page>;
  export const navigating: Readable<Navigation | null>;
  export const updated: Readable<boolean> & { check(): Promise<boolean> };
}
```

### Environment Modules

```typescript { .api }
// $env/static/private - Static private environment variables (server-only)
declare module '$env/static/private' {
  export const DATABASE_URL: string;
  export const SECRET_KEY: string;
  // ... other private env vars
}

// $env/static/public - Static public environment variables
declare module '$env/static/public' {
  export const PUBLIC_API_URL: string;
  export const PUBLIC_GA_ID: string;
  // ... other public env vars
}

// $env/dynamic/private - Dynamic private environment variables (server-only)
declare module '$env/dynamic/private' {
  export const env: Record<string, string | undefined>;
}

// $env/dynamic/public - Dynamic public environment variables
declare module '$env/dynamic/public' {
  export const env: Record<string, string | undefined>;
}
```

### Service Worker Module

```typescript { .api }
// $service-worker - Service worker utilities
declare module '$service-worker' {
  export const base: string;
  export const build: string[];
  export const files: string[];
  export const prerendered: string[];
  export const version: string;
}
```

## Plugin Customization

### Adding Custom Plugins

```typescript
// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit(),
    
    // Custom plugin for processing files
    {
      name: 'custom-processor',
      transform(code, id) {
        if (id.endsWith('.special')) {
          return `export default ${JSON.stringify(processSpecialFile(code))}`;
        }
      }
    },
    
    // Plugin for development only
    process.env.NODE_ENV === 'development' && {
      name: 'dev-only-plugin',
      configureServer(server) {
        server.middlewares.use('/dev-api', (req, res, next) => {
          // Development API endpoints
          if (req.url === '/status') {
            res.end(JSON.stringify({ status: 'ok' }));
          } else {
            next();
          }
        });
      }
    }
  ].filter(Boolean)
});
```

### TypeScript Configuration

```typescript
// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
  plugins: [sveltekit()],
  
  // TypeScript-specific options
  esbuild: {
    target: 'esnext',
    format: 'esm'
  },
  
  // Path aliases
  resolve: {
    alias: {
      $components: path.resolve('./src/components'),
      $utils: path.resolve('./src/utils')
    }
  }
};

export default defineConfig(config);
```

## Development Features

### Hot Module Replacement

```typescript
// src/lib/hot-reload.js
if (import.meta.hot) {
  // Accept hot updates for this module
  import.meta.hot.accept();
  
  // Dispose callback for cleanup
  import.meta.hot.dispose(() => {
    console.log('Module disposed');
  });
  
  // Custom HMR handling
  import.meta.hot.accept('./some-module.js', (newModule) => {
    // Handle updated module
    console.log('Module updated', newModule);
  });
}
```

### Environment-Specific Configuration

```typescript
// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production';
  const isDevelopment = command === 'serve';
  
  return {
    plugins: [sveltekit()],
    
    define: {
      __DEV__: !isProduction,
      __BUILD_DATE__: JSON.stringify(new Date().toISOString())
    },
    
    build: {
      // Production-only build options
      ...(isProduction && {
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true
          }
        }
      })
    },
    
    server: {
      // Development-only server options
      ...(isDevelopment && {
        proxy: {
          '/api': 'http://localhost:8080'
        }
      })
    }
  };
});
```

### CSS Processing

```typescript
// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import '$lib/styles/variables.scss';
          @import '$lib/styles/mixins.scss';
        `
      }
    },
    
    // PostCSS configuration
    postcss: {
      plugins: [
        require('autoprefixer'),
        require('tailwindcss')
      ]
    }
  }
});
```

### Asset Processing

```typescript
// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  
  // Asset handling
  assetsInclude: ['**/*.gltf', '**/*.hdr'],
  
  build: {
    assetsInlineLimit: 4096, // 4kb threshold for inlining
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Custom asset file naming
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          
          return `assets/[name]-[hash][extname]`;
        }
      }
    }
  }
});
```

### Worker Support

```typescript
// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  
  worker: {
    format: 'es'
  },
  
  build: {
    rollupOptions: {
      output: {
        // Separate chunk for web workers
        manualChunks: {
          worker: ['./src/lib/worker.js']
        }
      }
    }
  }
});

// Usage in component:
// const worker = new Worker('/src/lib/worker.js', { type: 'module' });
```

## Build Optimization

### Code Splitting

```typescript
// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunk for node_modules
          if (id.includes('node_modules')) {
            if (id.includes('svelte')) {
              return 'svelte-vendor';
            }
            return 'vendor';
          }
          
          // UI components chunk
          if (id.includes('/src/components/ui/')) {
            return 'ui-components';
          }
          
          // Utils chunk
          if (id.includes('/src/lib/utils/')) {
            return 'utils';
          }
        }
      }
    }
  }
});
```

### Bundle Analysis

```typescript
// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    sveltekit(),
    
    // Bundle analyzer
    process.env.ANALYZE && visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true
    })
  ].filter(Boolean)
});

// Run with: ANALYZE=true npm run build
```

## Best Practices

1. **Keep configuration simple**: Start with basic `sveltekit()` plugin and add complexity as needed
2. **Environment-specific configs**: Use mode and command parameters for different environments
3. **Optimize dependencies**: Use `optimizeDeps` for problematic packages
4. **Code splitting**: Implement manual chunks for better caching
5. **Asset optimization**: Configure appropriate asset handling and inlining thresholds
6. **Development proxy**: Use Vite's proxy for API development
7. **TypeScript integration**: Leverage Vite's built-in TypeScript support
8. **Hot reload**: Design components to work well with HMR
9. **Build analysis**: Use bundle analyzers to optimize bundle sizes
10. **Plugin ordering**: Be aware of plugin execution order when using multiple plugins