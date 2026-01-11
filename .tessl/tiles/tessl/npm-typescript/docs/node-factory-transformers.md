# Node Factory and Transformers

AST node creation and transformation system for building custom TypeScript transformers and code generation tools.

## Capabilities

### Node Factory Creation

Create a node factory instance for generating AST nodes.

```typescript { .api }
/**
 * Create a node factory for AST node creation
 * @param flags - Factory behavior flags
 * @param baseFactory - Optional base factory to extend
 * @returns Node factory instance
 */
function createNodeFactory(flags: NodeFactoryFlags, baseFactory?: BaseNodeFactory): NodeFactory;

enum NodeFactoryFlags {
  None = 0,
  NoParenthesizerRules = 1 << 0,
  NoNodeConverters = 1 << 1,
  NoIndentationOnFreshPropertyAccess = 1 << 2,
  NoOriginalNode = 1 << 3
}
```

**Usage Examples:**

```typescript
import * as ts from "typescript";

// Create default node factory
const factory = ts.createNodeFactory(ts.NodeFactoryFlags.None);

// Create identifier
const identifier = factory.createIdentifier("myVariable");

// Create string literal
const stringLiteral = factory.createStringLiteral("Hello, World!");
```

### Basic Node Creation

Create fundamental AST node types.

```typescript { .api }
interface NodeFactory {
  /**
   * Create an identifier node
   * @param text - Identifier text
   * @returns Identifier node
   */
  createIdentifier(text: string): Identifier;

  /**
   * Create a string literal node
   * @param text - String content
   * @param isSingleQuote - Whether to use single quotes
   * @returns String literal node
   */
  createStringLiteral(text: string, isSingleQuote?: boolean): StringLiteral;

  /**
   * Create a numeric literal node
   * @param value - Numeric value as string
   * @returns Numeric literal node
   */
  createNumericLiteral(value: string | number): NumericLiteral;

  /**
   * Create a boolean literal node
   * @param value - Boolean value
   * @returns Boolean literal node
   */
  createBooleanLiteral(value: boolean): BooleanLiteral;

  /**
   * Create a token node
   * @param token - Syntax kind of token
   * @returns Token node
   */
  createToken<TKind extends SyntaxKind>(token: TKind): Token<TKind>;

  /**
   * Create a modifier token
   * @param kind - Modifier syntax kind
   * @returns Modifier node
   */
  createModifier<T extends ModifierSyntaxKind>(kind: T): ModifierToken<T>;
}
```

**Usage Examples:**

```typescript
const factory = ts.createNodeFactory(ts.NodeFactoryFlags.None);

// Create various literals
const name = factory.createIdentifier("userName");
const message = factory.createStringLiteral("Hello");
const count = factory.createNumericLiteral("42");
const isActive = factory.createBooleanLiteral(true);

// Create tokens
const asyncToken = factory.createToken(ts.SyntaxKind.AsyncKeyword);
const publicModifier = factory.createModifier(ts.SyntaxKind.PublicKeyword);
```

### Function and Method Creation

Create function-related AST nodes.

