# Prettier

## Package Information

- **Name**: prettier
- **Type**: npm package
- **Language**: JavaScript/TypeScript
- **License**: MIT
- **Version**: 3.6.2

## Installation

```bash
npm install prettier
# or
yarn add prettier
# or
pnpm add prettier
```

## Core Imports

### ESM (Recommended)
```javascript { .api }
import * as prettier from 'prettier';
// or
import { format, formatWithCursor, check, resolveConfig, getSupportInfo } from 'prettier';
```

### CommonJS
```javascript { .api }
const prettier = require('prettier');
// or  
const { format, formatWithCursor, check, resolveConfig, getSupportInfo } = require('prettier');
```

### Browser/Standalone
```javascript { .api }
import * as prettier from 'prettier/standalone';
// Requires plugins to be imported separately for each language
```

## Basic Usage

### Format Code
```javascript { .api }
const formatted = await prettier.format('const x={a:1,b:2}', { 
  parser: 'babel',
  semi: false,
  singleQuote: true 
});
// Result: "const x = { a: 1, b: 2 }"
```

### Check if Code is Formatted
```javascript { .api }
const isFormatted = await prettier.check('const x = { a: 1, b: 2 }', { 
  parser: 'babel' 
});
// Result: true
```

### Resolve Configuration
```javascript { .api }
const config = await prettier.resolveConfig('/path/to/file.js');
// Result: { semi: true, singleQuote: false, ... } or null
```

## Capabilities

Prettier provides comprehensive code formatting capabilities organized into these areas:

### Core Formatting Functions
Format code with full control over cursor position, check formatting status, and integrate with editors.

```javascript { .api }
// Format with cursor tracking for editor integrations
const result = await prettier.formatWithCursor(code, { 
  cursorOffset: 10, 
  parser: 'babel' 
});
// result: { formatted: string, cursorOffset: number }

// Check if code needs formatting
const needsFormatting = !(await prettier.check(code, { parser: 'babel' }));
```

**[Core Formatting Functions](./core-formatting.md)**

### Configuration Resolution
Discover and resolve Prettier configuration files with support for EditorConfig integration.

```javascript { .api }
// Resolve configuration for a specific file
const config = await prettier.resolveConfig('/path/to/file.js', {
  editorconfig: true,
  useCache: true
});

// Find configuration file path
const configPath = await prettier.resolveConfigFile('/path/to/project');

// Clear configuration cache
await prettier.clearConfigCache();
```

**[Configuration Resolution](./configuration.md)**

### File Analysis and Language Support
Analyze files to determine parsers, check ignore status, and discover supported languages.

```javascript { .api }
// Get file information including inferred parser
const fileInfo = await prettier.getFileInfo('/path/to/file.js', {
  resolveConfig: true,
  plugins: []
});
// result: { ignored: boolean, inferredParser: string | null }

// Get supported languages and options  
const supportInfo = await prettier.getSupportInfo({
  showDeprecated: false,
  plugins: []
});
// result: { languages: SupportLanguage[], options: SupportOption[] }
```

**[File Analysis and Language Support](./file-analysis.md)**

### Document Builder API (Advanced Plugin Development)
Low-level document building primitives for creating custom formatters and plugins.

```javascript { .api }
import { doc } from 'prettier';

// Build formatting documents
const document = doc.builders.group([
  'if (',
  doc.builders.indent([doc.builders.line, 'condition']),
  doc.builders.line,
  ')'
]);

// Print document to string
const { formatted } = doc.printer.printDocToString(document, { 
  printWidth: 80,
  tabWidth: 2 
});
```

**[Document Builder API](./document-builders.md)**

### Utility Functions
Text processing, AST navigation, and comment manipulation utilities for advanced use cases.

```javascript { .api }
import { util } from 'prettier';

// String and position utilities
const width = util.getStringWidth('text');
const nextChar = util.getNextNonSpaceNonCommentCharacter(text, 0);
const hasNewLine = util.hasNewline(text, 10);

// Comment utilities
util.addLeadingComment(node, comment);
util.addTrailingComment(node, comment);
```

**[Utility Functions](./utilities.md)**

### Debug and Internal APIs (Advanced)
Low-level debugging APIs for development, CLI tools, and advanced integrations. These functions provide access to Prettier's internal parsing and formatting pipeline.

