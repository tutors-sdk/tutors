# ESLint Compatibility Utilities

ESLint Compatibility Utilities (@eslint/compat) provides functions that allow you to wrap existing ESLint rules, plugins, and configurations that were intended for use with ESLint v8.x to work seamlessly in ESLint v9.x. The package addresses breaking changes between ESLint versions by providing transparent compatibility wrappers.

## Package Information

- **Package Name**: @eslint/compat
- **Package Type**: npm
- **Language**: JavaScript/TypeScript
- **Installation**: `npm install @eslint/compat -D`

## Core Imports

```javascript
import { fixupRule, fixupPluginRules, fixupConfigRules, includeIgnoreFile, convertIgnorePatternToMinimatch } from "@eslint/compat";
```

For CommonJS:

```javascript
const { fixupRule, fixupPluginRules, fixupConfigRules, includeIgnoreFile, convertIgnorePatternToMinimatch } = require("@eslint/compat");
```

## Basic Usage

```javascript
import { fixupPluginRules, includeIgnoreFile } from "@eslint/compat";
import somePlugin from "eslint-plugin-some-plugin";
import path from "node:path";

// Fix plugin compatibility
export default [
  {
    plugins: {
      somePlugin: fixupPluginRules(somePlugin),
    },
    rules: {
      "somePlugin/rule-name": "error",
    },
  },
  // Include ignore file patterns
  includeIgnoreFile(path.resolve(process.cwd(), ".gitignore")),
];
```

## Capabilities

### Rule Compatibility

Wraps individual ESLint rules to provide missing methods on the context object for ESLint v9.x compatibility.

```javascript { .api }
/**
 * Takes the given rule and creates a new rule with the create() method wrapped
 * to provide the missing methods on the context object.
 * @param ruleDefinition - The rule to fix up (object-style with create method or legacy function-style)
 * @returns The fixed-up rule with compatible context methods
 */
function fixupRule(ruleDefinition: FixupRuleDefinition | FixupLegacyRuleDefinition): FixupRuleDefinition;

// Type definitions
type FixupRuleDefinition = {
  create: (context: any) => any;
  meta?: any;
  schema?: any;
};

type FixupLegacyRuleDefinition = (context: any) => any;
```

**Usage Example:**

```javascript
import { fixupRule } from "@eslint/compat";
import myRule from "./local-rule.js";

// Wrap individual rule for compatibility
const compatRule = fixupRule(myRule);

export default compatRule;
```

### Plugin Compatibility

Wraps all rules within an ESLint plugin to provide ESLint v9.x compatibility.

```javascript { .api }
/**
 * Takes the given plugin and creates a new plugin with all of the rules wrapped
 * to provide the missing methods on the context object.
 * @param plugin - The plugin object to fix up (must contain a rules property)
 * @returns The fixed-up plugin with all rules wrapped for compatibility
 */
function fixupPluginRules(plugin: FixupPluginDefinition): FixupPluginDefinition;

// Type definitions
type FixupPluginDefinition = {
  rules?: Record<string, FixupRuleDefinition | FixupLegacyRuleDefinition>;
  [key: string]: any;
};
```

**Usage Example:**

```javascript
import { fixupPluginRules } from "@eslint/compat";
import somePlugin from "eslint-plugin-some-plugin";

export default [
  {
    plugins: {
      somePlugin: fixupPluginRules(somePlugin),
    },
    rules: {
      "somePlugin/rule-name": "error",
    },
  },
];
```

### Configuration Compatibility

Wraps all plugins found in ESLint configuration arrays to provide ESLint v9.x compatibility.

```javascript { .api }
/**
 * Takes the given configuration and creates a new configuration with all of the
 * rules wrapped to provide the missing methods on the context object.
 * @param config - The configuration to fix up (single config object or array of configs)
 * @returns The fixed-up configuration array with all plugin rules wrapped
 */
function fixupConfigRules(config: FixupConfigArray | FixupConfig): FixupConfigArray;

// Type definitions
type FixupConfig = {
  plugins?: Record<string, FixupPluginDefinition>;
  [key: string]: any;
};

type FixupConfigArray = FixupConfig[];
```

