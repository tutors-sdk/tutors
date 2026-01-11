# Individual Rules

Comprehensive collection of 79 ESLint rules specifically designed for Svelte applications, covering security, best practices, styling, and Svelte-specific patterns.

## Capabilities

### Core System Rules

Essential system-level rules for ESLint plugin operation.

```typescript { .api }
/**
 * Support comment-based rule directives in Svelte files
 */
'svelte/comment-directive': Rule.RuleModule;

/**
 * Internal system rule for plugin operation
 */
'svelte/system': Rule.RuleModule;
```

### Security & Best Practice Rules

Rules focused on preventing security vulnerabilities and enforcing best practices.

```typescript { .api }
/**
 * Disallow {@html} tags to prevent XSS attacks
 */
'svelte/no-at-html-tags': Rule.RuleModule;

/**
 * Disallow {@debug} tags in production code
 */
'svelte/no-at-debug-tags': Rule.RuleModule;

/**
 * Disallow DOM manipulation in favor of Svelte bindings
 */
'svelte/no-dom-manipulating': Rule.RuleModule;

/**
 * Disallow use of Svelte internal APIs
 */
'svelte/no-svelte-internal': Rule.RuleModule;

/**
 * Require rel="noopener noreferrer" with target="_blank"
 */
'svelte/no-target-blank': Rule.RuleModule;

/**
 * Disallow use of top-level browser globals in SSR contexts
 */
'svelte/no-top-level-browser-globals': Rule.RuleModule;

/**
 * Disallow inspect expressions in production
 */
'svelte/no-inspect': Rule.RuleModule;
```

### Reactive Programming Rules

Rules for Svelte's reactivity system and state management.

```typescript { .api }
/**
 * Prevent infinite reactive loops
 */
'svelte/infinite-reactive-loop': Rule.RuleModule;

/**
 * Disallow immutable reactive statements
 */
'svelte/no-immutable-reactive-statements': Rule.RuleModule;

/**
 * Disallow reactive functions that don't depend on state
 */
'svelte/no-reactive-functions': Rule.RuleModule;

/**
 * Disallow reactive literals
 */
'svelte/no-reactive-literals': Rule.RuleModule;

/**
 * Prevent reactive reassignment issues
 */
'svelte/no-reactive-reassign': Rule.RuleModule;

/**
 * Prefer Svelte reactivity over DOM event listeners
 */
'svelte/prefer-svelte-reactivity': Rule.RuleModule;

/**
 * Disallow unnecessary curly braces in reactive statements
 */
'svelte/no-extra-reactive-curlies': Rule.RuleModule;
```

### Store Management Rules

Rules for Svelte store patterns and best practices.

```typescript { .api }
/**
 * Disallow async stores
 */
'svelte/no-store-async': Rule.RuleModule;

/**
 * Prefer destructured store props
 */
'svelte/prefer-destructured-store-props': Rule.RuleModule;

/**
 * Require store callbacks to use set parameter
 */
'svelte/require-store-callbacks-use-set-param': Rule.RuleModule;

/**
 * Require reactive store access
 */
'svelte/require-store-reactive-access': Rule.RuleModule;

/**
 * Require store initialization
 */
'svelte/require-stores-init': Rule.RuleModule;

/**
 * Prefer writable derived stores
 */
'svelte/prefer-writable-derived': Rule.RuleModule;

/**
 * Ensure derived stores have consistent inputs and outputs
 */
'svelte/derived-has-same-inputs-outputs': Rule.RuleModule;

/**
 * Disallow unsubscribe calls that are ignored
 */
'svelte/no-ignored-unsubscribe': Rule.RuleModule;
```

### Code Quality Rules

Rules for maintaining code quality and preventing common errors.

```typescript { .api }
/**
 * Disallow duplicate else-if blocks
 */
'svelte/no-dupe-else-if-blocks': Rule.RuleModule;

/**
 * Disallow duplicate on: directives
 */
'svelte/no-dupe-on-directives': Rule.RuleModule;

/**
 * Disallow duplicate style properties
 */
'svelte/no-dupe-style-properties': Rule.RuleModule;

/**
 * Disallow duplicate use: directives
 */
'svelte/no-dupe-use-directives': Rule.RuleModule;

/**
 * Disallow unused component props
 */
'svelte/no-unused-props': Rule.RuleModule;

/**
 * Disallow unused CSS class names
 */
'svelte/no-unused-class-name': Rule.RuleModule;

/**
 * Disallow unused svelte-ignore comments
 */
'svelte/no-unused-svelte-ignore': Rule.RuleModule;

/**
 * Disallow unnecessary mustache expressions
 */
'svelte/no-useless-mustaches': Rule.RuleModule;

/**
 * Disallow useless children snippets
 */
'svelte/no-useless-children-snippet': Rule.RuleModule;

/**
 * Disallow objects in text mustaches
 */
'svelte/no-object-in-text-mustaches': Rule.RuleModule;
```

