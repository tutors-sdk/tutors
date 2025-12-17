# Document Builder API

The Document Builder API provides low-level primitives for creating custom formatters and Prettier plugins. It offers a composable system for building formatted output through document objects that represent formatting decisions.

## Core Concepts

The Document Builder API uses an intermediate representation called "Doc" objects that describe how code should be formatted. These documents are then printed to strings with line breaking, indentation, and spacing applied.

### Importing Document Builders
```javascript { .api }
import { doc } from 'prettier';

// Access builder functions
const { builders, printer, utils } = doc;

// Or import specific builders
import { doc } from 'prettier';
const { group, line, indent, join } = doc.builders;
```

## Document Builder Functions

### Basic Building Blocks

### join
```javascript { .api }
function join(separator: Doc, docs: Doc[]): Doc
```

Join an array of documents with a separator document between each element.

**Parameters:**
- `separator` (Doc): Document to insert between elements
- `docs` (Doc[]): Array of documents to join

**Example:**
```javascript { .api }
const params = ['a', 'b', 'c'];
const joined = doc.builders.join(
  [',', doc.builders.line], 
  params
);
// Result: 'a,\nb,\nc' (when broken) or 'a, b, c' (when flat)
```

### Line Breaking Documents

### line
```javascript { .api }
const line: Doc
```

A line break that becomes a space when the parent group fits on one line.

**Example:**
```javascript { .api }
const statement = doc.builders.group([
  'if (',
  'condition',
  ')',
  doc.builders.line,
  'doSomething();'
]);
// Result: 'if (condition) doSomething();' or 'if (condition)\ndoSomething();'
```

### softline
```javascript { .api }
const softline: Doc
```

A line break that becomes nothing (empty string) when the parent group fits on one line.

**Example:**
```javascript { .api }
const array = doc.builders.group([
  '[',
  doc.builders.softline,
  doc.builders.join([',', doc.builders.line], elements),
  doc.builders.softline,
  ']'
]);
// Result: '[a, b, c]' or '[\n  a,\n  b,\n  c\n]'
```

### hardline
```javascript { .api }
const hardline: Doc
```

An unconditional line break that always creates a new line.

**Example:**
```javascript { .api }
const statements = [
  'const a = 1;',
  'const b = 2;'
];
const program = doc.builders.join(doc.builders.hardline, statements);
// Result: 'const a = 1;\nconst b = 2;'
```

### literalline
```javascript { .api }
const literalline: Doc
```

A line break that preserves literal newlines without triggering parent group breaking.

### hardlineWithoutBreakParent
```javascript { .api }
const hardlineWithoutBreakParent: Doc
```

An unconditional line break that doesn't trigger parent group breaking.

### literallineWithoutBreakParent  
```javascript { .api }
const literallineWithoutBreakParent: Doc
```

A literal line break that doesn't trigger parent group breaking.

### Grouping and Layout

### group
```javascript { .api }
function group(doc: Doc, options?: { shouldBreak?: boolean, id?: symbol }): Doc
```

Group documents that should be formatted consistently - either all on one line or all broken across multiple lines.

**Parameters:**
- `doc` (Doc): Document to group
- `options` (optional): Grouping options
  - `shouldBreak` (boolean): Force group to break
  - `id` (symbol): Unique identifier for the group

**Example:**
```javascript { .api }
const functionCall = doc.builders.group([
  'functionName(',
  doc.builders.indent([
    doc.builders.softline,
    doc.builders.join([',', doc.builders.line], args)
  ]),
  doc.builders.softline,
  ')'
]);
// Result: 'functionName(a, b, c)' or 'functionName(\n  a,\n  b,\n  c\n)'
```

### conditionalGroup
```javascript { .api }
function conditionalGroup(docs: Doc[], options?: { shouldBreak?: boolean }): Doc
```

Try multiple document variants in order, using the first one that fits.

**Example:**
```javascript { .api }
const alternatives = doc.builders.conditionalGroup([
  // Try inline first
  ['(', doc.builders.join(', ', args), ')'],
  // Fall back to multi-line
  [
    '(',
    doc.builders.indent([doc.builders.line, doc.builders.join([',', doc.builders.line], args)]),
    doc.builders.line,
    ')'
  ]
]);
```

### fill
```javascript { .api }
function fill(docs: Doc[]): Doc
```

Fill available line space optimally by trying to fit as many documents as possible on each line.

**Example:**
```javascript { .api }
const words = ['This', 'is', 'a', 'long', 'sentence', 'that', 'should', 'wrap'];
const paragraph = doc.builders.fill(
  doc.builders.join(doc.builders.line, words)
);
// Result: Wraps words to fit available width
```

