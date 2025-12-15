# ESLint Rules Types

ESLint provides comprehensive TypeScript definitions for all built-in rules through the `eslint/rules` export. These type definitions enable type-safe rule configuration and provide IntelliSense support for rule options in TypeScript projects.

## Capabilities

### ESLintRules Interface

Complete type definitions for all ESLint rules with their configuration options.

```typescript { .api }
/**
 * Complete interface containing type definitions for all ESLint rules
 * Extends Linter.RulesRecord with specific rule configuration types
 */
interface ESLintRules extends Linter.RulesRecord {
  // 330+ individual rule definitions with typed options
  "no-unused-vars": Linter.RuleEntry<[{
    vars?: "all" | "local";
    args?: "all" | "after-used" | "none";
    ignoreRestSiblings?: boolean;
    argsIgnorePattern?: string;
    varsIgnorePattern?: string;
    caughtErrors?: "all" | "none";
    caughtErrorsIgnorePattern?: string;
    destructuredArrayIgnorePattern?: string;
  }]>;
  
  "prefer-const": Linter.RuleEntry<[{
    destructuring?: "any" | "all";
    ignoreReadBeforeAssign?: boolean;
  }]>;
  
  // ... 328+ more rule definitions
}
```

**Usage Examples:**

```typescript
import type { ESLintRules } from "eslint/rules";

// Type-safe rule configuration
const rules: Partial<ESLintRules> = {
  "no-unused-vars": ["error", {
    vars: "local",
    args: "after-used",
    ignoreRestSiblings: true
  }],
  "prefer-const": ["warn", {
    destructuring: "all",
    ignoreReadBeforeAssign: false
  }],
  "semi": ["error", "always"]
};

// Use in ESLint configuration
export default {
  rules: rules
} satisfies Config;
```

### Individual Rule Types

Access specific rule option types for advanced usage.

```typescript { .api }
// Rule entry type for any ESLint rule
type RuleEntry<Options extends readonly unknown[]> = 
  | Linter.RuleSeverity
  | [Linter.RuleSeverity, ...Options];

// Rule severity levels
type RuleSeverity = "off" | "warn" | "error" | 0 | 1 | 2;
```

**Usage Examples:**

```typescript
import type { ESLintRules, Linter } from "eslint/rules";

// Extract specific rule type
type NoUnusedVarsOptions = ESLintRules["no-unused-vars"];
type PreferConstOptions = ESLintRules["prefer-const"];

// Create type-safe rule configurations
const noUnusedVarsConfig: NoUnusedVarsOptions = ["error", {
  vars: "all",
  args: "after-used"
}];

// Helper function for rule configuration
function createRuleConfig<K extends keyof ESLintRules>(
  ruleName: K,
  config: ESLintRules[K]
): Record<K, ESLintRules[K]> {
  return { [ruleName]: config } as Record<K, ESLintRules[K]>;
}

// Usage
const semiConfig = createRuleConfig("semi", ["error", "always"]);
```

## Rule Categories

### Problem Rules
Rules that identify potential errors or problematic code patterns:

```typescript
// Example problem rules with their types
const problemRules: Partial<ESLintRules> = {
  "no-unused-vars": ["error", { vars: "all" }],
  "no-undef": "error",
  "no-unreachable": "error",
  "array-callback-return": ["error", { allowImplicit: true }],
  "no-constant-condition": ["error", { checkLoops: false }]
};
```

### Suggestion Rules
Rules that suggest alternative approaches or best practices:

```typescript
// Example suggestion rules with their types
const suggestionRules: Partial<ESLintRules> = {
  "prefer-const": ["warn", { destructuring: "any" }],
  "no-var": "error",
  "prefer-arrow-callback": ["warn", { allowNamedFunctions: false }],
  "object-shorthand": ["warn", "always", { ignoreConstructors: false }],
  "prefer-template": "warn"
};
```

### Layout Rules (Deprecated)
Formatting rules that are being moved to @stylistic/eslint-plugin:

```typescript
// Many layout rules are now deprecated
const layoutRules: Partial<ESLintRules> = {
  "semi": ["error", "always"],
  "quotes": ["error", "double", { avoidEscape: true }],
  "indent": ["error", 2, { SwitchCase: 1 }],
  "comma-dangle": ["error", "never"]
};
```

## Advanced Type Usage

### Rule Configuration Validation

