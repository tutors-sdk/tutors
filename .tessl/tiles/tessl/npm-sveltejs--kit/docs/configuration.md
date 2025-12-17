# Configuration

SvelteKit provides extensive configuration options through the `svelte.config.js` file to customize the framework's behavior, build process, and deployment settings.

## Capabilities

### Core Configuration Interface

The main configuration object that extends Svelte's configuration.

```typescript { .api }
interface Config {
  /** SvelteKit configuration options */
  kit?: KitConfig;
  /** Vite plugin Svelte configuration (inherited) */
  extensions?: string[];
  compilerOptions?: any;
  preprocess?: any;
  [key: string]: any;
}

interface KitConfig {
  /** Adapter for deployment platform */
  adapter?: Adapter;
  /** Path aliases for imports */
  alias?: Record<string, string>;
  /** Directory name for SvelteKit assets */
  appDir?: string;
  /** Content Security Policy configuration */
  csp?: CSPConfig;
  /** Cross-Site Request Forgery protection */
  csrf?: CSRFConfig;
  /** Environment variable configuration */
  env?: EnvConfig;
  /** File and directory paths */
  files?: FilesConfig;
  /** CSS inlining threshold */
  inlineStyleThreshold?: number;
  /** Path configuration for deployment */
  paths?: PathsConfig;
  /** Prerendering configuration */
  prerender?: PrerenderConfig;
  /** Service worker configuration */
  serviceWorker?: ServiceWorkerConfig;
  /** TypeScript configuration */
  typescript?: TypeScriptConfig;
  /** Version management */
  version?: VersionConfig;
}
```

### Adapter Configuration

Configure deployment adapters for different platforms.

```typescript { .api }
interface Adapter {
  /** Name of the adapter */
  name: string;
  /** Function called after SvelteKit builds the app */
  adapt: (builder: Builder) => Promise<void> | void;
  /** Feature support checks */
  supports?: {
    read?: (details: { config: any; route: { id: string } }) => boolean;
  };
  /** Environment emulation during development */
  emulate?: () => Promise<Emulator> | Emulator;
}
```

**Usage Examples:**

```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-auto';

export default {
  kit: {
    // Auto-detect deployment platform
    adapter: adapter()
  }
};
```

```javascript
// Static site generation
import adapter from '@sveltejs/adapter-static';

export default {
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: '404.html',
      precompress: false,
      strict: true
    })
  }
};
```

```javascript
// Node.js deployment
import adapter from '@sveltejs/adapter-node';

export default {
  kit: {
    adapter: adapter({
      out: 'build',
      precompress: false,
      envPrefix: 'MY_CUSTOM_'
    })
  }
};
```

## Configuration Examples

### Basic Configuration

```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Svelte options
  extensions: ['.svelte'],
  preprocess: vitePreprocess(),
  
  kit: {
    // Basic SvelteKit options
    adapter: adapter(),
    
    // Custom app directory name
    appDir: '_app',
    
    // Path aliases
    alias: {
      $components: 'src/components',
      $stores: 'src/stores',
      $utils: 'src/utils'
    }
  }
};

export default config;
```

### Advanced Configuration

```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte'],
  preprocess: vitePreprocess(),
  
  kit: {
    adapter: adapter({
      out: 'build',
      precompress: true
    }),
    
    // Path configuration
    paths: {
      base: process.env.NODE_ENV === 'production' ? '/my-app' : '',
      assets: 'https://cdn.example.com',
      relative: false
    },
    
    // Environment variables
    env: {
      dir: '.',
      publicPrefix: 'PUBLIC_',
      privatePrefix: 'PRIVATE_'
    },
    
    // Content Security Policy
    csp: {
      mode: 'auto',
      directives: {
        'default-src': ['self'],
        'script-src': ['self', 'unsafe-inline'],
        'style-src': ['self', 'unsafe-inline'],
        'img-src': ['self', 'data:', 'https:'],
        'font-src': ['self'],
        'connect-src': ['self'],
        'frame-src': ['none']
      }
    },
    
    // CSRF protection
    csrf: {
      checkOrigin: true,
      trustedOrigins: ['https://trusted-site.com']
    },
    
    // Prerendering
    prerender: {
      entries: ['*'],
      crawl: true,
      concurrency: 2,
      handleHttpError: 'warn',
      handleMissingId: 'warn'
    },
    
    // Service worker
    serviceWorker: {
      register: true,
      files: (filename) => !/\.DS_Store/.test(filename)
    },
    
    // TypeScript
    typescript: {
      config: (config) => {
        config.compilerOptions.strict = true;
        return config;
      }
    },
    
    // Version management
    version: {
      name: process.env.npm_package_version,
      pollInterval: 30000
    }
  }
};

export default config;
```

### Multi-Environment Configuration

```javascript
// svelte.config.js
import adapterNode from '@sveltejs/adapter-node';
import adapterStatic from '@sveltejs/adapter-static';
import adapterVercel from '@sveltejs/adapter-vercel';

const dev = process.env.NODE_ENV === 'development';
const preview = process.env.NODE_ENV === 'preview';

// Choose adapter based on environment
function getAdapter() {
  if (process.env.VERCEL) {
    return adapterVercel();
  }
  
  if (process.env.BUILD_STATIC) {
    return adapterStatic({
      pages: 'dist',
      assets: 'dist',
      fallback: '404.html'
    });
  }
  
  return adapterNode({
    out: 'build'
  });
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: getAdapter(),
    
    // Environment-specific paths
    paths: {
      base: dev ? '' : process.env.BASE_PATH || '',
      assets: process.env.ASSETS_URL || ''
    },
    
    // Development-only features
    ...(dev && {
      // Hot reload configuration
      vite: {
        server: {
          hmr: {
            overlay: true
          }
        }
      }
    }),
    
    // Production optimizations
    ...(!dev && {
      inlineStyleThreshold: 1024,
      prerender: {
        entries: ['*'],
        crawl: true
      }
    })
  }
};

export default config;
```

