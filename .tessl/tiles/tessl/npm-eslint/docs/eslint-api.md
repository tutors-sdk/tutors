# Main ESLint API

The ESLint class provides the primary interface for linting JavaScript files and projects with full configuration support and file system integration. It supports flat configuration format and provides comprehensive control over the linting process.

## Capabilities

### ESLint Constructor

Creates a new ESLint instance with comprehensive configuration options.

```javascript { .api }
/**
 * Creates a new ESLint instance
 * @param options - Configuration options for the ESLint instance
 */
constructor(options?: ESLintOptions);

interface ESLintOptions {
  /** Enable/disable inline configuration comments (default: true) */
  allowInlineConfig?: boolean;
  /** Base configuration extended by all other configs */
  baseConfig?: Config | Config[];
  /** Enable result caching for improved performance (default: false) */
  cache?: boolean;
  /** Cache file location (default: .eslintcache) */
  cacheLocation?: string;
  /** Cache invalidation strategy (default: "metadata") */
  cacheStrategy?: "metadata" | "content";
  /** Max concurrent linting processes (default: "auto") */
  concurrency?: number | "auto" | "off";
  /** Current working directory (default: process.cwd()) */
  cwd?: string;
  /** Throw error if no files match patterns (default: true) */
  errorOnUnmatchedPattern?: boolean;
  /** Enable autofix or provide custom fix function (default: false) */
  fix?: boolean | ((message: LintMessage) => boolean);
  /** Types of fixes to apply (default: all types) */
  fixTypes?: FixType[];
  /** Feature flags to enable experimental features */
  flags?: string[];
  /** Enable glob pattern resolution (default: true) */
  globInputPaths?: boolean;
  /** Enable ignore patterns (default: true) */
  ignore?: boolean;
  /** Additional ignore patterns */
  ignorePatterns?: string[];
  /** Configuration that overrides all others */
  overrideConfig?: Config | Config[];
  /** Override config file discovery */
  overrideConfigFile?: string | true | null;
  /** Don't fail when no patterns provided (default: false) */
  passOnNoPatterns?: boolean;
  /** Plugin implementations */
  plugins?: Record<string, Plugin>;
  /** Enable performance statistics collection (default: false) */
  stats?: boolean;
  /** Show warnings for ignored files (default: false) */
  warnIgnored?: boolean;
}

type FixType = "directive" | "problem" | "suggestion" | "layout";
```

**Usage Examples:**

```javascript
import { ESLint } from "eslint";

// Basic setup
const eslint = new ESLint();

// With configuration
const eslint = new ESLint({
  baseConfig: {
    rules: {
      "no-unused-vars": "error",
      "prefer-const": "warn"
    }
  },
  fix: true,
  cache: true,
  cacheLocation: ".eslintcache"
});

// Custom fix function
const eslint = new ESLint({
  fix: (message) => message.ruleId !== "no-console"
});
```

### Static Properties

Static properties providing version and configuration information.

```javascript { .api }
/** Package version string */
static readonly version: string;

/** Configuration format identifier */
static readonly configType: "flat";

/** Default flat configuration array used internally */
static readonly defaultConfig: Config[];
```

### File Linting

Lint multiple files using glob patterns with comprehensive error reporting.

```javascript { .api }
/**
 * Lint files matching the given patterns
 * @param patterns - File patterns to lint (glob patterns supported)
 * @returns Promise resolving to array of lint results
 */
lintFiles(patterns: string | string[]): Promise<LintResult[]>;
```

**Usage Examples:**

```javascript
// Lint specific files
const results = await eslint.lintFiles(["src/index.js", "lib/utils.js"]);

// Lint with glob patterns
const results = await eslint.lintFiles(["src/**/*.js", "!src/**/*.test.js"]);

// Lint single pattern
const results = await eslint.lintFiles("src/**/*.{js,jsx,ts,tsx}");
```

### Text Linting

Lint source code strings without file system interaction.

```javascript { .api }
/**
 * Lint source code text
 * @param code - Source code to lint
 * @param options - Additional options for text linting
 * @returns Promise resolving to array of lint results
 */
lintText(code: string, options?: {
  /** Fake filename for the source code */
  filePath?: string;
  /** Show warnings for ignored file paths */
  warnIgnored?: boolean;
}): Promise<LintResult[]>;
```

**Usage Examples:**

```javascript
// Basic text linting
const code = "var unused = 'hello';";
const results = await eslint.lintText(code);

// With filename for better reporting
const results = await eslint.lintText(code, {
  filePath: "virtual-file.js"
});

// Show warnings for ignored files
const results = await eslint.lintText(code, {
  filePath: "ignored-file.js",
  warnIgnored: true
});
```

### Rule Metadata

Get metadata for rules used in lint results.