```typescript { .api }
interface NodeFactory {
  /**
   * Create a function declaration
   * @param modifiers - Function modifiers (public, async, etc.)
   * @param asteriskToken - Generator asterisk token
   * @param name - Function name
   * @param typeParameters - Generic type parameters
   * @param parameters - Function parameters
   * @param type - Return type annotation
   * @param body - Function body
   * @returns Function declaration node
   */
  createFunctionDeclaration(
    modifiers: readonly Modifier[] | undefined,
    asteriskToken: AsteriskToken | undefined,
    name: string | Identifier | undefined,
    typeParameters: readonly TypeParameterDeclaration[] | undefined,
    parameters: readonly ParameterDeclaration[],
    type: TypeNode | undefined,
    body: Block | undefined
  ): FunctionDeclaration;

  /**
   * Create a method declaration
   * @param modifiers - Method modifiers
   * @param asteriskToken - Generator asterisk token
   * @param name - Method name
   * @param questionToken - Optional method token
   * @param typeParameters - Generic type parameters
   * @param parameters - Method parameters
   * @param type - Return type annotation
   * @param body - Method body
   * @returns Method declaration node
   */
  createMethodDeclaration(
    modifiers: readonly Modifier[] | undefined,
    asteriskToken: AsteriskToken | undefined,
    name: string | PropertyName,
    questionToken: QuestionToken | undefined,
    typeParameters: readonly TypeParameterDeclaration[] | undefined,
    parameters: readonly ParameterDeclaration[],
    type: TypeNode | undefined,
    body: Block | undefined
  ): MethodDeclaration;

  /**
   * Create an arrow function
   * @param modifiers - Arrow function modifiers
   * @param typeParameters - Generic type parameters
   * @param parameters - Function parameters
   * @param type - Return type annotation
   * @param equalsGreaterThanToken - Arrow token
   * @param body - Function body
   * @returns Arrow function node
   */
  createArrowFunction(
    modifiers: readonly Modifier[] | undefined,
    typeParameters: readonly TypeParameterDeclaration[] | undefined,
    parameters: readonly ParameterDeclaration[],
    type: TypeNode | undefined,
    equalsGreaterThanToken: EqualsGreaterThanToken | undefined,
    body: ConciseBody
  ): ArrowFunction;

  /**
   * Create a parameter declaration
   * @param modifiers - Parameter modifiers
   * @param dotDotDotToken - Rest parameter token
   * @param name - Parameter name
   * @param questionToken - Optional parameter token
   * @param type - Parameter type
   * @param initializer - Default value
   * @returns Parameter declaration node
   */
  createParameterDeclaration(
    modifiers: readonly Modifier[] | undefined,
    dotDotDotToken: DotDotDotToken | undefined,
    name: string | BindingName,
    questionToken?: QuestionToken,
    type?: TypeNode,
    initializer?: Expression
  ): ParameterDeclaration;
}
```

**Usage Examples:**

```typescript
const factory = ts.createNodeFactory(ts.NodeFactoryFlags.None);

// Create function parameters
const param1 = factory.createParameterDeclaration(
  undefined,
  undefined,
  "name",
  undefined,
  factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
);

const param2 = factory.createParameterDeclaration(
  undefined,
  undefined,
  "age",
  undefined,
  factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
);

// Create function declaration
const greetFunction = factory.createFunctionDeclaration(
  [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
  undefined,
  "greet",
  undefined,
  [param1, param2],
  factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
  factory.createBlock([
    factory.createReturnStatement(
      factory.createTemplateExpression(
        factory.createTemplateHead("Hello, "),
        [factory.createTemplateSpan(
          factory.createIdentifier("name"),
          factory.createTemplateTail("!")
        )]
      )
    )
  ])
);
```

### Class and Interface Creation

Create class and interface declarations.

```typescript { .api }
interface NodeFactory {
  /**
   * Create a class declaration
   * @param modifiers - Class modifiers
   * @param name - Class name
   * @param typeParameters - Generic type parameters
   * @param heritageClauses - Extends/implements clauses
   * @param members - Class members
   * @returns Class declaration node
   */
  createClassDeclaration(
    modifiers: readonly Modifier[] | undefined,
    name: string | Identifier | undefined,
    typeParameters: readonly TypeParameterDeclaration[] | undefined,
    heritageClauses: readonly HeritageClause[] | undefined,
    members: readonly ClassElement[]
  ): ClassDeclaration;

  /**
   * Create an interface declaration
   * @param modifiers - Interface modifiers
   * @param name - Interface name
   * @param typeParameters - Generic type parameters
   * @param heritageClauses - Extends clauses
   * @param members - Interface members
   * @returns Interface declaration node
   */
  createInterfaceDeclaration(
    modifiers: readonly Modifier[] | undefined,
    name: string | Identifier,
    typeParameters: readonly TypeParameterDeclaration[] | undefined,
    heritageClauses: readonly HeritageClause[] | undefined,
    members: readonly TypeElement[]
  ): InterfaceDeclaration;

  /**
   * Create a property declaration
   * @param modifiers - Property modifiers
   * @param name - Property name
   * @param questionOrExclamationToken - Optional/definite assignment token
   * @param type - Property type
   * @param initializer - Initial value
   * @returns Property declaration node
   */
  createPropertyDeclaration(
    modifiers: readonly Modifier[] | undefined,
    name: string | PropertyName,
    questionOrExclamationToken: QuestionToken | ExclamationToken | undefined,
    type: TypeNode | undefined,
    initializer: Expression | undefined
  ): PropertyDeclaration;

  /**
   * Create a constructor declaration
   * @param modifiers - Constructor modifiers
   * @param parameters - Constructor parameters
   * @param body - Constructor body
   * @returns Constructor declaration node
   */
  createConstructorDeclaration(
    modifiers: readonly Modifier[] | undefined,
    parameters: readonly ParameterDeclaration[],
    body: Block | undefined
  ): ConstructorDeclaration;
}
```

