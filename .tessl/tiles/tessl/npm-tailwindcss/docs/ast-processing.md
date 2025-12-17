# AST Processing

Low-level CSS abstract syntax tree processing for advanced use cases and custom tooling. The AST system provides direct access to CSS parsing, manipulation, and generation.

## Capabilities

### AST Node Creation

Functions for creating different types of AST nodes.

```typescript { .api }
/**
 * Creates a style rule AST node
 * @param selector - CSS selector string
 * @param nodes - Child nodes for this rule
 * @returns StyleRule node
 */
function styleRule(selector: string, nodes?: AstNode[]): StyleRule;

/**
 * Creates an at-rule AST node
 * @param name - At-rule name (e.g., '@media', '@keyframes')
 * @param params - At-rule parameters
 * @param nodes - Child nodes for this rule
 * @returns AtRule node
 */
function atRule(name: string, params?: string, nodes?: AstNode[]): AtRule;

/**
 * Creates a rule node (auto-detects style rule vs at-rule)
 * @param selector - CSS selector or at-rule string
 * @param nodes - Child nodes for this rule
 * @returns StyleRule or AtRule node
 */
function rule(selector: string, nodes?: AstNode[]): StyleRule | AtRule;

/**
 * Creates a CSS declaration AST node
 * @param property - CSS property name
 * @param value - CSS property value
 * @param important - Whether declaration is !important
 * @returns Declaration node
 */
function decl(property: string, value?: string, important?: boolean): Declaration;

/**
 * Creates a comment AST node
 * @param value - Comment text content
 * @returns Comment node
 */
function comment(value: string): Comment;

/**
 * Creates a context wrapper node
 * @param context - Context metadata object
 * @param nodes - Child nodes to wrap
 * @returns Context node
 */
function context(context: Record<string, any>, nodes: AstNode[]): Context;

/**
 * Creates an at-root wrapper node
 * @param nodes - Child nodes to hoist to root level
 * @returns AtRoot node
 */
function atRoot(nodes: AstNode[]): AtRoot;
```

**Usage Examples:**

```typescript
import { styleRule, atRule, decl, comment, context } from "tailwindcss";

// Create a simple style rule
const buttonRule = styleRule('.btn', [
  decl('padding', '0.5rem 1rem'),
  decl('border-radius', '0.25rem'),
  decl('font-weight', '500'),
]);

// Create a media query
const mediaRule = atRule('@media', '(min-width: 768px)', [
  styleRule('.btn', [
    decl('padding', '0.75rem 1.5rem'),
  ]),
]);

// Create at-rule with auto-detection
const keyframesRule = rule('@keyframes spin', [
  styleRule('to', [
    decl('transform', 'rotate(360deg)'),
  ]),
]);

// Add comments and context
const ast = [
  comment('Button component styles'),
  context({ component: 'button' }, [buttonRule, mediaRule]),
];
```

### AST Walking

Traverse and manipulate AST nodes.

```typescript { .api }
/**
 * Walk through AST nodes with a callback function
 * @param ast - Array of AST nodes to traverse
 * @param callback - Function called for each node
 */
function walk(
  ast: AstNode[],
  callback: (
    node: AstNode,
    utils: {
      parent: AstNode | null;
      replaceWith: (nodes: AstNode[]) => void;
      context: Record<string, any>;
    }
  ) => WalkAction | void
): void;

enum WalkAction {
  /** Continue walking child nodes */
  Continue,
  /** Skip child nodes but continue with siblings */
  Skip,
  /** Stop walking entirely */
  Stop,
}
```

**Usage Examples:**

```typescript
import { walk, WalkAction } from "tailwindcss";

// Find and modify declarations
walk(ast, (node, { replaceWith }) => {
  if (node.kind === 'declaration' && node.property === 'color') {
    // Replace color declarations with custom property
    replaceWith([
      decl('color', 'var(--text-color)', node.important),
    ]);
  }
});

// Remove comments
walk(ast, (node, { replaceWith }) => {
  if (node.kind === 'comment') {
    replaceWith([]);
  }
});

// Skip processing certain rules
walk(ast, (node) => {
  if (node.kind === 'rule' && node.selector.includes('.skip')) {
    return WalkAction.Skip;
  }
});
```

### CSS Generation

Convert AST nodes back to CSS strings.

