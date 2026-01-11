# Configuration Helpers

ESLint provides configuration helper functions to assist with creating and managing ESLint configurations with type safety and validation. These utilities help ensure configuration correctness and provide better developer experience.

## Capabilities

### defineConfig Function

Creates an ESLint configuration with type safety and validation support.

```javascript { .api }
/**
 * Define an ESLint configuration with type safety
 * @param config - ESLint configuration object or array
 * @returns The same configuration with type safety applied
 */
function defineConfig(config: Config | Config[]): Config | Config[];

interface Config {
  /** Configuration identifier for debugging */
  name?: string;
  /** File patterns this config applies to */
  files?: string[];
  /** File patterns to ignore */
  ignores?: string[];
  /** Language-specific configuration */
  languageOptions?: LanguageOptions;
  /** Linter behavior configuration */
  linterOptions?: LinterOptions;
  /** Code processor */
  processor?: string | Processor;
  /** Plugin definitions */
  plugins?: Record<string, Plugin>;
  /** Rule configurations */
  rules?: Record<string, RuleConfig>;
  /** Shared settings for rules */
  settings?: Record<string, any>;
}
```

**Usage Examples:**

```javascript
import { defineConfig } from "eslint/config";

// Single configuration
export default defineConfig({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module"
  },
  rules: {
    "no-unused-vars": "error",
    "prefer-const": "warn"
  }
});

// Multiple configurations
export default defineConfig([
  {
    name: "base-config",
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        window: "readonly",
        document: "readonly"
      }
    }
  },
  {
    name: "typescript-files",
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: "@typescript-eslint/parser"
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "error"
    }
  }
]);

// With plugins and processors
export default defineConfig({
  plugins: {
    react: reactPlugin,
    "@typescript-eslint": typescriptPlugin
  },
  processor: "react/jsx",
  rules: {
    "react/jsx-uses-react": "error",
    "@typescript-eslint/no-explicit-any": "warn"
  }
});
```

### globalIgnores Function

Creates a configuration object for global ignore patterns.

```javascript { .api }
/**
 * Create a global ignore configuration
 * @param patterns - Array of glob patterns to ignore globally
 * @returns Configuration object with global ignore patterns
 */
function globalIgnores(patterns: string[]): Config;
```

**Usage Examples:**

```javascript
import { defineConfig, globalIgnores } from "eslint/config";

// Basic global ignores
export default defineConfig([
  globalIgnores([
    "node_modules/**",
    "dist/**",
    "build/**",
    "*.min.js"
  ]),
  {
    rules: {
      "no-unused-vars": "error"
    }
  }
]);

// Combined with other configurations
export default defineConfig([
  // Global ignores first
  globalIgnores([
    "coverage/**",
    "tmp/**",
    "*.generated.js"
  ]),
  
  // Base configuration
  {
    name: "base",
    languageOptions: {
      ecmaVersion: 2022
    }
  },
  
  // Specific file configurations
  {
    name: "test-files",
    files: ["**/*.test.js"],
    rules: {
      "no-console": "off"
    }
  }
]);
```

## Configuration Types

