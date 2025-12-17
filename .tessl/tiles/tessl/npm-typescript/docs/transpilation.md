# Transpilation

Simple and fast TypeScript-to-JavaScript conversion without full type checking. Ideal for build tools and development servers that need quick compilation.

## Capabilities

### Module Transpilation

Transpile a single TypeScript module to JavaScript.

```typescript { .api }
/**
 * Transpile a TypeScript module to JavaScript
 * @param input - TypeScript source code
 * @param transpileOptions - Transpilation options
 * @returns Transpiled JavaScript output with diagnostics
 */
function transpileModule(input: string, transpileOptions: TranspileOptions): TranspileOutput;

interface TranspileOptions {
  compilerOptions?: CompilerOptions;
  fileName?: string;
  reportDiagnostics?: boolean;
  moduleName?: string;
  renamedDependencies?: MapLike<string>;
  transformers?: CustomTransformers;
}

interface TranspileOutput {
  outputText: string;
  diagnostics?: Diagnostic[];
  sourceMapText?: string;
}
```

**Usage Examples:**

```typescript
import * as ts from "typescript";

// Basic transpilation
const result = ts.transpileModule(`
  interface User {
    name: string;
    age: number;
  }
  
  const user: User = { name: "Alice", age: 30 };
  const greeting = \`Hello, \${user.name}!\`;
  console.log(greeting);
`, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES5,
    sourceMap: true
  }
});

console.log("JavaScript output:");
console.log(result.outputText);
console.log("Source map:");
console.log(result.sourceMapText);

// Transpile with JSX
const jsxResult = ts.transpileModule(`
  import React from 'react';
  
  interface Props {
    name: string;
  }
  
  const Greeting: React.FC<Props> = ({ name }) => {
    return <div>Hello, {name}!</div>;
  };
  
  export default Greeting;
`, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2018,
    jsx: ts.JsxEmit.React,
    esModuleInterop: true
  },
  fileName: "Greeting.tsx"
});

console.log(jsxResult.outputText);
```

### Simple Transpilation

Transpile TypeScript code with minimal configuration.

```typescript { .api }
/**
 * Simple TypeScript to JavaScript transpilation
 * @param input - TypeScript source code
 * @param compilerOptions - Optional compiler options
 * @param fileName - Optional file name for diagnostics
 * @param diagnostics - Optional array to receive diagnostics
 * @param moduleName - Optional module name
 * @returns JavaScript output text
 */
function transpile(
  input: string,
  compilerOptions?: CompilerOptions,
  fileName?: string,
  diagnostics?: Diagnostic[],
  moduleName?: string
): string;
```

**Usage Examples:**

```typescript
import * as ts from "typescript";

// Simple transpilation with minimal options
const jsCode = ts.transpile(`
  enum Color {
    Red = "red",
    Green = "green",
    Blue = "blue"
  }
  
  function paintHouse(color: Color): string {
    return \`The house is painted \${color}\`;
  }
  
  console.log(paintHouse(Color.Blue));
`, {
  target: ts.ScriptTarget.ES2015,
  module: ts.ModuleKind.CommonJS
});

console.log(jsCode);

// With diagnostics collection
const diagnostics: ts.Diagnostic[] = [];
const result = ts.transpile(`
  let message: string = 42; // Type error
  console.log(message);
`, {
  target: ts.ScriptTarget.ES2018
}, "example.ts", diagnostics);

if (diagnostics.length > 0) {
  console.log("Transpilation diagnostics:");
  diagnostics.forEach(diag => {
    console.log(ts.flattenDiagnosticMessageText(diag.messageText, '\n'));
  });
}
```

### Transpilation with Custom Transformers

Apply custom AST transformations during transpilation.

```typescript { .api }
interface TranspileOptions {
  compilerOptions?: CompilerOptions;
  fileName?: string;
  reportDiagnostics?: boolean;
  moduleName?: string;
  renamedDependencies?: MapLike<string>;
  transformers?: CustomTransformers;
}

interface CustomTransformers {
  before?: readonly TransformerFactory<SourceFile>[];
  after?: readonly TransformerFactory<SourceFile>[];
  afterDeclarations?: readonly TransformerFactory<Bundle | SourceFile>[];
}

type TransformerFactory<T extends Node> = (context: TransformationContext) => Transformer<T>;
type Transformer<T extends Node> = (node: T) => T;
```

**Usage Examples:**

```typescript
import * as ts from "typescript";

// Custom transformer that adds console.log to function entries
const addLoggingTransformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
  return (sourceFile) => {
    function visitor(node: ts.Node): ts.Node {
      if (ts.isFunctionDeclaration(node) && node.name) {
        const logStatement = ts.factory.createExpressionStatement(
          ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
              ts.factory.createIdentifier("console"),
              ts.factory.createIdentifier("log")
            ),
            undefined,
            [ts.factory.createStringLiteral(`Entering function: ${node.name.text}`)]
          )
        );
        
        const newBody = ts.factory.updateBlock(
          node.body!,
          [logStatement, ...node.body!.statements]
        );
        
        return ts.factory.updateFunctionDeclaration(
          node,
          node.modifiers,
          node.asteriskToken,
          node.name,
          node.typeParameters,
          node.parameters,
          node.type,
          newBody
        );
      }
      return ts.visitEachChild(node, visitor, context);
    }
    return ts.visitNode(sourceFile, visitor);
  };
};

