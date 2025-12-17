# Utilities and Helpers

Essential utility functions for working with TypeScript AST nodes, including type guards, text operations, and traversal helpers.

## Capabilities

### Type Guards

Functions that determine the type of AST nodes at runtime.

```typescript { .api }
/**
 * Check if node is an identifier
 * @param node - Node to test
 * @returns True if node is an identifier
 */
function isIdentifier(node: Node): node is Identifier;

/**
 * Check if node is a string literal
 * @param node - Node to test
 * @returns True if node is a string literal
 */
function isStringLiteral(node: Node): node is StringLiteral;

/**
 * Check if node is a numeric literal
 * @param node - Node to test
 * @returns True if node is a numeric literal
 */
function isNumericLiteral(node: Node): node is NumericLiteral;

/**
 * Check if node is a function declaration
 * @param node - Node to test
 * @returns True if node is a function declaration
 */
function isFunctionDeclaration(node: Node): node is FunctionDeclaration;

/**
 * Check if node is a class declaration
 * @param node - Node to test
 * @returns True if node is a class declaration
 */
function isClassDeclaration(node: Node): node is ClassDeclaration;

/**
 * Check if node is an interface declaration
 * @param node - Node to test
 * @returns True if node is an interface declaration
 */
function isInterfaceDeclaration(node: Node): node is InterfaceDeclaration;

/**
 * Check if node is a variable declaration
 * @param node - Node to test
 * @returns True if node is a variable declaration
 */
function isVariableDeclaration(node: Node): node is VariableDeclaration;

/**
 * Check if node is a method declaration
 * @param node - Node to test
 * @returns True if node is a method declaration
 */
function isMethodDeclaration(node: Node): node is MethodDeclaration;

/**
 * Check if node is a property declaration
 * @param node - Node to test
 * @returns True if node is a property declaration
 */
function isPropertyDeclaration(node: Node): node is PropertyDeclaration;

/**
 * Check if node is a parameter declaration
 * @param node - Node to test
 * @returns True if node is a parameter declaration
 */
function isParameterDeclaration(node: Node): node is ParameterDeclaration;
```

**Usage Examples:**

```typescript
import * as ts from "typescript";

const sourceFile = ts.createSourceFile(
  "example.ts",
  `
    class User {
      name: string;
      constructor(name: string) {
        this.name = name;
      }
      greet(): string {
        return "Hello!";
      }
    }
  `,
  ts.ScriptTarget.Latest
);

function analyzeNode(node: ts.Node) {
  if (ts.isClassDeclaration(node)) {
    console.log(`Found class: ${node.name?.text}`);
    
    for (const member of node.members) {
      if (ts.isPropertyDeclaration(member)) {
        console.log(`  Property: ${member.name?.getText()}`);
      } else if (ts.isMethodDeclaration(member)) {
        console.log(`  Method: ${member.name?.getText()}`);
      } else if (ts.isConstructorDeclaration(member)) {
        console.log(`  Constructor with ${member.parameters.length} parameters`);
      }
    }
  }
  
  ts.forEachChild(node, analyzeNode);
}

analyzeNode(sourceFile);
```

### Expression Type Guards

Type guards for various expression types.

```typescript { .api }
/**
 * Check if node is an expression
 * @param node - Node to test
 * @returns True if node is an expression
 */
function isExpression(node: Node): node is Expression;

/**
 * Check if node is a call expression
 * @param node - Node to test
 * @returns True if node is a call expression
 */
function isCallExpression(node: Node): node is CallExpression;

/**
 * Check if node is a property access expression
 * @param node - Node to test
 * @returns True if node is a property access expression
 */
function isPropertyAccessExpression(node: Node): node is PropertyAccessExpression;

/**
 * Check if node is an element access expression
 * @param node - Node to test
 * @returns True if node is an element access expression
 */
function isElementAccessExpression(node: Node): node is ElementAccessExpression;

/**
 * Check if node is a binary expression
 * @param node - Node to test
 * @returns True if node is a binary expression
 */
function isBinaryExpression(node: Node): node is BinaryExpression;

/**
 * Check if node is a conditional expression
 * @param node - Node to test
 * @returns True if node is a conditional expression
 */
function isConditionalExpression(node: Node): node is ConditionalExpression;

/**
 * Check if node is an arrow function
 * @param node - Node to test
 * @returns True if node is an arrow function
 */
function isArrowFunction(node: Node): node is ArrowFunction;

/**
 * Check if node is a template expression
 * @param node - Node to test
 * @returns True if node is a template expression
 */
function isTemplateExpression(node: Node): node is TemplateExpression;

/**
 * Check if node is an object literal expression
 * @param node - Node to test
 * @returns True if node is an object literal expression
 */
function isObjectLiteralExpression(node: Node): node is ObjectLiteralExpression;

/**
 * Check if node is an array literal expression
 * @param node - Node to test
 * @returns True if node is an array literal expression
 */
function isArrayLiteralExpression(node: Node): node is ArrayLiteralExpression;
```

