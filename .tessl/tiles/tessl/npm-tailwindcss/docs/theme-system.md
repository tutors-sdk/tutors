# Theme System

Comprehensive theme and design system management with CSS custom properties, color palettes, and configuration. The theme system provides a complete design token system for consistent styling.

## Capabilities

### Color Palette

Complete color system with semantic color names and comprehensive shade scales.

```typescript { .api }
const colors: {
  inherit: string;
  current: string;
  transparent: string;
  black: string;
  white: string;
  slate: {
    '50': string;
    '100': string;
    '200': string;
    '300': string;
    '400': string;
    '500': string;
    '600': string;
    '700': string;
    '800': string;
    '900': string;
    '950': string;
  };
  gray: Record<string, string>;
  zinc: Record<string, string>;
  neutral: Record<string, string>;
  stone: Record<string, string>;
  red: Record<string, string>;
  orange: Record<string, string>;
  amber: Record<string, string>;
  yellow: Record<string, string>;
  lime: Record<string, string>;
  green: Record<string, string>;
  emerald: Record<string, string>;
  teal: Record<string, string>;
  cyan: Record<string, string>;
  sky: Record<string, string>;
  blue: Record<string, string>;
  indigo: Record<string, string>;
  violet: Record<string, string>;
  purple: Record<string, string>;
  fuchsia: Record<string, string>;
  pink: Record<string, string>;
  rose: Record<string, string>;
};
```

**Usage Examples:**

```typescript
import colors from "tailwindcss/colors";

// Access specific colors
const primaryBlue = colors.blue['500']; // 'oklch(62.3% 0.214 259.815)'
const slate50 = colors.slate['50']; // 'oklch(98.4% 0.003 247.858)'

// Use in plugin
plugin(function({ addUtilities }) {
  addUtilities({
    '.text-brand': {
      color: colors.indigo['600'],
    },
    '.bg-success': {
      backgroundColor: colors.green['500'],
    },
  });
});

// Extend theme with custom colors
module.exports = {
  theme: {
    extend: {
      colors: {
        'brand': colors.purple,
        'custom': {
          light: colors.sky['100'],
          dark: colors.slate['800'],
        },
      },
    },
  },
};
```

### Default Theme Configuration

Complete default theme providing design tokens for all utility classes.

