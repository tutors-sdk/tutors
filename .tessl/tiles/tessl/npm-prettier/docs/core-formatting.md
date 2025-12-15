# Core Formatting Functions

The core formatting functions provide the main API for formatting code with Prettier. These functions handle code parsing, formatting, and result generation with full async support.

## Core Functions

### format
```javascript { .api }
async function format(source: string, options?: Options): Promise<string>
```

Format source code using Prettier with the specified options.

**Parameters:**
- `source` (string): The source code to format
- `options` (Options, optional): Formatting options and parser configuration

**Returns:** Promise resolving to formatted source code string

**Example:**
```javascript { .api }
const formatted = await prettier.format('const x={a:1,b:2}', {
  parser: 'babel',
  semi: false,
  singleQuote: true,
  printWidth: 80
});
// Result: "const x = { a: 1, b: 2 };\n"
```

### formatWithCursor
```javascript { .api }
async function formatWithCursor(source: string, options: CursorOptions): Promise<CursorResult>
```

Format source code while tracking cursor position. Essential for editor integrations to maintain cursor position after formatting.

**Parameters:**
- `source` (string): The source code to format
- `options` (CursorOptions): Formatting options including cursor position

**Returns:** Promise resolving to CursorResult with formatted code and new cursor position

**Types:**
```javascript { .api }
interface CursorOptions extends Options {
  cursorOffset: number; // Position of cursor in original source
}

interface CursorResult {
  formatted: string;     // Formatted source code
  cursorOffset: number;  // New cursor position in formatted code
}
```

**Example:**
```javascript { .api }
const result = await prettier.formatWithCursor('const x={a:1,|b:2}', {
  cursorOffset: 13, // Position marked with |
  parser: 'babel',
  semi: false
});
// result.formatted: "const x = { a: 1, b: 2 }\n"
// result.cursorOffset: 18 (adjusted position)
```

### check
```javascript { .api }
async function check(source: string, options?: Options): Promise<boolean>
```

Check if source code is already formatted according to Prettier rules. Equivalent to CLI `--list-different` flag.

**Parameters:**
- `source` (string): The source code to check
- `options` (Options, optional): Formatting options to use for comparison

**Returns:** Promise resolving to boolean - true if already formatted, false if formatting is needed

**Example:**
```javascript { .api }
const isFormatted = await prettier.check('const x = { a: 1, b: 2 };', {
  parser: 'babel'
});
// Result: true

const needsFormatting = await prettier.check('const x={a:1,b:2}', {
  parser: 'babel'
});
// Result: false
```

## Formatting Options

### Core Options
```javascript { .api }
interface Options {
  // Parser and language
  parser?: string;           // Parser to use (babel, typescript, css, etc.)
  filepath?: string;         // File path for parser inference
  
  // Code style
  printWidth?: number;       // Line length limit (default: 80)
  tabWidth?: number;         // Tab width (default: 2)
  useTabs?: boolean;         // Use tabs instead of spaces (default: false)
  semi?: boolean;            // Print semicolons (default: true)
  singleQuote?: boolean;     // Use single quotes (default: false)
  jsxSingleQuote?: boolean;  // Use single quotes in JSX (default: false)
  quoteProps?: 'as-needed' | 'consistent' | 'preserve'; // Quote object properties
  
  // Trailing commas
  trailingComma?: 'none' | 'es5' | 'all'; // Trailing commas (default: 'all')
  
  // Spacing and brackets
  bracketSpacing?: boolean;     // Spaces in object literals (default: true)
  bracketSameLine?: boolean;    // Put > on same line in multi-line elements
  arrowParens?: 'avoid' | 'always'; // Parentheses around single arrow function param
  objectWrap?: 'preserve' | 'collapse'; // How to wrap object literals (default: 'preserve')
  
  // Range formatting
  rangeStart?: number;       // Format only a range (default: 0)
  rangeEnd?: number;         // Format only a range (default: Infinity)
  
  // Pragmas
  requirePragma?: boolean;   // Only format files with @format pragma
  insertPragma?: boolean;    // Insert @format pragma in formatted files
  checkIgnorePragma?: boolean; // Respect // prettier-ignore comments
  
  // Prose
  proseWrap?: 'always' | 'never' | 'preserve'; // Wrap prose (default: 'preserve')
  
  // HTML/CSS specific
  htmlWhitespaceSensitivity?: 'css' | 'strict' | 'ignore';
  vueIndentScriptAndStyle?: boolean; // Indent <script> and <style> in Vue
  
  // Line endings
  endOfLine?: 'auto' | 'lf' | 'crlf' | 'cr'; // Line ending style
  
  // Embedded languages
  embeddedLanguageFormatting?: 'auto' | 'off'; // Format embedded code
  
  // Experimental
  singleAttributePerLine?: boolean; // One attribute per line in HTML/JSX
  experimentalOperatorPosition?: 'start' | 'end'; // Operator position in binary expressions (default: 'end')
  experimentalTernaries?: boolean;  // Use curious ternary formatting (default: false)
  
  // Plugins
  plugins?: Array<string | Plugin>; // Plugins to load
}
```

