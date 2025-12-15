# CSS Compilation

Core CSS compilation functionality for processing Tailwind directives and generating utility classes. The compilation system transforms CSS containing Tailwind-specific at-rules into final CSS with generated utilities.

## Capabilities

### Compile Function

Main compilation function that processes CSS with Tailwind directives and returns a build system for generating final CSS.

```typescript { .api }
/**
 * Compiles CSS containing Tailwind directives into a build system
 * @param css - CSS source code with Tailwind directives
 * @param opts - Compilation options
 * @returns Promise resolving to compilation result with build function
 */
function compile(
  css: string,
  opts?: CompileOptions
): Promise<{
  sources: { base: string; pattern: string; negated: boolean }[];
  root: Root;
  features: Features;
  build(candidates: string[]): string;
  buildSourceMap(): DecodedSourceMap;
}>;

interface CompileOptions {
  /** Base directory for resolving imports and modules */
  base?: string;
  /** Source file path for source map generation */
  from?: string;
  /** Polyfill configuration flags */
  polyfills?: Polyfills;
  /** Custom module loader for @plugin and @config directives */
  loadModule?: (
    id: string,
    base: string,
    resourceHint: 'plugin' | 'config'
  ) => Promise<{
    path: string;
    base: string;
    module: Plugin | Config;
  }>;
  /** Custom stylesheet loader for @import directives */
  loadStylesheet?: (
    id: string,
    base: string
  ) => Promise<{
    path: string;
    base: string;
    content: string;
  }>;
}
```

**Usage Examples:**

```typescript
import { compile } from "tailwindcss";

// Basic compilation
const css = `
  @theme {
    --color-primary: #3b82f6;
    --color-secondary: #10b981;
  }
  
  @tailwind utilities;
`;

const result = await compile(css);

// Generate CSS for specific candidates
const finalCss = result.build([
  "bg-primary",
  "text-secondary", 
  "hover:bg-secondary",
  "lg:text-xl"
]);

// Advanced compilation with options
const advancedResult = await compile(css, {
  base: "/project/src",
  from: "styles.css",
  polyfills: Polyfills.All,
  loadModule: async (id, base, hint) => {
    // Custom module resolution
    const modulePath = path.resolve(base, id);
    const module = await import(modulePath);
    return {
      path: modulePath,
      base,
      module: module.default,
    };
  },
});
```

### Compile AST Function

Compiles an AST directly instead of parsing CSS from a string. Useful for advanced scenarios where you need to manipulate the AST before compilation.

```typescript { .api }
/**
 * Compiles an AST directly for advanced use cases
 * @param input - Array of AST nodes to compile
 * @param opts - Compilation options
 * @returns Promise resolving to AST compilation result
 */
function compileAst(
  input: AstNode[],
  opts?: CompileOptions
): Promise<{
  sources: { base: string; pattern: string; negated: boolean }[];
  root: Root;
  features: Features;
  build(candidates: string[]): AstNode[];
}>;
```

**Usage Example:**

```typescript
import { compileAst, styleRule, decl } from "tailwindcss";

// Create AST manually
const ast = [
  styleRule(":root", [
    decl("--color-primary", "#3b82f6"),
  ]),
  // Additional nodes...
];

const result = await compileAst(ast);
const compiledAst = result.build(["bg-primary"]);
```

### Load Design System Function

Loads a design system without full compilation. Internal API for advanced use cases.

```typescript { .api }
/**
 * Loads a design system from CSS (internal API)
 * @param css - CSS source with theme definitions
 * @param opts - Compilation options
 * @returns Promise resolving to DesignSystem instance
 */
function __unstable__loadDesignSystem(css: string, opts?: CompileOptions): Promise<DesignSystem>;
```

## Compilation Result

### Build Function

The build function returned by `compile()` generates final CSS for the provided candidates.

```typescript { .api }
/**
 * Generates final CSS for the provided utility candidates
 * @param candidates - Array of utility class names to generate
 * @returns Generated CSS string
 */
build(candidates: string[]): string;
```

### Build Source Map Function

Generates source maps for the compiled CSS.

```typescript { .api }
/**
 * Generates source map for the compiled CSS
 * @returns Decoded source map object
 */
buildSourceMap(): DecodedSourceMap;
```

## Compilation Features

The compilation system detects and tracks which Tailwind features are used:

```typescript { .api }
enum Features {
  None = 0,
  /** @apply directive was used */
  AtApply = 1 << 0,
  /** @import directive was used */
  AtImport = 1 << 1,
  /** JavaScript plugins were loaded */
  JsPluginCompat = 1 << 2,
  /** theme() function was used */
  ThemeFunction = 1 << 3,
  /** @tailwind utilities directive was used */
  Utilities = 1 << 4,
  /** @variant directive was used */
  Variants = 1 << 5,
}
```

## Polyfill Configuration

Control which CSS polyfills are generated:

```typescript { .api }
enum Polyfills {
  None = 0,
  /** Generate @property rule fallbacks */
  AtProperty = 1 << 0,
  /** Generate color-mix() fallbacks */
  ColorMix = 1 << 1,
  /** Enable all polyfills */
  All = AtProperty | ColorMix,
}
```

## Root Configuration

Configure how the compilation system resolves source files:

```typescript { .api }
type Root =
  /** Unknown/auto-detected root */
  | null
  /** Explicitly no root via source(none) */
  | 'none'
  /** Explicit root pattern */
  | { base: string; pattern: string };
```

## Source Configuration

The compilation result includes information about source file patterns:

```typescript { .api }
interface SourcePattern {
  /** Base directory for the pattern */
  base: string;
  /** Glob pattern for source files */
  pattern: string;
  /** Whether this pattern is negated (excluded) */
  negated: boolean;
}
```

## Default Export Warning

The default export throws an error directing users to use the PostCSS plugin instead.

```typescript { .api }
/**
 * Default export that throws an error about PostCSS plugin usage
 * @throws Error directing users to use @tailwindcss/postcss
 */
export default function postcssPluginWarning(): never;
```

**Note:** This function is designed to prevent direct usage of tailwindcss as a PostCSS plugin. Use `@tailwindcss/postcss` for PostCSS integration instead.