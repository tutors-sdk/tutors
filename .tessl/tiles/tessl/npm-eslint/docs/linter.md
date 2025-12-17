# Core Linter Engine

The Linter class provides the core linting engine that operates on source code and configurations independently of file system operations. It's designed for in-memory linting and can be used in environments where file system access is not available or desired.

## Capabilities

### Linter Constructor

Creates a new Linter instance with configuration options.

```javascript { .api }
/**
 * Creates a new Linter instance
 * @param options - Configuration options for the linter
 */
constructor(options?: {
  /** Current working directory (default: process.cwd()) */
  cwd?: string;
  /** Configuration system to use (default: "flat") */
  configType?: "flat" | "eslintrc";
  /** Feature flags to enable */
  flags?: string[];
});
```

**Usage Examples:**

```javascript
import { Linter } from "eslint";

// Basic linter
const linter = new Linter();

// With custom working directory
const linter = new Linter({
  cwd: "/path/to/project"
});

// With legacy eslintrc config support
const linter = new Linter({
  configType: "eslintrc"
});
```

### Static Properties

Static properties providing version information.

```javascript { .api }
/** Package version string */
static readonly version: string;
```

### Source Code Verification

Lint source code with configuration and return messages.

```javascript { .api }
/**
 * Lint source code and return messages
 * @param textOrSourceCode - Source code text or SourceCode instance
 * @param config - ESLint configuration or config array
 * @param options - Additional verification options
 * @returns Array of lint messages
 */
verify(
  textOrSourceCode: string | SourceCode,
  config: Config | Config[],
  options?: VerifyOptions
): LintMessage[];

interface VerifyOptions {
  /** Filename for the source code */
  filename?: string;
  /** Allow inline configuration comments (default: true) */
  allowInlineConfig?: boolean;
  /** Report unused disable directives */
  reportUnusedDisableDirectives?: boolean | string;
  /** Disable fix generation (default: false) */
  disableFixes?: boolean;
  /** Filter which rules to run */
  ruleFilter?: (rule: {ruleId: string, severity: number}) => boolean;
}
```

**Usage Examples:**

```javascript
// Basic verification
const messages = linter.verify("var x = 1;", {
  rules: {
    "no-var": "error"
  }
});

// With filename
const messages = linter.verify(sourceCode, config, {
  filename: "script.js"
});

// Disable fixes
const messages = linter.verify(code, config, {
  disableFixes: true
});

// Filter rules
const messages = linter.verify(code, config, {
  ruleFilter: ({ruleId}) => ruleId.startsWith("no-")
});
```

### Verification with Fixes

Lint source code and apply fixes automatically.

```javascript { .api }
/**
 * Lint source code and apply fixes
 * @param text - Source code text to lint and fix
 * @param config - ESLint configuration or config array
 * @param options - Additional fix options
 * @returns Fix report with fixed code and remaining messages
 */
verifyAndFix(
  text: string,
  config: Config | Config[],
  options?: FixOptions
): FixReport;

interface FixOptions extends VerifyOptions {
  /** Enable fixing (default: true) */
  fix?: boolean;
}

interface FixReport {
  /** Whether any fixes were applied */
  fixed: boolean;
  /** Fixed source code */
  output: string;
  /** Remaining lint messages after fixes */
  messages: LintMessage[];
}
```

**Usage Examples:**

```javascript
// Apply all available fixes
const report = linter.verifyAndFix("var x=1", {
  rules: {
    "no-var": "error",
    "semi": "error"
  }
});

console.log(report.fixed); // true
console.log(report.output); // "let x=1;"
console.log(report.messages.length); // 0

// Multiple fix passes
const code = "var   x   =   1   ;   var   y   =   2";
const report = linter.verifyAndFix(code, {
  rules: {
    "no-var": "error",
    "no-multiple-empty-lines": "error"
  }
});
```

### Source Code Access

Get the SourceCode object from the most recent verification.

```javascript { .api }
/**
 * Get the SourceCode object from the last verify() call
 * @returns SourceCode instance from last verification
 */
getSourceCode(): SourceCode;
```

### Performance Timing

Get performance timing data from linting operations.

```javascript { .api }
/**
 * Get performance timing data
 * @returns Timing information for linting passes
 */
getTimes(): {passes: TimePass[]};

interface TimePass {
  /** Parse timing information */
  parse: {total: number};
  /** Rule timing information */
  rules?: Record<string, {total: number}>;
  /** Fix timing information */
  fix: {total: number};
  /** Total time for this pass */
  total: number;
}
```

### Suppressed Messages

Get messages that were suppressed by disable directives.

