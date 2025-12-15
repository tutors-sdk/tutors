# Source Code Analysis

The SourceCode class provides a rich abstraction of JavaScript source code with comprehensive utilities for rules to analyze and manipulate code. It combines the parsed AST with the original source text and provides methods for navigating tokens, comments, scopes, and source locations.

## Capabilities

### SourceCode Constructor

Creates a SourceCode instance from source text and AST.

```javascript { .api }
/**
 * Creates a SourceCode instance from text and AST
 * @param text - Source code text
 * @param ast - Parsed AST (Program node)
 */
constructor(text: string, ast: Program);

/**
 * Creates a SourceCode instance from configuration object
 * @param config - Configuration with text, AST, and additional options
 */
constructor(config: {
  text: string;
  ast: Program;
  /** Whether source text has Unicode BOM */
  hasBOM?: boolean;
  /** Parser-specific services */
  parserServices?: Object;
  /** Scope analysis results */
  scopeManager?: ScopeManager;
  /** AST visitor keys */  
  visitorKeys?: Object;
});
```

**Usage Examples:**

```javascript
import { SourceCode } from "eslint";

// Basic construction
const sourceCode = new SourceCode("const x = 1;", ast);

// With additional configuration
const sourceCode = new SourceCode({
  text: "const x = 1;",
  ast: ast,
  hasBOM: false,
  parserServices: customParserServices,
  scopeManager: scopeManager,
  visitorKeys: customVisitorKeys
});
```

### Static Methods

Utility methods for working with source text.

```javascript { .api }
/**
 * Split text into lines preserving line ending information
 * @param text - Text to split into lines
 * @returns Array of lines without line endings
 */
static splitLines(text: string): string[];
```

### Instance Properties

Properties providing access to source code components.

```javascript { .api }
/** Source code text with BOM removed */
readonly text: string;

/** Parsed AST root node */
readonly ast: Program;

/** Whether original source had Unicode BOM */
readonly hasBOM: boolean;

/** Source code split into lines */
readonly lines: string[];

/** Scope analysis results */
readonly scopeManager: ScopeManager;

/** Parser-specific services object */
readonly parserServices: Object;

/** AST visitor keys for traversal */
readonly visitorKeys: Object;
```

### Text Retrieval

Get source text for nodes and ranges.

```javascript { .api }
/**
 * Get source text for a node with optional context
 * @param node - AST node to get text for (default: entire source)
 * @param beforeCount - Number of characters before node
 * @param afterCount - Number of characters after node
 * @returns Source text for the specified range
 */
getText(node?: ASTNode, beforeCount?: number, afterCount?: number): string;

/**
 * Get all source lines
 * @returns Array of source code lines
 */
getLines(): string[];
```

**Usage Examples:**

```javascript
// Get entire source
const fullText = sourceCode.getText();

// Get text for specific node
const nodeText = sourceCode.getText(node);

// Get node text with context
const contextText = sourceCode.getText(node, 2, 2); // 2 chars before/after

// Get all lines
const lines = sourceCode.getLines();
```

### Comment Access

Retrieve comments from the source code.

```javascript { .api }
/**
 * Get all comments in the source code
 * @returns Array of all comment nodes
 */
getAllComments(): Comment[];

/**
 * Get JSDoc comment for a node (deprecated - use getJSDocComment from context)
 * @param node - Node to find JSDoc comment for
 * @returns JSDoc comment node or null
 * @deprecated Use context.sourceCode.getJSDocComment instead
 */
getJSDocComment(node: ASTNode): Comment | null;

/**
 * Get comments before a node or token
 * @param nodeOrToken - Node or token to get comments before
 * @returns Array of comment nodes before the node/token
 */
getCommentsBefore(nodeOrToken: ASTNode | Token): Comment[];

/**
 * Get comments after a node or token
 * @param nodeOrToken - Node or token to get comments after
 * @returns Array of comment nodes after the node/token
 */
getCommentsAfter(nodeOrToken: ASTNode | Token): Comment[];

/**
 * Get comments inside a node
 * @param node - Node to get internal comments for
 * @returns Array of comment nodes inside the node
 */
getCommentsInside(node: ASTNode): Comment[];

/**
 * Check if comments exist between two nodes/tokens
 * @param left - Left node or token
 * @param right - Right node or token
 * @returns True if comments exist between the nodes/tokens
 */
commentsExistBetween(left: ASTNode | Token, right: ASTNode | Token): boolean;
```

### Node and Range Utilities

Navigate and locate nodes by position.

