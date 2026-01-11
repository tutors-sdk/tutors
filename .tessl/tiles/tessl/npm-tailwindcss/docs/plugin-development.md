# Plugin Development

Comprehensive plugin system for extending Tailwind CSS with custom utilities, variants, and components. The plugin API provides methods for adding CSS rules, creating parametric utilities, and accessing theme values.

## Capabilities

### Plugin Creation

Creates a Tailwind CSS plugin with a handler function and optional configuration.

```typescript { .api }
/**
 * Creates a Tailwind CSS plugin
 * @param handler - Function that receives the plugin API
 * @param config - Optional configuration to merge with user config
 * @returns Plugin object for use in Tailwind configuration
 */
function plugin(handler: PluginFn, config?: Partial<Config>): PluginWithConfig;

/**
 * Creates a plugin that accepts options
 * @param pluginFunction - Function that returns a plugin handler based on options
 * @param configFunction - Function that returns configuration based on options
 * @returns Options function that creates configured plugins
 */
plugin.withOptions<T>(
  pluginFunction: (options?: T) => PluginFn,
  configFunction?: (options?: T) => Partial<Config>
): PluginWithOptions<T>;

type PluginFn = (api: PluginAPI) => void;

interface PluginWithConfig {
  handler: PluginFn;
  config?: Config;
}

interface PluginWithOptions<T> {
  (options?: T): PluginWithConfig;
  __isOptionsFunction: true;
}
```

**Usage Examples:**

```typescript
import plugin from "tailwindcss/plugin";

// Simple plugin
const myPlugin = plugin(function({ addUtilities, theme }) {
  addUtilities({
    '.btn': {
      padding: theme('spacing.4'),
      borderRadius: theme('borderRadius.md'),
      fontWeight: theme('fontWeight.semibold'),
    },
    '.btn-primary': {
      backgroundColor: theme('colors.blue.500'),
      color: theme('colors.white'),
    },
  });
});

// Plugin with configuration
const buttonPlugin = plugin(function({ addComponents, theme }) {
  addComponents({
    '.btn': {
      padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
      borderRadius: theme('borderRadius.DEFAULT'),
      fontWeight: theme('fontWeight.medium'),
    },
  });
}, {
  theme: {
    extend: {
      colors: {
        'btn-primary': '#3b82f6',
      },
    },
  },
});

// Plugin with options
const spacingPlugin = plugin.withOptions<{ prefix?: string }>(
  (options = {}) => {
    return ({ addUtilities }) => {
      const prefix = options.prefix || '';
      addUtilities({
        [`.${prefix}spacing-xs`]: { padding: '0.5rem' },
        [`.${prefix}spacing-sm`]: { padding: '1rem' },
        [`.${prefix}spacing-md`]: { padding: '1.5rem' },
      });
    };
  }
);
```

### Base Styles

Add base styles that are applied globally to elements.

```typescript { .api }
/**
 * Add base styles to the generated CSS
 * @param base - CSS-in-JS object containing base styles
 */
addBase(base: CssInJs): void;
```

**Usage Example:**

```typescript
plugin(function({ addBase, theme }) {
  addBase({
    'h1': {
      fontSize: theme('fontSize.4xl'),
      fontWeight: theme('fontWeight.bold'),
    },
    'h2': {
      fontSize: theme('fontSize.3xl'),
      fontWeight: theme('fontWeight.semibold'),
    },
  });
});
```

### Variants

Add custom variants for conditional styling.

```typescript { .api }
/**
 * Add a simple variant
 * @param name - Variant name (e.g., 'hocus')
 * @param variant - CSS selector(s) or CSS-in-JS object
 */
addVariant(name: string, variant: string | string[] | CssInJs): void;

/**
 * Add a parametric variant that accepts values
 * @param name - Variant name (e.g., 'data')
 * @param cb - Callback that generates selectors based on values
 * @param options - Configuration options for the variant
 */
matchVariant<T = string>(
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
```

**Usage Examples:**

```typescript
plugin(function({ addVariant, matchVariant }) {
  // Simple variant
  addVariant('hocus', ['&:hover', '&:focus']);
  
  // Variant with CSS-in-JS
  addVariant('not-first', {
    '&:not(:first-child)': {},
  });
  
  // Parametric variant
  matchVariant('data', (value) => `&[data-${value}]`);
  
  // Parametric variant with predefined values
  matchVariant('theme', (value) => `[data-theme="${value}"] &`, {
    values: {
      light: 'light',
      dark: 'dark',
      auto: 'auto',
    },
  });
  
  // Custom sorting
  matchVariant('min', (value) => `@media (min-width: ${value})`, {
    sort(a, b) {
      return parseInt(a.value) - parseInt(b.value);
    },
  });
});
```

### Utilities

Add utility classes that can be applied directly to elements.

