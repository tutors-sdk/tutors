# Svelte File Processor

Custom ESLint processor for handling Svelte files, supporting comment directives and proper AST parsing.

## Capabilities

### File Preprocessing

Preprocesses Svelte files before ESLint analysis, preparing them for rule processing.

```typescript { .api }
/**
 * Preprocesses Svelte files before linting
 * Initializes shared state for comment directive processing
 * @param code - Source code content of the .svelte file
 * @param filename - Path to the file being processed
 * @returns Array of code strings for processing (typically single item)
 */
function preprocess(code: string, filename: string): string[];
```

**Usage:**
- Called automatically by ESLint when processing .svelte files
- Initializes shared state tracking for comment directives
- Returns the original code wrapped in an array for standard ESLint processing

### File Postprocessing

Postprocesses lint messages after rule analysis, applying comment directive filtering.

```typescript { .api }
/**
 * Postprocesses lint messages from Svelte files
 * Applies comment directive filtering to suppress specific rules
 * @param messages - Array of lint message arrays from ESLint rules
 * @param filename - Path to the file that was processed
 * @returns Filtered array of lint messages after applying directives
 */
function postprocess(
  messages: Linter.LintMessage[][], 
  filename: string
): Linter.LintMessage[];
```

**Features:**
- Processes `<!-- eslint-disable -->` and `<!-- eslint-enable -->` comments
- Filters out suppressed rule violations
- Maintains rule violation context and positioning
- Handles rule-specific and global suppressions

### Autofix Support

Indicates processor support for ESLint's autofix functionality.

```typescript { .api }
/**
 * Processor supports ESLint autofix operations
 */
const supportsAutofix: true;
```

**Features:**
- Enables automatic fixing of rule violations in .svelte files
- Maintains proper source mapping for fixes
- Preserves Svelte component structure and syntax

### Processor Metadata

Metadata about the processor version and capabilities.

```typescript { .api }
/**
 * Processor metadata
 */
const meta: {
  name: "eslint-plugin-svelte";
  version: "3.12.1";
};
```

## Comment Directive Support

### Supported Directives

The processor supports standard ESLint comment directives within Svelte files:

```html
<!-- eslint-disable -->
<div>{@html unsafeContent}</div>
<!-- eslint-enable -->

<!-- eslint-disable svelte/no-at-html-tags -->
<div>{@html trustedContent}</div>
<!-- eslint-enable svelte/no-at-html-tags -->

<!-- eslint-disable-next-line svelte/no-unused-props -->
<script>
  export let unusedProp;
</script>

<!-- eslint-disable-line svelte/prefer-class-directive -->
<div class={active ? 'active' : ''}></div>
```

### Directive Processing

```typescript { .api }
/**
 * Comment directive interface for rule suppression
 */
interface CommentDirective {
  filterMessages(messages: Linter.LintMessage[]): Linter.LintMessage[];
}

/**
 * Shared state interface for tracking directives
 */
interface Shared {
  commentDirectives: CommentDirective[];
}
```

## Processor Registration

### Automatic Registration

The processor is automatically registered with the plugin:

```typescript { .api }
interface ProcessorRegistration {
  '.svelte': SvelteProcessor;
  svelte: SvelteProcessor;
}
```

### Manual Configuration

```javascript
// eslint.config.js
export default [
  {
    files: ['**/*.svelte'],
    processor: 'svelte/svelte'
  }
];
```

## Integration with Shared State

### State Management

The processor integrates with the plugin's shared state system:

```typescript { .api }
/**
 * Initialize shared state for a file
 * @param filename - File being processed
 */
function beginShared(filename: string): void;

/**
 * Finalize and retrieve shared state for a file
 * @param filename - File that was processed
 * @returns Shared state object or null
 */
function terminateShared(filename: string): Shared | null;
```

**Usage Pattern:**
1. `preprocess()` calls `beginShared()` to initialize tracking
2. ESLint processes the file and rules interact with shared state
3. `postprocess()` calls `terminateShared()` to get final state
4. Comment directives are applied to filter messages

## File Type Support

### Supported Extensions

The processor handles multiple Svelte-related file types:

```typescript { .api }
/**
 * File patterns processed by the Svelte processor
 */
type SupportedFiles = 
  | '*.svelte'      // Standard Svelte components
  | '*.svelte.js'   // Svelte JavaScript files
  | '*.svelte.ts';  // Svelte TypeScript files
```

### Configuration Example

```javascript
// eslint.config.js
export default [
  {
    files: ['**/*.svelte', '**/*.svelte.js', '**/*.svelte.ts'],
    processor: 'svelte/svelte',
    languageOptions: {
      parser: svelteEslintParser
    }
  }
];
```

## Error Handling

### Message Filtering

The processor provides robust error message filtering:

```typescript { .api }
/**
 * Filter function for processing lint messages
 * @param messages - Original lint messages
 * @param shared - Shared state with comment directives
 * @returns Filtered messages after applying directives
 */
function filter(
  messages: Linter.LintMessage[], 
  shared: Shared
): Linter.LintMessage[];
```

**Features:**
- Processes multiple comment directives per file
- Maintains proper rule suppression scope
- Preserves non-suppressed violations
- Handles nested and overlapping directive ranges

## Types

### Core Processor Interface

```typescript { .api }
interface SvelteProcessor {
  preprocess(code: string, filename: string): string[];
  postprocess(messages: Linter.LintMessage[][], filename: string): Linter.LintMessage[];
  supportsAutofix: boolean;
  meta: {
    name: string;
    version: string;
  };
}
```

### Lint Message Structure

```typescript { .api }
interface Linter.LintMessage {
  ruleId: string | null;
  severity: 1 | 2;
  message: string;
  line: number;
  column: number;
  nodeType?: string;
  messageId?: string;
  endLine?: number;
  endColumn?: number;
  fix?: {
    range: [number, number];
    text: string;
  };
  suggestions?: Array<{
    desc: string;
    messageId?: string;
    fix: {
      range: [number, number];
      text: string;
    };
  }>;
}
```

### Shared State Types

```typescript { .api }
interface Shared {
  commentDirectives: CommentDirective[];
}

interface CommentDirective {
  filterMessages(messages: Linter.LintMessage[]): Linter.LintMessage[];
}
```

## Advanced Usage

### Custom Processor Configuration

```javascript
// eslint.config.js
import svelte from 'eslint-plugin-svelte';

export default [
  {
    files: ['**/*.svelte'],
    processor: svelte.processors['.svelte'],
    languageOptions: {
      parser: 'svelte-eslint-parser',
      parserOptions: {
        svelteConfig: './svelte.config.js'
      }
    },
    rules: {
      'svelte/comment-directive': 'error'
    }
  }
];
```

### Integration with Other Tools

```javascript
// Works with TypeScript
export default [
  {
    files: ['**/*.svelte'],
    processor: 'svelte/svelte',
    languageOptions: {
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.svelte']
      }
    }
  }
];
```