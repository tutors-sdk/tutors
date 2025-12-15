# Tailwind CSS

Tailwind CSS is a utility-first CSS framework that provides low-level utility classes for building custom user interfaces directly in HTML markup. It features a comprehensive design system with customizable themes, a powerful JIT (Just-in-Time) compiler, and a modern plugin architecture for extending functionality.

## Package Information

- **Package Name**: tailwindcss
- **Package Type**: npm
- **Language**: TypeScript/JavaScript
- **Installation**: `npm install tailwindcss`

## Core Imports

Main compilation API:

```typescript
import { compile, compileAst } from "tailwindcss";
```

Plugin creation:

```typescript
import plugin from "tailwindcss/plugin";
```

Theme system:

```typescript
import colors from "tailwindcss/colors";
import defaultTheme from "tailwindcss/defaultTheme";
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
```

AST processing:

```typescript
import { 
  toCss, walk, WalkAction,
  rule, atRule, styleRule, decl, comment, context, atRoot,
  optimizeAst
} from "tailwindcss";
```

For CommonJS:

```javascript
const { compile, compileAst, toCss, walk, rule, styleRule, decl } = require("tailwindcss");
const plugin = require("tailwindcss/plugin");
const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");
const flattenColorPalette = require("tailwindcss/lib/util/flattenColorPalette");
```

## Basic Usage

```typescript
import { compile } from "tailwindcss";

// Basic CSS compilation
const css = `
  @theme {
    --color-primary: blue;
  }
  
  @tailwind utilities;
`;

const result = await compile(css);
const compiled = result.build(["bg-primary", "text-white"]);
console.log(compiled);

// Plugin creation
import plugin from "tailwindcss/plugin";

const myPlugin = plugin(function({ addUtilities }) {
  addUtilities({
    '.my-utility': {
      'custom-property': 'value',
    },
  });
});
```

## Architecture

Tailwind CSS is built around several key components:

- **Compilation Engine**: Core CSS processing and utility generation (`compile`, `compileAst`)
- **Plugin System**: Extensible architecture for custom utilities, variants, and components
- **Design System**: Theme management with CSS custom properties and design tokens
- **AST Processing**: Low-level CSS abstract syntax tree manipulation
- **Compatibility Layer**: Backward compatibility with v3 API and patterns
- **JIT Compiler**: Just-in-time generation of CSS utilities based on usage

## Capabilities

### CSS Compilation

Core CSS compilation functionality for processing Tailwind directives and generating utility classes. Handles theme processing, utility generation, and optimization.

```typescript { .api }
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
  base?: string;
  from?: string;
  polyfills?: Polyfills;
  loadModule?: (
    id: string,
    base: string,
    resourceHint: 'plugin' | 'config'
  ) => Promise<{
    path: string;
    base: string;
    module: Plugin | Config;
  }>;
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

[CSS Compilation](./compilation.md)

### Plugin Development

Plugin system for extending Tailwind CSS with custom utilities, variants, and components. Provides a rich API for adding functionality.

```typescript { .api }
function plugin(handler: PluginFn, config?: Partial<Config>): PluginWithConfig;

interface PluginAPI {
  addBase(base: CssInJs): void;
  addVariant(name: string, variant: string | string[] | CssInJs): void;
  matchVariant<T>(
    name: string,
    cb: (value: T | string, extra: { modifier: string | null }) => string | string[],
    options?: {
      values?: Record<string, T>;
      sort?(
        a: { value: T | string; modifier: string | null },
        b: { value: T | string; modifier: string | null }
      ): number;
    }
  ): void;
  addUtilities(
    utilities: Record<string, CssInJs | CssInJs[]> | Record<string, CssInJs | CssInJs[]>[],
    options?: {}
  ): void;
  matchUtilities(
    utilities: Record<
      string,
      (value: string, extra: { modifier: string | null }) => CssInJs | CssInJs[]
    >,
    options?: Partial<{
      type: string | string[];
      supportsNegativeValues: boolean;
      values: Record<string, string>;
      modifiers: 'any' | Record<string, string>;
    }>
  ): void;
  addComponents(components: Record<string, CssInJs> | Record<string, CssInJs>[], options?: {}): void;
  matchComponents(
    components: Record<string, (value: string, extra: { modifier: string | null }) => CssInJs>,
    options?: Partial<{
      type: string | string[];
      supportsNegativeValues: boolean;
      values: Record<string, string>;
      modifiers: 'any' | Record<string, string>;
    }>
  ): void;
  theme(path: string, defaultValue?: any): any;
  config(path?: string, defaultValue?: any): any;
  prefix(className: string): string;
}
```

[Plugin Development](./plugin-development.md)

### Theme System

Comprehensive theme and design system management with CSS custom properties, color palettes, and configuration.

```typescript { .api }
const colors: {
  inherit: string;
  current: string;
  transparent: string;
  black: string;
  white: string;
  slate: Record<string, string>;
  gray: Record<string, string>;
  // ... all color scales
};