```typescript { .api }
/**
 * Add static utility classes
 * @param utilities - CSS-in-JS object containing utility definitions
 * @param options - Additional options (currently unused)
 */
addUtilities(
  utilities: Record<string, CssInJs | CssInJs[]> | Record<string, CssInJs | CssInJs[]>[],
  options?: {}
): void;

/**
 * Add parametric utilities that generate classes based on values
 * @param utilities - Object mapping utility names to generator functions
 * @param options - Configuration for values, types, and behavior
 */
matchUtilities(
  utilities: Record<
    string,
    (value: string, extra: { modifier: string | null }) => CssInJs | CssInJs[]
  >,
  options?: Partial<{
    type: string | string[];
    supportsNegativeValues: boolean;
    values: Record<string, string> & {
      __BARE_VALUE__?: (value: NamedUtilityValue) => string | undefined;
    };
    modifiers: 'any' | Record<string, string>;
  }>
): void;
```

**Usage Examples:**

```typescript
plugin(function({ addUtilities, matchUtilities, theme }) {
  // Static utilities
  addUtilities({
    '.scrollbar-hide': {
      '-ms-overflow-style': 'none',
      'scrollbar-width': 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
    '.scrollbar-default': {
      '-ms-overflow-style': 'auto',
      'scrollbar-width': 'auto',
      '&::-webkit-scrollbar': {
        display: 'block',
      },
    },
  });
  
  // Parametric utilities
  matchUtilities(
    {
      'text-shadow': (value) => ({
        textShadow: value,
      }),
      'text-stroke': (value) => ({
        '-webkit-text-stroke-width': value,
      }),
    },
    {
      values: theme('textShadow'),
      type: ['length', 'color'],
    }
  );
  
  // Utilities with modifiers and negative values
  matchUtilities(
    {
      'skew-x': (value) => ({
        transform: `skewX(${value})`,
      }),
    },
    {
      values: theme('skew'),
      supportsNegativeValues: true,
      type: 'angle',
    }
  );
});
```

### Components

Add component classes that contain multiple CSS properties.

```typescript { .api }
/**
 * Add static component classes
 * @param components - CSS-in-JS object containing component definitions
 * @param options - Additional options (currently unused)
 */
addComponents(components: Record<string, CssInJs> | Record<string, CssInJs>[], options?: {}): void;

/**
 * Add parametric components that generate classes based on values
 * @param components - Object mapping component names to generator functions
 * @param options - Configuration for values, types, and behavior
 */
matchComponents(
  components: Record<string, (value: string, extra: { modifier: string | null }) => CssInJs>,
  options?: Partial<{
    type: string | string[];
    supportsNegativeValues: boolean;
    values: Record<string, string> & {
      __BARE_VALUE__?: (value: NamedUtilityValue) => string | undefined;
    };
    modifiers: 'any' | Record<string, string>;
  }>
): void;
```

**Usage Examples:**

```typescript
plugin(function({ addComponents, matchComponents, theme }) {
  // Static components
  addComponents({
    '.btn': {
      padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
      borderRadius: theme('borderRadius.md'),
      fontWeight: theme('fontWeight.medium'),
    },
    '.card': {
      backgroundColor: theme('colors.white'),
      boxShadow: theme('boxShadow.lg'),
      borderRadius: theme('borderRadius.lg'),
      padding: theme('spacing.6'),
    },
  });
  
  // Parametric components
  matchComponents(
    {
      'btn': (value) => ({
        backgroundColor: value,
        color: theme('colors.white'),
        '&:hover': {
          backgroundColor: theme(`colors.${value}.600`),
        },
      }),
    },
    {
      values: theme('colors'),
      type: 'color',
    }
  );
});
```

### Theme Access

Access theme values within plugins.

```typescript { .api }
/**
 * Access theme configuration values
 * @param path - Dot-notation path to theme value (e.g., 'colors.blue.500')
 * @param defaultValue - Default value if path doesn't exist
 * @returns Theme value or default
 */
theme(path: string, defaultValue?: any): any;
```

**Usage Example:**

```typescript
plugin(function({ addUtilities, theme }) {
  // Access nested theme values
  const primaryColor = theme('colors.blue.500');
  const defaultSpacing = theme('spacing.4');
  const customFont = theme('fontFamily.custom', ['Inter', 'sans-serif']);
  
  addUtilities({
    '.custom-button': {
      backgroundColor: primaryColor,
      padding: defaultSpacing,
      fontFamily: customFont.join(', '),
    },
  });
});
```

### Configuration Access

Access the full Tailwind configuration within plugins.

```typescript { .api }
/**
 * Access configuration values
 * @param path - Dot-notation path to config value
 * @param defaultValue - Default value if path doesn't exist
 * @returns Configuration value or default
 */
config(path?: string, defaultValue?: any): any;
```

### Class Prefixing

Apply the configured prefix to class names.

```typescript { .api }
/**
 * Apply the configured prefix to a class name
 * @param className - Class name to prefix
 * @returns Prefixed class name
 */
prefix(className: string): string;
```

**Usage Example:**

```typescript
plugin(function({ addUtilities, prefix }) {
  addUtilities({
    [`.${prefix('my-utility')}`]: {
      customProperty: 'value',
    },
  });
});
```

## Plugin Types

```typescript { .api }
type CssInJs = Record<string, string | string[] | CssInJs>;

interface NamedUtilityValue {
  value: string;
  fraction: string | null;
  modifier: string | null;
}
```