```typescript
import type { ESLintRules } from "eslint/rules";

// Utility type to validate rule configuration
type ValidateRules<T> = {
  [K in keyof T]: K extends keyof ESLintRules ? ESLintRules[K] : never;
};

// Usage
const validatedRules: ValidateRules<{
  "no-unused-vars": ["error", { vars: "all" }];
  "prefer-const": ["warn"];
  // "invalid-rule": "error"; // TypeScript error - not a valid rule
}> = {
  "no-unused-vars": ["error", { vars: "all" }],
  "prefer-const": ["warn"]
};
```

### Plugin Rule Integration

```typescript
import type { ESLintRules } from "eslint/rules";

// Extend ESLintRules for plugin rules
interface AllRules extends ESLintRules {
  "@typescript-eslint/no-unused-vars": Linter.RuleEntry<[{
    vars?: "all" | "local";
    args?: "all" | "after-used" | "none";
  }]>;
  "react/jsx-uses-react": Linter.RuleEntry<[]>;
}

const config: { rules: Partial<AllRules> } = {
  rules: {
    // ESLint core rules
    "no-unused-vars": "off",
    "prefer-const": "error",
    
    // Plugin rules
    "@typescript-eslint/no-unused-vars": ["error", { vars: "all" }],
    "react/jsx-uses-react": "error"
  }
};
```

### Rule Option Extraction

```typescript
import type { ESLintRules } from "eslint/rules";

// Extract options type for a specific rule
type ExtractRuleOptions<T extends keyof ESLintRules> = 
  ESLintRules[T] extends Linter.RuleEntry<infer Options> ? Options : never;

// Usage
type NoUnusedVarsOptionsArray = ExtractRuleOptions<"no-unused-vars">;
type PreferConstOptionsArray = ExtractRuleOptions<"prefer-const">;

// Get first option object type
type NoUnusedVarsFirstOption = NoUnusedVarsOptionsArray extends readonly [infer First, ...any[]] ? First : never;
```

## Configuration Examples

### Strict Configuration

```typescript
import type { ESLintRules } from "eslint/rules";

const strictRules: Partial<ESLintRules> = {
  // Error on all problems
  "no-unused-vars": ["error", {
    vars: "all",
    args: "all",
    ignoreRestSiblings: false
  }],
  "no-undef": "error",
  "no-unreachable": "error",
  
  // Enforce best practices
  "prefer-const": ["error", {
    destructuring: "all",
    ignoreReadBeforeAssign: false
  }],
  "no-var": "error",
  "eqeqeq": ["error", "always"],
  
  // Code style (where not deprecated)
  "semi": ["error", "always"],
  "quotes": ["error", "double"]
};
```

### Permissive Configuration

```typescript
const permissiveRules: Partial<ESLintRules> = {
  // Warn on common issues
  "no-unused-vars": ["warn", {
    vars: "local",
    args: "after-used",
    ignoreRestSiblings: true,
    argsIgnorePattern: "^_"
  }],
  "no-console": "warn",
  
  // Allow flexible code styles
  "prefer-const": "off",
  "no-var": "warn",
  "eqeqeq": ["warn", "smart"]
};
```

### Migration Helper

```typescript
// Helper to migrate from string rules to typed rules
function migrateRules(
  oldRules: Record<string, string | [string, ...any[]]>
): Partial<ESLintRules> {
  const newRules: Partial<ESLintRules> = {};
  
  for (const [ruleName, config] of Object.entries(oldRules)) {
    if (ruleName in ({} as ESLintRules)) {
      (newRules as any)[ruleName] = config;
    }
  }
  
  return newRules;
}

// Usage
const legacyRules = {
  "no-unused-vars": "error",
  "prefer-const": ["warn", { destructuring: "all" }],
  "some-plugin-rule": "error" // Won't be included
};

const typedRules = migrateRules(legacyRules);
```

## Type Definitions

```typescript { .api }
interface Linter {
  interface RulesRecord {
    [name: string]: RuleEntry<any>;
  }
  
  type RuleEntry<Options extends readonly unknown[]> = 
    | RuleSeverity
    | [RuleSeverity, ...Options];
    
  type RuleSeverity = "off" | "warn" | "error" | 0 | 1 | 2;
}

// All ESLint rule names as union type
type ESLintRuleName = keyof ESLintRules;

// Union of all possible rule configurations
type AnyRuleConfig = ESLintRules[ESLintRuleName];
```

## Migration from @types/eslint

If you were previously using `@types/eslint`, you can migrate to the official types:

```typescript
// Old approach
import { Linter } from "@types/eslint";

// New approach
import { Linter } from "eslint";
import type { ESLintRules } from "eslint/rules";

// The ESLintRules interface provides the same functionality
// as the old @types/eslint Rules interface
```

This provides complete type safety for all 330+ built-in ESLint rules with their specific configuration options, enabling better IDE support and compile-time validation of ESLint configurations.