### Indentation and Alignment

### indent
```javascript { .api }
function indent(doc: Doc): Doc
```

Increase indentation level for the contained document.

**Example:**
```javascript { .api }
const block = [
  '{',
  doc.builders.indent([
    doc.builders.hardline,
    'statement1;',
    doc.builders.hardline,
    'statement2;'
  ]),
  doc.builders.hardline,
  '}'
];
// Result: '{\n  statement1;\n  statement2;\n}'
```

### indentIfBreak
```javascript { .api }
function indentIfBreak(doc: Doc, options?: { groupId?: symbol }): Doc
```

Conditionally indent the document only if the parent group breaks.

**Parameters:**
- `doc` (Doc): Document to conditionally indent
- `options` (object, optional): Options including group ID for specific targeting

**Example:**
```javascript { .api }
const conditional = doc.builders.group([
  'if (',
  doc.builders.indentIfBreak([
    doc.builders.line,
    'longCondition'
  ]),
  doc.builders.line,
  ')'
]);
// Indents only when the group breaks
```

### align
```javascript { .api }
function align(n: number | string, doc: Doc): Doc
```

Align document to a specific column offset.

**Parameters:**
- `n` (number | string): Spaces to align (number) or alignment string
- `doc` (Doc): Document to align

**Example:**
```javascript { .api }
const aligned = doc.builders.align(4, [
  'let x = longVariableName +',
  doc.builders.line,
  'anotherLongVariableName;'
]);
// Result: Aligns continuation line to column 4
```

### addAlignmentToDoc
```javascript { .api }
function addAlignmentToDoc(doc: Doc, size: number, tabWidth: number): Doc
```

Add additional alignment space to an existing document.

**Parameters:**
- `doc` (Doc): Document to add alignment to
- `size` (number): Number of spaces to add for alignment
- `tabWidth` (number): Tab width for calculating proper alignment

**Example:**
```javascript { .api }
const withAlignment = doc.builders.addAlignmentToDoc(
  existingDoc,
  4,
  2
);
// Adds 4 spaces of alignment considering tab width
```

### dedent
```javascript { .api }
function dedent(doc: Doc): Doc
```

Decrease indentation level for the contained document.

### dedentToRoot
```javascript { .api }
function dedentToRoot(doc: Doc): Doc
```

Remove all indentation, aligning to the root level.

### markAsRoot
```javascript { .api }
function markAsRoot(doc: Doc): Doc
```

Mark document as root for indentation calculations.

### Conditional Formatting

### ifBreak
```javascript { .api }
function ifBreak(breakContents: Doc, flatContents?: Doc, options?: { groupId?: symbol }): Doc
```

Conditionally include content based on whether the parent group breaks.

**Parameters:**
- `breakContents` (Doc): Content when parent group breaks
- `flatContents` (Doc, optional): Content when parent group is flat
- `options` (optional): Options including group ID to check

**Example:**
```javascript { .api }
const arrayElements = doc.builders.group([
  '[',
  doc.builders.indent([
    doc.builders.softline,
    doc.builders.join([
      ',',
      doc.builders.ifBreak(doc.builders.hardline, doc.builders.line)
    ], elements)
  ]),
  doc.builders.softline,
  ']'
]);
```

### Line Manipulation

### lineSuffix
```javascript { .api }
function lineSuffix(doc: Doc): Doc
```

Content that should appear at the end of the current line.

**Example:**
```javascript { .api }
const statement = [
  'const x = value;',
  doc.builders.lineSuffix(' // comment')
];
// Result: 'const x = value; // comment'
```

### lineSuffixBoundary
```javascript { .api }
const lineSuffixBoundary: Doc
```

Boundary marker for line suffix content placement.

### Special Documents

### cursor
```javascript { .api }
const cursor: Doc
```

Placeholder for cursor position in editor integrations.

### breakParent
```javascript { .api }
const breakParent: Doc
```

Force the parent group to break across multiple lines.

**Example:**
```javascript { .api }
const forceBreak = doc.builders.group([
  'items: [',
  doc.builders.indent([
    doc.builders.line,
    'item1,',
    doc.builders.breakParent, // Forces parent group to break
    doc.builders.line,
    'item2'
  ]),
  doc.builders.line,
  ']'
]);
```

### trim
```javascript { .api }
const trim: Doc
```

Remove trailing whitespace from the current line.

### label
```javascript { .api }
function label(label: string, doc: Doc): Doc
```

Label document for debugging and development purposes.

