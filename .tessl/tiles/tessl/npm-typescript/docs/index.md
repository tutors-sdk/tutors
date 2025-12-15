# TypeScript

TypeScript is a comprehensive programming language and compiler system that extends JavaScript by adding optional static type annotations. It enables developers to build large-scale applications with enhanced tooling support, early error detection, and improved code maintainability. The TypeScript compiler (tsc) transforms TypeScript code into readable, standards-based JavaScript, while the TypeScript Language Server (tsserver) provides rich development experiences with intelligent code completion, refactoring, and error checking.

## Package Information

- **Package Name**: typescript
- **Package Type**: npm
- **Language**: TypeScript (self-hosting)
- **Installation**: `npm install -D typescript`

## Core Imports

```typescript
import * as ts from "typescript";
```

For CommonJS:

```javascript
const ts = require("typescript");
```

## Basic Usage

```typescript
import * as ts from "typescript";

// Parse TypeScript source code
const sourceFile = ts.createSourceFile(
  "example.ts",
  'const greeting: string = "Hello, World!";',
  ts.ScriptTarget.Latest
);

// Create a program with the source file
const program = ts.createProgram(["example.ts"], {
  target: ts.ScriptTarget.ES2015,
  module: ts.ModuleKind.CommonJS
}, {
  getSourceFile: (fileName) => fileName === "example.ts" ? sourceFile : undefined,
  writeFile: () => {},
  getCurrentDirectory: () => "",
  getDirectories: () => [],
  fileExists: () => true,
  readFile: () => "",
  getCanonicalFileName: (fileName) => fileName,
  useCaseSensitiveFileNames: () => true,
  getNewLine: () => "\n"
});

// Get type checker for semantic analysis
const typeChecker = program.getTypeChecker();

// Emit JavaScript output
const result = program.emit();
console.log(`Emit result: ${result.emitSkipped ? 'failed' : 'success'}`);
```

## Architecture

TypeScript's API is organized into several key components:

- **Compiler Core**: Parsing, type checking, and code generation (`createSourceFile`, `createProgram`, `TypeChecker`)
- **Language Services**: IDE functionality like completion, navigation, and refactoring (`LanguageService`)
- **Server Protocol**: TSServer for editor integration (`ts.server` namespace)
- **Transpilation**: Simple TypeScript-to-JavaScript conversion (`transpileModule`)
- **Node Factory**: AST node creation and manipulation for transformations
- **Utilities**: Helper functions for AST traversal, type guards, and text operations

## Capabilities

### Parser and AST

Core parsing functionality that converts TypeScript source code into Abstract Syntax Trees (AST). Essential for any tool that needs to analyze or manipulate TypeScript code.

```typescript { .api }
function createSourceFile(
  fileName: string,
  sourceText: string,
  languageVersionOrOptions: ScriptTarget | CreateSourceFileOptions,
  setParentNodes?: boolean,
  scriptKind?: ScriptKind
): SourceFile;

function forEachChild<T>(
  node: Node,
  cbNode: (node: Node) => T | undefined,
  cbNodes?: (nodes: NodeArray<Node>) => T | undefined
): T | undefined;
```

[Parser and AST](./parser-ast.md)

### Type Checker

Comprehensive type analysis system that provides semantic information about TypeScript code. Powers features like type inference, error detection, and symbol resolution.

```typescript { .api }
function createTypeChecker(host: TypeCheckerHost): TypeChecker;

interface TypeChecker {
  getTypeAtLocation(node: Node): Type;
  getSymbolAtLocation(node: Node): Symbol | undefined;
  getSignatureFromDeclaration(declaration: SignatureDeclaration): Signature | undefined;
  typeToTypeNode(type: Type, enclosingDeclaration?: Node, flags?: NodeBuilderFlags): TypeNode | undefined;
}
```

[Type Checker](./type-checker.md)

### Program and Compilation

High-level compilation interface that manages multiple source files, handles module resolution, and orchestrates the compilation process from parsing to emit.

```typescript { .api }
function createProgram(
  rootNames: readonly string[],
  options: CompilerOptions,
  host?: CompilerHost,
  oldProgram?: Program,
  configFileParsingDiagnostics?: readonly Diagnostic[]
): Program;

interface Program {
  getRootFileNames(): readonly string[];
  getSourceFiles(): readonly SourceFile[];
  getTypeChecker(): TypeChecker;
  emit(targetSourceFile?: SourceFile, writeFile?: WriteFileCallback, cancellationToken?: CancellationToken, emitOnlyDtsFiles?: boolean, customTransformers?: CustomTransformers): EmitResult;
}
```

[Program and Compilation](./program-compilation.md)

### Language Services

Advanced IDE functionality including auto-completion, navigation, refactoring, and code fixes. Provides the foundation for rich development experiences in editors and IDEs.

