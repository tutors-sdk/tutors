# Compiler API

Svelte's compiler API provides functions for compiling Svelte components, parsing source code, preprocessing, and migrating between versions. These tools are essential for build systems, development tools, and code transformation.

## Capabilities

### compile

Converts Svelte component source code into a JavaScript module that exports a component.

```typescript { .api }
/**
 * Compile a Svelte component to JavaScript
 * @param source - The component source code
 * @param options - Compilation options
 * @returns Compilation result with JavaScript and CSS
 */
function compile(source: string, options: CompileOptions): CompileResult;
```

**Usage Examples:**

```typescript
import { compile } from "svelte/compiler";

const source = `
<script>
  let count = 0;
</script>

<button on:click={() => count++}>
  Count: {count}
</button>
`;

// Basic compilation
const result = compile(source, {
  filename: "Counter.svelte",
  generate: "dom" // or "ssr" for server-side rendering
});

console.log(result.js.code); // Generated JavaScript
console.log(result.css?.code); // Generated CSS (if any)

// Advanced compilation options
const advancedResult = compile(source, {
  filename: "Counter.svelte",
  generate: "dom",
  dev: true, // Development mode with runtime checks
  css: "external", // Extract CSS to separate file
  runes: true, // Enable runes mode
  customElement: false,
  namespace: "html",
  accessors: false,
  immutable: false,
  preserveComments: false,
  preserveWhitespace: false,
  sourcemap: true
});
```

### compileModule

Compiles JavaScript source code containing runes into a JavaScript module.

```typescript { .api }
/**
 * Compile JavaScript module with runes to optimized JavaScript
 * @param source - JavaScript source code with runes
 * @param options - Module compilation options
 * @returns Compilation result
 */
function compileModule(source: string, options: ModuleCompileOptions): CompileResult;
```

**Usage Examples:**

```typescript
import { compileModule } from "svelte/compiler";

const runesSource = `
let count = $state(0);
let doubled = $derived(count * 2);

$effect(() => {
  console.log('Count changed:', count);
});

export { count, doubled };
`;

const result = compileModule(runesSource, {
  filename: "store.runes.js",
  dev: false,
  generate: "client"
});

console.log(result.js.code); // Compiled JavaScript with optimized reactivity
```

### parse

Parses a Svelte component and returns its Abstract Syntax Tree (AST).

```typescript { .api }
/**
 * Parse a Svelte component and return its AST
 * @param source - Component source code
 * @param options - Parse options
 * @returns AST representation of the component
 */
function parse(source: string, options?: {
  filename?: string;
  modern?: boolean;
  loose?: boolean;
}): AST.Root;
```

**Usage Examples:**

```typescript
import { parse } from "svelte/compiler";

const source = `
<script>
  export let name = 'world';
</script>

<h1>Hello {name}!</h1>

<style>
  h1 {
    color: purple;
  }
</style>
`;

// Parse with modern AST (recommended)
const ast = parse(source, {
  filename: "Hello.svelte",
  modern: true
});

console.log(ast.type); // "Root"
console.log(ast.instance); // Script AST
console.log(ast.fragment); // Template AST
console.log(ast.css); // Style AST

// Traverse AST
function walkAST(node, callback) {
  callback(node);
  if (node.children) {
    node.children.forEach(child => walkAST(child, callback));
  }
}

walkAST(ast, (node) => {
  if (node.type === 'Text') {
    console.log('Text node:', node.data);
  }
});
```

### preprocess

Transforms Svelte component source code using preprocessors before compilation.

```typescript { .api }
/**
 * Transform component source code using preprocessors
 * @param source - Component source code
 * @param preprocessor - Single preprocessor or array of preprocessors
 * @param options - Preprocessing options
 * @returns Promise with processed code
 */
function preprocess(
  source: string,
  preprocessor: PreprocessorGroup | PreprocessorGroup[],
  options?: { filename?: string }
): Promise<Processed>;
```

**Usage Examples:**

```typescript
import { preprocess } from "svelte/compiler";

const source = `
<script lang="ts">
  let count: number = 0;
</script>

<style lang="scss">
  $primary-color: #ff3e00;
  
  .button {
    background: $primary-color;
    &:hover {
      opacity: 0.8;
    }
  }
</style>

<button class="button" on:click={() => count++}>
  Count: {count}
</button>
`;

// TypeScript and SCSS preprocessing
const result = await preprocess(source, [
  {
    name: "typescript",
    script: ({ content, attributes }) => {
      if (attributes.lang === "ts") {
        // Transform TypeScript to JavaScript
        return {
          code: transformTypeScript(content),
          map: sourceMap
        };
      }
    }
  },
  {
    name: "scss",
    style: ({ content, attributes }) => {
      if (attributes.lang === "scss") {
        return {
          code: compileSCSS(content),
          map: sourceMap
        };
      }
    }
  }
], {
  filename: "Component.svelte"
});

console.log(result.code); // Processed source ready for compilation
```

### migrate

Migrates Svelte 4 code to Svelte 5 syntax, converting to runes and modern patterns.

