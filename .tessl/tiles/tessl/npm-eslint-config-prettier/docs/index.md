# ESLint Config Prettier

ESLint Config Prettier is an ESLint configuration package that disables all formatting rules that might conflict with Prettier, enabling seamless integration between ESLint and Prettier in JavaScript/TypeScript projects. It supports both legacy eslintrc configuration files and the new flat config format, automatically handles various ESLint plugins, and includes a CLI helper tool to identify configuration conflicts.

## Package Information

- **Package Name**: eslint-config-prettier
- **Package Type**: npm
- **Language**: JavaScript
- **Installation**: `npm install --save-dev eslint-config-prettier`

## Core Imports

ESLint configuration (eslintrc):

```json
{
  "extends": ["prettier"]
}
```

Flat config (ESLint 9+):

```javascript
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default [
  // other configs...
  eslintConfigPrettier,
];
```

CommonJS flat config:

```javascript
const eslintConfigPrettier = require("eslint-config-prettier/flat");

module.exports = [
  // other configs...
  eslintConfigPrettier,
];
```

Programmatic access to utilities:

```javascript
// Main configuration object
const eslintConfigPrettier = require("eslint-config-prettier");

// Prettier-specific rules
const prettierRules = require("eslint-config-prettier/prettier");

// CLI helper functions
const { processRules } = require("eslint-config-prettier/bin/cli");

// Rule validators
const validators = require("eslint-config-prettier/bin/validators");
```

## Basic Usage

### Legacy ESLint Configuration

Add to your `.eslintrc.json`:

```json
{
  "extends": [
    "some-other-config-you-use",
    "prettier"
  ]
}
```

### Flat Config (ESLint 9+)

Add to your `eslint.config.js`:

```javascript
import someConfig from "some-other-config-you-use";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default [
  someConfig,
  eslintConfigPrettier,
];
```

### CLI Conflict Detection

Check for conflicting rules:

```bash
npx eslint-config-prettier path/to/main.js
```

## Capabilities

### Main Configuration

The primary ESLint configuration that disables all formatting rules conflicting with Prettier.

```javascript { .api }
/**
 * Main ESLint configuration object with disabled formatting rules
 * Contains hundreds of rules set to either "off" or 0 (special rules)
 */
const eslintConfigPrettier: {
  rules: Record<string, 0 | "off">;
};

module.exports = eslintConfigPrettier;
```

The main configuration includes:
- **Regular rules**: Set to `"off"` - rules that directly conflict with Prettier
- **Special rules**: Set to `0` - rules that can be used with specific options (see Special Rules section)
- **Plugin rules**: Rules from various ESLint plugins that conflict with Prettier formatting

**Usage in eslintrc:**

```json
{
  "extends": ["prettier"]
}
```

**Programmatic usage:**

```javascript
const eslintConfigPrettier = require("eslint-config-prettier");
console.log(Object.keys(eslintConfigPrettier.rules).length);
// 300+ rules (depending on ESLINT_CONFIG_PRETTIER_NO_DEPRECATED setting)
```

### Flat Config

ESLint flat config version with name property for better tooling integration.

```javascript { .api }
/**
 * Flat config version with name property
 */
const eslintConfigPrettierFlat: {
  name: "config-prettier";
  rules: Record<string, 0 | "off">;
};

export = eslintConfigPrettierFlat;
```

**Usage:**

```javascript
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default [
  eslintConfigPrettier,
];
```

### Prettier-Specific Rules

Additional rules that can cause issues when using eslint-plugin-prettier.

```javascript { .api }
/**
 * Rules that may conflict with eslint-plugin-prettier
 * These are safe to use as long as the "prettier/prettier" rule from
 * eslint-plugin-prettier isn't enabled
 */
const prettierRules: {
  rules: {
    "arrow-body-style": 0;
    "prefer-arrow-callback": 0;
  };
};

module.exports = prettierRules;
```

The prettier rules configuration disables:
- `arrow-body-style`: Controls arrow function body style (set to 0 as special rule)
- `prefer-arrow-callback`: Prefers arrow functions as callbacks (set to 0 as special rule)

These rules use `0` instead of `"off"` to indicate they are special rules that _can_ be used safely in specific situations.

**Usage:**

```javascript
const prettierRules = require("eslint-config-prettier/prettier");
console.log(prettierRules.rules);
// { "arrow-body-style": 0, "prefer-arrow-callback": 0 }
```

### CLI Helper Tool

Command-line tool for detecting ESLint rules that conflict with Prettier.

```javascript { .api }
/**
 * Process ESLint rules and detect conflicts with Prettier
 * @param configRules - Array of [ruleName, value, source] tuples from ESLint config
 * @returns Object with stdout, stderr messages and exit code
 */
function processRules(configRules: Array<[string, any, string]>): {
  stdout?: string;
  stderr?: string;
  code: 0 | 1 | 2;
};
```

**Programmatic Usage:**

```javascript
const { processRules } = require("eslint-config-prettier/bin/cli");

// Example rule configuration
const configRules = [
  ["indent", ["error", 2], "src/config.js"],
  ["quotes", ["error", "single"], "src/config.js"]
];

const result = processRules(configRules);
console.log(result);
// { stdout: "...", code: 2 }
```

**Command Usage:**

```bash
# Check single file
npx eslint-config-prettier index.js

# Check multiple files
npx eslint-config-prettier index.js test/index.js src/app.js

# With environment variables
ESLINT_USE_FLAT_CONFIG=true npx eslint-config-prettier index.js
ESLINT_CONFIG_PRETTIER_NO_DEPRECATED=true npx eslint-config-prettier index.js
```

