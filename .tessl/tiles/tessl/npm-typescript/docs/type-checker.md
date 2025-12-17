# Type Checker

Comprehensive type analysis system that provides semantic information about TypeScript code. Powers features like type inference, error detection, and symbol resolution.

## Capabilities

### Type Checker Creation

Create a type checker instance for semantic analysis.

```typescript { .api }
/**
 * Create a TypeScript type checker
 * @param host - Type checker host providing program information
 * @returns Type checker instance
 */
function createTypeChecker(host: TypeCheckerHost): TypeChecker;

interface TypeCheckerHost {
  getCompilerOptions(): CompilerOptions;
  getSourceFiles(): readonly SourceFile[];
  getSourceFile(fileName: string): SourceFile | undefined;
  getResolvedTypeReferenceDirectives(): ReadonlyMap<ResolvedTypeReferenceDirective | undefined>;
  getCurrentDirectory(): string;
}
```

### Type Analysis

Get type information for AST nodes and symbols.

```typescript { .api }
interface TypeChecker {
  /**
   * Get the type of an AST node at a specific location
   * @param node - AST node to analyze
   * @returns Type information for the node
   */
  getTypeAtLocation(node: Node): Type;

  /**
   * Get the contextual type for a node (e.g., from assignment target)
   * @param node - AST node to analyze
   * @returns Contextual type if available
   */
  getContextualType(node: Expression): Type | undefined;

  /**
   * Get the type of a symbol at a specific location
   * @param symbol - Symbol to analyze
   * @param location - AST node location
   * @returns Type of the symbol
   */
  getTypeOfSymbolAtLocation(symbol: Symbol, location: Node): Type;

  /**
   * Get the base type of a type (e.g., Array<string> -> Array<T>)
   * @param type - Type to analyze
   * @returns Base type
   */
  getBaseTypeOfLiteralType(type: Type): Type;

  /**
   * Get the apparent type (after applying index signatures, etc.)
   * @param type - Type to analyze
   * @returns Apparent type
   */
  getApparentType(type: Type): Type;
}
```

**Usage Examples:**

```typescript
import * as ts from "typescript";

// Create program and type checker
const program = ts.createProgram(["example.ts"], {
  target: ts.ScriptTarget.ES2020,
  module: ts.ModuleKind.CommonJS
}, compilerHost);

const typeChecker = program.getTypeChecker();
const sourceFile = program.getSourceFile("example.ts")!;

// Get type at specific node
function visitNode(node: ts.Node) {
  if (ts.isVariableDeclaration(node) && node.name) {
    const type = typeChecker.getTypeAtLocation(node.name);
    const typeString = typeChecker.typeToString(type);
    console.log(`Variable ${node.name.text} has type: ${typeString}`);
  }
  ts.forEachChild(node, visitNode);
}
visitNode(sourceFile);
```

### Symbol Analysis

Work with symbols representing declarations and their metadata.

```typescript { .api }
interface TypeChecker {
  /**
   * Get the symbol at a specific AST location
   * @param node - AST node to analyze
   * @returns Symbol if found
   */
  getSymbolAtLocation(node: Node): Symbol | undefined;

  /**
   * Get all symbols accessible in scope at a location
   * @param location - AST node location
   * @param meaning - Type of symbols to find (value, type, namespace)
   * @returns Array of accessible symbols
   */
  getSymbolsInScope(location: Node, meaning: SymbolFlags): Symbol[];

  /**
   * Get exported symbols from a module
   * @param module - Module symbol to analyze
   * @returns Exported symbols
   */
  getExportsOfModule(module: Symbol): Symbol[];

  /**
   * Get local symbols from a symbol (for namespaces, classes, etc.)
   * @param symbol - Symbol to analyze
   * @returns Local symbols
   */
  getLocalSymbolsOfContainer(symbol: Symbol): Symbol[];

  /**
   * Get the fully qualified name of a symbol
   * @param symbol - Symbol to analyze
   * @returns Fully qualified name
   */
  getFullyQualifiedName(symbol: Symbol): string;
}
```

### Signature Analysis

Analyze function and method signatures.