```javascript { .api }
/**
 * Get node at a specific character index
 * @param index - Character index in source code
 * @returns AST node at the index or null
 */
getNodeByRangeIndex(index: number): ASTNode | null;

/**
 * Check if whitespace exists between two nodes/tokens
 * @param first - First node or token
 * @param second - Second node or token
 * @returns True if whitespace exists between them
 */
isSpaceBetween(first: ASTNode | Token, second: ASTNode | Token): boolean;

/**
 * Convert character index to line/column location
 * @param index - Character index
 * @returns Location object with line and column
 */
getLocFromIndex(index: number): {line: number, column: number};

/**
 * Convert line/column location to character index
 * @param loc - Location with line and column
 * @returns Character index in source code
 */
getIndexFromLoc(loc: {line: number, column: number}): number;

/**
 * Get location information for a node or token
 * @param nodeOrToken - Node or token to get location for
 * @returns Source location object
 */
getLoc(nodeOrToken: ASTNode | Token): SourceLocation;

/**
 * Get character range for a node or token
 * @param nodeOrToken - Node or token to get range for
 * @returns Character range as [start, end]
 */
getRange(nodeOrToken: ASTNode | Token): [number, number];
```

### Scope Analysis

Access scope and variable information.

```javascript { .api }
/**
 * Get scope for a specific node
 * @param node - Node to get scope for
 * @returns Scope object for the node
 */
getScope(node: ASTNode): Scope;

/**
 * Get variables declared by a node
 * @param node - Node to get declared variables for
 * @returns Array of variables declared by the node
 */
getDeclaredVariables(node: ASTNode): Variable[];

/**
 * Get ancestor nodes for a node
 * @param node - Node to get ancestors for
 * @returns Array of ancestor nodes from parent to root
 */
getAncestors(node: ASTNode): ASTNode[];

/**
 * Check if a node is a global reference
 * @param node - Identifier node to check
 * @returns True if the identifier is a global reference
 */
isGlobalReference(node: ASTNode): boolean;

/**
 * Mark a variable as used in the current scope
 * @param name - Variable name to mark as used
 * @param refNode - Reference node (default: current node)
 * @returns True if variable was found and marked
 */
markVariableAsUsed(name: string, refNode?: ASTNode): boolean;
```

### Token Navigation

Comprehensive token navigation and retrieval methods.

```javascript { .api }
/**
 * Get token at a specific character offset
 * @param offset - Character offset
 * @param options - Options for token retrieval
 * @returns Token at the offset or null
 */
getTokenByRangeStart(offset: number, options?: {includeComments?: boolean}): Token | null;

/**
 * Get first token of a node
 * @param node - Node to get first token for
 * @param options - Options for token filtering and skipping
 * @returns First token of the node or null
 */
getFirstToken(node: ASTNode, options?: TokenOptions): Token | null;

/**
 * Get first N tokens of a node
 * @param node - Node to get tokens for
 * @param options - Options for token filtering and count
 * @returns Array of first tokens
 */
getFirstTokens(node: ASTNode, options?: TokenCountOptions): Token[];

/**
 * Get last token of a node
 * @param node - Node to get last token for
 * @param options - Options for token filtering and skipping
 * @returns Last token of the node or null
 */
getLastToken(node: ASTNode, options?: TokenOptions): Token | null;

/**
 * Get last N tokens of a node
 * @param node - Node to get tokens for
 * @param options - Options for token filtering and count
 * @returns Array of last tokens
 */
getLastTokens(node: ASTNode, options?: TokenCountOptions): Token[];

/**
 * Get token before a node or token
 * @param nodeOrToken - Node or token to get predecessor for
 * @param options - Options for token filtering and skipping
 * @returns Token before the node/token or null
 */
getTokenBefore(nodeOrToken: ASTNode | Token, options?: TokenOptions): Token | null;

/**
 * Get N tokens before a node or token
 * @param nodeOrToken - Node or token to get predecessors for
 * @param options - Options for token filtering and count
 * @returns Array of tokens before the node/token
 */
getTokensBefore(nodeOrToken: ASTNode | Token, options?: TokenCountOptions): Token[];

/**
 * Get token after a node or token
 * @param nodeOrToken - Node or token to get successor for
 * @param options - Options for token filtering and skipping
 * @returns Token after the node/token or null
 */
getTokenAfter(nodeOrToken: ASTNode | Token, options?: TokenOptions): Token | null;

/**
 * Get N tokens after a node or token
 * @param nodeOrToken - Node or token to get successors for
 * @param options - Options for token filtering and count
 * @returns Array of tokens after the node/token
 */
getTokensAfter(nodeOrToken: ASTNode | Token, options?: TokenCountOptions): Token[];

/**
 * Get first token between two nodes/tokens
 * @param left - Left boundary node or token
 * @param right - Right boundary node or token
 * @param options - Options for token filtering and skipping
 * @returns First token between boundaries or null
 */
getFirstTokenBetween(left: ASTNode | Token, right: ASTNode | Token, options?: TokenOptions): Token | null;

/**
 * Get first N tokens between two nodes/tokens
 * @param left - Left boundary node or token
 * @param right - Right boundary node or token
 * @param options - Options for token filtering and count
 * @returns Array of first tokens between boundaries
 */
getFirstTokensBetween(left: ASTNode | Token, right: ASTNode | Token, options?: TokenCountOptions): Token[];

/**
 * Get last token between two nodes/tokens
 * @param left - Left boundary node or token
 * @param right - Right boundary node or token
 * @param options - Options for token filtering and skipping
 * @returns Last token between boundaries or null
 */
getLastTokenBetween(left: ASTNode | Token, right: ASTNode | Token, options?: TokenOptions): Token | null;

/**
 * Get last N tokens between two nodes/tokens
 * @param left - Left boundary node or token
 * @param right - Right boundary node or token
 * @param options - Options for token filtering and count
 * @returns Array of last tokens between boundaries
 */
getLastTokensBetween(left: ASTNode | Token, right: ASTNode | Token, options?: TokenCountOptions): Token[];

/**
 * Get all tokens between two nodes/tokens
 * @param left - Left boundary node or token
 * @param right - Right boundary node or token
 * @param options - Options for token filtering and count
 * @returns Array of all tokens between boundaries
 */
getTokensBetween(left: ASTNode | Token, right: ASTNode | Token, options?: TokenCountOptions): Token[];

/**
 * Get all tokens for a node with optional context
 * @param node - Node to get tokens for
 * @param beforeCount - Number of tokens before node
 * @param afterCount - Number of tokens after node
 * @returns Array of tokens for the node
 */
getTokens(node: ASTNode, beforeCount?: number, afterCount?: number): Token[];
```

