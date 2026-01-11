# Tailwind CSS Typography

The official Tailwind CSS Typography plugin provides a set of `prose` classes for adding beautiful typographic defaults to vanilla HTML content. It automatically styles plain HTML from sources like Markdown renderers or CMSs with carefully tuned typography scales, spacing, and color themes.

## Package Information

- **Package Name**: @tailwindcss/typography
- **Package Type**: npm
- **Language**: JavaScript
- **Installation**: `npm install -D @tailwindcss/typography`

## Core Imports

```javascript
const typographyPlugin = require('@tailwindcss/typography');
```

ESM:

```javascript
import typographyPlugin from '@tailwindcss/typography';
```

## Basic Usage

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    // ...
  },
  plugins: [
    require('@tailwindcss/typography'),
    // ...
  ],
}
```

```html
<!-- Basic prose styling -->
<article class="prose">
  <h1>Article Title</h1>
  <p>Your HTML content gets beautiful typography automatically.</p>
</article>

<!-- With size and color modifiers -->
<article class="prose prose-lg prose-slate">
  <h1>Large slate-themed content</h1>
  <p>Automatically styled with larger typography and slate color theme.</p>
</article>
```

## Architecture

The plugin is built around several key components:

- **Plugin Function**: Main export that registers with Tailwind CSS using the `plugin.withOptions` pattern
- **Typography Styles**: Comprehensive style definitions for all HTML elements in multiple size scales
- **Color Themes**: Pre-built color themes for different gray scales and accent colors
- **Variant System**: Element-specific modifier classes for granular control
- **CSS Custom Properties**: Theme-aware custom properties for consistent styling

## Capabilities

### Plugin Registration

Registers the typography plugin with Tailwind CSS, adding prose utility classes and theme configuration.

```typescript { .api }
/**
 * Main plugin export that integrates with Tailwind CSS
 * @param options - Plugin configuration options
 * @returns Tailwind CSS plugin object with handler and configuration
 */
function plugin(options?: Partial<PluginOptions>): TailwindPlugin;

interface PluginOptions {
  /** Base class name for typography styles (default: 'prose') */
  className?: string;
  /** 
   * Targeting mode for CSS selectors (default: 'modern')
   * - 'modern': Uses modern CSS selectors with :where() and :is()
   * - 'legacy': Uses traditional CSS selectors for older browser compatibility
   */
  target?: 'modern' | 'legacy';
}

interface TailwindPlugin {
  /** The plugin handler function */
  handler: () => void;
  /** Marker indicating this is an options-based plugin */
  __isOptionsFunction: true;
}
```

### Size Modifiers

Typography scales that adjust the overall size and spacing of content for different contexts.

```typescript { .api }
// Available size modifier classes
type SizeModifiers = 
  | 'prose-sm'    // Small scale (14px base)
  | 'prose'       // Base scale (16px base) 
  | 'prose-lg'    // Large scale (18px base)
  | 'prose-xl'    // Extra large scale (20px base)
  | 'prose-2xl';  // Double extra large scale (24px base)
```

**Usage Examples:**

```html
<!-- Small typography for compact layouts -->
<article class="prose prose-sm">{{ content }}</article>

<!-- Large typography for featured content -->
<article class="prose prose-xl">{{ content }}</article>

<!-- Extra large typography for hero content -->
<article class="prose prose-2xl">{{ content }}</article>

<!-- Responsive typography scaling -->
<article class="prose md:prose-lg lg:prose-xl">{{ content }}</article>
```

### Color Themes

Pre-built color themes that provide consistent styling across light and dark modes.

```typescript { .api }
// Gray scale themes
type GrayScaleThemes = 
  | 'prose-gray'    // Default gray theme
  | 'prose-slate'   // Slate gray theme
  | 'prose-zinc'    // Zinc gray theme
  | 'prose-neutral' // Neutral gray theme
  | 'prose-stone';  // Stone gray theme

// Accent color themes (affects links only)
type AccentColorThemes = 
  | 'prose-red' | 'prose-orange' | 'prose-amber' | 'prose-yellow'
  | 'prose-lime' | 'prose-green' | 'prose-emerald' | 'prose-teal'
  | 'prose-cyan' | 'prose-sky' | 'prose-blue' | 'prose-indigo'
  | 'prose-violet' | 'prose-purple' | 'prose-fuchsia' | 'prose-pink' | 'prose-rose';

// Special themes
type SpecialThemes = 'prose-invert'; // Dark mode theme
```

**Usage Examples:**

```html
<!-- Slate color theme -->
<article class="prose prose-slate">{{ content }}</article>

<!-- Blue links with default gray theme -->
<article class="prose prose-blue">{{ content }}</article>

<!-- Dark mode styling -->
<article class="prose prose-invert">{{ content }}</article>

