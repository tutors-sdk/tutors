# Vite Preprocessing

Svelte preprocessor that uses Vite's transformation pipeline for processing script and style blocks within Svelte components. This allows Svelte components to use TypeScript, PostCSS, Sass, and other transformations that Vite supports.

## Capabilities

### Vite Preprocessor Factory

Creates a Svelte preprocessor that integrates with Vite's transformation pipeline.

```typescript { .api }
/**
 * Creates a Svelte preprocessor that uses Vite's pipeline for script and style processing
 * @param opts - Preprocessing options
 * @returns Svelte PreprocessorGroup for use in svelte.config.js
 */
function vitePreprocess(opts?: VitePreprocessOptions): PreprocessorGroup;

interface VitePreprocessOptions {
  /** 
   * Preprocess script blocks with vite pipeline
   * Since Svelte 5 this is not needed for TypeScript anymore
   * @default false
   */
  script?: boolean;
  /** Preprocess style blocks with vite pipeline */
  style?: boolean | InlineConfig | ResolvedConfig;
}
```

**Usage Examples:**

```javascript
// svelte.config.js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  preprocess: vitePreprocess({
    style: true,
    script: false // Not needed for TypeScript in Svelte 5+
  })
};

// Enable both script and style preprocessing
export default {
  preprocess: vitePreprocess({
    style: true,
    script: true // Only needed for Svelte 4 or specific use cases
  })
};

// Pass Vite config for style preprocessing
export default {
  preprocess: vitePreprocess({
    style: {
      css: {
        devSourcemap: true,
        preprocessorOptions: {
          scss: {
            additionalData: '@import "src/styles/variables.scss";'
          }
        }
      }
    }
  })
};
```

## Script Preprocessing

### Script Processing Options

Configure TypeScript and JavaScript preprocessing for script blocks.

```typescript { .api }
interface ScriptProcessingOptions {
  /** 
   * Enable script block preprocessing
   * Note: Since Svelte 5, TypeScript is handled natively and this is usually not needed
   * @default false
   */
  script?: boolean;
}
```

**Usage Examples:**

```javascript
// For Svelte 5+ (TypeScript works natively)
export default {
  preprocess: vitePreprocess({
    script: false // Default, TypeScript works without this
  })
};

// For Svelte 4 or when you need Vite transformations in script blocks
export default {
  preprocess: vitePreprocess({
    script: true // Enables Vite's esbuild/oxc transformation
  })
};
```

**Svelte Component Example:**

```svelte
<!-- Works in Svelte 5+ without script preprocessing -->
<script lang="ts">
  interface User {
    name: string;
    age: number;
  }
  
  export let user: User;
  
  // TypeScript features work natively
  const displayName: string = user.name.toUpperCase();
</script>

<div>
  <h1>{displayName}</h1>
  <p>Age: {user.age}</p>
</div>
```

## Style Preprocessing

### Style Processing Options

Configure CSS, PostCSS, Sass, and other style preprocessing.

```typescript { .api }
interface StyleProcessingOptions {
  /** 
   * Enable and configure style block preprocessing
   * - boolean: enable/disable with default Vite config
   * - InlineConfig: provide specific Vite configuration
   * - ResolvedConfig: use existing resolved Vite config
   */
  style?: boolean | InlineConfig | ResolvedConfig;
}
```

**Usage Examples:**

```javascript
// Basic style preprocessing (uses default Vite config)
export default {
  preprocess: vitePreprocess({
    style: true
  })
};

// Custom Vite configuration for style processing
export default {
  preprocess: vitePreprocess({
    style: {
      css: {
        devSourcemap: true,
        preprocessorOptions: {
          scss: {
            additionalData: `@import "src/styles/variables.scss";`
          },
          less: {
            modifyVars: {
              'primary-color': '#1890ff'
            }
          }
        }
      }
    }
  })
};

// Advanced PostCSS configuration
export default {
  preprocess: vitePreprocess({
    style: {
      css: {
        postcss: {
          plugins: [
            require('autoprefixer'),
            require('tailwindcss'),
            require('postcss-nesting')
          ]
        }
      }
    }
  })
};
```

**Svelte Component Style Examples:**

```svelte
<!-- PostCSS with nesting -->
<style lang="postcss">
  .card {
    padding: 1rem;
    border-radius: 0.5rem;
    
    &:hover {
      transform: scale(1.02);
    }
    
    .title {
      font-size: 1.25rem;
      font-weight: bold;
    }
  }
</style>

<!-- Sass/SCSS -->
<style lang="scss">
  $primary-color: #3498db;
  
  .button {
    background-color: $primary-color;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    
    &:hover {
      background-color: darken($primary-color, 10%);
    }
  }
</style>

<!-- CSS with imports -->
<style>
  @import 'modern-normalize';
  @import './component-styles.css';
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
</style>
```

### CSS Module Support

Support for CSS modules and scoped styles.

```svelte
<!-- CSS Modules -->
<style module>
  .button {
    background: blue;
    color: white;
  }
</style>

<script>
  // Access CSS module classes
  export let styles;
</script>

<button class={styles.button}>Click me</button>
```

### Style Dependencies and Imports

Handle CSS dependencies and asset imports.

```svelte
<!-- Import external stylesheets -->
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
  @import '../styles/global.css';
  
  /* Local asset imports work through Vite */
  .background {
    background-image: url('../assets/pattern.svg');
  }
</style>
```

## Advanced Configuration

### Integration with Vite Config

Coordinate preprocessing with your main Vite configuration.

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: '@import "src/styles/variables.scss";'
      }
    }
  },
  plugins: [
    svelte({
      preprocess: vitePreprocess({
        style: true // Will use the CSS config above
      })
    })
  ]
});
```

### Multiple Preprocessors

Combine vitePreprocess with other Svelte preprocessors.

```javascript
// svelte.config.js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

export default {
  extensions: ['.svelte', '.md'],
  preprocess: [
    mdsvex({
      extensions: ['.md']
    }),
    vitePreprocess({
      style: true
    })
  ]
};
```

### Development vs Production

Different preprocessing settings for different environments.

```javascript
// svelte.config.js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const dev = process.env.NODE_ENV === 'development';

export default {
  preprocess: vitePreprocess({
    style: {
      css: {
        devSourcemap: dev,
        minify: !dev
      }
    }
  })
};
```

## Error Handling

The vitePreprocess function handles errors from Vite's transformation pipeline and provides meaningful error messages with source mapping information for debugging.