```typescript { .api }
interface TypeChecker {
  /**
   * Get signature from a declaration
   * @param declaration - Function/method declaration
   * @returns Signature information
   */
  getSignatureFromDeclaration(declaration: SignatureDeclaration): Signature | undefined;

  /**
   * Get resolved signature from a call expression
   * @param node - Call expression node
   * @returns Resolved signature
   */
  getResolvedSignature(node: CallLikeExpression): Signature | undefined;

  /**
   * Get all signatures for a type (overloads)
   * @param type - Type to analyze
   * @param kind - Signature kind (call, construct, index)
   * @returns Array of signatures
   */
  getSignaturesOfType(type: Type, kind: SignatureKind): readonly Signature[];

  /**
   * Get return type of a signature
   * @param signature - Signature to analyze
   * @returns Return type
   */
  getReturnTypeOfSignature(signature: Signature): Type;

  /**
   * Check if signature has a rest parameter
   * @param signature - Signature to check
   * @returns True if has rest parameter
   */
  hasRestParameter(signature: Signature): boolean;
}
```

### Type Utilities

Essential type analysis methods available on the TypeChecker interface.

```typescript { .api }
interface TypeChecker {
  /**
   * Get the type of a symbol
   * @param symbol - Symbol to analyze
   * @returns Type of the symbol
   */
  getTypeOfSymbol(symbol: Symbol): Type;

  /**
   * Get the declared type of a symbol (before any type resolution)
   * @param symbol - Symbol to analyze
   * @returns Declared type of the symbol
   */
  getDeclaredTypeOfSymbol(symbol: Symbol): Type;

  /**
   * Get all properties of a type
   * @param type - Type to analyze
   * @returns Array of property symbols
   */
  getPropertiesOfType(type: Type): Symbol[];

  /**
   * Get a specific property of a type by name
   * @param type - Type to analyze
   * @param propertyName - Name of the property
   * @returns Property symbol if found
   */
  getPropertyOfType(type: Type, propertyName: string): Symbol | undefined;

  /**
   * Get index info for a type (for string or number indexing)
   * @param type - Type to analyze
   * @param kind - Index kind (string or number)
   * @returns Index info if available
   */
  getIndexInfoOfType(type: Type, kind: IndexKind): IndexInfo | undefined;

  /**
   * Get all index infos for a type
   * @param type - Type to analyze
   * @returns Array of index infos
   */
  getIndexInfosOfType(type: Type): readonly IndexInfo[];

  /**
   * Get the awaited type for async/await scenarios
   * @param type - Type to analyze (usually a Promise type)
   * @returns Awaited type or undefined
   */
  getAwaitedType(type: Type): Type | undefined;

  /**
   * Get nullable version of a type
   * @param type - Base type
   * @param flags - Type flags for nullability
   * @returns Nullable type
   */
  getNullableType(type: Type, flags: TypeFlags): Type;

  /**
   * Get non-nullable version of a type
   * @param type - Potentially nullable type
   * @returns Non-nullable type
   */
  getNonNullableType(type: Type): Type;

  /**
   * Get augmented properties of a type (including inherited and mixed-in)
   * @param type - Type to analyze
   * @returns Array of all property symbols
   */
  getAugmentedPropertiesOfType(type: Type): Symbol[];
}
```

### Type Conversions

Convert between types and AST representations.

```typescript { .api }
interface TypeChecker {
  /**
   * Convert a type to a TypeNode AST representation
   * @param type - Type to convert
   * @param enclosingDeclaration - Context for the conversion
   * @param flags - Conversion flags
   * @returns TypeNode AST or undefined
   */
  typeToTypeNode(
    type: Type,
    enclosingDeclaration?: Node,
    flags?: NodeBuilderFlags
  ): TypeNode | undefined;

  /**
   * Convert a symbol to EntityName AST representation
   * @param symbol - Symbol to convert
   * @param meaning - Symbol meaning context
   * @param enclosingDeclaration - Context for conversion
   * @returns EntityName AST or undefined
   */
  symbolToEntityName(
    symbol: Symbol,
    meaning: SymbolFlags,
    enclosingDeclaration?: Node
  ): EntityName | undefined;

  /**
   * Convert type to string representation
   * @param type - Type to convert
   * @param enclosingDeclaration - Context for conversion
   * @param flags - Type formatting flags
   * @returns String representation
   */
  typeToString(
    type: Type,
    enclosingDeclaration?: Node,
    flags?: TypeFormatFlags
  ): string;

  /**
   * Convert symbol to string representation
   * @param symbol - Symbol to convert
   * @param enclosingDeclaration - Context for conversion
   * @param meaning - Symbol meaning
   * @returns String representation
   */
  symbolToString(
    symbol: Symbol,
    enclosingDeclaration?: Node,
    meaning?: SymbolFlags
  ): string;
}
```

