# CSS Processing

Vite provides comprehensive CSS processing with support for preprocessors (Sass, Less, Stylus), CSS modules, PostCSS, and advanced optimizations. It includes source map generation, automatic vendor prefixing, and production minification.

## Capabilities

### CSS Preprocessing

Process CSS with various preprocessors and generate source maps.

```typescript { .api }
/**
 * Preprocess CSS with configured preprocessors
 * @param code - CSS source code
 * @param filename - Source filename
 * @param config - Resolved Vite configuration
 * @returns Promise resolving to preprocessing result
 */
function preprocessCSS(
  code: string,
  filename: string,
  config: ResolvedConfig
): Promise<PreprocessCSSResult>;

interface PreprocessCSSResult {
  /** Processed CSS code */
  code: string;
  /** Source map */
  map?: SourceMap;
  /** Additional dependencies */
  deps?: string[];
  /** Modules (for CSS modules) */
  modules?: Record<string, string>;
}
```

**Usage Examples:**

```typescript
import { preprocessCSS } from "vite";

// Process Sass file
const result = await preprocessCSS(
  '@import "variables"; .btn { color: $primary; }',
  './src/components/Button.scss', 
  config
);

console.log(result.code); // Compiled CSS
console.log(result.map);  // Source map
console.log(result.deps); // Dependencies found during processing
```

### PostCSS Source Maps

Format and handle PostCSS source maps for proper debugging.

```typescript { .api }
/**
 * Format PostCSS source maps
 * @param rawMap - Raw source map from PostCSS
 * @param file - Source file path
 * @returns Formatted source map
 */
function formatPostcssSourceMap(
  rawMap: ExistingRawSourceMap,
  file: string
): SourceMap;
```

### CSS Options

Configure CSS processing behavior including modules, preprocessors, and PostCSS.

```typescript { .api }
interface CSSOptions {
  /** CSS modules configuration */
  modules?: CSSModulesOptions;
  /** Preprocessor options */
  preprocessorOptions?: {
    sass?: SassPreprocessorOptions;
    scss?: SassPreprocessorOptions;
    less?: LessPreprocessorOptions;
    stylus?: StylusPreprocessorOptions;
  };
  /** PostCSS configuration */
  postcss?: PostCSSOptions;
  /** Enable sourcemaps in dev */
  devSourcemap?: boolean;
  /** Minify CSS */
  minify?: boolean | 'esbuild' | 'lightningcss';
  /** Lightning CSS options */
  lightningcss?: LightningCSSOptions;
}

interface ResolvedCSSOptions extends CSSOptions {
  modules: CSSModulesOptions | false;
  preprocessorOptions: {
    sass: SassPreprocessorOptions;
    scss: SassPreprocessorOptions; 
    less: LessPreprocessorOptions;
    stylus: StylusPreprocessorOptions;
  };
  postcss: PostCSSOptions;
  devSourcemap: boolean;
}
```

### CSS Modules

Configure CSS modules for scoped styling and class name generation.

```typescript { .api }
interface CSSModulesOptions {
  /** Scoped names pattern */
  scopeBehaviour?: 'global' | 'local';
  /** Global modules pattern */
  globalModulePaths?: RegExp[];
  /** Exported globals */
  exportGlobals?: boolean;
  /** Class name generation */
  generateScopedName?: string | ((name: string, filename: string, css: string) => string);
  /** Hash prefix */
  hashPrefix?: string;
  /** Locales path */
  localsConvention?: 'camelCase' | 'camelCaseOnly' | 'dashes' | 'dashesOnly';
}
```

**Usage Examples:**

```typescript
// CSS modules configuration
export default defineConfig({
  css: {
    modules: {
      scopeBehaviour: 'local',
      generateScopedName: '[name]__[local]___[hash:base64:5]',
      localsConvention: 'camelCaseOnly'
    }
  }
});

// Using CSS modules
// styles.module.css
// .button-primary { color: blue; }

// Component.tsx  
import styles from './styles.module.css';
console.log(styles.buttonPrimary); // 'Button__button-primary___2h8kJ'
```

### Sass/SCSS Options

Configure Sass and SCSS preprocessing options.

