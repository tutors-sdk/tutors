# Configuration Options

Comprehensive configuration system for customizing prettier-plugin-tailwindcss behavior including Tailwind config paths, custom attributes, function names, and formatting preferences.

## Capabilities

### Plugin Options Interface

Main configuration interface defining all available plugin options that can be set in your Prettier configuration.

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

### Tailwind Configuration Path

Specify the path to your Tailwind configuration file for custom class ordering. By default, the plugin searches for common Tailwind config file names in your project.

**Usage Examples:**

```json
{
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindConfig": "./tailwind.config.js"
}
```

```json
{
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindConfig": "./config/tailwind.config.ts"
}
```

**Automatic Discovery:**

If not specified, the plugin automatically searches for:
- `tailwind.config.js`
- `tailwind.config.cjs` 
- `tailwind.config.mjs`
- `tailwind.config.ts`

### Tailwind v4 Stylesheet Path

For Tailwind CSS v4+, specify the CSS entry point containing your theme and configuration.

**Usage Example:**

```json
{
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindStylesheet": "./src/styles/app.css"
}
```

The stylesheet should contain your Tailwind directives and custom CSS:

```css
@import "tailwindcss";

/* Your custom styles and configuration */
@layer components {
  .btn-primary {
    @apply bg-blue-500 text-white px-4 py-2 rounded;
  }
}
```

### Custom Attributes

Configure additional HTML attributes that should have their classes sorted beyond the default `class` and `className` attributes.

**Usage Examples:**

```json
{
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindAttributes": ["myClassList", "customClass"]
}
```

This enables sorting in custom attributes:

```jsx
// Before
<div myClassList="px-4 bg-blue-500 text-white py-2">Content</div>

// After  
<div myClassList="bg-blue-500 px-4 py-2 text-white">Content</div>
```

**Framework-Specific Behavior:**

```json
{
  "tailwindAttributes": ["x-bind:class", "wire:class", "my-classes"]
}
```

### Custom Functions

Configure function names that contain class strings to be sorted. Useful for utility libraries like `clsx`, `classNames`, or custom helper functions.

**Usage Examples:**

```json
{
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindFunctions": ["clsx", "cn", "classNames", "tw"]
}
```

This enables sorting inside function calls:

```javascript
// Before
const classes = clsx("px-4 bg-blue-500 text-white py-2");

// After
const classes = clsx("bg-blue-500 px-4 py-2 text-white");
```

**Advanced Function Usage:**

```javascript
// Template literals with tagged templates
const styles = tw`px-4 bg-blue-500 text-white py-2`;

// Nested function calls
const buttonClass = cn(
  "base-button",
  clsx("px-4 bg-blue-500 text-white py-2", {
    "opacity-50": disabled
  })
);

// Method chaining
const dynamicClass = ClassBuilder()
  .add("px-4 bg-blue-500 text-white py-2")
  .build();
```

### Whitespace Preservation

Control whether whitespace around classes is preserved during sorting. By default, whitespace is normalized to single spaces.

**Usage Example:**

```json
{
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindPreserveWhitespace": true
}
```

**Behavior:**

```html
<!-- With tailwindPreserveWhitespace: false (default) -->
<div class="  px-4   bg-blue-500  text-white  py-2  ">
<!-- Becomes: -->
<div class="bg-blue-500 px-4 py-2 text-white">

<!-- With tailwindPreserveWhitespace: true -->
<div class="  px-4   bg-blue-500  text-white  py-2  ">
<!-- Becomes: -->
<div class="  bg-blue-500   px-4  py-2  text-white  ">
```

### Duplicate Class Preservation

Control whether duplicate classes are preserved or removed during sorting. By default, duplicate classes are removed.

**Usage Example:**

```json
{
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindPreserveDuplicates": true
}
```

**Behavior:**

```html
<!-- With tailwindPreserveDuplicates: false (default) -->
<div class="px-4 bg-blue-500 px-4 text-white">
<!-- Becomes: -->
<div class="bg-blue-500 px-4 text-white">

<!-- With tailwindPreserveDuplicates: true -->
<div class="px-4 bg-blue-500 px-4 text-white">
<!-- Becomes: -->
<div class="bg-blue-500 px-4 px-4 text-white">
```

### Package Name Override

Specify a custom package name to use when loading Tailwind CSS. Useful for custom Tailwind builds or alternative distributions.

**Usage Example:**

```json
{
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindPackageName": "@my-org/tailwindcss"
}
```

**Default Behavior:**

By default, the plugin uses `"tailwindcss"` as the package name. This option allows you to:

- Use custom Tailwind CSS builds with different package names
- Load Tailwind CSS from forked or modified versions
- Work with monorepo setups that have renamed the Tailwind package

**Example with Custom Build:**

```json
{
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindPackageName": "tailwindcss-custom",
  "tailwindConfig": "./tailwind.config.js"
}
```

## Complete Configuration Example

**Prettier Configuration (`.prettierrc`):**

```json
{
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindConfig": "./tailwind.config.js",
  "tailwindAttributes": [
    "myClassList",
    "x-bind:class",
    "wire:class"
  ],
  "tailwindFunctions": [
    "clsx",
    "cn", 
    "classNames",
    "tw"
  ],
  "tailwindPreserveWhitespace": false,
  "tailwindPreserveDuplicates": false,
  "tailwindPackageName": "tailwindcss"
}
```

**Package.json Script:**

```json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,html,css}\""
  }
}
```

## Configuration File Locations

The plugin configuration can be specified in any of Prettier's supported configuration files:

- `.prettierrc`
- `.prettierrc.json`
- `.prettierrc.js`
- `.prettierrc.mjs`
- `.prettierrc.cjs`
- `prettier.config.js`
- `prettier.config.mjs`
- `prettier.config.cjs`
- `package.json` (in a `prettier` field)

**Example in `prettier.config.js`:**

```javascript
export default {
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindConfig: "./tailwind.config.js",
  tailwindFunctions: ["clsx", "cn"],
  tailwindAttributes: ["customClass"]
};
```