```typescript { .api }
function createLanguageService(
  host: LanguageServiceHost,
  documentRegistry?: DocumentRegistry,
  syntaxOnlyOrLanguageServiceMode?: boolean | LanguageServiceMode
): LanguageService;

interface LanguageService {
  getCompletionsAtPosition(fileName: string, position: number, options?: GetCompletionsAtPositionOptions): CompletionInfo | undefined;
  getDefinitionAtPosition(fileName: string, position: number): readonly DefinitionInfo[] | undefined;
  findReferences(fileName: string, position: number): ReferencedSymbol[] | undefined;
  getApplicableRefactors(fileName: string, positionOrRange: number | TextRange, preferences?: UserPreferences): ApplicableRefactorInfo[];
}
```

[Language Services](./language-services.md)

### Transpilation

Simple and fast TypeScript-to-JavaScript conversion without full type checking. Ideal for build tools and development servers that need quick compilation.

```typescript { .api }
function transpileModule(input: string, transpileOptions: TranspileOptions): TranspileOutput;

function transpile(
  input: string,
  compilerOptions?: CompilerOptions,
  fileName?: string,
  diagnostics?: Diagnostic[],
  moduleName?: string
): string;

interface TranspileOptions {
  compilerOptions?: CompilerOptions;
  fileName?: string;
  reportDiagnostics?: boolean;
  moduleName?: string;
  renamedDependencies?: MapLike<string>;
}
```

[Transpilation](./transpilation.md)

### Node Factory and Transformers

AST node creation and transformation system for building custom TypeScript transformers and code generation tools.

```typescript { .api }
function createNodeFactory(flags: NodeFactoryFlags, baseFactory?: BaseNodeFactory): NodeFactory;

function transformNodes<T extends Node>(
  resolver: EmitResolver | undefined,
  host: EmitHost | undefined,
  options: CompilerOptions,
  nodes: readonly T[],
  transformers: readonly TransformerFactory<T>[],
  allowDtsFiles: boolean
): TransformationResult<T>;

interface NodeFactory {
  createIdentifier(text: string): Identifier;
  createStringLiteral(text: string, isSingleQuote?: boolean): StringLiteral;
  createFunctionDeclaration(
    modifiers: readonly Modifier[] | undefined,
    asteriskToken: AsteriskToken | undefined,
    name: string | Identifier | undefined,
    typeParameters: readonly TypeParameterDeclaration[] | undefined,
    parameters: readonly ParameterDeclaration[],
    type: TypeNode | undefined,
    body: Block | undefined
  ): FunctionDeclaration;
}
```

[Node Factory and Transformers](./node-factory-transformers.md)

### Utilities and Helpers

Essential utility functions for working with TypeScript AST nodes, including type guards, text operations, and traversal helpers.

```typescript { .api }
function isIdentifier(node: Node): node is Identifier;
function isStringLiteral(node: Node): node is StringLiteral;
function isFunctionDeclaration(node: Node): node is FunctionDeclaration;

function getOriginalNode(node: Node, nodeTest?: (node: Node) => node is Node): Node;
function findAncestor<T extends Node>(node: Node, callback: (element: Node) => element is T): T | undefined;

function escapeLeadingUnderscores(identifier: string): __String;
function unescapeLeadingUnderscores(identifier: __String): string;
```

[Utilities and Helpers](./utilities-helpers.md)

### Command Line and Configuration

Configuration management and command-line argument parsing for building TypeScript tooling and custom compilers.

```typescript { .api }
function parseCommandLine(commandLine: readonly string[], readFile?: (path: string) => string | undefined): ParsedCommandLine;

function readConfigFile(fileName: string, readFile: (path: string) => string | undefined): { config?: any; error?: Diagnostic };

function parseConfigFileTextToJson(fileName: string, jsonText: string): { config?: any; error?: Diagnostic };

interface CompilerOptions {
  target?: ScriptTarget;
  module?: ModuleKind;
  strict?: boolean;
  esModuleInterop?: boolean;
  skipLibCheck?: boolean;
  declaration?: boolean;
  outDir?: string;
  rootDir?: string;
  // ... 200+ more options
}
```

[Command Line and Configuration](./command-line-config.md)

## Types

### Core AST Types

```typescript { .api }
interface Node {
  kind: SyntaxKind;
  flags: NodeFlags;
  pos: number;
  end: number;
  parent: Node;
}

interface SourceFile extends Declaration {
  kind: SyntaxKind.SourceFile;
  statements: NodeArray<Statement>;
  endOfFileToken: Token<SyntaxKind.EndOfFileToken>;
  fileName: string;
  text: string;
  languageVersion: ScriptTarget;
}

interface Identifier extends Declaration {
  kind: SyntaxKind.Identifier;
  text: string;
  originalKeywordKind: SyntaxKind;
}

enum SyntaxKind {
  Unknown = 0,
  EndOfFileToken = 1,
  SingleLineCommentTrivia = 2,
  MultiLineCommentTrivia = 3,
  // ... 400+ syntax kinds
  Identifier = 79,
  StringLiteral = 10,
  FunctionDeclaration = 256,
  ClassDeclaration = 257,
  // ... many more
}
```

### Diagnostic Types

```typescript { .api }
interface Diagnostic {
  file: SourceFile | undefined;
  start: number | undefined;
  length: number | undefined;
  messageText: string | DiagnosticMessageChain;
  category: DiagnosticCategory;
  code: number;
  source?: string;
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