```typescript { .api }
/**
 * Convert AST nodes to CSS string
 * @param ast - Array of AST nodes to convert
 * @param withSourceMaps - Whether to include source map information
 * @returns Generated CSS string
 */
function toCss(ast: AstNode[], withSourceMaps?: boolean): string;
```

**Usage Example:**

```typescript
import { toCss, styleRule, decl } from "tailwindcss";

const ast = [
  styleRule('.btn', [
    decl('padding', '0.5rem 1rem'),
    decl('background-color', '#3b82f6'),
    decl('color', 'white'),
  ]),
];

const css = toCss(ast);
console.log(css);
// Output:
// .btn {
//   padding: 0.5rem 1rem;
//   background-color: #3b82f6;
//   color: white;
// }
```

### AST Optimization

Optimize AST for better performance and smaller output.

```typescript { .api }
/**
 * Optimize AST nodes for better performance and output
 * @param ast - Array of AST nodes to optimize
 * @param designSystem - Design system for context
 * @param polyfills - Polyfill configuration
 * @returns Optimized AST nodes
 */
function optimizeAst(
  ast: AstNode[],
  designSystem: DesignSystem,
  polyfills?: Polyfills
): AstNode[];
```

## AST Node Types

### StyleRule Node

Represents CSS style rules with selectors and declarations.

```typescript { .api }
interface StyleRule {
  kind: 'rule';
  selector: string;
  nodes: AstNode[];
  src?: SourceLocation;
  dst?: SourceLocation;
}
```

### AtRule Node

Represents CSS at-rules like @media, @keyframes, etc.

```typescript { .api }
interface AtRule {
  kind: 'at-rule';
  name: string;
  params: string;
  nodes: AstNode[];
  src?: SourceLocation;
  dst?: SourceLocation;
}
```

### Declaration Node

Represents CSS property declarations.

```typescript { .api }
interface Declaration {
  kind: 'declaration';
  property: string;
  value: string | undefined;
  important: boolean;
  src?: SourceLocation;
  dst?: SourceLocation;
}
```

### Comment Node

Represents CSS comments.

```typescript { .api }
interface Comment {
  kind: 'comment';
  value: string;
  src?: SourceLocation;
  dst?: SourceLocation;
}
```

### Context Node

Wrapper node for adding metadata and context to child nodes.

```typescript { .api }
interface Context {
  kind: 'context';
  context: Record<string, string | boolean>;
  nodes: AstNode[];
  src?: undefined;
  dst?: undefined;
}
```

### AtRoot Node

Wrapper node for hoisting child nodes to the root level.

```typescript { .api }
interface AtRoot {
  kind: 'at-root';
  nodes: AstNode[];
  src?: undefined;
  dst?: undefined;
}
```

## Source Location

Source location information for debugging and source maps.

```typescript { .api }
interface SourceLocation {
  start: { line: number; column: number };
  end: { line: number; column: number };
  source?: string;
}
```

## Union Types

```typescript { .api }
type Rule = StyleRule | AtRule;
type AstNode = StyleRule | AtRule | Declaration | Comment | Context | AtRoot;
```

## Advanced Usage

### Custom AST Processing

```typescript
import { compileAst, walk, styleRule, decl } from "tailwindcss";

// Create custom AST
const customAst = [
  styleRule(':root', [
    decl('--primary', '#3b82f6'),
    decl('--secondary', '#10b981'),
  ]),
  styleRule('.custom-btn', [
    decl('background', 'var(--primary)'),
    decl('color', 'white'),
  ]),
];

// Process with Tailwind
const result = await compileAst(customAst);

// Generate final CSS
const finalAst = result.build(['bg-primary', 'text-white']);
```

### AST Transformation Pipeline

```typescript
import { walk, toCss } from "tailwindcss";

function transformAst(ast: AstNode[]): AstNode[] {
  // Step 1: Add vendor prefixes
  walk(ast, (node, { replaceWith }) => {
    if (node.kind === 'declaration' && node.property === 'transform') {
      replaceWith([
        decl('-webkit-transform', node.value, node.important),
        decl('-moz-transform', node.value, node.important),
        decl('transform', node.value, node.important),
      ]);
    }
  });

  // Step 2: Minify selectors
  walk(ast, (node) => {
    if (node.kind === 'rule') {
      node.selector = node.selector.replace(/\s+/g, ' ').trim();
    }
  });

  return ast;
}

// Use in processing pipeline
const processedAst = transformAst(originalAst);
const css = toCss(processedAst);
```