# Parser and AST

Core parsing functionality that converts TypeScript source code into Abstract Syntax Trees (AST). Essential for any tool that needs to analyze or manipulate TypeScript code.

## Capabilities

### Source File Creation

Creates a TypeScript AST from source code text.

```typescript { .api }
/**
 * Parse source text into a TypeScript AST
 * @param fileName - Name of the file (used for error reporting)
 * @param sourceText - TypeScript source code to parse
 * @param languageVersionOrOptions - Target language version or parsing options
 * @param setParentNodes - Whether to set parent references on nodes (default: false)
 * @param scriptKind - Type of script being parsed
 * @returns Parsed source file AST
 */
function createSourceFile(
  fileName: string,
  sourceText: string,
  languageVersionOrOptions: ScriptTarget | CreateSourceFileOptions,
  setParentNodes?: boolean,
  scriptKind?: ScriptKind
): SourceFile;

interface CreateSourceFileOptions {
  languageVersion: ScriptTarget;
  impliedNodeFormat?: ResolutionMode;
  setExternalModuleIndicator?: (file: SourceFile) => void;
  jsDocParsingMode?: JSDocParsingMode;
}

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

enum ScriptKind {
  Unknown = 0,
  JS = 1,
  JSX = 2,
  TS = 3,
  TSX = 4,
  External = 5,
  JSON = 6,
  Deferred = 7
}

enum ResolutionMode {
  Imports = 0,
  Require = 1
}

enum JSDocParsingMode {
  ParseAll = 0,
  ParseNone = 1,
  ParseForTypeErrors = 2,
  ParseForTypeInfo = 3
}
```

**Usage Examples:**

```typescript
import * as ts from "typescript";

// Parse a simple TypeScript file
const sourceFile = ts.createSourceFile(
  "example.ts",
  `
    interface User {
      name: string;
      age: number;
    }
    
    function greet(user: User): string {
      return \`Hello, \${user.name}!\`;
    }
  `,
  ts.ScriptTarget.ES2020,
  true // Set parent nodes for easier traversal
);

console.log(sourceFile.statements.length); // Number of top-level statements
```

### AST Traversal

Traverse and visit AST nodes using various patterns.

```typescript { .api }
/**
 * Visit each child of an AST node
 * @param node - AST node to traverse
 * @param cbNode - Callback for individual nodes
 * @param cbNodes - Optional callback for node arrays
 * @returns Result from first successful callback
 */
function forEachChild<T>(
  node: Node,
  cbNode: (node: Node) => T | undefined,
  cbNodes?: (nodes: NodeArray<Node>) => T | undefined
): T | undefined;

/**
 * Recursively traverse AST with depth-first search
 * @param node - Starting AST node
 * @param cbNode - Callback for individual nodes
 * @param cbNodes - Optional callback for node arrays
 * @returns Result from first successful callback
 */
function forEachChildRecursively<T>(
  node: Node,
  cbNode: (node: Node) => T | undefined,
  cbNodes?: (nodes: NodeArray<Node>) => T | undefined
): T | undefined;

/**
 * Visit a single AST node with a visitor function
 * @param node - Node to visit
 * @param visitor - Visitor function
 * @param test - Optional type guard test
 * @param lift - Optional lifting function
 * @returns Visited node or array
 */
function visitNode<T extends Node>(
  node: T | undefined,
  visitor: Visitor,
  test?: (node: Node) => boolean,
  lift?: (node: NodeArray<Node>) => T
): T;

/**
 * Visit an array of AST nodes
 * @param nodes - Array of nodes to visit
 * @param visitor - Visitor function
 * @param test - Optional type guard test
 * @param start - Starting index
 * @param count - Number of nodes to visit
 * @returns Visited node array
 */
function visitNodes<T extends Node>(
  nodes: NodeArray<T> | undefined,
  visitor: Visitor,
  test?: (node: Node) => boolean,
  start?: number,
  count?: number
): NodeArray<T>;
```

**Usage Examples:**

```typescript
import * as ts from "typescript";

const sourceFile = ts.createSourceFile(
  "example.ts",
  "function add(a: number, b: number): number { return a + b; }",
  ts.ScriptTarget.Latest
);

// Find all identifiers in the AST
const identifiers: string[] = [];
function visit(node: ts.Node) {
  if (ts.isIdentifier(node)) {
    identifiers.push(node.text);
  }
  ts.forEachChild(node, visit);
}
visit(sourceFile);
console.log(identifiers); // ['add', 'a', 'number', 'b', 'number', 'number', 'a', 'b']

// Find function declarations
const functions: ts.FunctionDeclaration[] = [];
ts.forEachChild(sourceFile, (node) => {
  if (ts.isFunctionDeclaration(node)) {
    functions.push(node);
  }
});
```

### Incremental Parsing

Update existing source files efficiently for editor scenarios.

```typescript { .api }
/**
 * Incrementally update a source file with new text
 * @param sourceFile - Existing source file
 * @param newText - New source text
 * @param textChangeRange - Range of text that changed
 * @param aggressiveChecks - Whether to perform aggressive validation
 * @returns Updated source file
 */
function updateSourceFile(
  sourceFile: SourceFile,
  newText: string,
  textChangeRange: TextChangeRange,
  aggressiveChecks?: boolean
): SourceFile;

interface TextChangeRange {
  span: TextSpan;
  newLength: number;
}

interface TextSpan {
  start: number;
  length: number;
}
```

### Module Detection

Determine module characteristics of source files.

```typescript { .api }
/**
 * Check if a source file is an external module (has imports/exports)
 * @param file - Source file to check
 * @returns True if file is an external module
 */