### Styling & Formatting Rules

Rules for consistent code formatting and styling patterns.

```typescript { .api }
/**
 * Enforce first attribute linebreak
 */
'svelte/first-attribute-linebreak': Rule.RuleModule;

/**
 * Enforce closing bracket placement
 */
'svelte/html-closing-bracket-new-line': Rule.RuleModule;

/**
 * Enforce closing bracket spacing
 */
'svelte/html-closing-bracket-spacing': Rule.RuleModule;

/**
 * Enforce consistent quotes in HTML attributes
 */
'svelte/html-quotes': Rule.RuleModule;

/**
 * Configure self-closing tag style
 */
'svelte/html-self-closing': Rule.RuleModule;

/**
 * Enforce consistent indentation
 */
'svelte/indent': Rule.RuleModule;

/**
 * Limit attributes per line
 */
'svelte/max-attributes-per-line': Rule.RuleModule;

/**
 * Enforce spacing in mustache expressions
 */
'svelte/mustache-spacing': Rule.RuleModule;

/**
 * Sort component attributes
 */
'svelte/sort-attributes': Rule.RuleModule;

/**
 * Enforce spacing around equal signs in attributes
 */
'svelte/no-spaces-around-equal-signs-in-attribute': Rule.RuleModule;

/**
 * Disallow trailing spaces
 */
'svelte/no-trailing-spaces': Rule.RuleModule;

/**
 * Enforce spacing in HTML comments
 */
'svelte/spaced-html-comment': Rule.RuleModule;
```

### Directive Rules

Rules for Svelte directive usage and patterns.

```typescript { .api }
/**
 * Prefer class directive over conditional classes
 */
'svelte/prefer-class-directive': Rule.RuleModule;

/**
 * Prefer style directive over conditional styles
 */
'svelte/prefer-style-directive': Rule.RuleModule;

/**
 * Enforce shorthand attribute syntax
 */
'svelte/shorthand-attribute': Rule.RuleModule;

/**
 * Enforce shorthand directive syntax
 */
'svelte/shorthand-directive': Rule.RuleModule;

/**
 * Disallow dynamic slot names
 */
'svelte/no-dynamic-slot-name': Rule.RuleModule;

/**
 * Disallow unknown style directive properties
 */
'svelte/no-unknown-style-directive-property': Rule.RuleModule;

/**
 * Disallow shorthand style property overrides
 */
'svelte/no-shorthand-style-property-overrides': Rule.RuleModule;
```

### Event Handling Rules

Rules for event handling patterns and best practices.

```typescript { .api }
/**
 * Disallow addEventListener in favor of on: directives
 */
'svelte/no-add-event-listener': Rule.RuleModule;

/**
 * Ensure event handlers are functions
 */
'svelte/no-not-function-handler': Rule.RuleModule;

/**
 * Require types for event dispatchers
 */
'svelte/require-event-dispatcher-types': Rule.RuleModule;

/**
 * Require event name prefix
 */
'svelte/require-event-prefix': Rule.RuleModule;
```

### Validation & Compilation Rules

Rules for validating Svelte syntax and compilation.

```typescript { .api }
/**
 * Validate Svelte compilation
 */
'svelte/valid-compile': Rule.RuleModule;

/**
 * Validate each block keys
 */
'svelte/valid-each-key': Rule.RuleModule;

/**
 * Require key in each blocks
 */
'svelte/require-each-key': Rule.RuleModule;

/**
 * Validate style parsing
 */
'svelte/valid-style-parse': Rule.RuleModule;

/**
 * Ensure proper block language syntax
 */
'svelte/block-lang': Rule.RuleModule;

/**
 * Enforce consistent selector styles
 */
'svelte/consistent-selector-style': Rule.RuleModule;
```

### SvelteKit Specific Rules

Rules specific to SvelteKit applications and patterns.