## Parser Selection

Prettier automatically infers the parser from file extensions, but you can specify explicitly:

### JavaScript Parsers
```javascript { .api }
// Babel parser (recommended for modern JS/TS/JSX)
{ parser: 'babel' }

// TypeScript-specific parsers
{ parser: 'typescript' }  // Standard TypeScript parser
{ parser: 'babel-ts' }    // Babel TypeScript parser

// Flow parsers  
{ parser: 'flow' }        // Flow parser
{ parser: 'babel-flow' }  // Babel Flow parser

// Alternative parsers
{ parser: 'acorn' }    // Acorn parser
{ parser: 'espree' }   // ESLint's parser
{ parser: 'meriyah' }  // Fast parser
```

### CSS Parsers
```javascript { .api }
{ parser: 'css' }      // Standard CSS
{ parser: 'scss' }     // SCSS/Sass
{ parser: 'less' }     // Less CSS
```

### Markup Parsers
```javascript { .api }
{ parser: 'html' }     // HTML
{ parser: 'vue' }      // Vue SFC
{ parser: 'angular' }  // Angular templates
{ parser: 'lwc' }      // Lightning Web Components
```

### Data Parsers
```javascript { .api }
{ parser: 'json' }         // JSON
{ parser: 'json5' }        // JSON5
{ parser: 'jsonc' }        // JSON with comments
{ parser: 'json-stringify' } // JSON with stringify behavior
{ parser: 'yaml' }         // YAML
```

### Other Parsers
```javascript { .api }
{ parser: 'graphql' }    // GraphQL
{ parser: 'markdown' }   // Markdown
{ parser: 'mdx' }        // MDX (Markdown + JSX)
{ parser: 'glimmer' }    // Handlebars/Glimmer templates  
{ parser: 'mjml' }       // MJML email templates
```

## Error Handling

All formatting functions can throw errors for invalid syntax or configuration:

```javascript { .api }
try {
  const formatted = await prettier.format('invalid javascript syntax', {
    parser: 'babel'
  });
} catch (error) {
  console.error('Formatting error:', error.message);
  console.error('Location:', error.loc); // { start: { line, column }, end: { line, column } }
}
```

## Performance Considerations

- Use `check()` before `format()` to avoid unnecessary formatting
- Cache configuration resolution results when processing multiple files
- Consider using standalone build for browser applications
- Plugin loading has overhead - reuse formatter instances when possible

```javascript { .api }
// Efficient multi-file formatting
const config = await prettier.resolveConfig(firstFile);
const cachedConfig = { ...config, filepath: undefined }; // Remove filepath for reuse

for (const file of files) {
  const needsFormatting = !(await prettier.check(file.content, { 
    ...cachedConfig, 
    filepath: file.path 
  }));
  
  if (needsFormatting) {
    file.formatted = await prettier.format(file.content, {
      ...cachedConfig,
      filepath: file.path
    });
  }
}
```