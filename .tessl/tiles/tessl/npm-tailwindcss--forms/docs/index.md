# Tailwind CSS Forms

A Tailwind CSS plugin that provides comprehensive form element styling and normalization. It offers two strategies for applying styles: 'base' for global form element styling and 'class' for explicit utility classes, with support for all standard HTML form input types.

## Package Information

- **Package Name**: @tailwindcss/forms
- **Package Type**: npm
- **Language**: JavaScript
- **Installation**: `npm install -D @tailwindcss/forms`

## Core Imports

```javascript
const forms = require('@tailwindcss/forms');
```

For ES modules:

```javascript
import forms from '@tailwindcss/forms';
```

## Basic Usage

Add the plugin to your `tailwind.config.js` file:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    // ...
  },
  plugins: [
    require('@tailwindcss/forms'),
    // ...
  ],
}
```

With configuration options:

```javascript
// tailwind.config.js
module.exports = {
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'base', // only generate global styles
    }),
    // or
    require('@tailwindcss/forms')({
      strategy: 'class', // only generate classes
    }),
  ],
}
```

## Architecture

The @tailwindcss/forms plugin is built around the following design:

- **Strategy System**: Supports both global base styles and utility classes via the `strategy` option
- **Form Element Normalization**: Provides consistent cross-browser styling for all form input types
- **Custom Icon Integration**: Uses SVG data URIs for custom checkbox, radio, and select dropdown icons
- **Theme Integration**: Seamlessly integrates with Tailwind's color and spacing systems
- **Focus State Management**: Automatic focus ring styling using Tailwind's ring utilities
- **WebKit Compatibility**: Special handling for Safari and Chrome date/time input quirks

## Capabilities

### Plugin Configuration

Main plugin function that configures form styling behavior.

```javascript { .api }
/**
 * Tailwind CSS forms plugin created using plugin.withOptions()
 * @param options - Configuration options for the plugin
 * @returns Tailwind CSS plugin instance
 */
const forms = plugin.withOptions(function (options = { strategy: undefined }) {
  // Plugin implementation
});

interface FormPluginOptions {
  /** Strategy for applying form styles */
  strategy?: 'base' | 'class';
}
```

**Configuration Details:**

- `strategy: 'base'` - Applies styles globally to form elements (default when combined with 'class')
- `strategy: 'class'` - Generates utility classes only (form-input, form-select, etc.)
- `strategy: undefined` - Applies both base styles and generates utility classes (default behavior)

### Form Element Styling

The plugin provides styling for all standard HTML form input types through two approaches:

#### Base Strategy Selectors

When using base strategy, the following selectors receive automatic styling:

```css { .api }
/* Text input types */
[type='text']
input:where(:not([type]))  /* inputs without type attribute */
[type='email']
[type='url']
[type='password']
[type='number']
[type='date']
[type='datetime-local']
[type='month']
[type='search']
[type='tel']
[type='time']
[type='week']

/* Other form elements */
textarea
select
[multiple]  /* multi-select elements */
[type='checkbox']
[type='radio']
[type='file']  /* minimal reset only */
```

#### Utility Classes (Class Strategy)

When using class strategy, the following utility classes are generated:

```css { .api }
.form-input        /* For text, email, password, number, date, etc. inputs */
.form-textarea     /* For textarea elements */
.form-select       /* For single select elements */
.form-multiselect  /* For multiple select elements */
.form-checkbox     /* For checkbox inputs */
.form-radio        /* For radio inputs */
```

### Form Element Features

#### Text Input Styling

All text-type inputs receive consistent styling with:

- Normalized appearance and border styling
- Consistent padding and typography
- Automatic focus ring states using Tailwind's ring utilities
- Placeholder text styling
- WebKit-specific fixes for date/time inputs

#### Select Element Styling

Select elements receive:

- Custom dropdown arrow using SVG data URI
- Consistent styling with other inputs
- Automatic removal of custom arrow for multi-select elements
- Theme-aware arrow color that respects Tailwind color configuration

#### Checkbox and Radio Styling

Checkbox and radio inputs feature:

- Custom SVG icons for checked states
- Consistent sizing and positioning
- Indeterminate state support for checkboxes
- Focus ring styling
- Color theming support
- High contrast mode compatibility

#### File Input Handling

File inputs receive minimal reset styling to preserve browser functionality while maintaining consistency.

## Supported Form Input Types

The plugin provides comprehensive support for all HTML form input types:

### Text Input Types
- `type="text"` - Standard text input
- `type="email"` - Email address input
- `type="url"` - URL input
- `type="password"` - Password input
- `type="number"` - Numeric input
- `type="search"` - Search input
- `type="tel"` - Telephone number input

### Date and Time Input Types
- `type="date"` - Date picker
- `type="datetime-local"` - Local date and time
- `type="month"` - Month picker
- `type="time"` - Time picker
- `type="week"` - Week picker

### Other Input Types
- `type="checkbox"` - Checkbox input
- `type="radio"` - Radio button input
- `type="file"` - File upload input
- `textarea` - Multi-line text input
- `select` - Single selection dropdown
- `select[multiple]` - Multi-selection list

## Usage Examples

### Basic Form Styling

```html
<!-- Using base strategy (automatic styling) -->
<form>
  <input type="text" placeholder="Full name" />
  <input type="email" placeholder="Email address" />
  <select>
    <option>Choose option</option>
    <option>Option 1</option>
    <option>Option 2</option>
  </select>
  <textarea placeholder="Message"></textarea>
  <input type="checkbox" id="agree" />
  <label for="agree">I agree to terms</label>