### Statement Type Guards

Type guards for various statement types.

```typescript { .api }
/**
 * Check if node is a statement
 * @param node - Node to test
 * @returns True if node is a statement
 */
function isStatement(node: Node): node is Statement;

/**
 * Check if node is a block statement
 * @param node - Node to test
 * @returns True if node is a block statement
 */
function isBlock(node: Node): node is Block;

/**
 * Check if node is an if statement
 * @param node - Node to test
 * @returns True if node is an if statement
 */
function isIfStatement(node: Node): node is IfStatement;

/**
 * Check if node is a for statement
 * @param node - Node to test
 * @returns True if node is a for statement
 */
function isForStatement(node: Node): node is ForStatement;

/**
 * Check if node is a while statement
 * @param node - Node to test
 * @returns True if node is a while statement
 */
function isWhileStatement(node: Node): node is WhileStatement;

/**
 * Check if node is a return statement
 * @param node - Node to test
 * @returns True if node is a return statement
 */
function isReturnStatement(node: Node): node is ReturnStatement;

/**
 * Check if node is a try statement
 * @param node - Node to test
 * @returns True if node is a try statement
 */
function isTryStatement(node: Node): node is TryStatement;

/**
 * Check if node is a switch statement
 * @param node - Node to test
 * @returns True if node is a switch statement
 */
function isSwitchStatement(node: Node): node is SwitchStatement;

/**
 * Check if node is an expression statement
 * @param node - Node to test
 * @returns True if node is an expression statement
 */
function isExpressionStatement(node: Node): node is ExpressionStatement;

/**
 * Check if node is a variable statement
 * @param node - Node to test
 * @returns True if node is a variable statement
 */
function isVariableStatement(node: Node): node is VariableStatement;
```

### Type Node Guards

Type guards for TypeScript type annotations.

```typescript { .api }
/**
 * Check if node is a type node
 * @param node - Node to test
 * @returns True if node is a type node
 */
function isTypeNode(node: Node): node is TypeNode;

/**
 * Check if node is a type reference node
 * @param node - Node to test
 * @returns True if node is a type reference node
 */
function isTypeReferenceNode(node: Node): node is TypeReferenceNode;

/**
 * Check if node is a union type node
 * @param node - Node to test
 * @returns True if node is a union type node
 */
function isUnionTypeNode(node: Node): node is UnionTypeNode;

/**
 * Check if node is an intersection type node
 * @param node - Node to test
 * @returns True if node is an intersection type node
 */
function isIntersectionTypeNode(node: Node): node is IntersectionTypeNode;

/**
 * Check if node is an array type node
 * @param node - Node to test
 * @returns True if node is an array type node
 */
function isArrayTypeNode(node: Node): node is ArrayTypeNode;

/**
 * Check if node is a tuple type node
 * @param node - Node to test
 * @returns True if node is a tuple type node
 */
function isTupleTypeNode(node: Node): node is TupleTypeNode;

/**
 * Check if node is a function type node
 * @param node - Node to test
 * @returns True if node is a function type node
 */
function isFunctionTypeNode(node: Node): node is FunctionTypeNode;

/**
 * Check if node is a mapped type node
 * @param node - Node to test
 * @returns True if node is a mapped type node
 */
function isMappedTypeNode(node: Node): node is MappedTypeNode;

/**
 * Check if node is a conditional type node
 * @param node - Node to test
 * @returns True if node is a conditional type node
 */
function isConditionalTypeNode(node: Node): node is ConditionalTypeNode;

/**
 * Check if node is a literal type node
 * @param node - Node to test
 * @returns True if node is a literal type node
 */
function isLiteralTypeNode(node: Node): node is LiteralTypeNode;
```