**Exit Codes:**
- `0`: No problems found
- `1`: General error
- `2`: Conflicting rules found

### Rule Validators

Validation functions for special rules that require specific configuration options.

```javascript { .api }
/**
 * Validator functions for special ESLint rules
 * Module export from eslint-config-prettier/bin/validators
 */
const validators: {
  /**
   * Validates curly brace rule options
   * @param config - Object containing options array from ESLint rule config
   * @returns true if config is compatible with Prettier
   */
  curly(config: { options: any[] }): boolean;
  
  /**
   * Validates lines-around-comment rule options
   * @param config - Object containing options array from ESLint rule config
   * @returns true if config is compatible with Prettier
   */
  "lines-around-comment"(config: { options: any[] }): boolean;
  
  /**
   * Validates no-confusing-arrow rule options
   * @param config - Object containing options array from ESLint rule config
   * @returns true if config is compatible with Prettier
   */
  "no-confusing-arrow"(config: { options: any[] }): boolean;
  
  /**
   * Validates no-tabs rule options
   * @param config - Object containing options array from ESLint rule config
   * @returns true if config is compatible with Prettier
   */
  "no-tabs"(config: { options: any[] }): boolean;
  
  /**
   * Validates unicorn/template-indent rule options
   * @param config - Object containing options array from ESLint rule config
   * @returns true if config is compatible with Prettier
   */
  "unicorn/template-indent"(config: { options: any[] }): boolean;
  
  /**
   * Validates vue/html-self-closing rule options
   * @param config - Object containing options array from ESLint rule config
   * @returns true if config is compatible with Prettier
   */
  "vue/html-self-closing"(config: { options: any[] }): boolean;
};

module.exports = validators;
```

**Programmatic Usage:**

```javascript
const validators = require("eslint-config-prettier/bin/validators");

// Validate a curly rule configuration
const curlyConfig = { options: ["all"] };
const isCompatible = validators.curly(curlyConfig);
console.log(isCompatible); // true

// Validate lines-around-comment rule
const commentConfig = { 
  options: [{ 
    allowBlockStart: true, 
    allowBlockEnd: true,
    allowObjectStart: true,
    allowObjectEnd: true,
    allowArrayStart: true,
    allowArrayEnd: true
  }] 
};
const isCommentCompatible = validators["lines-around-comment"](commentConfig);
console.log(isCommentCompatible); // true
```

## Supported Plugins

ESLint Config Prettier automatically handles formatting rules from these plugins:

- **@babel/eslint-plugin**: Babel-specific ESLint rules
- **@stylistic/eslint-plugin**: Stylistic formatting rules (new ESLint stylistic plugin)
- **@typescript-eslint/eslint-plugin**: TypeScript-specific ESLint rules
- **eslint-plugin-babel**: Legacy Babel ESLint plugin
- **eslint-plugin-flowtype**: Flow type checking rules
- **eslint-plugin-react**: React-specific ESLint rules
- **eslint-plugin-standard**: JavaScript Standard Style rules
- **eslint-plugin-unicorn**: Various awesome ESLint rules
- **eslint-plugin-vue**: Vue.js-specific ESLint rules

## Environment Variables

### ESLINT_CONFIG_PRETTIER_NO_DEPRECATED

Excludes deprecated ESLint rules from the configuration when set to any non-empty value.

```bash
# Exclude deprecated rules
ESLINT_CONFIG_PRETTIER_NO_DEPRECATED=true npx eslint-config-prettier index.js
```

### ESLINT_USE_FLAT_CONFIG

Controls which ESLint configuration format the CLI tool uses:

```bash
# Force flat config
ESLINT_USE_FLAT_CONFIG=true npx eslint-config-prettier index.js

# Force legacy config
ESLINT_USE_FLAT_CONFIG=false npx eslint-config-prettier index.js

# Auto-detect (default)
npx eslint-config-prettier index.js
```

## Special Rules

Some rules require special attention and can be enabled with specific configurations:

### curly

Can be used with options other than "multi-line" or "multi-or-nest":

```json
{
  "rules": {
    "curly": ["error", "all"]
  }
}
```

### lines-around-comment

Can be used with specific allow options:

```json
{
  "rules": {
    "lines-around-comment": ["error", {
      "allowBlockStart": true,
      "allowBlockEnd": true,
      "allowObjectStart": true,
      "allowObjectEnd": true,
      "allowArrayStart": true,
      "allowArrayEnd": true
    }]
  }
}
```

### no-confusing-arrow

Can be used with `allowParens: false`:

```json
{
  "rules": {
    "no-confusing-arrow": ["error", { "allowParens": false }]
  }
}
```

### no-tabs

Can be used with `allowIndentationTabs: true`:

```json
{
  "rules": {
    "no-tabs": ["error", { "allowIndentationTabs": true }]
  }
}
```

## Error Handling

The CLI tool provides structured error reporting:

- **Regular conflicts**: Rules that directly conflict with Prettier formatting
- **Options conflicts**: Rules enabled with options that may conflict
- **Special rule warnings**: Rules that require manual verification
- **Prettier plugin conflicts**: Rules that conflict when using eslint-plugin-prettier

## Advanced Usage

### Multiple Configuration Files

For projects with different ESLint configurations for different file types:

```bash
npx eslint-config-prettier src/index.js test/index.js config/webpack.js
```

### Integration with eslint-plugin-prettier

When using both packages together:

```json
{
  "extends": [
    "some-config",
    "plugin:prettier/recommended"
  ]
}
```

The `plugin:prettier/recommended` configuration includes eslint-config-prettier automatically.