```javascript { .api }
interface LanguageOptions {
  /** ECMAScript version to support */
  ecmaVersion?: EcmaVersion;
  /** JavaScript source type */
  sourceType?: "script" | "module" | "commonjs";
  /** Global variables */
  globals?: Record<string, GlobalConfig>;
  /** Custom parser */
  parser?: Parser;
  /** Parser-specific options */
  parserOptions?: Object;
}

interface LinterOptions {
  /** Disable inline configuration comments */
  noInlineConfig?: boolean;
  /** Report unused disable directives */
  reportUnusedDisableDirectives?: boolean | Severity | StringSeverity;
  /** Report unused inline configs */
  reportUnusedInlineConfigs?: boolean | Severity | StringSeverity;
}

type EcmaVersion = 3 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 | 2026 | "latest";

type GlobalConfig = boolean | "off" | "readable" | "readonly" | "writable" | "writeable";

type RuleConfig = RuleSeverity | [RuleSeverity, ...any[]];
type RuleSeverity = "off" | "warn" | "error" | 0 | 1 | 2;
type Severity = 0 | 1 | 2;
type StringSeverity = "off" | "warn" | "error";

interface Parser {
  /** Parse source code into AST */
  parse?(text: string, options?: any): Program;
  /** Parse with additional services */
  parseForESLint?(text: string, options?: any): ESLintParseResult;
  /** Parser metadata */
  meta?: {
    name?: string;
    version?: string;
  };
}

interface ESLintParseResult {
  /** Parsed AST */
  ast: Program;
  /** Parser services */
  services?: any;
  /** Scope manager */
  scopeManager?: any;
  /** Visitor keys */
  visitorKeys?: Record<string, string[]>;
}

interface Processor {
  /** Process code before linting */
  preprocess?(text: string, filename: string): string[] | ProcessorFile[];
  /** Process messages after linting */
  postprocess?(messages: LintMessage[][], filename: string): LintMessage[];
  /** Whether processor supports autofix */
  supportsAutofix?: boolean;
  /** Processor metadata */
  meta?: {
    name?: string;
    version?: string;
  };
}

interface ProcessorFile {
  /** File content */
  text: string;
  /** Virtual filename */
  filename: string;
}

interface Plugin {
  /** Plugin metadata */
  meta?: {
    name?: string;
    version?: string;
    namespace?: string;
  };
  /** Plugin configurations */
  configs?: Record<string, Config | Config[]>;
  /** Plugin rules */
  rules?: Record<string, RuleDefinition>;
  /** Plugin processors */
  processors?: Record<string, Processor>;
  /** Plugin environments (legacy) */
  environments?: Record<string, Environment>;
}

interface Environment {
  /** Global variables provided by environment */
  globals?: Record<string, GlobalConfig>;
  /** Parser options for environment */
  parserOptions?: Object;
}
```

## Advanced Configuration Patterns

### File-Specific Configurations

```javascript
import { defineConfig } from "eslint/config";

export default defineConfig([
  // Base configuration for all files
  {
    name: "base",
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module"
    },
    rules: {
      "no-unused-vars": "error"
    }
  },
  
  // Configuration for TypeScript files
  {
    name: "typescript",
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json"
      }
    },
    plugins: {
      "@typescript-eslint": typescriptPlugin
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error"
    }
  },
  
  // Configuration for test files
  {
    name: "tests",
    files: ["**/*.test.{js,ts}", "**/*.spec.{js,ts}"],
    languageOptions: {
      globals: {
        describe: "readonly",
        it: "readonly",
        expect: "readonly"
      }
    },
    rules: {
      "no-console": "off"
    }
  }
]);
```

### Environment-Specific Configurations

```javascript
import { defineConfig } from "eslint/config";

export default defineConfig([
  // Node.js environment
  {
    name: "node",
    files: ["server/**/*.js", "scripts/**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly"
      }
    }
  },
  
  // Browser environment
  {
    name: "browser",
    files: ["src/**/*.js", "public/**/*.js"],
    languageOptions: {
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly"
      }
    }
  }
]);
```

### Plugin Integration

```javascript
import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import react from "eslint-plugin-react";

export default defineConfig([
  // Use recommended configurations
  js.configs.recommended,
  
  // Custom configuration with plugins
  {
    name: "custom-with-plugins",
    plugins: {
      "@typescript-eslint": typescript,
      react: react
    },
    rules: {
      // JavaScript rules
      "no-console": "warn",
      "prefer-const": "error",
      
      // TypeScript rules
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      
      // React rules
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error"
    }
  }
]);
```

### Processor Usage

```javascript
import { defineConfig } from "eslint/config";
import markdown from "eslint-plugin-markdown";

export default defineConfig([
  {
    name: "markdown-processor",
    files: ["**/*.md"],
    plugins: {
      markdown: markdown
    },
    processor: "markdown/markdown",
    rules: {
      "no-console": "off",
      "no-unused-vars": "off"
    }
  }
]);
```

## Migration from Legacy Configuration

```javascript
// Legacy .eslintrc.js
module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module"
  },
  rules: {
    "no-unused-vars": "error"
  }
};

// New flat config equivalent
import { defineConfig } from "eslint/config";
import js from "@eslint/js";

export default defineConfig([
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "error"
    }
  }
]);
```