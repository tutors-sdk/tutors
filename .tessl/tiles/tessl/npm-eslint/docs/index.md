# ESLint

ESLint is an AST-based pattern checker for JavaScript that provides comprehensive linting capabilities with configurable rules and autofix support. It analyzes JavaScript code to identify and report problems based on patterns, helping maintain code quality and enforce coding standards across projects.

## Package Information

- **Package Name**: eslint
- **Package Type**: npm
- **Language**: JavaScript (with TypeScript definitions)
- **Installation**: `npm install eslint`

## Core Imports

```javascript
import { ESLint, Linter, RuleTester, SourceCode, loadESLint } from "eslint";
```

For CommonJS:

```javascript
const { ESLint, Linter, RuleTester, SourceCode, loadESLint } = require("eslint");
```

For configuration helpers:

```javascript
import { defineConfig, globalIgnores } from "eslint/config";
```

For browser/universal usage:

```javascript
import { Linter } from "eslint/universal";
```

## Basic Usage

```javascript
import { ESLint } from "eslint";

// Create ESLint instance
const eslint = new ESLint({
  baseConfig: {
    rules: {
      "no-unused-vars": "error",
      "prefer-const": "warn"
    }
  },
  fix: true
});

// Lint files
const results = await eslint.lintFiles(["src/**/*.js"]);

// Apply fixes to files
await ESLint.outputFixes(results);

// Format results
const formatter = await eslint.loadFormatter("stylish");
const resultText = formatter.format(results);
console.log(resultText);
```

## Architecture

ESLint is built around several key components:

- **ESLint Class**: Main API for Node.js environments with file system access and configuration management
- **Linter Class**: Core linting engine that operates on source code and configurations independently
- **Rule System**: Extensible rule architecture with 330+ built-in rules covering problems, suggestions, and formatting
- **Configuration System**: Flat configuration format (v9+) with support for cascading configs and overrides
- **AST Analysis**: Uses Espree parser by default with support for custom parsers and visitor patterns
- **Source Code Utilities**: Rich API for rule developers to analyze and manipulate JavaScript source code

## Capabilities

### Main ESLint API

Primary interface for linting JavaScript files and projects with full configuration support and file system integration.

```javascript { .api }
class ESLint {
  constructor(options?: ESLintOptions);
  static readonly version: string;
  static readonly configType: "flat";
  static readonly defaultConfig: Config[];
  
  lintFiles(patterns: string | string[]): Promise<LintResult[]>;
  lintText(code: string, options?: {filePath?: string, warnIgnored?: boolean}): Promise<LintResult[]>;
  getRulesMetaForResults(results: LintResult[]): Record<string, RuleMetaData>;
  hasFlag(flag: string): boolean;
  loadFormatter(name?: string): Promise<Formatter>;
  calculateConfigForFile(filePath: string): Promise<Config | undefined>;
  findConfigFile(filePath?: string): Promise<string | undefined>;
  isPathIgnored(filePath: string): Promise<boolean>;
  
  static outputFixes(results: LintResult[]): Promise<void>;
  static getErrorResults(results: LintResult[]): LintResult[];
  static fromOptionsModule(optionsURL: {readonly href: string}): Promise<ESLint>;
}

interface ESLintOptions {
  allowInlineConfig?: boolean;
  baseConfig?: Config | Config[];
  cache?: boolean;
  cacheLocation?: string;
  cacheStrategy?: "metadata" | "content";
  concurrency?: number | "auto" | "off";
  cwd?: string;
  errorOnUnmatchedPattern?: boolean;
  fix?: boolean | ((message: LintMessage) => boolean);
  fixTypes?: FixType[];
  flags?: string[];
  globInputPaths?: boolean;
  ignore?: boolean;
  ignorePatterns?: string[];
  overrideConfig?: Config | Config[];
  overrideConfigFile?: string | true | null;
  passOnNoPatterns?: boolean;
  plugins?: Record<string, Plugin>;
  stats?: boolean;
  warnIgnored?: boolean;
}
```

[Main ESLint API](./eslint-api.md)

### Core Linter Engine

The core linting engine that can be used independently of file system operations for in-memory linting.