## Document Printer

### printDocToString
```javascript { .api }
function printDocToString(doc: Doc, options: PrintOptions): PrintResult
```

Convert a document to a formatted string with the specified print options.

**Types:**
```javascript { .api }
interface PrintOptions {
  printWidth?: number;        // Maximum line width (default: 80)
  tabWidth?: number;          // Tab width (default: 2)
  useTabs?: boolean;          // Use tabs for indentation (default: false)
  endOfLine?: 'auto' | 'lf' | 'crlf' | 'cr'; // Line ending style
}

interface PrintResult {
  formatted: string;          // Formatted output
  cursorOffset: number;       // Cursor position (if cursor doc was used)
}
```

**Example:**
```javascript { .api }
const document = doc.builders.group([
  'function(',
  doc.builders.indent([
    doc.builders.softline,
    doc.builders.join([',', doc.builders.line], parameters)
  ]),
  doc.builders.softline,
  ')'
]);

const result = doc.printer.printDocToString(document, {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false
});

console.log(result.formatted);
```

## Document Utilities

### traverseDoc
```javascript { .api }
function traverseDoc(
  doc: Doc, 
  onEnter?: (doc: Doc) => void | boolean | Doc,
  onExit?: (doc: Doc) => void,
  shouldTraverseConditionalGroup?: boolean
): void
```

Traverse document tree with enter/exit callbacks.

### findInDoc
```javascript { .api }
function findInDoc(doc: Doc, fn: (doc: Doc) => boolean, defaultValue?: any): any
```

Find element in document tree matching predicate function.

### mapDoc
```javascript { .api }
function mapDoc(doc: Doc, fn: (doc: Doc) => Doc): Doc
```

Transform document tree by applying function to each node.

### willBreak
```javascript { .api }
function willBreak(doc: Doc): boolean
```

Check if document will cause parent group to break.

### canBreak
```javascript { .api }
function canBreak(doc: Doc): boolean
```

Check if document can break across lines.

### removeLines
```javascript { .api }
function removeLines(doc: Doc): Doc
```

Remove all line breaks from document.

### stripTrailingHardline
```javascript { .api }
function stripTrailingHardline(doc: Doc): Doc
```

Remove trailing hard line breaks from document.

### replaceEndOfLine
```javascript { .api }
function replaceEndOfLine(doc: Doc, replacement?: Doc): Doc
```

Replace end-of-line characters in document.

## Usage Patterns

### Building Complex Layouts
```javascript { .api }
function formatObjectExpression(properties) {
  return doc.builders.group([
    '{',
    properties.length > 0 ? [
      doc.builders.indent([
        doc.builders.line,
        doc.builders.join([',', doc.builders.line], properties.map(formatProperty))
      ]),
      doc.builders.line
    ] : '',
    '}'
  ]);
}

function formatProperty(prop) {
  return doc.builders.group([
    prop.key,
    ': ',
    prop.value
  ]);
}
```

### Plugin Development
```javascript { .api }
// Example plugin printer function
function print(path, options, print) {
  const node = path.node;
  
  switch (node.type) {
    case 'CustomNode':
      return doc.builders.group([
        'custom(',
        doc.builders.indent([
          doc.builders.softline,
          doc.builders.join([',', doc.builders.line], 
            node.args.map((_, index) => path.call(print, 'args', index))
          )
        ]),
        doc.builders.softline,
        ')'
      ]);
      
    default:
      return '';
  }
}
```

### Conditional Formatting
```javascript { .api }
function formatArray(elements, options) {
  const shouldBreakElements = elements.length > 3 || 
    elements.some(el => willBreak(el));
  
  return doc.builders.group([
    '[',
    elements.length > 0 ? [
      doc.builders.indent([
        shouldBreakElements ? doc.builders.hardline : doc.builders.softline,
        doc.builders.join([
          ',',
          shouldBreakElements ? doc.builders.hardline : doc.builders.line
        ], elements)
      ]),
      shouldBreakElements ? doc.builders.hardline : doc.builders.softline
    ] : '',
    ']'
  ], { shouldBreak: shouldBreakElements });
}
```

## Deprecated Functions

### concat (Deprecated)
```javascript { .api }
function concat(parts: Doc[]): Doc[]
```

**⚠️ Deprecated**: This function will be removed in v4. Use array syntax directly instead.

Legacy function that simply returns the parts array. Modern code should use arrays directly.

**Example:**
```javascript { .api }
// Deprecated usage
const doc = doc.builders.concat([part1, part2, part3]);

// Modern equivalent  
const doc = [part1, part2, part3];
```