### Type Node Creation

Create type annotation nodes.

```typescript { .api }
interface NodeFactory {
  /**
   * Create a keyword type node (string, number, boolean, etc.)
   * @param kind - Type keyword syntax kind
   * @returns Keyword type node
   */
  createKeywordTypeNode<TKind extends KeywordTypeSyntaxKind>(kind: TKind): KeywordTypeNode<TKind>;

  /**
   * Create a type reference node
   * @param typeName - Type name
   * @param typeArguments - Generic type arguments
   * @returns Type reference node
   */
  createTypeReferenceNode(
    typeName: string | EntityName,
    typeArguments?: readonly TypeNode[]
  ): TypeReferenceNode;

  /**
   * Create a union type node
   * @param types - Union member types
   * @returns Union type node
   */
  createUnionTypeNode(types: readonly TypeNode[]): UnionTypeNode;

  /**
   * Create an intersection type node
   * @param types - Intersection member types
   * @returns Intersection type node
   */
  createIntersectionTypeNode(types: readonly TypeNode[]): IntersectionTypeNode;

  /**
   * Create an array type node
   * @param elementType - Array element type
   * @returns Array type node
   */
  createArrayTypeNode(elementType: TypeNode): ArrayTypeNode;

  /**
   * Create a tuple type node
   * @param elements - Tuple element types
   * @returns Tuple type node
   */
  createTupleTypeNode(elements: readonly (TypeNode | NamedTupleMember)[]): TupleTypeNode;

  /**
   * Create a function type node
   * @param typeParameters - Generic type parameters
   * @param parameters - Function parameters
   * @param type - Return type
   * @returns Function type node
   */
  createFunctionTypeNode(
    typeParameters: readonly TypeParameterDeclaration[] | undefined,
    parameters: readonly ParameterDeclaration[],
    type: TypeNode
  ): FunctionTypeNode;
}
```

### Transformation System

Transform AST nodes using the transformer pipeline.

```typescript { .api }
/**
 * Transform AST nodes using transformer pipeline
 * @param resolver - Emit resolver for semantic information
 * @param host - Emit host for file operations
 * @param options - Compiler options
 * @param nodes - AST nodes to transform
 * @param transformers - Array of transformer factories
 * @param allowDtsFiles - Whether to allow .d.ts files
 * @returns Transformation result
 */
function transformNodes<T extends Node>(
  resolver: EmitResolver | undefined,
  host: EmitHost | undefined,
  options: CompilerOptions,
  nodes: readonly T[],
  transformers: readonly TransformerFactory<T>[],
  allowDtsFiles: boolean
): TransformationResult<T>;

/**
 * Transformer factory function type
 * @param context - Transformation context
 * @returns Transformer function
 */
type TransformerFactory<T extends Node> = (context: TransformationContext) => Transformer<T>;

/**
 * Transformer function type
 * @param node - Node to transform
 * @returns Transformed node
 */
type Transformer<T extends Node> = (node: T) => T;

interface TransformationContext {
  /** Get compiler options */
  getCompilerOptions(): CompilerOptions;
  
  /** Start lexical environment scope */
  startLexicalEnvironment(): void;
  
  /** End lexical environment scope */
  endLexicalEnvironment(): Statement[] | undefined;
  
  /** Suspend lexical environment */
  suspendLexicalEnvironment(): void;
  
  /** Resume lexical environment */
  resumeLexicalEnvironment(): void;
  
  /** Hoist function declaration */
  hoistFunctionDeclaration(node: FunctionDeclaration): void;
  
  /** Hoist variable declaration */
  hoistVariableDeclaration(node: Identifier): void;
  
  /** Request emit helper */
  requestEmitHelper(helper: EmitHelper): void;
  
  /** Read emit helpers */
  readEmitHelpers(): EmitHelper[] | undefined;
  
  /** Enable emit notifications */
  enableEmitNotification(kind: SyntaxKind): void;
  
  /** Check if emit notifications enabled */
  isEmitNotificationEnabled(node: Node): boolean;
  
  /** Trigger emit notification */
  onEmitNode(hint: EmitHint, node: Node, emitCallback: (hint: EmitHint, node: Node) => void): void;
  
  /** Substitute node during emit */
  onSubstituteNode(hint: EmitHint, node: Node): Node;
}

interface TransformationResult<T extends Node> {
  /** Transformed nodes */
  transformed: readonly T[];
  
  /** Diagnostics from transformation */
  diagnostics?: readonly Diagnostic[];
  
  /** Substitution map */
  substituteNode?(hint: EmitHint, node: Node): Node;
  
  /** Emit node callback */
  emitNodeWithNotification?(hint: EmitHint, node: Node, emitCallback: (hint: EmitHint, node: Node) => void): void;
  
  /** Dispose transformation context */
  dispose?(): void;
}
```