</form>
```

### Using Utility Classes

```html
<!-- Using class strategy (explicit classes) -->
<form>
  <input type="text" class="form-input rounded-lg" placeholder="Full name" />
  <input type="email" class="form-input rounded-lg" placeholder="Email" />
  <select class="form-select rounded-lg">
    <option>Choose option</option>
  </select>
  <textarea class="form-textarea rounded-lg" placeholder="Message"></textarea>
  <input type="checkbox" class="form-checkbox text-blue-600" id="agree" />
</form>
```

### Custom Styling with Tailwind Utilities

```html
<!-- Combining with Tailwind utilities -->
<input type="email" class="form-input px-4 py-3 rounded-full border-2 border-blue-300 focus:border-blue-500" />
<select class="form-select bg-gray-50 text-lg rounded-xl">
  <option>Large rounded select</option>
</select>
<input type="checkbox" class="form-checkbox h-6 w-6 text-green-600 rounded-lg" />
```

## Dependencies

The plugin has minimal dependencies:

```javascript { .api }
// External dependency for SVG data URI conversion
const svgToDataUri = require('mini-svg-data-uri');

// Tailwind CSS plugin utilities
const plugin = require('tailwindcss/plugin');
const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

// Destructured defaults from Tailwind's default theme
const [baseFontSize, { lineHeight: baseLineHeight }] = defaultTheme.fontSize.base;
const { spacing, borderWidth, borderRadius } = defaultTheme;

/**
 * Utility function to resolve color values with alpha-value placeholder support
 * @param color - Color value that may contain '<alpha-value>' placeholder
 * @param opacityVariableName - CSS custom property name for opacity
 * @returns Resolved color value with proper opacity variable
 */
function resolveColor(color, opacityVariableName) {
  return color.replace('<alpha-value>', `var(${opacityVariableName}, 1)`);
}

/**
 * Internal utility to resolve chevron colors for select dropdown arrows
 * @param color - Theme color path
 * @param fallback - Fallback color value
 * @returns Resolved color without CSS variables
 */
function resolveChevronColor(color, fallback) {
  let resolved = theme(color);
  
  if (!resolved || resolved.includes('var(')) {
    return fallback;
  }
  
  return resolved.replace('<alpha-value>', '1');
}
```

## Browser Compatibility

The plugin includes specific handling for browser compatibility issues:

- **WebKit Date/Time Inputs**: Special fixes for Safari and Chrome date/time input rendering
- **High Contrast Mode**: Automatic appearance fallbacks for forced-colors media queries
- **Print Styles**: Color adjustment settings for proper printing
- **Cross-browser Normalization**: Consistent appearance across all modern browsers

## TypeScript Support

The plugin includes TypeScript definitions:

```typescript { .api }
declare const forms: {
  (options?: Partial<{ strategy: 'base' | 'class' }>): {
    handler: (tailwindApi: { addBase: Function; addComponents: Function; theme: Function }) => void;
  };
  __isOptionsFunction: true;
};

export = forms;
```