```javascript { .api }
import prettier from 'prettier';

// Parse source code to AST without formatting
const ast = await prettier.__debug.parse(code, { parser: 'babel' });

// Format AST to intermediate document representation  
const doc = await prettier.__debug.formatAST(ast, { parser: 'babel' });

// Format document object to final string output
const formatted = await prettier.__debug.formatDoc(doc, { printWidth: 80 });

// Convert source to document without formatting (for analysis)
const doc = await prettier.__debug.printToDoc(code, { parser: 'babel' });

// Print document to string with layout options
const result = await prettier.__debug.printDocToString(doc, { 
  printWidth: 80,
  tabWidth: 2 
});
// result: { formatted: string, cursorOffset?: number }
```

**Note:** Debug APIs are internal and may change between versions. Use with caution in production.

### Version Information
Get the current Prettier version for compatibility checks and debugging.

```javascript { .api }
import { version } from 'prettier';

console.log(version); // '3.6.2'

// Check version compatibility
const majorVersion = parseInt(version.split('.')[0]);
if (majorVersion >= 3) {
  // Use newer APIs
}
```

## Supported Languages

Prettier supports formatting for the following languages out of the box:

- **JavaScript**: ES2015+, JSX, Flow, TypeScript
- **CSS**: CSS, SCSS, Less  
- **Markup**: HTML, Vue, Angular templates, LWC
- **Data**: JSON, JSON5, JSONC, YAML
- **GraphQL**: Schema and query documents
- **Markdown**: CommonMark, GFM, MDX
- **Templates**: Handlebars/Glimmer

Additional languages can be supported through plugins.

## TypeScript Support

Prettier includes full TypeScript definitions and supports both ESM and CommonJS imports:

```typescript { .api }
import { format, Options, AST, Doc, AstPath, LiteralUnion } from 'prettier';

const options: Options = {
  parser: 'typescript',
  semi: false,
  singleQuote: true
};

const formatted: string = await format(code, options);
```

### Advanced TypeScript Types

```typescript { .api }
// Utility type for string literals with fallback
export type LiteralUnion<T extends U, U = string> = 
  | T 
  | (Pick<U, never> & { _?: never | undefined });

// AST and Document types
export type AST = any;
export type Doc = doc.builders.Doc;

// Enhanced AstPath for AST traversal
export class AstPath<T = any> {
  constructor(value: T);
  
  // Navigation properties
  get key(): string | null;
  get index(): number | null;
  get node(): T;
  get parent(): T | null;
  get grandparent(): T | null;
  get isInArray(): boolean;
  get siblings(): T[] | null;
  get next(): T | null;
  get previous(): T | null;
  get isFirst(): boolean;
  get isLast(): boolean;
  get isRoot(): boolean;
  get root(): T;
  get ancestors(): T[];
  
  // Traversal methods
  callParent<U>(callback: (path: this) => U, count?: number): U;
  match(...predicates: Array<(node: any, name: string | null, number: number | null) => boolean>): boolean;
  call<U>(callback: (path: AstPath<T>, index: number, value: any) => U): U;
  each(callback: (path: AstPath<T>, index: number, value: any) => void): void;
  map<U>(callback: (path: AstPath<T>, index: number, value: any) => U): U[];
}

// Built-in parser names with literal union support
export type BuiltInParserName = LiteralUnion<
  | "acorn" | "angular" | "babel-flow" | "babel-ts" | "babel"
  | "css" | "espree" | "flow" | "glimmer" | "graphql" | "html"
  | "json-stringify" | "json" | "json5" | "jsonc" | "less"
  | "lwc" | "markdown" | "mdx" | "meriyah" | "mjml" | "scss"
  | "typescript" | "vue" | "yaml"
>;
```

## Plugin System

Prettier supports plugins to extend language support and customize formatting behavior. Built-in languages are implemented as internal plugins, and external plugins can be loaded:

```javascript { .api }
import myPlugin from 'prettier-plugin-custom';

const formatted = await prettier.format(code, {
  parser: 'custom',
  plugins: [myPlugin]
});
```

### Plugin Development
Advanced plugin interfaces for creating custom parsers, printers, and language support.

```typescript { .api }
// Plugin interface with language support
interface Plugin<T = any> {
  languages?: SupportLanguage[];
  parsers?: { [parserName: string]: Parser<T> };
  printers?: { [astFormat: string]: Printer<T> };
  options?: SupportOptions;
  defaultOptions?: Partial<RequiredOptions>;
}

// Parser implementation
interface Parser<T = any> {
  parse: (text: string, options: ParserOptions<T>) => T | Promise<T>;
  astFormat: string;
  hasPragma?: (text: string) => boolean;
  locStart: (node: T) => number;
  locEnd: (node: T) => number;
}
```

**[Plugin Development Guide](./plugin-development.md)**