**Usage Examples:**

```typescript
import * as ts from "typescript";

// Custom transformer that adds console.log to functions
function createLoggingTransformer(): ts.TransformerFactory<ts.SourceFile> {
  return (context: ts.TransformationContext) => {
    return (sourceFile: ts.SourceFile) => {
      function visit(node: ts.Node): ts.Node {
        if (ts.isFunctionDeclaration(node) && node.body) {
          const factory = context.factory;
          
          // Create console.log statement
          const logStatement = factory.createExpressionStatement(
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier("console"),
                factory.createIdentifier("log")
              ),
              undefined,
              [factory.createStringLiteral(`Entering function ${node.name?.text || 'anonymous'}`)]
            )
          );
          
          // Add to function body
          const newBody = factory.createBlock([
            logStatement,
            ...node.body.statements
          ]);
          
          return factory.updateFunctionDeclaration(
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
        
        return ts.visitEachChild(node, visit, context);
      }
      
      return ts.visitNode(sourceFile, visit);
    };
  };
}

// Use the transformer
const sourceFile = ts.createSourceFile(
  "example.ts",
  "function greet(name: string) { return `Hello, ${name}!`; }",
  ts.ScriptTarget.Latest
);

const result = ts.transform(sourceFile, [createLoggingTransformer()]);
const transformedSourceFile = result.transformed[0];
```

### Node Update Functions

Update existing AST nodes while preserving identity.

```typescript { .api }
interface NodeFactory {
  /**
   * Update function declaration
   * @param node - Original function declaration
   * @param modifiers - Updated modifiers
   * @param asteriskToken - Updated asterisk token
   * @param name - Updated name
   * @param typeParameters - Updated type parameters
   * @param parameters - Updated parameters
   * @param type - Updated return type
   * @param body - Updated body
   * @returns Updated function declaration
   */
  updateFunctionDeclaration(
    node: FunctionDeclaration,
    modifiers: readonly Modifier[] | undefined,
    asteriskToken: AsteriskToken | undefined,
    name: Identifier | undefined,
    typeParameters: readonly TypeParameterDeclaration[] | undefined,
    parameters: readonly ParameterDeclaration[],
    type: TypeNode | undefined,
    body: Block | undefined
  ): FunctionDeclaration;

  /**
   * Update class declaration
   * @param node - Original class declaration
   * @param modifiers - Updated modifiers
   * @param name - Updated name
   * @param typeParameters - Updated type parameters
   * @param heritageClauses - Updated heritage clauses
   * @param members - Updated members
   * @returns Updated class declaration
   */
  updateClassDeclaration(
    node: ClassDeclaration,
    modifiers: readonly Modifier[] | undefined,
    name: Identifier | undefined,
    typeParameters: readonly TypeParameterDeclaration[] | undefined,
    heritageClauses: readonly HeritageClause[] | undefined,
    members: readonly ClassElement[]
  ): ClassDeclaration;
}
```

### Printer and Emitter API

Print AST nodes back to source text and manage code emission.