```typescript { .api }
/**
 * Prevent load export in page modules
 */
'svelte/no-export-load-in-svelte-module-in-kit-pages': Rule.RuleModule;

/**
 * Require base for goto navigation
 */
'svelte/no-goto-without-base': Rule.RuleModule;

/**
 * Require base for navigation
 */
'svelte/no-navigation-without-base': Rule.RuleModule;

/**
 * Require resolve for navigation
 */
'svelte/no-navigation-without-resolve': Rule.RuleModule;

/**
 * Validate prop names in Kit pages
 */
'svelte/valid-prop-names-in-kit-pages': Rule.RuleModule;
```

### HTML & Accessibility Rules

Rules for HTML elements and accessibility.

```typescript { .api }
/**
 * Require button elements to have explicit type
 */
'svelte/button-has-type': Rule.RuleModule;

/**
 * Disallow inline styles
 */
'svelte/no-inline-styles': Rule.RuleModule;

/**
 * Disallow restricted HTML elements
 */
'svelte/no-restricted-html-elements': Rule.RuleModule;

/**
 * Disallow raw special elements (script, style)
 */
'svelte/no-raw-special-elements': Rule.RuleModule;

/**
 * Require optimized style attributes
 */
'svelte/require-optimized-style-attribute': Rule.RuleModule;
```

### Advanced & Experimental Rules

Advanced rules and experimental features.

```typescript { .api }
/**
 * Require slot types (experimental)
 */
'svelte/experimental-require-slot-types': Rule.RuleModule;

/**
 * Require strict event types (experimental)
 */
'svelte/experimental-require-strict-events': Rule.RuleModule;

/**
 * Disallow unnecessary state wrapping
 */
'svelte/no-unnecessary-state-wrap': Rule.RuleModule;

/**
 * Prefer const declarations
 */
'svelte/prefer-const': Rule.RuleModule;

/**
 * Disallow inner declarations
 */
'svelte/no-inner-declarations': Rule.RuleModule;
```

### Extension Rules

Rules that extend existing ESLint rules for Svelte context.

```typescript { .api }
/**
 * TypeScript ESLint extension: no unnecessary conditions
 */
'@typescript-eslint/no-unnecessary-condition': Rule.RuleModule;
```

## Rule Categories

### By Category Type

```typescript { .api }
type RuleCategory = 
  | 'Possible Errors'      // Rules preventing runtime errors
  | 'Security Vulnerability' // Security-focused rules
  | 'Best Practices'       // Code quality and maintainability
  | 'Stylistic Issues'     // Code formatting and style
  | 'Extension Rules'      // Extensions of existing ESLint rules
  | 'SvelteKit'           // SvelteKit-specific patterns
  | 'Experimental'        // Experimental features
  | 'System';            // Internal system rules
```

### By Rule Type

```typescript { .api }
type RuleType = 
  | 'problem'     // Code correctness issues
  | 'suggestion'  // Code improvement suggestions
  | 'layout';     // Code formatting issues
```

## Rule Configuration

### Individual Rule Usage

```javascript
export default [
  {
    rules: {
      'svelte/no-at-html-tags': 'error',
      'svelte/prefer-class-directive': 'warn',
      'svelte/html-quotes': ['error', { prefer: 'double' }]
    }
  }
];
```

### Rule with Options

```javascript
export default [
  {
    rules: {
      'svelte/max-attributes-per-line': ['error', {
        multiline: 1,
        singleline: 3
      }],
      'svelte/sort-attributes': ['error', {
        order: ['class', 'id', 'name', 'slot']
      }]
    }
  }
];
```

## Types

### Rule Module Interface

```typescript { .api }
interface RuleModule {
  meta: RuleMetaData;
  create: (context: RuleContext) => RuleListener;
}

interface RuleMetaData {
  docs: {
    description: string;
    category: RuleCategory;
    recommended: boolean | 'base';
    url: string;
    ruleId: string;
    ruleName: string;
    default?: 'error' | 'warn';
    conflictWithPrettier?: boolean;
  };
  messages: { [messageId: string]: string };
  fixable?: 'code' | 'whitespace';
  hasSuggestions?: boolean;
  schema: JSONSchema4 | JSONSchema4[];
  deprecated?: boolean;
  replacedBy?: string[] | { note: string };
  type: 'problem' | 'suggestion' | 'layout';
}

interface RuleListener {
  [key: string]: ((node: any) => void) | undefined;
  onCodePathStart?(codePath: any, node: never): void;
  onCodePathEnd?(codePath: any, node: never): void;
}
```