**Usage Example:**

```javascript
import { fixupConfigRules } from "@eslint/compat";
import someConfig from "eslint-config-some-config";

export default [
  ...fixupConfigRules(someConfig),
  {
    // your overrides
  },
];
```

### Ignore File Integration

Reads ignore files (like .gitignore) and converts patterns into the correct format for ESLint flat config.

```javascript { .api }
/**
 * Reads an ignore file and returns an object with the ignore patterns.
 * @param ignoreFilePath - The absolute path to the ignore file (e.g., .gitignore, .eslintignore)
 * @param name - Optional descriptive name for the ignore file config (defaults to "Imported .gitignore patterns") 
 * @returns A flat config object with name and ignores array properties
 * @throws Error if the ignore file path is not absolute
 */
function includeIgnoreFile(ignoreFilePath: string, name?: string): FlatConfig;

/**
 * Converts an ESLint ignore pattern to a minimatch pattern.
 * @param pattern - The .eslintignore or .gitignore pattern string to convert (supports negation with !, escaping, etc.)
 * @returns The converted minimatch-compatible pattern string
 */
function convertIgnorePatternToMinimatch(pattern: string): string;

// Type definitions
type FlatConfig = {
  name: string;
  ignores: string[];
};
```

**Usage Example:**

```javascript
import { includeIgnoreFile } from "@eslint/compat";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, ".gitignore");

export default [
  includeIgnoreFile(gitignorePath, "Custom ignore patterns"),
  {
    // your config
  },
];
```

## Error Handling

### fixupRule and fixupPluginRules

These functions handle various edge cases silently:
- If a rule has already been fixed up, returns cached version
- If plugin has no rules property, returns plugin unchanged
- Preserves all original rule metadata and schema information

### includeIgnoreFile

Throws an `Error` if the provided `ignoreFilePath` is not an absolute path:

```javascript
// This will throw an error
includeIgnoreFile("./relative/path/.gitignore"); // Error: The ignore file location must be an absolute path.

// This is correct
includeIgnoreFile(path.resolve(process.cwd(), ".gitignore"));
```

## Compatibility Notes

- **Node.js**: Requires ^18.18.0 || ^20.9.0 || >=21.1.0 (as specified in package.json engines field)
- **ESLint**: Works with ESLint ^8.40 || 9.x (peer dependency, optional)
- **Module Format**: Supports both ESM and CommonJS with dual exports
- **TypeScript**: Includes full type definitions (.d.ts files)

The package specifically addresses the removal of context methods in ESLint v9.x by adding back these methods:
`getSource`, `getSourceLines`, `getAllComments`, `getDeclaredVariables`, `getNodeByRangeIndex`, `getCommentsBefore`, `getCommentsAfter`, `getCommentsInside`, `getJSDocComment`, `getFirstToken`, `getFirstTokens`, `getLastToken`, `getLastTokens`, `getTokenAfter`, `getTokenBefore`, `getTokenByRangeStart`, `getTokens`, `getTokensAfter`, `getTokensBefore`, `getTokensBetween`, `getScope`, `getAncestors`, and `markVariableAsUsed`.

### Context Methods Added Back

The following context methods are automatically added to the context object for compatibility:

```javascript { .api }
/**
 * Gets the scope for the current node during rule execution
 * @returns {Scope} The scope for the current node
 */
context.getScope(): Scope;

/**
 * Gets the ancestors of the current node during rule execution
 * @returns {ASTNode[]} Array of ancestor nodes
 */
context.getAncestors(): ASTNode[];

/**
 * Marks a variable as used in the current scope
 * @param {Variable} variable - The variable to mark as used
 */
context.markVariableAsUsed(variable: Variable): void;
```