## Token Options

```javascript { .api }
interface TokenOptions {
  /** Include comments in results */
  includeComments?: boolean;
  /** Filter function for tokens */
  filter?: (token: Token) => boolean;
  /** Number of tokens to skip */
  skip?: number;
}

interface TokenCountOptions {
  /** Include comments in results */
  includeComments?: boolean;
  /** Filter function for tokens */
  filter?: (token: Token) => boolean;
  /** Maximum number of tokens to return */
  count?: number;
}
```

## Type Definitions

```javascript { .api }
interface Token {
  /** Token type */
  type: TokenType;
  /** Token value */
  value: string;
  /** Character range */
  range: [number, number];
  /** Source location */
  loc: SourceLocation;
}

type TokenType = "Boolean" | "Null" | "Identifier" | "Keyword" | "Punctuator" | "JSXIdentifier" | "JSXText" | "Numeric" | "String" | "RegularExpression";

interface Comment {
  /** Comment type */
  type: "Line" | "Block";
  /** Comment value */
  value: string;
  /** Character range */
  range: [number, number];
  /** Source location */
  loc: SourceLocation;
}

interface SourceLocation {
  /** Start position */
  start: {line: number, column: number};
  /** End position */
  end: {line: number, column: number};
}

interface Scope {
  /** Scope type */
  type: "block" | "catch" | "class" | "for" | "function" | "function-expression-name" | "global" | "module" | "switch" | "with" | "TDZ";
  /** Whether scope is in strict mode */
  isStrict: boolean;
  /** Parent scope */
  upper: Scope | null;
  /** Child scopes */
  childScopes: Scope[];
  /** Associated AST node */
  block: ASTNode;
  /** Variables defined in this scope */
  variables: Variable[];
  /** References to variables */
  references: Reference[];
  /** References that couldn't be resolved */
  through: Reference[];
}

interface Variable {
  /** Variable name */
  name: string;
  /** Scope containing this variable */
  scope: Scope;
  /** Identifier nodes that define this variable */
  identifiers: ASTNode[];
  /** All references to this variable */
  references: Reference[];
  /** Variable definitions */
  defs: Definition[];
}

interface Reference {
  /** Identifier node */
  identifier: ASTNode;
  /** Scope containing the reference */
  from: Scope;
  /** Variable being referenced (null if unresolved) */
  resolved: Variable | null;
  /** Expression being written to (for write references) */
  writeExpr: ASTNode | null;
  /** Whether this is an initializing reference */
  init: boolean;
  
  /** Check if this is a write reference */
  isWrite(): boolean;
  /** Check if this is a read reference */
  isRead(): boolean;
  /** Check if this is a write-only reference */
  isWriteOnly(): boolean;
  /** Check if this is a read-only reference */
  isReadOnly(): boolean;
  /** Check if this is a read-write reference */
  isReadWrite(): boolean;
}
```

## Usage Examples

```javascript
// In a rule implementation
create(context) {
  const sourceCode = context.sourceCode;
  
  return {
    FunctionDeclaration(node) {
      // Get function name token
      const nameToken = sourceCode.getFirstToken(node, {skip: 1});
      
      // Get all tokens for function
      const tokens = sourceCode.getTokens(node);
      
      // Check for comments
      const comments = sourceCode.getCommentsBefore(node);
      
      // Get function scope
      const scope = sourceCode.getScope(node);
      
      // Check variable usage
      const isUsed = sourceCode.markVariableAsUsed("myVar");
      
      // Location utilities
      const loc = sourceCode.getLoc(node);
      const range = sourceCode.getRange(node);
    }
  };
}
```