```typescript { .api }
const defaultTheme: {
  accentColor: (options: { theme: ThemeFn }) => any;
  animation: {
    none: string;
    spin: string;
    ping: string;
    pulse: string;
    bounce: string;
  };
  aria: Record<string, string>;
  aspectRatio: {
    auto: string;
    square: string;
    video: string;
  };
  backdropBlur: (options: { theme: ThemeFn }) => any;
  backdropBrightness: (options: { theme: ThemeFn }) => any;
  backdropContrast: (options: { theme: ThemeFn }) => any;
  backdropGrayscale: (options: { theme: ThemeFn }) => any;
  backdropHueRotate: (options: { theme: ThemeFn }) => any;
  backdropInvert: (options: { theme: ThemeFn }) => any;
  backdropOpacity: (options: { theme: ThemeFn }) => any;
  backdropSaturate: (options: { theme: ThemeFn }) => any;
  backdropSepia: (options: { theme: ThemeFn }) => any;
  backgroundColor: (options: { theme: ThemeFn }) => any;
  backgroundImage: Record<string, string>;
  backgroundOpacity: (options: { theme: ThemeFn }) => any;
  backgroundPosition: Record<string, string>;
  backgroundSize: Record<string, string>;
  blur: Record<string, string>;
  borderColor: (options: { theme: ThemeFn }) => any;
  borderOpacity: (options: { theme: ThemeFn }) => any;
  borderRadius: Record<string, string>;
  borderSpacing: (options: { theme: ThemeFn }) => any;
  borderWidth: Record<string, string>;
  boxShadow: Record<string, string>;
  boxShadowColor: (options: { theme: ThemeFn }) => any;
  brightness: Record<string, string>;
  caretColor: (options: { theme: ThemeFn }) => any;
  colors: () => typeof colors;
  columns: Record<string, string>;
  container: {};
  content: Record<string, string>;
  contrast: Record<string, string>;
  cursor: Record<string, string>;
  divideColor: (options: { theme: ThemeFn }) => any;
  divideOpacity: (options: { theme: ThemeFn }) => any;
  divideWidth: (options: { theme: ThemeFn }) => any;
  dropShadow: Record<string, string | string[]>;
  fill: (options: { theme: ThemeFn }) => any;
  flex: Record<string, string>;
  flexBasis: (options: { theme: ThemeFn }) => any;
  flexGrow: Record<string, string>;
  flexShrink: Record<string, string>;
  fontFamily: {
    sans: string[];
    serif: string[];
    mono: string[];
  };
  fontSize: Record<string, string | [string, { lineHeight: string }]>;
  fontWeight: Record<string, string>;
  gap: (options: { theme: ThemeFn }) => any;
  gradientColorStops: (options: { theme: ThemeFn }) => any;
  gradientColorStopPositions: Record<string, string>;
  grayscale: Record<string, string>;
  gridAutoColumns: Record<string, string>;
  gridAutoRows: Record<string, string>;
  gridColumn: Record<string, string>;
  gridColumnEnd: Record<string, string>;
  gridColumnStart: Record<string, string>;
  gridRow: Record<string, string>;
  gridRowEnd: Record<string, string>;
  gridRowStart: Record<string, string>;
  gridTemplateColumns: Record<string, string>;
  gridTemplateRows: Record<string, string>;
  height: (options: { theme: ThemeFn }) => any;
  hueRotate: Record<string, string>;
  inset: (options: { theme: ThemeFn }) => any;
  invert: Record<string, string>;
  keyframes: Record<string, Record<string, Record<string, string>>>;
  letterSpacing: Record<string, string>;
  lineHeight: Record<string, string>;
  listStyleType: Record<string, string>;
  listStyleImage: Record<string, string>;
  margin: (options: { theme: ThemeFn }) => any;
  lineClamp: Record<string, string>;
  maxHeight: (options: { theme: ThemeFn }) => any;
  maxWidth: (options: { theme: ThemeFn }) => any;
  minHeight: (options: { theme: ThemeFn }) => any;
  minWidth: (options: { theme: ThemeFn }) => any;
  objectPosition: Record<string, string>;
  opacity: Record<string, string>;
  order: Record<string, string>;
  outlineColor: (options: { theme: ThemeFn }) => any;
  outlineOffset: Record<string, string>;
  outlineWidth: Record<string, string>;
  padding: (options: { theme: ThemeFn }) => any;
  placeholderColor: (options: { theme: ThemeFn }) => any;
  placeholderOpacity: (options: { theme: ThemeFn }) => any;
  ringColor: (options: { theme: ThemeFn }) => any;
  ringOffsetColor: (options: { theme: ThemeFn }) => any;
  ringOffsetWidth: Record<string, string>;
  ringOpacity: (options: { theme: ThemeFn }) => any;
  ringWidth: Record<string, string>;
  rotate: Record<string, string>;
  saturate: Record<string, string>;
  scale: Record<string, string>;
  screens: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  scrollMargin: (options: { theme: ThemeFn }) => any;
  scrollPadding: (options: { theme: ThemeFn }) => any;
  sepia: Record<string, string>;
  skew: Record<string, string>;
  space: (options: { theme: ThemeFn }) => any;
  spacing: {
    px: string;
    0: string;
    0.5: string;
    1: string;
    1.5: string;
    2: string;
    2.5: string;
    3: string;
    3.5: string;
    4: string;
    5: string;
    6: string;
    7: string;
    8: string;
    9: string;
    10: string;
    11: string;
    12: string;
    14: string;
    16: string;
    20: string;
    24: string;
    28: string;
    32: string;
    36: string;
    40: string;
    44: string;
    48: string;
    52: string;
    56: string;
    60: string;
    64: string;
    72: string;
    80: string;
    96: string;
  };
  stroke: (options: { theme: ThemeFn }) => any;
  strokeWidth: Record<string, string>;
  supports: {};
  data: {};
  textColor: (options: { theme: ThemeFn }) => any;
  textDecorationColor: (options: { theme: ThemeFn }) => any;
  textDecorationThickness: Record<string, string>;
  textIndent: (options: { theme: ThemeFn }) => any;
  textOpacity: (options: { theme: ThemeFn }) => any;
  textUnderlineOffset: Record<string, string>;
  transformOrigin: Record<string, string>;
  transitionDelay: Record<string, string>;
  transitionDuration: Record<string, string>;
  transitionProperty: Record<string, string>;
  transitionTimingFunction: Record<string, string>;
  translate: (options: { theme: ThemeFn }) => any;
  size: (options: { theme: ThemeFn }) => any;
  width: (options: { theme: ThemeFn }) => any;
  willChange: Record<string, string>;
  zIndex: Record<string, string>;
};

type ThemeFn = (path: string) => any;
```