### Node Navigation

Functions for traversing and finding AST nodes.

```typescript { .api }
/**
 * Get the original node before transformations
 * @param node - Node to get original for
 * @param nodeTest - Optional test function to validate result
 * @returns Original node
 */
function getOriginalNode(node: Node): Node;
function getOriginalNode<T extends Node>(node: Node, nodeTest: (node: Node) => node is T): T;
function getOriginalNode(node: Node | undefined): Node | undefined;
function getOriginalNode<T extends Node>(node: Node | undefined, nodeTest: (node: Node | undefined) => node is T): T | undefined;

/**
 * Find ancestor node matching predicate
 * @param node - Starting node
 * @param callback - Predicate function
 * @returns Found ancestor or undefined
 */
function findAncestor<T extends Node>(node: Node | undefined, callback: (element: Node) => element is T): T | undefined;
function findAncestor(node: Node | undefined, callback: (element: Node) => boolean): Node | undefined;

/**
 * Check if node is from original parse tree
 * @param node - Node to check
 * @returns True if from parse tree
 */
function isParseTreeNode(node: Node): boolean;

/**
 * Get original parse tree node
 * @param node - Node to get parse tree node for
 * @param nodeTest - Optional test function
 * @returns Parse tree node
 */
function getParseTreeNode(node: Node | undefined): Node | undefined;
function getParseTreeNode<T extends Node>(node: T | undefined, nodeTest?: (node: Node) => node is T): T | undefined;

/**
 * Get all leading trivia for a node
 * @param node - Node to get trivia for
 * @param sourceFile - Source file containing the node
 * @param includeJSDoc - Whether to include JSDoc comments
 * @returns Array of trivia ranges
 */
function getLeadingCommentRanges(text: string, pos: number): CommentRange[] | undefined;

/**
 * Get all trailing trivia for a node
 * @param text - Source text
 * @param pos - Position to start from
 * @returns Array of trivia ranges
 */
function getTrailingCommentRanges(text: string, pos: number): CommentRange[] | undefined;
```

**Usage Examples:**

```typescript
import * as ts from "typescript";

// Find all function declarations in a class
function findFunctionsInClass(classNode: ts.ClassDeclaration): ts.FunctionLikeDeclaration[] {
  const functions: ts.FunctionLikeDeclaration[] = [];
  
  function visit(node: ts.Node) {
    if (ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node) || ts.isArrowFunction(node)) {
      functions.push(node);
    }
    ts.forEachChild(node, visit);
  }
  
  visit(classNode);
  return functions;
}

// Find the containing class for a method
function findContainingClass(node: ts.Node): ts.ClassDeclaration | undefined {
  return ts.findAncestor(node, ts.isClassDeclaration);
}
```

### Text and Position Utilities

Functions for working with text positions and spans.

```typescript { .api }
/**
 * Get the end position of a text span
 * @param span - Text span
 * @returns End position
 */
function textSpanEnd(span: TextSpan): number;

/**
 * Check if a text span contains a position
 * @param span - Text span to check
 * @param position - Position to test
 * @returns True if span contains position
 */
function textSpanContainsPosition(span: TextSpan, position: number): boolean;

/**
 * Check if a text span contains another text span
 * @param span - Container span
 * @param other - Contained span
 * @returns True if span contains other
 */
function textSpanContainsTextSpan(span: TextSpan, other: TextSpan): boolean;

/**
 * Check if two text spans overlap
 * @param span1 - First span
 * @param span2 - Second span
 * @returns True if spans overlap
 */
function textSpanOverlapsWith(span1: TextSpan, span2: TextSpan): boolean;

/**
 * Get intersection of two text spans
 * @param span1 - First span
 * @param span2 - Second span
 * @returns Intersection span or undefined
 */
function textSpanIntersection(span1: TextSpan, span2: TextSpan): TextSpan | undefined;

/**
 * Create a text span
 * @param start - Start position
 * @param length - Length of span
 * @returns Text span object
 */
function createTextSpan(start: number, length: number): TextSpan;

/**
 * Check if a text span is empty (has zero length)
 * @param span - Text span to check
 * @returns True if span is empty
 */
function textSpanIsEmpty(span: TextSpan): boolean;

/**
 * Create a text change range
 * @param span - Text span being changed
 * @param newLength - New length after change
 * @returns Text change range object
 */
function createTextChangeRange(span: TextSpan, newLength: number): TextChangeRange;

/**
 * Collapse multiple text change ranges across versions
 * @param changes - Array of text change ranges
 * @returns Collapsed text change range
 */
function collapseTextChangeRangesAcrossMultipleVersions(changes: readonly TextChangeRange[]): TextChangeRange;
```