```javascript { .api }
/**
 * Get suppressed messages from the last verify() call
 * @returns Array of suppressed lint messages
 */
getSuppressedMessages(): SuppressedLintMessage[];

interface SuppressedLintMessage extends LintMessage {
  /** Information about why this message was suppressed */
  suppressions: LintSuppression[];
}

interface LintSuppression {
  /** Type of suppression */
  kind: string;
  /** Justification for suppression */
  justification: string;
}
```

### Feature Flags

Check if experimental features are enabled.

```javascript { .api }
/**
 * Check if a feature flag is enabled
 * @param flag - Feature flag name to check
 * @returns True if the flag is enabled
 */
hasFlag(flag: string): boolean;
```

### Legacy Methods (ESLintRC Only)

These methods are only available when `configType: "eslintrc"` is used.

```javascript { .api }
/**
 * Define a custom rule (eslintrc only)
 * @param ruleId - Unique rule identifier
 * @param rule - Rule implementation
 */
defineRule(ruleId: string, rule: RuleDefinition): void;

/**
 * Define multiple custom rules (eslintrc only)
 * @param rules - Object mapping rule IDs to implementations
 */
defineRules(rules: Record<string, RuleDefinition>): void;

/**
 * Get all defined rules (eslintrc only)
 * @returns Map of rule IDs to rule implementations
 */
getRules(): Map<string, RuleDefinition>;

/**
 * Define a custom parser (eslintrc only)
 * @param parserId - Unique parser identifier
 * @param parser - Parser implementation
 */
defineParser(parserId: string, parser: Parser): void;
```

**Usage Examples:**

```javascript
// Create linter with eslintrc support
const linter = new Linter({configType: "eslintrc"});

// Define custom rule
linter.defineRule("my-rule", {
  meta: {
    type: "problem",
    docs: {description: "My custom rule"}
  },
  create(context) {
    return {
      Identifier(node) {
        context.report({node, message: "Custom rule triggered"});
      }
    };
  }
});

// Use the custom rule
const messages = linter.verify("var x = 1;", {
  rules: {"my-rule": "error"}
});
```

## Advanced Usage

### Configuration Objects

```javascript { .api }
interface Config {
  /** Configuration name */
  name?: string;
  /** File patterns this config applies to */
  files?: string[];
  /** File patterns to ignore */
  ignores?: string[];
  /** Language-specific options */
  languageOptions?: LanguageOptions;
  /** Linter behavior options */
  linterOptions?: LinterOptions;
  /** Code processor */
  processor?: string | Processor;
  /** Plugin definitions */
  plugins?: Record<string, Plugin>;
  /** Rule configurations */
  rules?: Record<string, RuleConfig>;
  /** Shared settings */
  settings?: Record<string, any>;
}

interface LanguageOptions {
  /** ECMAScript version */
  ecmaVersion?: EcmaVersion;
  /** Source type */
  sourceType?: "script" | "module" | "commonjs";
  /** Global variables */
  globals?: Record<string, GlobalConfig>;
  /** Custom parser */
  parser?: Parser;
  /** Parser options */
  parserOptions?: Object;
}

interface LinterOptions {
  /** Disable inline configuration */
  noInlineConfig?: boolean;
  /** Report unused disable directives */
  reportUnusedDisableDirectives?: boolean | string;
}

type EcmaVersion = 3 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 | 2026 | "latest";

type RuleConfig = "off" | "warn" | "error" | 0 | 1 | 2 | [RuleSeverity, ...any[]];
type RuleSeverity = "off" | "warn" | "error" | 0 | 1 | 2;
```

### Message Types

```javascript { .api }
interface LintMessage {
  /** Rule ID that triggered this message */
  ruleId: string | null;
  /** Severity level (1=warning, 2=error) */
  severity: 1 | 2;
  /** Human-readable message */
  message: string;
  /** 1-based line number */
  line: number;
  /** 1-based column number */
  column: number;
  /** AST node type */
  nodeType: string;
  /** Message ID from rule metadata */
  messageId?: string;
  /** 1-based end line number */
  endLine?: number;
  /** 1-based end column number */
  endColumn?: number;
  /** Fix information */
  fix?: Fix;
  /** Suggested fixes */
  suggestions?: SuggestionResult[];
}

interface Fix {
  /** Character range to replace */
  range: [number, number];
  /** Replacement text */
  text: string;
}

interface SuggestionResult {
  /** Description of the suggestion */
  desc: string;
  /** Fix to apply */
  fix: Fix;
  /** Message ID for the suggestion */
  messageId?: string;
}
```