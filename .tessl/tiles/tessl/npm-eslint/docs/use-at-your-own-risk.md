# Use at Your Own Risk API

ESLint provides access to internal APIs through the `eslint/use-at-your-own-risk` export. These APIs are not officially supported and may change or be removed at any time without notice. Use these APIs only when necessary and understand that they may break compatibility in future versions.

**Warning**: These APIs are intended for advanced use cases and ESLint plugin/tool developers. They are not covered by semantic versioning guarantees.

## Capabilities

### Built-in Rules Access

Direct access to all built-in ESLint rules for programmatic inspection and usage.

```javascript { .api }
/**
 * Map of all built-in ESLint rules
 * @type {Map<string, RuleDefinition>}
 */
const builtinRules: Map<string, RuleDefinition>;
```

**Usage Examples:**

```javascript
import { builtinRules } from "eslint/use-at-your-own-risk";

// Get a specific rule
const noUnusedVarsRule = builtinRules.get("no-unused-vars");

// List all available rule names
const ruleNames = Array.from(builtinRules.keys());
console.log(ruleNames); // ["no-unused-vars", "prefer-const", ...]

// Inspect rule metadata
const rule = builtinRules.get("prefer-const");
console.log(rule.meta.type); // "suggestion"
console.log(rule.meta.docs.description); // "require const declarations for variables that are never reassigned after declared"

// Use rule programmatically
const linter = new Linter();
linter.defineRule("custom-prefer-const", rule);
```

### FlatESLint Class

Direct access to the flat configuration ESLint implementation.

```javascript { .api }
/**
 * ESLint class for flat configuration (modern configuration format)
 * This is the same as the regular ESLint export but exposed explicitly
 */
class FlatESLint {
  constructor(options?: ESLintOptions);
  // ... (same API as ESLint class)
}
```

**Usage Examples:**

```javascript
import { FlatESLint } from "eslint/use-at-your-own-risk";

// Explicitly use flat config ESLint
const eslint = new FlatESLint({
  baseConfig: [{
    rules: {
      "no-unused-vars": "error"
    }
  }]
});

const results = await eslint.lintText("var unused = 1;");
```

### Legacy ESLint Class

Access to the legacy ESLint implementation for backwards compatibility.

```javascript { .api }
/**
 * Legacy ESLint class for eslintrc configuration format
 * Used for compatibility with older configuration formats
 */
class LegacyESLint {
  constructor(options?: LegacyESLintOptions);
  
  lintFiles(patterns: string | string[]): Promise<LintResult[]>;
  lintText(code: string, options?: {filePath?: string, warnIgnored?: boolean}): Promise<LintResult[]>;
  getRulesMetaForResults(results: LintResult[]): Record<string, RuleMetaData>;
  loadFormatter(name?: string): Promise<Formatter>;
  calculateConfigForFile(filePath: string): Promise<Config | undefined>;
  isPathIgnored(filePath: string): Promise<boolean>;
  
  static outputFixes(results: LintResult[]): Promise<void>;
  static getErrorResults(results: LintResult[]): LintResult[];
}

interface LegacyESLintOptions {
  /** Working directory */
  cwd?: string;
  /** Base configuration object */
  baseConfig?: Object;
  /** Use eslintrc configuration files */
  useEslintrc?: boolean;
  /** Configuration file path */
  configFile?: string;
  /** Override configuration */
  overrideConfig?: Object;
  /** Override configuration file */
  overrideConfigFile?: string;
  /** Ignore path */
  ignorePath?: string;
  /** Ignore patterns */
  ignorePattern?: string | string[];
  /** Plugin resolution */
  resolvePluginsRelativeTo?: string;
  /** Enable autofix */
  fix?: boolean;
  /** Fix types to apply */
  fixTypes?: Array<"problem" | "suggestion" | "layout">;
  /** Allow inline configuration */
  allowInlineConfig?: boolean;
  /** Report unused disable directives */
  reportUnusedDisableDirectives?: "error" | "warn" | "off";
  /** Cache results */
  cache?: boolean;
  /** Cache location */
  cacheLocation?: string;
  /** Cache strategy */
  cacheStrategy?: "metadata" | "content";
  /** Global patterns */
  globInputPaths?: boolean;
  /** Error on unmatched patterns */
  errorOnUnmatchedPattern?: boolean;
}
```

**Usage Examples:**

```javascript
import { LegacyESLint } from "eslint/use-at-your-own-risk";

// Use legacy ESLint with eslintrc format
const eslint = new LegacyESLint({
  baseConfig: {
    env: {
      node: true,
      es2021: true
    },
    extends: ["eslint:recommended"],
    rules: {
      "no-unused-vars": "error"
    }
  }
});

const results = await eslint.lintFiles(["src/**/*.js"]);
```