```javascript { .api }
class Linter {
  constructor(options?: {cwd?: string, configType?: "flat" | "eslintrc", flags?: string[]});
  static readonly version: string;
  
  verify(textOrSourceCode: string | SourceCode, config: Config | Config[], options?: VerifyOptions): LintMessage[];
  verifyAndFix(text: string, config: Config | Config[], options?: FixOptions): FixReport;
  getSourceCode(): SourceCode;
  getTimes(): {passes: TimePass[]};
  getSuppressedMessages(): SuppressedLintMessage[];
  hasFlag(flag: string): boolean;
}

interface VerifyOptions {
  filename?: string;
  allowInlineConfig?: boolean;
  reportUnusedDisableDirectives?: boolean | string;
  disableFixes?: boolean;
}

interface FixReport {
  fixed: boolean;
  output: string;
  messages: LintMessage[];
}
```

[Core Linter Engine](./linter.md)

### Rule Development and Testing

Framework for developing and testing custom ESLint rules with comprehensive test case support.

```javascript { .api }
class RuleTester {
  constructor(config?: Object);
  static describe: Function | null;
  static it: Function | null;
  static itOnly: Function | null;
  
  run(name: string, rule: RuleDefinition, tests: {valid: ValidTestCase[], invalid: InvalidTestCase[]}): void;
  
  static setDefaultConfig(config: Object): void;
  static getDefaultConfig(): Object;
  static resetDefaultConfig(): void;
  static only(item: string | ValidTestCase | InvalidTestCase): ValidTestCase | InvalidTestCase;
}

interface ValidTestCase {
  name?: string;
  code: string;
  options?: any[];
  filename?: string;
  languageOptions?: LanguageOptions;
  settings?: Record<string, any>;
  only?: boolean;
}

interface InvalidTestCase extends ValidTestCase {
  errors: number | Array<TestCaseError | string>;
  output?: string | null;
}
```

[Rule Development and Testing](./rule-development.md)

### Source Code Analysis

Rich abstraction of JavaScript source code providing utilities for rules to analyze and manipulate code.

```javascript { .api }
class SourceCode {
  constructor(text: string, ast: Program);
  constructor(config: {text: string, ast: Program, parserServices?: Object, scopeManager?: ScopeManager, visitorKeys?: Object});
  
  static splitLines(text: string): string[];
  
  readonly text: string;
  readonly ast: Program;
  readonly hasBOM: boolean;
  readonly lines: string[];
  readonly scopeManager: ScopeManager;
  readonly parserServices: Object;
  readonly visitorKeys: Object;
  
  getText(node?: ASTNode, beforeCount?: number, afterCount?: number): string;
  getLines(): string[];
  getAllComments(): Comment[];
  getNodeByRangeIndex(index: number): ASTNode | null;
  isSpaceBetween(first: ASTNode | Token, second: ASTNode | Token): boolean;
  getLocFromIndex(index: number): {line: number, column: number};
  getIndexFromLoc(loc: {line: number, column: number}): number;
  getScope(node: ASTNode): Scope;
  getDeclaredVariables(node: ASTNode): Variable[];
  getAncestors(node: ASTNode): ASTNode[];
  isGlobalReference(node: ASTNode): boolean;
  markVariableAsUsed(name: string, refNode?: ASTNode): boolean;
}
```

[Source Code Analysis](./source-code.md)

### Configuration Helpers

Utilities for creating and managing ESLint configurations with type safety and validation.

```javascript { .api }
function defineConfig(config: Config | Config[]): Config | Config[];
function globalIgnores(patterns: string[]): Config;
```

[Configuration Helpers](./configuration.md)

### Command Line Interface

Comprehensive command-line interface for linting JavaScript files and projects with extensive configuration options.

```bash { .api }
# Basic usage
eslint [options] [file patterns]

# Core options
--fix                    # Automatically fix problems
--config <path>         # Use specific config file
--format <formatter>    # Output format (stylish, json, etc.)
--ext <extensions>      # File extensions to lint
--cache                 # Enable result caching
--max-warnings <count>  # Fail if warnings exceed count
```

[Command Line Interface](./cli.md)

### Use at Your Own Risk API

Internal and unsupported APIs for advanced ESLint usage, including direct access to built-in rules, legacy ESLint class, and file enumeration utilities.