```javascript { .api }
/**
 * Get metadata for rules used in the lint results
 * @param results - Lint results to analyze
 * @returns Object mapping rule IDs to their metadata
 */
getRulesMetaForResults(results: LintResult[]): Record<string, RuleMetaData>;

interface RuleMetaData {
  docs?: {
    description?: string;
    category?: string;
    recommended?: boolean;
    url?: string;
  };
  messages?: Record<string, string>;
  fixable?: "code" | "whitespace";
  schema?: JSONSchema4 | JSONSchema4[] | false;
  type?: "problem" | "suggestion" | "layout";
  hasSuggestions?: boolean;
  deprecated?: boolean;
  replacedBy?: readonly string[];
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

### Formatter Loading

Load output formatters for displaying lint results.

```javascript { .api }
/**
 * Load a formatter by name
 * @param name - Formatter name (default: "stylish")
 * @returns Promise resolving to loaded formatter
 */
loadFormatter(name?: string): Promise<Formatter>;

interface Formatter {
  format(results: LintResult[], resultsMeta?: ResultsMeta): string | Promise<string>;
}
```

**Usage Examples:**

```javascript
// Load default stylish formatter
const formatter = await eslint.loadFormatter();
const output = formatter.format(results);

// Load specific formatter
const jsonFormatter = await eslint.loadFormatter("json");
const jsonOutput = jsonFormatter.format(results);

// Built-in formatters: stylish, compact, json, tap, junit, checkstyle
const compactFormatter = await eslint.loadFormatter("compact");
```

### Configuration Calculation

Calculate the resolved configuration for specific files.

```javascript { .api }
/**
 * Calculate the resolved configuration for a file
 * @param filePath - File path to calculate config for
 * @returns Promise resolving to calculated config or undefined if ignored
 */
calculateConfigForFile(filePath: string): Promise<Config | undefined>;
```

### Configuration Discovery

Find the configuration file being used by ESLint.

```javascript { .api }
/**
 * Find the configuration file being used
 * @param filePath - Starting path for config search (default: cwd)
 * @returns Promise resolving to config file path or undefined
 */
findConfigFile(filePath?: string): Promise<string | undefined>;
```

### Ignore Path Checking

Check if a file path is ignored by ESLint configuration.

```javascript { .api }
/**
 * Check if a file path is ignored by ESLint
 * @param filePath - File path to check
 * @returns Promise resolving to true if path is ignored
 */
isPathIgnored(filePath: string): Promise<boolean>;
```

### Static Methods

Utility methods for processing lint results.

```javascript { .api }
/**
 * Write fixes from lint results to their respective files
 * @param results - Lint results containing fixes to apply
 */
static outputFixes(results: LintResult[]): Promise<void>;

/**
 * Filter results to only include errors (severity 2)
 * @param results - Lint results to filter
 * @returns Results containing only error messages
 */
static getErrorResults(results: LintResult[]): LintResult[];

/**
 * Create ESLint instance from a configuration module URL
 * @param optionsURL - URL object pointing to options module
 * @returns Promise resolving to configured ESLint instance
 */
static fromOptionsModule(optionsURL: {readonly href: string}): Promise<ESLint>;
```

**Usage Examples:**

```javascript
// Apply fixes to files
const results = await eslint.lintFiles(["src/**/*.js"]);
await ESLint.outputFixes(results);

// Filter to errors only
const errorResults = ESLint.getErrorResults(results);
console.log(`Found ${errorResults.length} files with errors`);

// Load from config module
const configURL = new URL("./eslint-config.js", import.meta.url);
const eslint = await ESLint.fromOptionsModule(configURL);
```

## Result Types

```javascript { .api }
interface LintResult {
  /** Path to the file that was linted */
  filePath: string;
  /** Array of lint messages */
  messages: LintMessage[];
  /** Array of suppressed messages */
  suppressedMessages: SuppressedLintMessage[];
  /** Number of error messages */
  errorCount: number;
  /** Number of fatal error messages */
  fatalErrorCount: number;
  /** Number of warning messages */
  warningCount: number;
  /** Number of fixable error messages */
  fixableErrorCount: number;
  /** Number of fixable warning messages */
  fixableWarningCount: number;
  /** Fixed source code (when fixes applied) */
  output?: string;
  /** Original source code */
  source?: string;
  /** Performance statistics (when stats enabled) */
  stats?: Stats;
  /** Information about deprecated rules used */
  usedDeprecatedRules: DeprecatedRuleUse[];
}

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
  /** Fix information for autofixing */
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
  /** Fix to apply for this suggestion */
  fix: Fix;
  /** Message ID for the suggestion */
  messageId?: string;
}

interface Stats {
  /** Number of fix passes applied */
  fixPasses: number;
  /** Timing information for each pass */
  times: {passes: TimePass[]};
}

interface DeprecatedRuleUse {
  /** The deprecated rule ID */
  ruleId: string;
  /** Rules that replace this deprecated rule */
  replacedBy: string[];
}
```