### Identifier Utilities

Functions for working with TypeScript identifiers.

```typescript { .api }
/**
 * Escape leading underscores in identifier for internal use
 * @param identifier - Identifier text
 * @returns Escaped identifier
 */
function escapeLeadingUnderscores(identifier: string): __String;

/**
 * Unescape leading underscores for display
 * @param identifier - Escaped identifier
 * @returns Unescaped identifier text
 */
function unescapeLeadingUnderscores(identifier: __String): string;

/**
 * Get text content of identifier node
 * @param identifier - Identifier node
 * @returns Identifier text
 */
function idText(identifier: Identifier): string;

/**
 * Get display name of symbol
 * @param symbol - Symbol to get name for
 * @returns Symbol display name
 */
function symbolName(symbol: Symbol): string;

/**
 * Check if identifier name is reserved word
 * @param name - Identifier name to check
 * @param languageVersion - Language version context
 * @returns True if reserved word
 */
function isIdentifierANonContextualKeyword(name: string): boolean;

/**
 * Check if text is a valid identifier
 * @param text - Text to validate
 * @param languageVersion - Language version context
 * @returns True if valid identifier
 */
function isValidIdentifier(text: string, languageVersion?: ScriptTarget): boolean;
```

### JSDoc Utilities

Functions for working with JSDoc comments and annotations.

```typescript { .api }
/**
 * Get all JSDoc tags for an AST node
 * @param node - Node to get JSDoc tags for
 * @returns Array of JSDoc tag nodes
 */
function getJSDocTags(node: Node): readonly JSDocTag[] | undefined;

/**
 * Get JSDoc type annotation for a node
 * @param node - Node to get JSDoc type for
 * @returns JSDoc type node
 */
function getJSDocType(node: Node): TypeNode | undefined;

/**
 * Get JSDoc return type annotation
 * @param node - Node to get return type for
 * @returns JSDoc return type node
 */
function getJSDocReturnType(node: Node): TypeNode | undefined;

/**
 * Extract text content from JSDoc comment
 * @param comment - JSDoc comment node
 * @returns Comment text
 */
function getTextOfJSDocComment(comment: JSDocComment | undefined): string | undefined;

/**
 * Get JSDoc parameter tags for a function
 * @param node - Function node
 * @returns Array of JSDoc parameter tags
 */
function getJSDocParameterTags(node: FunctionLikeDeclaration): readonly JSDocParameterTag[];

/**
 * Get JSDoc deprecated tag if present
 * @param node - Node to check
 * @returns JSDoc deprecated tag
 */
function getJSDocDeprecatedTag(node: Node): JSDocDeprecatedTag | undefined;

/**
 * Get all JSDoc comments for a node including parents
 * @param node - Node to get comments for
 * @param sourceFile - Source file containing node
 * @returns Array of JSDoc comment nodes
 */
function getJSDocCommentsAndTags(node: Node, checkParentVariableStatement?: boolean): readonly (JSDoc | JSDocTag)[];
```

**Usage Examples:**

```typescript
import * as ts from "typescript";

// Extract JSDoc information from functions
function analyzeJSDoc(node: ts.FunctionDeclaration) {
  const jsdocTags = ts.getJSDocTags(node);
  if (jsdocTags) {
    for (const tag of jsdocTags) {
      if (ts.isJSDocParameterTag(tag)) {
        console.log(`@param ${tag.name?.getText()}: ${tag.comment}`);
      } else if (ts.isJSDocReturnTag(tag)) {
        console.log(`@returns: ${tag.comment}`);
      }
    }
  }
  
  const deprecatedTag = ts.getJSDocDeprecatedTag(node);
  if (deprecatedTag) {
    console.log(`Function is deprecated: ${deprecatedTag.comment}`);
  }
}
```

### Syntax Kind Utilities

Functions for working with syntax kinds and tokens.