```typescript { .api }
/**
 * Migrate Svelte 4 code to Svelte 5 runes syntax
 * @param source - Svelte 4 source code
 * @param options - Migration options
 * @returns Migrated code
 */
function migrate(source: string, options?: {
  filename?: string;
  use_ts?: boolean;
}): { code: string };
```

**Usage Examples:**

```typescript
import { migrate } from "svelte/compiler";

const svelte4Source = `
<script>
  export let name = 'world';
  let count = 0;
  
  $: doubled = count * 2;
  $: if (count > 5) {
    console.log('Count is high!');
  }
  
  import { onMount } from 'svelte';
  
  onMount(() => {
    console.log('Component mounted');
  });
</script>

<h1>Hello {name}!</h1>
<button on:click={() => count++}>
  Count: {count}, Doubled: {doubled}
</button>
`;

// Migrate to Svelte 5
const migrated = migrate(svelte4Source, {
  filename: "Component.svelte",
  use_ts: false
});

console.log(migrated.code);
// Output will use $state, $derived, $effect, etc.
```

### VERSION

Current version of the Svelte compiler.

```typescript { .api }
/**
 * The current Svelte version string
 */
const VERSION: string;
```

**Usage Examples:**

```typescript
import { VERSION } from "svelte/compiler";

console.log(`Using Svelte compiler version: ${VERSION}`);

// Conditional logic based on version
const majorVersion = parseInt(VERSION.split('.')[0]);
if (majorVersion >= 5) {
  // Use Svelte 5 features
}
```

## Types

```typescript { .api }
interface CompileOptions extends ModuleCompileOptions {
  /** Component name (inferred from filename if not provided) */
  name?: string;
  /** Generate custom element instead of regular component */
  customElement?: boolean;
  /** Create accessors for component props */
  accessors?: boolean;
  /** Element namespace (html, svg, mathml) */
  namespace?: 'html' | 'svg' | 'mathml';
  /** Enable immutable mode optimizations */
  immutable?: boolean;
  /** CSS handling strategy */
  css?: 'injected' | 'external';
  /** Custom CSS class name hasher */
  cssHash?: (args: { name: string; filename: string; css: string; hash: (input: string) => string }) => string;
  /** Preserve HTML comments in output */
  preserveComments?: boolean;
  /** Preserve whitespace in templates */
  preserveWhitespace?: boolean;
  /** Force runes mode on/off */
  runes?: boolean;
  /** Expose version in browser globals */
  discloseVersion?: boolean;
  /** Legacy compatibility options */
  compatibility?: { componentApi?: 4 | 5 };
  /** Input sourcemap */
  sourcemap?: object | string;
  /** Output filename for JS sourcemap */
  outputFilename?: string;
  /** Output filename for CSS sourcemap */
  cssOutputFilename?: string;
  /** Enable hot module reloading */
  hmr?: boolean;
  /** Use modern AST format */
  modernAst?: boolean;
}

interface ModuleCompileOptions {
  /** Enable development mode with runtime checks */
  dev?: boolean;
  /** Target platform (client, server, or false for syntax-only) */
  generate?: 'client' | 'server' | false;
  /** Source filename for debugging */
  filename?: string;
  /** Root directory for relative paths */
  rootDir?: string;
  /** Function to filter warnings */
  warningFilter?: (warning: Warning) => boolean;
}

interface CompileResult {
  /** Generated JavaScript */
  js: {
    code: string;
    map: SourceMap;
  };
  /** Generated CSS (null if no styles) */
  css: null | {
    code: string;
    map: SourceMap;
    hasGlobal: boolean;
  };
  /** Compilation warnings */
  warnings: Warning[];
  /** Compilation metadata */
  metadata: {
    runes: boolean;
  };
  /** Component AST */
  ast: any;
}

interface Processed {
  /** Transformed source code */
  code: string;
  /** Source map */
  map?: string | object;
  /** Additional files to watch */
  dependencies?: string[];
  /** Updated tag attributes */
  attributes?: Record<string, string | boolean>;
}

interface PreprocessorGroup {
  /** Preprocessor name */
  name?: string;
  /** Markup preprocessor */
  markup?: MarkupPreprocessor;
  /** Style preprocessor */
  style?: Preprocessor;
  /** Script preprocessor */
  script?: Preprocessor;
}

type MarkupPreprocessor = (options: {
  content: string;
  filename?: string;
}) => Processed | void | Promise<Processed | void>;

type Preprocessor = (options: {
  content: string;
  attributes: Record<string, string | boolean>;
  markup: string;
  filename?: string;
}) => Processed | void | Promise<Processed | void>;
```

## Best Practices

1. **Use appropriate targets**: Choose 'client' for browser code, 'server' for SSR
2. **Enable dev mode in development**: Provides better error messages and debugging
3. **Extract CSS in production**: Use `css: 'external'` for better caching
4. **Handle warnings**: Implement `warningFilter` to manage compilation warnings
5. **Preserve source maps**: Enable sourcemaps for better debugging experience
6. **Use preprocessing**: Leverage preprocessors for TypeScript, SCSS, PostCSS, etc.