<!-- Combined themes -->
<article class="prose prose-lg prose-slate prose-blue">{{ content }}</article>
```

### Element Variants

Element-specific modifier classes for granular control over individual HTML elements.

```typescript { .api }
// Element-specific variant classes
type ElementVariants = 
  | 'prose-headings' // All headings (h1-h6, th)
  | 'prose-h1' | 'prose-h2' | 'prose-h3' | 'prose-h4' | 'prose-h5' | 'prose-h6'
  | 'prose-p'        // Paragraphs
  | 'prose-a'        // Links
  | 'prose-blockquote' // Block quotes
  | 'prose-figure' | 'prose-figcaption' // Figures and captions
  | 'prose-strong' | 'prose-em' // Text emphasis
  | 'prose-kbd' | 'prose-code' | 'prose-pre' // Code elements
  | 'prose-ol' | 'prose-ul' | 'prose-li' // Lists
  | 'prose-table' | 'prose-thead' | 'prose-tr' | 'prose-th' | 'prose-td' // Tables
  | 'prose-img' | 'prose-video' // Media
  | 'prose-hr'       // Horizontal rules
  | 'prose-lead';    // Lead text (class-based)
```

### Not-Prose Utility

Disables typography styles for specific content areas within prose-styled containers.

```typescript { .api }
// Utility class for disabling prose styles
type NotProseUtility = 'not-prose'; // Disables all prose styling for nested content
```

**Usage Examples:**

```html
<!-- Disable prose styles for a specific section -->
<article class="prose">
  <h1>Article Title</h1>
  <p>This paragraph has prose styling.</p>
  
  <div class="not-prose">
    <!-- This content is not styled by prose -->
    <div class="bg-blue-500 p-4 text-white">
      Custom styled content that ignores prose
    </div>
  </div>
  
  <p>This paragraph has prose styling again.</p>
</article>
```

```html
<!-- Style only headings with a specific color -->
<article class="prose prose-headings:text-blue-900">{{ content }}</article>

<!-- Style only links -->
<article class="prose prose-a:text-green-600 prose-a:no-underline">{{ content }}</article>
```

### Theme Configuration

The plugin provides a complete theme configuration for the `typography` key in Tailwind's theme.

```typescript { .api }
interface TypographyTheme {
  DEFAULT: TypographyConfig;
  sm: TypographyConfig;
  base: TypographyConfig;
  lg: TypographyConfig;
  xl: TypographyConfig;
  '2xl': TypographyConfig;
  // Color themes
  slate: TypographyConfig;
  gray: TypographyConfig;
  zinc: TypographyConfig;
  neutral: TypographyConfig;
  stone: TypographyConfig;
  // Accent color themes
  red: TypographyConfig;
  orange: TypographyConfig;
  // ... all other color themes
  invert: TypographyConfig;
}

interface TypographyConfig {
  css: CSSRule[] | CSSRule;
}

interface CSSRule {
  [selector: string]: CSSProperties | CSSRule;
}
```

## CSS Custom Properties

The plugin defines comprehensive CSS custom properties for consistent theming:

```css { .api }
/* Light mode properties */
--tw-prose-body: /* Body text color */
--tw-prose-headings: /* Heading text color */
--tw-prose-lead: /* Lead text color */
--tw-prose-links: /* Link color */
--tw-prose-bold: /* Bold text color */
--tw-prose-counters: /* List counter color */
--tw-prose-bullets: /* List bullet color */
--tw-prose-hr: /* Horizontal rule color */
--tw-prose-quotes: /* Blockquote text color */
--tw-prose-quote-borders: /* Blockquote border color */
--tw-prose-captions: /* Caption text color */
--tw-prose-kbd: /* Keyboard text color */
--tw-prose-kbd-shadows: /* Keyboard shadow color (RGB values) */
--tw-prose-code: /* Inline code color */
--tw-prose-pre-code: /* Code block text color */
--tw-prose-pre-bg: /* Code block background color */
--tw-prose-th-borders: /* Table header border color */
--tw-prose-td-borders: /* Table cell border color */

/* Dark mode properties (used with prose-invert) */
--tw-prose-invert-body: /* Inverted body text color */
--tw-prose-invert-headings: /* Inverted heading text color */
/* ... all other invert properties */
```

## Advanced Configuration

### Custom Theme Extension

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      typography: {
        'custom': {
          css: {
            '--tw-prose-body': '#1a1a1a',
            '--tw-prose-headings': '#0f0f0f',
            // ... custom properties
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
```

### Plugin Options

```javascript
// tailwind.config.js
module.exports = {
  plugins: [
    require('@tailwindcss/typography')({
      className: 'wysiwyg',  // Use 'wysiwyg' instead of 'prose'
      target: 'legacy'       // Use legacy CSS selectors for older browsers
    }),
  ],
}
```

**Target Options:**

- **`modern` (default)**: Uses `:where()` and `:is()` pseudo-selectors for better specificity control and performance. Recommended for modern browsers.
- **`legacy`**: Uses traditional CSS selectors without modern pseudo-selectors. Use this if you need to support older browsers that don't support `:where()` and `:is()`.

```html
<!-- With custom className -->
<article class="wysiwyg wysiwyg-lg wysiwyg-slate">{{ content }}</article>
```

## Styled Elements

The plugin automatically styles all standard HTML elements commonly found in content:

- **Typography**: h1-h6, p, lead text
- **Emphasis**: strong, em, mark
- **Code**: code, pre, kbd
- **Lists**: ul, ol, li, dl, dt, dd
- **Links**: a
- **Quotes**: blockquote
- **Media**: img, video, picture
- **Tables**: table, thead, tbody, tfoot, tr, th, td
- **Misc**: hr, figure, figcaption

Each element receives carefully tuned spacing, typography, and color styles that work harmoniously together.