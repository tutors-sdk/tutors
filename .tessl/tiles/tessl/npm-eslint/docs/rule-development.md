# Rule Development and Testing

The RuleTester class provides a comprehensive framework for developing and testing custom ESLint rules. It integrates with test frameworks like Mocha, Jest, and others to provide structured testing with detailed reporting and validation.

## Capabilities

### RuleTester Constructor

Creates a new RuleTester instance with default configuration.

```javascript { .api }
/**
 * Creates a new RuleTester instance
 * @param config - Default configuration for all tests
 */
constructor(config?: Object);
```

**Usage Examples:**

```javascript
import { RuleTester } from "eslint";

// Basic rule tester
const ruleTester = new RuleTester();

// With default configuration
const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module"
  }
});

// With parser configuration
const ruleTester = new RuleTester({
  languageOptions: {
    parser: require("@typescript-eslint/parser"),
    parserOptions: {
      project: "./tsconfig.json"
    }
  }
});
```

### Static Properties

Test framework integration properties that can be customized.

```javascript { .api }
/** Test framework describe function (default: global.describe) */
static describe: Function | null;

/** Test framework it function (default: global.it) */
static it: Function | null;

/** Test framework it.only function (default: global.it.only) */
static itOnly: Function | null;
```

**Usage Examples:**

```javascript
// Custom test framework integration
import { RuleTester } from "eslint";
import * as mocha from "mocha";

RuleTester.describe = mocha.describe;
RuleTester.it = mocha.it;
RuleTester.itOnly = mocha.it.only;

// Disable test framework integration
RuleTester.describe = null;
RuleTester.it = null;
RuleTester.itOnly = null;
```

### Rule Testing

Run comprehensive tests for a rule with valid and invalid test cases.

```javascript { .api }
/**
 * Run tests for a rule
 * @param name - Rule name for test reporting
 * @param rule - Rule implementation to test
 * @param tests - Test cases to run
 */
run(
  name: string,
  rule: RuleDefinition,
  tests: {
    valid: Array<string | ValidTestCase>;
    invalid: InvalidTestCase[];
  }
): void;

interface ValidTestCase {
  /** Test case name for reporting */
  name?: string;
  /** Source code that should not trigger rule */
  code: string;
  /** Rule options to use */
  options?: any[];
  /** Filename for the code */
  filename?: string;
  /** Run only this test case */
  only?: boolean;
  /** Language options for parsing */
  languageOptions?: LanguageOptions;
  /** Settings object */
  settings?: Record<string, any>;
}

interface InvalidTestCase extends ValidTestCase {
  /** Expected errors (count or detailed error objects) */
  errors: number | Array<TestCaseError | string>;
  /** Expected fixed output (null means no fix expected) */
  output?: string | null;
}

interface TestCaseError {
  /** Expected error message */
  message?: string | RegExp;
  /** Expected message ID */
  messageId?: string;
  /** Expected AST node type */
  type?: string;
  /** Expected template data */
  data?: any;
  /** Expected line number (1-based) */
  line?: number;
  /** Expected column number (1-based) */
  column?: number;
  /** Expected end line number (1-based) */
  endLine?: number;
  /** Expected end column number (1-based) */
  endColumn?: number;
  /** Expected suggestions */
  suggestions?: SuggestionTestCase[];
}

interface SuggestionTestCase {
  /** Expected suggestion description */
  desc?: string;
  /** Expected suggestion message ID */
  messageId?: string;
  /** Expected template data */
  data?: Record<string, unknown>;
  /** Expected output after applying suggestion */
  output: string;
}
```

**Usage Examples:**

```javascript
import { RuleTester } from "eslint";

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022 }
});

// Example rule implementation
const noVarRule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "disallow var declarations"
    },
    fixable: "code",
    messages: {
      unexpectedVar: "Unexpected var, use let or const instead."
    }
  },
  create(context) {
    return {
      VariableDeclaration(node) {
        if (node.kind === "var") {
          context.report({
            node,
            messageId: "unexpectedVar",
            fix(fixer) {
              return fixer.replaceText(node, node.raw.replace("var", "let"));
            }
          });
        }
      }
    };
  }
};

// Run tests
ruleTester.run("no-var", noVarRule, {
  valid: [
    "let x = 1;",
    "const y = 2;",
    {
      code: "let z = 3;",
      name: "let declaration is valid"
    }
  ],
  invalid: [
    {
      code: "var x = 1;",
      output: "let x = 1;",
      errors: [{
        messageId: "unexpectedVar",
        type: "VariableDeclaration",
        line: 1,
        column: 1
      }]
    },
    {
      code: "var a = 1, b = 2;",
      output: "let a = 1, b = 2;",
      errors: 1
    }
  ]
});
```

### Configuration Management

Static methods for managing default test configuration.