```typescript { .api }
/**
 * Create AST-to-text printer
 * @param printerOptions - Printer configuration options
 * @param handlers - Optional emit handlers
 * @returns Printer instance
 */
function createPrinter(printerOptions?: PrinterOptions, handlers?: PrintHandlers): Printer;

interface Printer {
  /**
   * Print a source file to string
   * @param sourceFile - Source file to print
   * @returns Generated source text
   */
  printFile(sourceFile: SourceFile): string;
  
  /**
   * Print a bundle to string
   * @param bundle - Bundle to print
   * @returns Generated source text
   */
  printBundle(bundle: Bundle): string;
  
  /**
   * Print a node to string
   * @param hint - Emit hint for context
   * @param node - Node to print
   * @param sourceFile - Source file context
   * @returns Generated source text
   */
  printNode(hint: EmitHint, node: Node, sourceFile?: SourceFile): string;
  
  /**
   * Print list of nodes to string
   * @param format - List format
   * @param nodes - Nodes to print
   * @param sourceFile - Source file context
   * @returns Generated source text
   */
  printList<T extends Node>(format: ListFormat, nodes: NodeArray<T>, sourceFile?: SourceFile): string;
}

interface PrinterOptions {
  removeComments?: boolean;
  newLine?: NewLineKind;
  omitTrailingSemicolon?: boolean;
  noEmitHelpers?: boolean;
  module?: ModuleKind;
  target?: ScriptTarget;
  sourceMap?: boolean;
  inlineSourceMap?: boolean;
  inlineSources?: boolean;
  extendedDiagnostics?: boolean;
  onlyPrintJsDocStyle?: boolean;
  neverAsciiEscape?: boolean;
  writeBundleFileInfo?: boolean;
  recordInternalSection?: boolean;
  stripInternal?: boolean;
  preserveSourceNewlines?: boolean;
  terminateUnterminatedLiterals?: boolean;
  relativeToBuildInfo?: (path: string) => string;
}

interface PrintHandlers {
  hasGlobalName?(name: string): boolean;
  onEmitNode?(hint: EmitHint, node: Node, emitCallback: (hint: EmitHint, node: Node) => void): void;
  isEmitNotificationEnabled?(node: Node): boolean;
  substituteNode?(hint: EmitHint, node: Node): Node;
  onBeforeEmitNodeArray?(nodes: NodeArray<any> | undefined): void;
  onAfterEmitNodeArray?(nodes: NodeArray<any> | undefined): void;
  onBeforeEmitToken?(node: Node): void;
  onAfterEmitToken?(node: Node): void;
}

/**
 * Get output file paths for a source file
 * @param sourceFile - Source file to get paths for
 * @param host - Emit host
 * @param forceDtsPaths - Whether to force .d.ts paths
 * @returns Array of output file paths
 */
function getOutputPathsFor(
  sourceFile: SourceFile,
  host: EmitHost,
  forceDtsPaths: boolean
): readonly string[];

/**
 * Get output file extension for a source file
 * @param sourceFile - Source file
 * @param options - Compiler options
 * @returns Output file extension
 */
function getOutputExtension(sourceFile: SourceFile, options: CompilerOptions): Extension;

/**
 * Iterate over files that would be emitted
 * @param host - Emit host
 * @param action - Callback for each emitted file
 * @param sourceFilesOrTargetSourceFile - Source files to emit
 * @param forceDtsEmit - Whether to force .d.ts emission
 * @param onlyBuildInfo - Whether to emit only build info
 * @param includeBuildInfo - Whether to include build info
 */
function forEachEmittedFile<T>(
  host: EmitHost,
  action: (emitFileNames: EmitFileNames, sourceFileOrBundle?: SourceFile | Bundle) => T,
  sourceFilesOrTargetSourceFile?: readonly SourceFile[] | SourceFile,
  forceDtsEmit?: boolean,
  onlyBuildInfo?: boolean,
  includeBuildInfo?: boolean
): T | undefined;

interface EmitHost extends ScriptReferenceHost, ModuleSpecifierResolutionHost {
  getPrependNodes(): readonly (UnparsedSource | InputFiles)[];
  getCanonicalFileName(fileName: string): string;
  getCommonSourceDirectory(): string;
  getCurrentDirectory(): string;
  getNewLine(): string;
  getSourceFile(fileName: string): SourceFile | undefined;
  getSourceFileByPath(path: Path): SourceFile | undefined;
  getSourceFiles(): readonly SourceFile[];
  getLibFileFromReference(ref: FileReference): SourceFile | undefined;
  writeFile: WriteFileCallback;
  getProgramBuildInfo(): ProgramBuildInfo | undefined;
  getSourceRoot(): string | undefined;
  getSourceMapRoot(): string | undefined;
  getBuildInfo(bundle?: Bundle): BuildInfo | undefined;
}
```