## Configuration Options

### Path Configuration

```javascript
export default {
  kit: {
    paths: {
      // Base path for deployment to subdirectory
      base: '/my-app',
      
      // CDN or asset server URL
      assets: 'https://cdn.example.com',
      
      // Use relative paths in HTML
      relative: true
    }
  }
};
```

### File Structure Configuration

```javascript
export default {
  kit: {
    files: {
      // Source directory
      src: 'src',
      
      // Static assets
      assets: 'static',
      
      // Hook files
      hooks: {
        client: 'src/hooks.client',
        server: 'src/hooks.server',
        universal: 'src/hooks'
      },
      
      // Library directory
      lib: 'src/lib',
      
      // Route parameter matchers
      params: 'src/params',
      
      // Routes directory
      routes: 'src/routes',
      
      // Service worker
      serviceWorker: 'src/service-worker',
      
      // HTML templates
      appTemplate: 'src/app.html',
      errorTemplate: 'src/error.html'
    }
  }
};
```

### Security Configuration

```javascript
export default {
  kit: {
    // Content Security Policy
    csp: {
      mode: 'hash', // or 'nonce' or 'auto'
      directives: {
        'default-src': ['self'],
        'script-src': ['self'],
        'style-src': ['self', 'unsafe-inline'],
        'img-src': ['self', 'data:', 'https:'],
        'font-src': ['self'],
        'connect-src': ['self', 'https://api.example.com'],
        'frame-src': ['none'],
        'object-src': ['none'],
        'base-uri': ['self']
      },
      reportOnly: {
        'default-src': ['self'],
        'report-uri': ['/csp-report']
      }
    },
    
    // CSRF protection
    csrf: {
      checkOrigin: true,
      trustedOrigins: [
        'https://checkout.stripe.com',
        'https://js.stripe.com'
      ]
    }
  }
};
```

### Build Configuration

```javascript
export default {
  kit: {
    // CSS inlining threshold (characters)
    inlineStyleThreshold: 1024,
    
    // Output configuration
    output: {
      preloadStrategy: 'modulepreload' // or 'preload-js' or 'preload-mjs'
    },
    
    // Module extensions
    moduleExtensions: ['.js', '.ts'],
    
    // Output directory
    outDir: '.svelte-kit'
  }
};
```

### Prerendering Configuration

```javascript
export default {
  kit: {
    prerender: {
      // Which pages to prerender
      entries: ['*', '/sitemap.xml'],
      
      // Follow links to find more pages
      crawl: true,
      
      // Concurrent prerendering
      concurrency: 4,
      
      // Error handling
      handleHttpError: ({ status, path, referrer, message }) => {
        if (path === '/admin' && status === 404) {
          return; // Ignore admin 404s
        }
        throw new Error(message);
      },
      
      handleMissingId: 'warn',
      handleEntryGeneratorMismatch: 'warn',
      
      // Origin for absolute URLs during prerendering
      origin: 'https://example.com'
    }
  }
};
```

### TypeScript Configuration

```javascript
export default {
  kit: {
    typescript: {
      config: (config) => {
        // Modify generated tsconfig.json
        config.compilerOptions.strict = true;
        config.compilerOptions.noImplicitReturns = true;
        config.include.push('../shared/**/*');
        
        return config;
      }
    }
  }
};
```

### Version Management

```javascript
import { execSync } from 'child_process';

export default {
  kit: {
    version: {
      // Use git commit hash as version
      name: execSync('git rev-parse HEAD').toString().trim(),
      
      // Poll for updates every 30 seconds
      pollInterval: 30000
    }
  }
};
```

### Service Worker Configuration

```javascript
export default {
  kit: {
    serviceWorker: {
      register: true,
      
      // Filter which static files to include
      files: (filename) => {
        return !/\.DS_Store/.test(filename) && 
               !filename.includes('admin') &&
               !filename.endsWith('.map');
      }
    }
  }
};
```

## Platform-Specific Configurations

### Vercel Configuration

```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-vercel';

export default {
  kit: {
    adapter: adapter({
      runtime: 'edge', // or 'nodejs18.x'
      regions: ['iad1'],
      split: true
    })
  }
};
```

### Netlify Configuration

```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-netlify';

export default {
  kit: {
    adapter: adapter({
      edge: false,
      split: false
    })
  }
};
```

### Cloudflare Pages Configuration

```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-cloudflare';

export default {
  kit: {
    adapter: adapter({
      routes: {
        include: ['/*'],
        exclude: ['/admin/*']
      }
    })
  }
};
```

## Best Practices

1. **Environment-specific configs**: Use environment variables for different deployment targets
2. **Security headers**: Configure CSP and CSRF protection appropriately
3. **Path configuration**: Set correct base and assets paths for deployment
4. **Prerendering**: Configure prerendering for better performance and SEO
5. **Type safety**: Use TypeScript configuration for better development experience
6. **Asset optimization**: Set appropriate inlining thresholds and compression
7. **Service worker**: Configure service worker file filtering for optimal caching
8. **Version management**: Use meaningful version identifiers for cache busting
9. **Adapter selection**: Choose the right adapter for your deployment platform
10. **Development optimization**: Use different configurations for development and production