```javascript { .api }
const builtinRules: Map<string, RuleDefinition>;
class FlatESLint { /* ... */ }
class LegacyESLint { /* ... */ }
function shouldUseFlatConfig(cwd?: string): Promise<boolean>;
class FileEnumerator { /* ... */ }
```

[Use at Your Own Risk API](./use-at-your-own-risk.md)

### Rules Type Definitions

Complete TypeScript definitions for all ESLint rules enabling type-safe rule configuration and IntelliSense support.

```typescript { .api }
interface ESLintRules extends Linter.RulesRecord {
  "no-unused-vars": Linter.RuleEntry<[{
    vars?: "all" | "local";
    args?: "all" | "after-used" | "none";
    // ... more options
  }]>;
  // ... 330+ more rule definitions
}
```

[Rules Type Definitions](./rules-types.md)

### Utility Functions

Factory functions and utilities for ESLint instantiation and configuration detection.

```javascript { .api }
/**
 * Dynamically loads the correct ESLint constructor based on configuration format detection
 * @param options - Configuration options
 * @param options.useFlatConfig - Force flat config usage (true) or eslintrc (false). If undefined, auto-detects based on project configuration
 * @returns Promise resolving to the appropriate ESLint constructor (ESLint for flat config, LegacyESLint for eslintrc)
 */
function loadESLint(options?: {useFlatConfig?: boolean}): Promise<typeof ESLint | typeof LegacyESLint>;
```

**Usage Examples:**

```javascript
import { loadESLint } from "eslint";

// Auto-detect configuration format
const ESLintClass = await loadESLint();
const eslint = new ESLintClass({
  baseConfig: {
    rules: {
      "no-unused-vars": "error"
    }
  }
});

// Force flat config usage
const FlatESLintClass = await loadESLint({ useFlatConfig: true });
const flatEslint = new FlatESLintClass({
  baseConfig: [{
    rules: {
      "prefer-const": "warn"
    }
  }]
});

// Force legacy eslintrc usage
const LegacyESLintClass = await loadESLint({ useFlatConfig: false });
const legacyEslint = new LegacyESLintClass({
  baseConfig: {
    extends: ["eslint:recommended"],
    rules: {
      "no-console": "warn"
    }
  }
});

// Use in a factory function
async function createESLint(config, options = {}) {
  const ESLintConstructor = await loadESLint(options);
  return new ESLintConstructor({
    baseConfig: config,
    fix: true
  });
}
```

## Types

```javascript { .api }
interface LintResult {
  filePath: string;
  messages: LintMessage[];
  suppressedMessages: SuppressedLintMessage[];
  errorCount: number;
  fatalErrorCount: number;
  warningCount: number;
  fixableErrorCount: number;
  fixableWarningCount: number;
  output?: string;
  source?: string;
  stats?: Stats;
  usedDeprecatedRules: DeprecatedRuleUse[];
}

interface LintMessage {
  ruleId: string | null;
  severity: 1 | 2;
  message: string;
  line: number;
  column: number;
  nodeType: string;
  messageId?: string;
  endLine?: number;
  endColumn?: number;
  fix?: Fix;
  suggestions?: SuggestionResult[];
}

interface Config {
  name?: string;
  files?: string[];
  ignores?: string[];
  languageOptions?: LanguageOptions;
  linterOptions?: LinterOptions;
  processor?: string | Processor;
  plugins?: Record<string, Plugin>;
  rules?: Record<string, RuleConfig>;
  settings?: Record<string, any>;
}

interface LanguageOptions {
  ecmaVersion?: EcmaVersion;
  sourceType?: "script" | "module" | "commonjs";
  globals?: Record<string, GlobalConfig>;
  parser?: Parser;
  parserOptions?: Object;
}

type EcmaVersion = 3 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 | 2026 | "latest";

type RuleConfig = "off" | "warn" | "error" | 0 | 1 | 2 | [RuleSeverity, ...any[]];
type RuleSeverity = "off" | "warn" | "error" | 0 | 1 | 2;

type FixType = "directive" | "problem" | "suggestion" | "layout";

interface Formatter {
  format(results: LintResult[], resultsMeta?: ResultsMeta): string | Promise<string>;
}

interface Plugin {
  meta?: {name?: string, version?: string};
  configs?: Record<string, Config | Config[]>;
  rules?: Record<string, RuleDefinition>;
  processors?: Record<string, Processor>;
}
```