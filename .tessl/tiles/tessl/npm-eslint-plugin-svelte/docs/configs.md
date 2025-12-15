# Configuration Presets

Predefined ESLint configurations optimized for Svelte development with different rule sets and compatibility options.

## Capabilities

### Base Configuration

Essential configuration for Svelte files with parser setup and core rule configuration.

```typescript { .api }
/**
 * Base configuration for Svelte files
 * Sets up svelte-eslint-parser and essential rules
 */
const base: Linter.Config[];
```

**Features:**
- Configures svelte-eslint-parser for .svelte files
- Disables conflicting ESLint core rules (no-inner-declarations, no-self-assign)
- Enables essential svelte rules: comment-directive, system
- Sets up processor for .svelte, .svelte.js, and .svelte.ts files
- Provides plugin object setup for flat config

**Usage:**

```javascript
import svelte from 'eslint-plugin-svelte';

export default [
  ...svelte.configs.base,
  // your additional configuration
];
```

### Recommended Configuration

Recommended configuration extending base with production-ready rule set.

```typescript { .api }
/**
 * Recommended configuration for Svelte projects
 * Extends base configuration with recommended rules
 */
const recommended: Linter.Config[];
```

**Features:**
- Includes all base configuration
- Enables 35+ recommended rules for Svelte development
- Optimized for security and best practices
- Suitable for production applications

**Enabled Rules:**
- `svelte/comment-directive: 'error'`
- `svelte/infinite-reactive-loop: 'error'`
- `svelte/no-at-debug-tags: 'warn'`
- `svelte/no-at-html-tags: 'error'`
- `svelte/no-dom-manipulating: 'error'`
- `svelte/no-dupe-else-if-blocks: 'error'`
- `svelte/no-dupe-on-directives: 'error'`
- `svelte/no-dupe-style-properties: 'error'`
- `svelte/no-dupe-use-directives: 'error'`
- `svelte/no-export-load-in-svelte-module-in-kit-pages: 'error'`
- `svelte/no-immutable-reactive-statements: 'error'`
- `svelte/no-inner-declarations: 'error'`
- `svelte/no-inspect: 'warn'`
- `svelte/no-navigation-without-resolve: 'error'`
- `svelte/no-not-function-handler: 'error'`
- `svelte/no-object-in-text-mustaches: 'error'`
- `svelte/no-raw-special-elements: 'error'`
- `svelte/no-reactive-functions: 'error'`
- `svelte/no-reactive-literals: 'error'`
- `svelte/no-reactive-reassign: 'error'`
- `svelte/no-shorthand-style-property-overrides: 'error'`
- `svelte/no-store-async: 'error'`
- `svelte/no-svelte-internal: 'error'`
- `svelte/no-unknown-style-directive-property: 'error'`
- `svelte/no-unnecessary-state-wrap: 'error'`
- `svelte/no-unused-props: 'error'`
- `svelte/no-unused-svelte-ignore: 'error'`
- `svelte/no-useless-children-snippet: 'error'`
- `svelte/no-useless-mustaches: 'error'`
- `svelte/prefer-svelte-reactivity: 'error'`
- `svelte/prefer-writable-derived: 'error'`
- `svelte/require-each-key: 'error'`
- `svelte/require-event-dispatcher-types: 'error'`
- `svelte/require-store-reactive-access: 'error'`
- `svelte/system: 'error'`
- `svelte/valid-each-key: 'error'`
- `svelte/valid-prop-names-in-kit-pages: 'error'`

**Usage:**

```javascript
import svelte from 'eslint-plugin-svelte';

export default [
  ...svelte.configs.recommended,
  // your additional configuration
];
```

### Prettier Configuration

Configuration optimized for compatibility with Prettier formatting.

```typescript { .api }
/**
 * Configuration compatible with Prettier formatting
 * Disables conflicting stylistic rules
 */
const prettier: Linter.Config[];
```

**Features:**
- Extends base configuration
- Disables rules that conflict with Prettier
- Maintains functionality while allowing Prettier to handle formatting
- Ideal for projects using Prettier for code formatting

**Usage:**

```javascript
import svelte from 'eslint-plugin-svelte';

export default [
  ...svelte.configs.prettier,
  // your additional configuration
];
```

### All Rules Configuration

Configuration with all available rules enabled for comprehensive linting.

```typescript { .api }
/**
 * Configuration with all available rules enabled
 * Use with caution - includes experimental and strict rules
 */
const all: Linter.Config[];
```

**Features:**
- Extends base configuration
- Enables all 79 available rules
- Includes experimental and strict rules
- Best used for code quality auditing or strict development environments

**Usage:**

```javascript
import svelte from 'eslint-plugin-svelte';

export default [
  ...svelte.configs.all,
  // override specific rules as needed
  {
    rules: {
      'svelte/some-strict-rule': 'warn' // downgrade if needed
    }
  }
];
```

### Backward Compatibility Aliases

Legacy flat config aliases for backward compatibility.

```typescript { .api }
/**
 * Backward compatibility aliases
 * These reference the same configurations as above
 */
interface BackwardCompatibilityConfigs {
  'flat/base': typeof base;
  'flat/recommended': typeof recommended;
  'flat/prettier': typeof prettier;
  'flat/all': typeof all;
}
```

**Usage:**

```javascript
import svelte from 'eslint-plugin-svelte';

// These are equivalent
export default [...svelte.configs.recommended];
export default [...svelte.configs['flat/recommended']];
```

## Configuration Composition

### Combining Configurations

```javascript
import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parserOptions: {
        svelteConfig: './svelte.config.js'
      }
    }
  }
);
```

### Custom Rule Overrides

```javascript
import svelte from 'eslint-plugin-svelte';

export default [
  ...svelte.configs.recommended,
  {
    rules: {
      // Override specific rules
      'svelte/no-at-debug-tags': 'off',
      'svelte/no-unused-props': 'warn',
      'svelte/prefer-class-directive': 'error'
    }
  }
];
```

## Types

### Configuration Interface

```typescript { .api }
interface PluginConfigs {
  base: Linter.Config[];
  recommended: Linter.Config[];
  prettier: Linter.Config[];
  all: Linter.Config[];
  'flat/base': Linter.Config[];
  'flat/recommended': Linter.Config[];
  'flat/prettier': Linter.Config[];
  'flat/all': Linter.Config[];
}
```

### Linter Configuration Structure

```typescript { .api }
interface Linter.Config {
  name?: string;
  files?: string[];
  languageOptions?: {
    parser?: any;
    parserOptions?: {
      svelteConfig?: any;
      projectService?: boolean;
      extraFileExtensions?: string[];
    };
    globals?: Record<string, any>;
  };
  plugins?: Record<string, any>;
  processor?: string;
  rules?: Record<string, any>;
}
```