```typescript { .api }
type SassPreprocessorOptions = {
  /** Additional data to prepend */
  additionalData?: string | ((source: string, filename: string) => string);
  /** Include paths */
  includePaths?: string[];
  /** Indented syntax (Sass) */
  indentedSyntax?: boolean;
  /** Sass implementation */
  implementation?: any;
  /** Import function */
  importer?: any;
  /** Custom functions */
  functions?: Record<string, any>;
  /** Output style */
  outputStyle?: 'nested' | 'expanded' | 'compact' | 'compressed';
  /** Source map */
  sourceMap?: boolean;
  /** Source map contents */
  sourceMapContents?: boolean;
  /** Source map embed */
  sourceMapEmbed?: boolean;
  /** Sass options (all other Sass options) */
  [key: string]: any;
};
```

### Less Options

Configure Less preprocessing options.

```typescript { .api }
type LessPreprocessorOptions = {
  /** Additional data to prepend */
  additionalData?: string | ((source: string, filename: string) => string);
  /** Math mode */
  math?: 'always' | 'strict' | 'parens-division' | 'parens' | 'strict-legacy' | number;
  /** Include paths */
  paths?: string[];
  /** Global variables */
  globalVars?: Record<string, string>;
  /** Modify variables */
  modifyVars?: Record<string, string>;
  /** Filename */
  filename?: string;
  /** Plugins */
  plugins?: any[];
  /** JavaScript enabled */
  javascriptEnabled?: boolean;
  /** Less options (all other Less options) */
  [key: string]: any;
};
```

### Stylus Options

Configure Stylus preprocessing options.

```typescript { .api }
type StylusPreprocessorOptions = {
  /** Additional data to prepend */
  additionalData?: string | ((source: string, filename: string) => string);
  /** Include paths */
  paths?: string[];
  /** Global variables */
  globals?: Record<string, any>;
  /** Define functions */
  functions?: Record<string, any>;
  /** Use plugins */
  use?: any[];
  /** Import files */
  imports?: string[];
  /** Include CSS */
  includeCSS?: boolean;
  /** Stylus options (all other Stylus options) */
  [key: string]: any;
};
```

### PostCSS Configuration

Configure PostCSS processing and plugins.

```typescript { .api }
type PostCSSOptions = {
  /** PostCSS plugins */
  plugins?: any[];
  /** PostCSS options */
  parser?: string | any;
  stringifier?: string | any;
  syntax?: string | any;
  map?: boolean | any;
  from?: string;
  to?: string;
  /** PostCSS configuration (all other PostCSS options) */
  [key: string]: any;
};
```

**Usage Examples:**

```typescript
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer()
      ]
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
        includePaths: ['node_modules', 'src/styles']
      },
      less: {
        globalVars: {
          'primary-color': '#1890ff',
          'border-radius': '4px'
        }
      }
    }
  }
});
```

## CSS Request Detection

Utilities for detecting CSS-related requests.

```typescript { .api }
/**
 * Check if request is for CSS
 * @param request - Request path or URL
 * @returns Whether request is for CSS file
 */
function isCSSRequest(request: string): boolean;

/**
 * Check if request is for CSS modules
 * @param request - Request path or URL
 * @returns Whether request is for CSS modules
 */
function isCSSModulesRequest(request: string): boolean;

/**
 * Check if request is for preprocessor file
 * @param request - Request path or URL
 * @returns Whether request is for preprocessor file (sass, less, stylus)
 */
function isPreprocessorRequest(request: string): boolean;
```

## CSS Asset Handling

Handle CSS assets during build and development.

```typescript { .api }
/**
 * CSS asset information
 */
interface CSSAssetInfo {
  /** Asset filename */
  filename: string;
  /** CSS source */
  source: string;
  /** Whether it's a CSS module */
  isModule: boolean;
}

/**
 * CSS chunk information
 */
interface CSSChunkInfo {
  /** CSS content */
  css: string;
  /** Associated JS chunks */
  chunks: string[];
  /** CSS modules mapping */
  modules?: Record<string, string>;
}
```

## Lightning CSS Options

Configuration for Lightning CSS (fast CSS processor).

```typescript { .api }
interface LightningCSSOptions {
  /** Minify CSS */
  minify?: boolean;
  /** Target browsers */
  targets?: string | string[] | Record<string, any>;
  /** Include features */
  include?: number;
  /** Exclude features */  
  exclude?: number;
  /** Draft features */
  drafts?: {
    nesting?: boolean;
    customMedia?: boolean;
  };
  /** Non-standard features */
  nonStandard?: {
    deepSelectorCombinator?: boolean;
  };
  /** Pseudo classes */
  pseudoClasses?: Record<string, string>;
  /** Unused symbols */
  unusedSymbols?: string[];
}
```