### Utility Functions

Helper functions for node creation and manipulation.

```typescript { .api }
/**
 * Set text range for a node
 * @param range - Node to set range on
 * @param location - Source location to copy range from
 * @returns Node with updated range
 */
function setTextRange<T extends ReadonlyTextRange>(range: T, location: ReadonlyTextRange | undefined): T;

/**
 * Create source map source
 * @param fileName - Source file name
 * @param text - Source text
 * @param skipTrivia - Whether to skip trivia
 * @returns Source map source
 */
function createSourceMapSource(fileName: string, text: string, skipTrivia?: (pos: number) => number): SourceMapSource;

/**
 * Create node array from elements
 * @param elements - Array elements
 * @param hasTrailingComma - Whether array has trailing comma
 * @returns Node array
 */
function createNodeArray<T extends Node>(elements?: readonly T[], hasTrailingComma?: boolean): NodeArray<T>;

/**
 * Move node to a new synthetic location
 * @param node - Node to move
 * @param pos - New start position
 * @returns Node with updated synthetic position
 */
function moveRangePastDecorators(node: Node): number;

/**
 * Move node past modifiers
 * @param node - Node to analyze
 * @returns Position after modifiers
 */
function moveRangePastModifiers(node: Node): number;
```

## Types

### Factory Types

```typescript { .api }
interface BaseNodeFactory {
  createBaseSourceFileNode(kind: SyntaxKind): Node;
  createBaseIdentifierNode(kind: SyntaxKind): Node;
  createBaseTokenNode(kind: SyntaxKind): Node;
  createBaseNode(kind: SyntaxKind): Node;
}

interface NodeFactory extends BaseNodeFactory {
  readonly flags: NodeFactoryFlags;
  createNodeArray<T extends Node>(elements?: readonly T[], hasTrailingComma?: boolean): NodeArray<T>;
  createNumericLiteral(value: string | number, numericLiteralFlags?: TokenFlags): NumericLiteral;
  createBigIntLiteral(value: string | PseudoBigInt): BigIntLiteral;
  createStringLiteral(text: string, isSingleQuote?: boolean): StringLiteral;
  createStringLiteralFromNode(sourceNode: PropertyNameLiteral, isSingleQuote?: boolean): StringLiteral;
  createRegularExpressionLiteral(text: string): RegularExpressionLiteral;
  createLiteralLikeNode(kind: LiteralToken["kind"] | SyntaxKind.JsxTextAllWhiteSpaces, text: string): LiteralLikeNode;
}
```

### Transformation Types

```typescript { .api }
interface CustomTransformers {
  /** Transformers to apply before TypeScript's built-in transformations */
  before?: (TransformerFactory<SourceFile> | CustomTransformerFactory)[];
  
  /** Transformers to apply after TypeScript's built-in transformations */
  after?: (TransformerFactory<SourceFile> | CustomTransformerFactory)[];
  
  /** Transformers to apply to .d.ts files after TypeScript's built-in .d.ts transformations */
  afterDeclarations?: (TransformerFactory<Bundle | SourceFile> | CustomTransformerFactory)[];
}

interface CustomTransformerFactory {
  (context: TransformationContext): CustomTransformer;
}

interface CustomTransformer {
  transformSourceFile(node: SourceFile): SourceFile;
  transformBundle(node: Bundle): Bundle;
}

enum EmitHint {
  SourceFile = 0,
  Expression = 1,
  IdentifierName = 2,
  MappedTypeParameter = 3,
  Unspecified = 4,
  EmbeddedStatement = 5,
  JsxAttributeValue = 6
}

interface EmitHelper {
  readonly name: string;
  readonly scoped: boolean;
  readonly text: string | ((node: EmitHelperUniqueNameCallback) => string);
  readonly priority?: number;
  readonly dependencies?: EmitHelper[];
}
```