const defaultTheme: {
  accentColor: (options: { theme: ThemeFn }) => any;
  animation: Record<string, string>;
  // ... all theme sections
};

function flattenColorPalette(colors: Colors): Record<string, string>;
```

[Theme System](./theme-system.md)

### AST Processing

Low-level CSS abstract syntax tree processing for advanced use cases and custom tooling. Includes utilities for creating, manipulating, and converting AST nodes.

```typescript { .api }
function compileAst(
  input: AstNode[],
  opts?: CompileOptions
): Promise<{
  sources: { base: string; pattern: string; negated: boolean }[];
  root: Root;
  features: Features;
  build(candidates: string[]): AstNode[];
}>;

function toCss(ast: AstNode[], withSourceMap?: boolean): string;

function walk(
  ast: AstNode[],
  visitor: (node: AstNode, utils: WalkUtils) => void | WalkAction
): void;

function rule(selector: string, nodes: AstNode[]): AtRule | StyleRule;
function atRule(name: string, params: string, nodes: AstNode[]): AtRule;
function styleRule(selector: string, nodes: AstNode[]): StyleRule;
function decl(property: string, value: string): Declaration;
function comment(text: string): Comment;
function context(ctx: Record<string, any>, nodes: AstNode[]): Context;
function atRoot(nodes: AstNode[]): AtRoot;
function optimizeAst(ast: AstNode[], designSystem: DesignSystem, polyfills?: Polyfills): AstNode[];

enum WalkAction {
  Continue = 'continue',
  Skip = 'skip',
  Stop = 'stop',
}

interface WalkUtils {
  parent: AstNode | null;
  replaceWith: (nodes: AstNode[]) => void;
  context: Record<string, any>;
}
```

[AST Processing](./ast-processing.md)

### CSS Assets

Prebuilt CSS files for different use cases and components of the Tailwind CSS system.

```typescript { .api }
// Main Tailwind CSS file with all components
import "tailwindcss/index.css";
// or 
import "tailwindcss";

// CSS reset and base styles
import "tailwindcss/preflight.css"; 
import "tailwindcss/preflight";

// Theme variable definitions
import "tailwindcss/theme.css";
import "tailwindcss/theme";

// Core utility classes
import "tailwindcss/utilities.css";
import "tailwindcss/utilities";
```

**Asset Files:**
- `index.css`: Complete Tailwind CSS framework
- `preflight.css`: CSS reset and normalize styles
- `theme.css`: Theme variable definitions and custom properties
- `utilities.css`: Core utility class definitions

## Types

```typescript { .api }
type Config = UserConfig;

enum Polyfills {
  None = 0,
  AtProperty = 1 << 0,
  ColorMix = 1 << 1,
  All = AtProperty | ColorMix,
}

enum Features {
  None = 0,
  AtApply = 1 << 0,
  AtImport = 1 << 1,
  JsPluginCompat = 1 << 2,
  ThemeFunction = 1 << 3,
  Utilities = 1 << 4,
  Variants = 1 << 5,
}

type Root =
  | null
  | 'none'
  | { base: string; pattern: string };

type CssInJs = Record<string, string | string[] | CssInJs>;

type Plugin = PluginFn | PluginWithConfig | PluginWithOptions<any>;

type PluginFn = (api: PluginAPI) => void;

interface PluginWithConfig {
  handler: PluginFn;
  config?: UserConfig;
}

interface PluginWithOptions<T> {
  (options?: T): PluginWithConfig;
  __isOptionsFunction: true;
}

interface DecodedSourceMap {
  version: number;
  sources: string[];
  sourcesContent: (string | null)[];
  names: string[];
  mappings: string;
  file?: string;
  sourceRoot?: string;
}

interface Colors {
  [key: string | number]: string | Colors;
}

interface SourceLocation {
  start: { line: number; column: number };
  end: { line: number; column: number };
  source?: string;
}

type AstNode = StyleRule | AtRule | Declaration | Comment | Context | AtRoot;

interface StyleRule {
  kind: 'rule';
  selector: string;
  nodes: AstNode[];
  src?: SourceLocation;
  dst?: SourceLocation;
}

interface AtRule {
  kind: 'at-rule';
  name: string;
  params: string;
  nodes: AstNode[];
  src?: SourceLocation;
  dst?: SourceLocation;
}

interface Declaration {
  kind: 'declaration';
  property: string;
  value: string | undefined;
  important: boolean;
  src?: SourceLocation;
  dst?: SourceLocation;
}

interface Comment {
  kind: 'comment';
  value: string;
  src?: SourceLocation;
  dst?: SourceLocation;
}

interface Context {
  kind: 'context';
  context: Record<string, any>;
  nodes: AstNode[];
}

interface AtRoot {
  kind: 'at-root';
  nodes: AstNode[];
}

interface DesignSystem {
  theme: any;
  invalidCandidates: Set<string>;
  important: boolean | null;
  variants: any;
  parseVariant: (variant: string) => any;
}
```