```typescript { .api }
/**
 * Check if syntax kind is a token
 * @param kind - Syntax kind to test
 * @returns True if kind is a token
 */
function isToken(kind: SyntaxKind): boolean;

/**
 * Check if syntax kind is a keyword
 * @param kind - Syntax kind to test
 * @returns True if kind is a keyword
 */
function isKeyword(kind: SyntaxKind): boolean;

/**
 * Check if syntax kind is a modifier
 * @param kind - Syntax kind to test
 * @returns True if kind is a modifier
 */
function isModifierKind(kind: SyntaxKind): boolean;

/**
 * Check if syntax kind is a literal
 * @param kind - Syntax kind to test
 * @returns True if kind is a literal
 */
function isLiteralKind(kind: SyntaxKind): boolean;

/**
 * Check if syntax kind is a punctuation token
 * @param kind - Syntax kind to test
 * @returns True if kind is punctuation
 */
function isPunctuation(kind: SyntaxKind): boolean;

/**
 * Get token text for a syntax kind
 * @param kind - Syntax kind
 * @returns Token text or undefined
 */
function tokenToString(kind: SyntaxKind): string | undefined;

/**
 * Get syntax kind from token text
 * @param text - Token text
 * @returns Syntax kind or undefined
 */
function stringToToken(text: string): SyntaxKind | undefined;
```

### Binding Pattern Utilities

Functions for working with destructuring patterns.

```typescript { .api }
/**
 * Check if node is a binding pattern
 * @param node - Node to test
 * @returns True if node is binding pattern
 */
function isBindingPattern(node: Node | undefined): node is BindingPattern;

/**
 * Check if node is an object binding pattern
 * @param node - Node to test
 * @returns True if node is object binding pattern
 */
function isObjectBindingPattern(node: Node): node is ObjectBindingPattern;

/**
 * Check if node is an array binding pattern
 * @param node - Node to test
 * @returns True if node is array binding pattern
 */
function isArrayBindingPattern(node: Node): node is ArrayBindingPattern;

/**
 * Check if node is a binding element
 * @param node - Node to test
 * @returns True if node is binding element
 */
function isBindingElement(node: Node): node is BindingElement;

/**
 * Check if binding element is a rest element
 * @param node - Binding element to test
 * @returns True if rest element
 */
function isRestElement(node: Node): node is RestElement;

/**
 * Get name from binding pattern element
 * @param element - Binding element
 * @returns Element name
 */
function getNameOfBindingElement(element: BindingElement): string | undefined;
```

## Types

### Utility Types

```typescript { .api }
type __String = string & { __escapedIdentifier: void };

interface TextSpan {
  start: number;
  length: number;
}

interface TextChangeRange {
  span: TextSpan;
  newLength: number;
}

interface CommentRange extends TextRange {
  hasTrailingNewLine?: boolean;
  kind: CommentKind;
}

enum CommentKind {
  SingleLine = 0,
  MultiLine = 1
}

interface JSDocComment {
  kind: SyntaxKind.JSDocComment;
  comment?: string | NodeArray<JSDocText | JSDocLink>;
  tags?: NodeArray<JSDocTag>;
}

interface JSDocTag extends Node {
  parent: JSDoc | JSDocTypeLiteral;
  tagName: Identifier;
  comment?: string | NodeArray<JSDocText | JSDocLink>;
}

interface JSDocParameterTag extends JSDocTag {
  kind: SyntaxKind.JSDocParameterTag;
  name: EntityName;
  typeExpression?: JSDocTypeExpression;
  isNameFirst: boolean;
  isBracketed: boolean;
}
```

### Type Guard Result Types

```typescript { .api }
// All type guard functions return type predicates
// Example signatures:
function isIdentifier(node: Node): node is Identifier;
function isFunctionDeclaration(node: Node): node is FunctionDeclaration;
function isStringLiteral(node: Node): node is StringLiteral;

// These enable TypeScript to narrow types automatically
const node: ts.Node = getNode();
if (ts.isIdentifier(node)) {
  // node is now typed as ts.Identifier
  console.log(node.text); // TypeScript knows 'text' property exists
}

if (ts.isFunctionDeclaration(node)) {
  // node is now typed as ts.FunctionDeclaration
  console.log(node.name?.text); // TypeScript knows about function properties
}
```