function isExternalModule(file: SourceFile): boolean;

/**
 * Check if a filename represents a declaration file
 * @param fileName - File name to check
 * @returns True if filename ends with .d.ts
 */
function isDeclarationFileName(fileName: string): boolean;
```

### JSON Parsing

Parse JSON with TypeScript-specific handling.

```typescript { .api }
/**
 * Parse JSON text with TypeScript-specific error handling
 * @param fileName - Name of JSON file
 * @param sourceText - JSON source text
 * @returns Parsed JSON source file
 */
function parseJsonText(fileName: string, sourceText: string): JsonSourceFile;

interface JsonSourceFile extends SourceFile {
  statements: NodeArray<JsonObjectExpressionStatement>;
}
```

### JSDoc Parsing

Parse JSDoc type expressions for testing and analysis.

```typescript { .api }
/**
 * Parse JSDoc type expressions for testing purposes
 * @param content - JSDoc type expression content
 * @param start - Starting position
 * @param length - Length of content to parse
 * @returns Parsed JSDoc type expression
 */
function parseJSDocTypeExpressionForTests(
  content: string,
  start?: number,
  length?: number
): { jsDocTypeExpression: JSDocTypeExpression; diagnostics: Diagnostic[] };
```

## Types

### Core Node Types

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
  scriptKind: ScriptKind;
  isDeclarationFile: boolean;
  hasNoDefaultLib: boolean;
  externalModuleIndicator?: Node;
}

interface Statement extends Node {
  _statementBrand: any;
}

interface Expression extends Node {
  _expressionBrand: any;
}

interface Declaration extends Node {
  _declarationBrand: any;
}

interface Identifier extends Declaration {
  kind: SyntaxKind.Identifier;
  text: string;
  originalKeywordKind: SyntaxKind;
}
```

### Node Arrays

```typescript { .api }
interface NodeArray<T extends Node> extends ReadonlyArray<T> {
  pos: number;
  end: number;
  hasTrailingComma: boolean;
}

/**
 * Create a node array from elements
 * @param elements - Array elements
 * @param hasTrailingComma - Whether array has trailing comma
 * @returns Node array
 */
function createNodeArray<T extends Node>(elements?: readonly T[], hasTrailingComma?: boolean): NodeArray<T>;
```

### Scanner API

Create and use lexical scanners for tokenization.

```typescript { .api }
/**
 * Create a lexical scanner for tokenizing TypeScript source
 * @param languageVersion - Target language version
 * @param skipTrivia - Whether to skip whitespace and comments
 * @param languageVariant - Language variant (TypeScript, JSX, etc.)
 * @param textInitial - Initial text to scan
 * @param onError - Error reporting callback
 * @param start - Starting position
 * @param length - Length to scan
 * @returns Scanner instance
 */
function createScanner(
  languageVersion: ScriptTarget,
  skipTrivia: boolean,
  languageVariant?: LanguageVariant,
  textInitial?: string,
  onError?: ErrorCallback,
  start?: number,
  length?: number
): Scanner;

interface Scanner {
  /** Get next token */
  scan(): SyntaxKind;
  
  /** Get current token kind */
  getToken(): SyntaxKind;
  
  /** Get current token position */
  getTokenPos(): number;
  
  /** Get current text position */
  getTextPos(): number;
  
  /** Get text of current token */
  getTokenText(): string;
  
  /** Get numeric value of token */
  getTokenValue(): string;
  
  /** Check if token has extended unicode escape */
  hasUnicodeEscape(): boolean;
  
  /** Check if token has extended unicode escape */
  hasExtendedUnicodeEscape(): boolean;
  
  /** Check if preceding line break */
  hasPrecedingLineBreak(): boolean;
  
  /** Set text to scan */
  setText(text: string | undefined, start?: number, length?: number): void;
  
  /** Set text position */
  setTextPos(textPos: number): void;
  
  /** Look ahead for next token */
  lookAhead<T>(callback: () => T): T;
  
  /** Scan range of text */
  scanRange<T>(start: number, length: number, callback: () => T): T;
  
  /** Try scan */
  tryScan<T>(callback: () => T): T;
}

/**
 * Check if character can start an identifier
 * @param ch - Character code to check
 * @param languageVersion - Language version context
 * @returns True if character can start identifier
 */
function isIdentifierStart(ch: number, languageVersion?: ScriptTarget): boolean;

/**
 * Check if character can be part of an identifier
 * @param ch - Character code to check
 * @param languageVersion - Language version context
 * @returns True if character can be part of identifier
 */
function isIdentifierPart(ch: number, languageVersion?: ScriptTarget): boolean;

/**
 * Check if character is whitespace-like
 * @param ch - Character code to check
 * @returns True if whitespace-like
 */
function isWhiteSpaceLike(ch: number): boolean;

/**
 * Check if character is a line break
 * @param ch - Character code to check
 * @returns True if line break
 */
function isLineBreak(ch: number): boolean;
```

### Text Ranges

```typescript { .api }
interface TextRange {
  pos: number;
  end: number;
}

interface ReadonlyTextRange {
  readonly pos: number;
  readonly end: number;
}

/**
 * Create text span from start and length
 * @param start - Starting position
 * @param length - Length of span
 * @returns Text span object
 */
function createTextSpan(start: number, length: number): TextSpan;

/**
 * Create text change range
 * @param span - Text span that changed
 * @param newLength - New length after change
 * @returns Text change range
 */
function createTextChangeRange(span: TextSpan, newLength: number): TextChangeRange;
```