### Diagnostics

Get semantic diagnostics and error information.

```typescript { .api }
interface TypeChecker {
  /**
   * Get semantic diagnostics for a source file
   * @param sourceFile - Source file to analyze
   * @returns Array of diagnostics
   */
  getSemanticDiagnostics(sourceFile?: SourceFile): readonly Diagnostic[];

  /**
   * Get suggestion diagnostics (hints, not errors)
   * @param sourceFile - Source file to analyze
   * @returns Array of suggestion diagnostics
   */
  getSuggestionDiagnostics(sourceFile: SourceFile): readonly DiagnosticWithLocation[];

  /**
   * Get global diagnostics (not tied to specific files)
   * @returns Array of global diagnostics
   */
  getGlobalDiagnostics(): readonly Diagnostic[];
}
```

## Types

### Core Type System

```typescript { .api }
interface Type {
  flags: TypeFlags;
  symbol: Symbol;
  pattern?: DestructuringPattern;
  aliasSymbol?: Symbol;
  aliasTypeArguments?: readonly Type[];
}

enum TypeFlags {
  Any = 1,
  Unknown = 2,
  String = 4,
  Number = 8,
  Boolean = 16,
  Enum = 32,
  BigInt = 64,
  StringLiteral = 128,
  NumberLiteral = 256,
  BooleanLiteral = 512,
  EnumLiteral = 1024,
  BigIntLiteral = 2048,
  ESSymbol = 4096,
  UniqueESSymbol = 8192,
  Void = 16384,
  Undefined = 32768,
  Null = 65536,
  Never = 131072,
  TypeParameter = 262144,
  Object = 524288,
  Union = 1048576,
  Intersection = 2097152,
  Index = 4194304,
  IndexedAccess = 8388608,
  Conditional = 16777216,
  Substitution = 33554432,
  NonPrimitive = 67108864
}

interface Symbol {
  flags: SymbolFlags;
  escapedName: __String;
  declarations: Declaration[];
  valueDeclaration: Declaration;
  members?: SymbolTable;
  exports?: SymbolTable;
  globalExports?: SymbolTable;
}

enum SymbolFlags {
  None = 0,
  FunctionScopedVariable = 1,
  BlockScopedVariable = 2,
  Property = 4,
  EnumMember = 8,
  Function = 16,
  Class = 32,
  Interface = 64,
  ConstEnum = 128,
  RegularEnum = 256,
  ValueModule = 512,
  NamespaceModule = 1024,
  TypeLiteral = 2048,
  ObjectLiteral = 4096,
  Method = 8192,
  Constructor = 16384,
  GetAccessor = 32768,
  SetAccessor = 65536,
  Signature = 131072,
  TypeParameter = 262144,
  TypeAlias = 524288,
  ExportValue = 1048576,
  Alias = 2097152,
  Prototype = 4194304,
  ExportStar = 8388608,
  Optional = 16777216,
  Transient = 33554432
}
```

### Signature Types

```typescript { .api }
interface Signature {
  declaration?: SignatureDeclaration;
  typeParameters?: readonly TypeParameter[];
  parameters: readonly Symbol[];
  resolvedReturnType: Type;
  minArgumentCount: number;
  hasRestParameter: boolean;
  hasLiteralTypes: boolean;
}

enum SignatureKind {
  Call = 0,
  Construct = 1
}

interface CallSignature extends Signature {
  kind: SignatureKind.Call;
}

interface ConstructSignature extends Signature {
  kind: SignatureKind.Construct;
}
```

### Index Types

```typescript { .api }
enum IndexKind {
  String = 0,
  Number = 1
}

interface IndexInfo {
  type: Type;
  isReadonly: boolean;
  declaration?: IndexSignatureDeclaration;
}
```