// Use custom transformer
const result = ts.transpileModule(`
  function greet(name: string): string {
    return \`Hello, \${name}!\`;
  }
  
  function calculate(a: number, b: number): number {
    return a + b;
  }
`, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2015,
    module: ts.ModuleKind.CommonJS
  },
  transformers: {
    before: [addLoggingTransformer]
  }
});

console.log(result.outputText);
```

### JSX Transpilation

Transpile JSX and TSX files to JavaScript.

```typescript { .api }
enum JsxEmit {
  None = 0,
  Preserve = 1,
  React = 2,
  ReactNative = 3,
  ReactJSX = 4,
  ReactJSXDev = 5
}
```

**Usage Examples:**

```typescript
import * as ts from "typescript";

// React JSX transpilation
const reactResult = ts.transpileModule(`
  import React from 'react';
  
  interface ButtonProps {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  }
  
  const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false }) => {
    return (
      <button 
        onClick={onClick} 
        disabled={disabled}
        className="btn"
      >
        {label}
      </button>
    );
  };
  
  export default Button;
`, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2018,
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.React,
    jsxFactory: "React.createElement",
    esModuleInterop: true
  },
  fileName: "Button.tsx"
});

// Modern React JSX transform
const modernReactResult = ts.transpileModule(`
  interface CardProps {
    title: string;
    children: React.ReactNode;
  }
  
  export const Card: React.FC<CardProps> = ({ title, children }) => {
    return (
      <div className="card">
        <h2>{title}</h2>
        <div className="card-content">
          {children}
        </div>
      </div>
    );
  };
`, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.ReactJSX, // Modern transform
    moduleResolution: ts.ModuleResolutionKind.NodeJs
  },
  fileName: "Card.tsx"
});

console.log("Classic React transform:");
console.log(reactResult.outputText);
console.log("\nModern React transform:");
console.log(modernReactResult.outputText);
```

### Configuration for Transpilation

Common compiler options for transpilation scenarios.

```typescript { .api }
interface CompilerOptions {
  // Essential for transpilation
  target?: ScriptTarget;
  module?: ModuleKind;
  jsx?: JsxEmit;
  
  // Output control
  sourceMap?: boolean;
  inlineSourceMap?: boolean;
  removeComments?: boolean;
  downlevelIteration?: boolean;
  
  // Module resolution
  esModuleInterop?: boolean;
  allowSyntheticDefaultImports?: boolean;
  moduleResolution?: ModuleResolutionKind;
  
  // Type checking (usually disabled for fast transpilation)
  skipLibCheck?: boolean;
  noEmit?: boolean;
  isolatedModules?: boolean;
  
  // JSX-specific
  jsxFactory?: string;
  jsxFragmentFactory?: string;
  jsxImportSource?: string;
}
```

**Common Configurations:**

```typescript
// Node.js target (CommonJS)
const nodeConfig: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES2020,
  module: ts.ModuleKind.CommonJS,
  esModuleInterop: true,
  skipLibCheck: true,
  isolatedModules: true
};

// Modern browser target (ES modules)
const browserConfig: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES2020,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
  skipLibCheck: true,
  isolatedModules: true
};

// React application
const reactConfig: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES2018,
  module: ts.ModuleKind.ESNext,
  jsx: ts.JsxEmit.ReactJSX,
  jsxImportSource: "react",
  esModuleInterop: true,
  allowSyntheticDefaultImports: true,
  skipLibCheck: true,
  isolatedModules: true
};

// Library build (multiple targets)
const libConfig: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES5,
  module: ts.ModuleKind.UMD,
  declaration: true,
  sourceMap: true,
  skipLibCheck: true
};
```

## Types

### Transpilation Types

```typescript { .api }
type MapLike<T> = Record<string, T>;

interface Diagnostic {
  file: SourceFile | undefined;
  start: number | undefined;
  length: number | undefined;
  messageText: string | DiagnosticMessageChain;
  category: DiagnosticCategory;
  code: number;
}

enum DiagnosticCategory {
  Warning = 0,
  Error = 1,
  Suggestion = 2,
  Message = 3
}

interface DiagnosticMessageChain {
  messageText: string;
  category: DiagnosticCategory;
  code: number;
  next?: DiagnosticMessageChain[];
}
```

### Target and Module Types

```typescript { .api }
enum ScriptTarget {
  ES3 = 0,
  ES5 = 1,
  ES2015 = 2,
  ES2016 = 3,
  ES2017 = 4,
  ES2018 = 5,
  ES2019 = 6,
  ES2020 = 7,
  ES2021 = 8,
  ES2022 = 9,
  ESNext = 99,
  Latest = ESNext
}

enum ModuleKind {
  None = 0,
  CommonJS = 1,
  AMD = 2,
  UMD = 3,
  System = 4,
  ES2015 = 5,
  ES2020 = 6,
  ES2022 = 7,
  ESNext = 99,
  Node16 = 100,
  NodeNext = 199
}

enum ModuleResolutionKind {
  Classic = 1,
  NodeJs = 2,
  Node16 = 3,
  NodeNext = 99
}
```

### Performance Considerations

Transpilation is designed for speed over completeness:

- **No type checking**: Only syntactic transformations are performed
- **Single file processing**: Each file is processed independently
- **Limited diagnostics**: Only syntax errors and basic semantic errors are reported
- **Fast parsing**: Optimized for development-time performance
- **Incremental friendly**: Suitable for watch mode and hot reload scenarios

For full type checking and comprehensive error reporting, use the full compiler API with `createProgram()` and `program.emit()`.