# Parsers and Transformations

The plugin integrates with Prettier's parser system to provide Tailwind class sorting across multiple file formats and languages. Users configure the plugin through Prettier settings, and the plugin automatically handles class sorting in supported file types.

## Capabilities

### Plugin Integration

The plugin exports parsers that extend Prettier's built-in parsers with Tailwind class sorting capabilities.

```typescript { .api }
// Plugin exports (used internally by Prettier)
const parsers: Record<string, Parser>;
const printers: Record<string, Printer>;
```

### Supported File Formats

The plugin automatically sorts Tailwind classes in the following file types when configured in Prettier:

#### HTML and Templates
- **HTML** (`.html`) - Standard HTML documents
- **Angular** (`.html`) - Angular component templates  
- **Vue** (`.vue`) - Vue.js single file components
- **Svelte** (`.svelte`) - Svelte components
- **Astro** (`.astro`) - Astro components
- **Glimmer** (`.hbs`) - Ember.js Handlebars templates
- **Liquid** - Shopify Liquid templates
- **Twig** - Twig template engine
- **Pug** - Pug template engine
- **Marko** - Marko templating language
- **LWC** - Lightning Web Components

#### CSS and Preprocessors
- **CSS** (`.css`) - Standard CSS files with `@apply` directives
- **SCSS** (`.scss`) - Sass stylesheets
- **Less** (`.less`) - Less stylesheets

#### JavaScript and TypeScript
- **JavaScript** (`.js`, `.mjs`) - JavaScript files with JSX
- **TypeScript** (`.ts`, `.tsx`) - TypeScript files
- **JSX/TSX** - React components with `className` attributes

### Attribute Support

The plugin sorts classes in different attributes based on the file format:

#### Static Attributes (sorted directly)
```typescript { .api }
// HTML-based formats
class="..."           // HTML, Angular, Vue
className="..."       // React/JSX

// Framework-specific
[class]="..."         // Angular property binding
:class="..."          // Vue.js binding
v-bind:class="..."    // Vue.js binding (full syntax)
```

#### Dynamic Attributes (JavaScript expressions parsed)
```typescript { .api }
// Angular
[ngClass]="expression"

// Vue.js  
:class="expression"
v-bind:class="expression"

// Astro
class:list="expression"
```

### Function Call Support

When configured with `tailwindFunctions`, the plugin sorts classes inside function calls:

```javascript
// Example with clsx function
clsx("px-4 bg-blue-500 text-white py-2")
// Becomes: clsx("bg-blue-500 px-4 py-2 text-white")

// Template literals
tw`px-4 bg-blue-500 text-white py-2`
// Becomes: tw`bg-blue-500 px-4 py-2 text-white`
```

### CSS @apply Directive Support

The plugin sorts Tailwind utilities in CSS `@apply` directives:

```css
.my-component {
  @apply px-4 bg-blue-500 text-white py-2;
}

/* Becomes: */
.my-component {  
  @apply bg-blue-500 px-4 py-2 text-white;
}
```

## Configuration Integration

### Custom Attributes

Add custom attributes to sort with the `tailwindAttributes` option:

```json
{
  "tailwindAttributes": ["myClass", "customClasses"]
}
```

This enables sorting in custom attributes:

```html
<div myClass="px-4 bg-blue-500 text-white py-2">Content</div>
```

### Custom Functions

Add custom function names with the `tailwindFunctions` option:

```json
{
  "tailwindFunctions": ["clsx", "cn", "classNames"]
}
```

This enables sorting inside specified function calls:

```javascript
const classes = cn("px-4 bg-blue-500 text-white py-2");
```

## Framework-Specific Features

### Angular
- Sorts `class` attributes in templates
- Parses and sorts `[ngClass]` directive expressions
- Handles Angular interpolation syntax

### Vue.js
- Sorts `class` attributes in templates  
- Parses and sorts `:class` and `v-bind:class` expressions
- Supports both object and array syntax in bindings

### React/JSX
- Sorts both `class` and `className` attributes
- Handles JSX expression containers
- Supports template literals and function calls

### Svelte
- Sorts `class` attributes in components
- Handles Svelte's reactive class syntax
- Processes mustache tag expressions

### CSS Preprocessors
- Preserves `!important` flags in `@apply` directives
- Maintains variable references and calculations
- Works with nested rules and mixins