```javascript { .api }
/**
 * Set default configuration for all rule testers
 * @param config - Default configuration object
 */
static setDefaultConfig(config: Object): void;

/**
 * Get the current default configuration
 * @returns Current default configuration object
 */
static getDefaultConfig(): Object;

/**
 * Reset default configuration to initial state
 */
static resetDefaultConfig(): void;
```

**Usage Examples:**

```javascript
import { RuleTester } from "eslint";

// Set global default config
RuleTester.setDefaultConfig({
  languageOptions: {
    ecmaVersion: 2023,
    sourceType: "module"
  }
});

// Get current config
const currentConfig = RuleTester.getDefaultConfig();

// Reset to original defaults
RuleTester.resetDefaultConfig();
```

### Test Case Filtering

Mark specific test cases to run exclusively.

```javascript { .api }
/**
 * Mark a test case to run exclusively (only this test will run)
 * @param item - Test case to mark as only
 * @returns Modified test case with only flag
 */
static only(
  item: string | ValidTestCase | InvalidTestCase
): ValidTestCase | InvalidTestCase;
```

**Usage Examples:**

```javascript
// Focus on specific test case
ruleTester.run("my-rule", rule, {
  valid: [
    "normal test",
    RuleTester.only("focused test"), // Only this will run
    "another normal test"
  ],
  invalid: [
    {
      code: "invalid code",
      errors: 1
    }
  ]
});

// Focus on invalid test case
ruleTester.run("my-rule", rule, {
  valid: ["valid code"],
  invalid: [
    RuleTester.only({
      code: "focused invalid test",
      errors: 1
    })
  ]
});
```

## Advanced Testing Patterns

### Testing with Different Language Options

```javascript
// Test with different ECMAScript versions
ruleTester.run("my-rule", rule, {
  valid: [
    {
      code: "const x = 1;",
      languageOptions: { ecmaVersion: 2015 }
    },
    {
      code: "let x = 1;",
      languageOptions: { ecmaVersion: 2020 }
    }
  ],
  invalid: []
});

// Test with different source types
ruleTester.run("my-rule", rule, {
  valid: [
    {
      code: "import x from 'module';",
      languageOptions: { sourceType: "module" }
    },
    {
      code: "const x = require('module');",
      languageOptions: { sourceType: "commonjs" }
    }
  ],
  invalid: []
});
```

### Testing with Rule Options

```javascript
ruleTester.run("configurable-rule", rule, {
  valid: [
    {
      code: "console.log('hello');",
      options: [{ allowConsole: true }]
    }
  ],
  invalid: [
    {
      code: "console.log('hello');",
      options: [{ allowConsole: false }],
      errors: [{ messageId: "noConsole" }]
    }
  ]
});
```

### Testing Suggestions

```javascript
ruleTester.run("rule-with-suggestions", rule, {
  valid: ["valid code"],
  invalid: [
    {
      code: "problematic code",
      errors: [{
        messageId: "problemFound",
        suggestions: [
          {
            messageId: "suggestion1",
            output: "fixed code option 1"
          },
          {
            messageId: "suggestion2", 
            output: "fixed code option 2"
          }
        ]
      }]
    }
  ]
});
```

### Testing Complex Error Locations

```javascript
ruleTester.run("precise-location-rule", rule, {
  valid: [],
  invalid: [
    {
      code: `
        function test() {
          var problematic = 'issue here';
        }
      `,
      errors: [{
        message: "Problematic code found",
        line: 3,
        column: 11,
        endLine: 3,
        endColumn: 22
      }]
    }
  ]
});
```

## Rule Definition Types

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

interface RuleContext {
  /** Get rule options */
  options: any[];
  /** Get filename being linted */
  filename: string;
  /** Get source code object */
  sourceCode: SourceCode;
  /** Report a problem */
  report(descriptor: ReportDescriptor): void;
  /** Get rule settings */
  settings: Record<string, any>;
  /** Get physical filename */
  physicalFilename: string;
  /** Get current working directory */
  cwd: string;
}

interface RuleListener {
  /** Node visitor methods */
  [key: string]: ((node: any) => void) | undefined;
}

interface ReportDescriptor {
  /** Node or location to report */
  node?: any;
  loc?: SourceLocation;
  /** Error message or message ID */
  message?: string;
  messageId?: string;
  /** Template data for message */
  data?: Record<string, any>;
  /** Fix function */
  fix?: (fixer: RuleFixer) => Fix | Fix[] | null;
  /** Suggestion functions */
  suggest?: SuggestionDescriptor[];
}

interface SuggestionDescriptor {
  /** Suggestion description or message ID */
  desc?: string;
  messageId?: string;
  /** Template data */
  data?: Record<string, any>;
  /** Fix function for suggestion */
  fix: (fixer: RuleFixer) => Fix | Fix[] | null;
}
```