**Usage Examples:**

```typescript
import defaultTheme from "tailwindcss/defaultTheme";

// Extend default theme
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      spacing: {
        ...defaultTheme.spacing,
        '18': '4.5rem',
        '88': '22rem',
      },
      screens: {
        ...defaultTheme.screens,
        '3xl': '1600px',
      },
    },
  },
};

// Use in plugin
plugin(function({ addComponents, theme }) {
  addComponents({
    '.btn': {
      padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
      fontSize: theme('fontSize.sm'),
      fontWeight: theme('fontWeight.medium'),
      borderRadius: theme('borderRadius.md'),
    },
  });
});
```

### Color Palette Utilities

Utility for flattening nested color objects into flat key-value pairs.

```typescript { .api }
/**
 * Flattens a nested color palette object into flat key-value pairs
 * @param colors - Nested color object with color scales
 * @returns Flattened object with dot-notation keys
 */
function flattenColorPalette(colors: Colors): Record<string, string>;

interface Colors {
  [key: string | number]: string | Colors;
}
```

**Usage Examples:**

```typescript
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
import colors from "tailwindcss/colors";

// Flatten default colors
const flatColors = flattenColorPalette(colors);
// Result: { 'blue-50': 'oklch(...)', 'blue-100': 'oklch(...)', ... }

// Flatten custom colors
const customColors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    900: '#1e3a8a',
  },
  secondary: '#10b981',
};

const flattened = flattenColorPalette(customColors);
// Result: { 'primary-50': '#eff6ff', 'primary-100': '#dbeafe', 'primary-500': '#3b82f6', 'primary-900': '#1e3a8a', 'secondary': '#10b981' }

// Use in plugin
plugin(function({ addUtilities, theme }) {
  const colors = flattenColorPalette(theme('colors'));
  const utilities = Object.entries(colors).reduce((acc, [key, value]) => {
    acc[`.border-${key}`] = { borderColor: value };
    return acc;
  }, {});
  
  addUtilities(utilities);
});
```

## Theme Configuration

### Responsive Breakpoints

Default screen breakpoints for responsive design:

```typescript { .api }
const screens = {
  sm: '40rem',    // 640px
  md: '48rem',    // 768px  
  lg: '64rem',    // 1024px
  xl: '80rem',    // 1280px
  '2xl': '96rem', // 1536px
};
```

### Spacing Scale

Core spacing scale used for padding, margin, width, height, and more:

```typescript { .api }
const spacing = {
  px: '1px',
  0: '0px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
};
```

### Typography Scale

Font sizes with corresponding line heights:

```typescript { .api }
const fontSize = {
  xs: ['0.75rem', { lineHeight: '1rem' }],     // 12px
  sm: ['0.875rem', { lineHeight: '1.25rem' }], // 14px
  base: ['1rem', { lineHeight: '1.5rem' }],    // 16px
  lg: ['1.125rem', { lineHeight: '1.75rem' }], // 18px
  xl: ['1.25rem', { lineHeight: '1.75rem' }],  // 20px
  '2xl': ['1.5rem', { lineHeight: '2rem' }],   // 24px
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
  '5xl': ['3rem', { lineHeight: '1' }],           // 48px
  '6xl': ['3.75rem', { lineHeight: '1' }],        // 60px
  '7xl': ['4.5rem', { lineHeight: '1' }],         // 72px
  '8xl': ['6rem', { lineHeight: '1' }],           // 96px
  '9xl': ['8rem', { lineHeight: '1' }],           // 128px
};
```

### Animation Presets

Built-in animation utilities:

```typescript { .api }
const animation = {
  none: 'none',
  spin: 'spin 1s linear infinite',
  ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
  pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  bounce: 'bounce 1s infinite',
};

const keyframes = {
  spin: {
    to: { transform: 'rotate(360deg)' },
  },
  ping: {
    '75%, 100%': {
      transform: 'scale(2)',
      opacity: '0',
    },
  },
  pulse: {
    '50%': { opacity: '.5' },
  },
  bounce: {
    '0%, 100%': {
      transform: 'translateY(-25%)',
      animationTimingFunction: 'cubic-bezier(0.8,0,1,1)',
    },
    '50%': {
      transform: 'none',
      animationTimingFunction: 'cubic-bezier(0,0,0.2,1)',
    },
  },
};
```