### Configuration Detection

Utility to determine which configuration format should be used.

```javascript { .api }
/**
 * Determine whether flat config should be used for a given directory
 * @param cwd - Directory to check (defaults to process.cwd())
 * @returns Promise resolving to true if flat config should be used
 */
function shouldUseFlatConfig(cwd?: string): Promise<boolean>;
```

**Usage Examples:**

```javascript
import { shouldUseFlatConfig, FlatESLint, LegacyESLint } from "eslint/use-at-your-own-risk";

// Automatically choose correct ESLint implementation
async function createESLint(options = {}) {
  const useFlatConfig = await shouldUseFlatConfig(options.cwd);
  
  if (useFlatConfig) {
    return new FlatESLint(options);
  } else {
    return new LegacyESLint(options);
  }
}

// Use in your application
const eslint = await createESLint({ cwd: "/path/to/project" });
const results = await eslint.lintFiles(["src/**/*.js"]);
```

### File Enumeration

Internal file enumeration utilities for advanced file discovery.

```javascript { .api }
/**
 * Internal file enumerator used by ESLint CLI
 * Handles file discovery, glob pattern matching, and ignore patterns
 */
class FileEnumerator {
  constructor(options?: FileEnumeratorOptions);
  
  /**
   * Enumerate files matching patterns
   * @param patterns - Glob patterns to match
   * @returns Iterator of file information objects
   */
  iterateFiles(patterns: string | string[]): IterableIterator<{
    filePath: string;
    config: Config;
    ignored: boolean;
  }>;
}

interface FileEnumeratorOptions {
  /** Current working directory */
  cwd?: string;
  /** Configuration array or path */
  configArrayFactory?: (baseDirectory: string) => ConfigArray;
  /** Error callback */
  errorCallback?: (error: Error) => void;
  /** Extensions to consider */
  extensions?: string[] | null;
  /** Glob input paths */
  globInputPaths?: boolean;
  /** Ignore patterns */
  ignore?: boolean;
}
```

**Usage Examples:**

```javascript
import { FileEnumerator } from "eslint/use-at-your-own-risk";

// Create file enumerator
const enumerator = new FileEnumerator({
  cwd: process.cwd(),
  extensions: [".js", ".jsx", ".ts", ".tsx"]
});

// Enumerate files
for (const { filePath, config, ignored } of enumerator.iterateFiles(["src/**/*"])) {
  if (!ignored) {
    console.log(`Found file: ${filePath}`);
    console.log(`Config rules:`, Object.keys(config.rules || {}));
  }
}
```

## Migration Warning

These APIs are subject to change without notice. When possible, use the official public APIs:

- Instead of `FlatESLint`, use the regular `ESLint` export
- Instead of `shouldUseFlatConfig`, use `loadESLint()` which handles detection automatically
- Instead of `FileEnumerator`, use `ESLint.lintFiles()` with appropriate patterns
- Instead of direct `builtinRules` access, use `Linter.getRules()` when possible

## Type Definitions

```javascript { .api }
interface RuleDefinition {
  /** Rule metadata */
  meta?: RuleMetaData;
  /** Rule implementation factory */
  create(context: RuleContext): RuleListener;
}

interface RuleMetaData {
  /** Rule type classification */
  type?: "problem" | "suggestion" | "layout";
  /** Documentation properties */
  docs?: {
    description?: string;
    category?: string;
    recommended?: boolean;
    url?: string;
  };
  /** Message templates */
  messages?: Record<string, string>;
  /** Whether rule provides fixes */
  fixable?: "code" | "whitespace";
  /** Rule configuration schema */
  schema?: JSONSchema4 | JSONSchema4[] | false;
  /** Whether rule provides suggestions */
  hasSuggestions?: boolean;
  /** Whether rule is deprecated */
  deprecated?: boolean;
  /** Rules that replace this deprecated rule */
  replacedBy?: readonly string[];
}

interface Config {
  /** Configuration name */
  name?: string;
  /** File patterns */
  files?: string[];
  /** Ignore patterns */
  ignores?: string[];
  /** Language options */
  languageOptions?: LanguageOptions;
  /** Linter options */
  linterOptions?: LinterOptions;
  /** Processor */
  processor?: string | Processor;
  /** Plugins */
  plugins?: Record<string, Plugin>;
  /** Rules */
  rules?: Record<string, RuleConfig>;
  /** Settings */
  settings?: Record<string, any>;
}
```