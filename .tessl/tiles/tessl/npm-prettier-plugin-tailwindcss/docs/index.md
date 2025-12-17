# Prettier Plugin Tailwind CSS

Prettier Plugin Tailwind CSS is a Prettier v3+ plugin that automatically sorts Tailwind CSS classes based on the recommended class order. It provides parsers for multiple languages and frameworks, with extensive configuration options and compatibility with other Prettier plugins.

## Package Information

- **Package Name**: prettier-plugin-tailwindcss
- **Package Type**: npm
- **Language**: TypeScript
- **Installation**: `npm install -D prettier-plugin-tailwindcss`

## Core Imports

This plugin is automatically loaded by Prettier when configured. Users do not directly import from this package as it's a Prettier plugin:

```typescript
// No direct imports needed - plugin is configured in Prettier settings
// For TypeScript projects, the plugin automatically provides type safety
// through Prettier's plugin system
```

## Basic Usage

### Prettier Configuration

Add the plugin to your Prettier configuration:

```json
{
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### Basic Class Sorting

The plugin automatically sorts Tailwind classes in various contexts:

```jsx
// Before formatting
<div className="px-4 bg-blue-500 text-white py-2 rounded">
  Content
</div>

// After formatting
<div className="rounded bg-blue-500 px-4 py-2 text-white">
  Content
</div>
```

### With Configuration

```json
{
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindConfig": "./tailwind.config.js",
  "tailwindFunctions": ["clsx", "cn"],
  "tailwindAttributes": ["myClass"]
}
```

## Architecture

The plugin is built around several key components:

- **Parser System**: Creates custom parsers for each supported file format that wrap the original Prettier parsers
- **AST Transformation**: Traverses and modifies Abstract Syntax Trees to sort class strings while preserving code structure
- **Tailwind Integration**: Loads Tailwind configuration to determine proper class ordering based on layer and utility priority
- **Plugin Compatibility**: Works with other Prettier plugins through explicit compatibility handling
- **Multi-Format Support**: Handles HTML, CSS, JavaScript, TypeScript, and various template languages

## Capabilities

### Configuration Options

Comprehensive configuration system for customizing plugin behavior including Tailwind config paths, custom attributes, function names, and formatting preferences.

```typescript { .api }
interface PluginOptions {
  /** Path to Tailwind configuration file */
  tailwindConfig?: string;
  /** Path to the CSS stylesheet in your Tailwind project (v4+) */
  tailwindStylesheet?: string;
  /** Path to the CSS entrypoint in your Tailwind project (v4+) @deprecated Use tailwindStylesheet instead */
  tailwindEntryPoint?: string;
  /** List of functions and tagged templates that contain sortable Tailwind classes */
  tailwindFunctions?: string[];
  /** List of attributes/props that contain sortable Tailwind classes */
  tailwindAttributes?: string[];
  /** Preserve whitespace around Tailwind classes when sorting */
  tailwindPreserveWhitespace?: boolean;
  /** Preserve duplicate classes inside a class list when sorting */
  tailwindPreserveDuplicates?: boolean;
  /** The package name to use when loading Tailwind CSS */
  tailwindPackageName?: string;
}
```

[Configuration](./configuration.md)

### Plugin Integration

The plugin integrates with Prettier's plugin system to provide class sorting capabilities across multiple file formats and languages.

```typescript { .api }
// Plugin exports (used internally by Prettier)
const parsers: Record<string, Parser>;
const printers: Record<string, Printer>;
const options: Record<string, SupportOption>;
```

[Parsers and Transformations](./parsers.md)

## Supported Languages and Frameworks

### Template Languages
- HTML, Angular, Vue.js, Svelte, Astro
- Glimmer (Ember.js), Marko, Twig, Pug
- Liquid templates, Lightning Web Components (LWC)

### Programming Languages
- JavaScript (ES5+), TypeScript
- CSS, SCSS, Less
- JSX/TSX (React)

### Attributes and Contexts
- Static attributes: `class`, `className`
- Dynamic attributes: `[ngClass]`, `:class`, `v-bind:class`
- CSS `@apply` directives
- Function calls: `clsx()`, `cn()`, custom functions
- Template literals and tagged templates

