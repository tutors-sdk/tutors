# Plugin Development Guide

Complete interfaces and types for developing Prettier plugins, including parsers, printers, and language support definitions.

## Plugin Interface

### Plugin Definition
```typescript { .api }
interface Plugin<T = any> {
  languages?: SupportLanguage[] | undefined;
  parsers?: { [parserName: string]: Parser<T> } | undefined;
  printers?: { [astFormat: string]: Printer<T> } | undefined;
  options?: SupportOptions | undefined;
  defaultOptions?: Partial<RequiredOptions> | undefined;
}
```

The main plugin interface that defines a complete Prettier plugin with language support, parsing, printing, and configuration capabilities.

**Properties:**
- `languages` (SupportLanguage[], optional): Supported languages and file extensions
- `parsers` (object, optional): Parser implementations keyed by parser name
- `printers` (object, optional): Printer implementations keyed by AST format
- `options` (SupportOptions, optional): Custom formatting options
- `defaultOptions` (Partial<RequiredOptions>, optional): Default option values

## Parser Interface

### Parser Implementation
```typescript { .api }
interface Parser<T = any> {
  parse: (text: string, options: ParserOptions<T>) => T | Promise<T>;
  astFormat: string;
  hasPragma?: ((text: string) => boolean) | undefined;
  hasIgnorePragma?: ((text: string) => boolean) | undefined;
  locStart: (node: T) => number;
  locEnd: (node: T) => number;
  preprocess?: ((text: string, options: ParserOptions<T>) => string) | undefined;
}
```

Defines how to parse source code into an Abstract Syntax Tree (AST).

**Required Properties:**
- `parse` (function): Main parsing function that converts text to AST
- `astFormat` (string): Identifier for the AST format produced
- `locStart` (function): Returns start position of a node in original text
- `locEnd` (function): Returns end position of a node in original text

**Optional Properties:**
- `hasPragma` (function): Detects if source contains a formatting pragma
- `hasIgnorePragma` (function): Detects if source should be ignored
- `preprocess` (function): Transform source before parsing

### Parser Options
```typescript { .api }
interface ParserOptions<T = any> extends RequiredOptions {
  locStart: (node: T) => number;
  locEnd: (node: T) => number;
  originalText: string;
}
```

Options passed to parser functions, extending base formatting options with location utilities.

## Printer Interface

### Printer Implementation
```typescript { .api }
interface Printer<T = any> {
  print(
    path: AstPath<T>,
    options: ParserOptions<T>,
    print: (path: AstPath<T>) => Doc,
    args?: unknown,
  ): Doc;
  embed?: ((
    path: AstPath,
    options: Options,
  ) => ((
    textToDoc: (text: string, options: Options) => Promise<Doc>,
    print: (selector?: string | number | Array<string | number> | AstPath) => Doc,
    path: AstPath,
    options: Options,
  ) => Promise<Doc | undefined> | Doc | undefined) | Doc | null) | undefined;
  preprocess?: ((ast: T, options: ParserOptions<T>) => T | Promise<T>) | undefined;
  insertPragma?: (text: string) => string;
  massageAstNode?: ((original: any, cloned: any, parent: any) => any) | undefined;
  hasPrettierIgnore?: ((path: AstPath<T>) => boolean) | undefined;
  canAttachComment?: ((node: T) => boolean) | undefined;
  isBlockComment?: ((node: T) => boolean) | undefined;
  willPrintOwnComments?: ((path: AstPath<T>) => boolean) | undefined;
  printComment?: ((commentPath: AstPath<T>, options: ParserOptions<T>) => Doc) | undefined;
  getCommentChildNodes?: ((node: T, options: ParserOptions<T>) => T[] | undefined) | undefined;
}
```

Defines how to format AST nodes into formatted output documents.

**Required Methods:**
- `print` (function): Main printing function that converts AST nodes to Doc objects

**Optional Methods:**
- `embed` (function): Handle embedded languages (like CSS in HTML)
- `preprocess` (function): Transform AST before printing
- `insertPragma` (function): Add formatting pragma to output
- `massageAstNode` (function): Modify AST nodes during printing
- `hasPrettierIgnore` (function): Check if node should be ignored
- `canAttachComment` (function): Determine if comments can attach to node
- `isBlockComment` (function): Identify block vs line comments
- `printComment` (function): Custom comment formatting
- `getCommentChildNodes` (function): Override default comment traversal

### Comment Handling
```typescript { .api }
interface CommentHandlers<T = any> {
  ownLine?: ((
    commentNode: any,
    text: string,
    options: ParserOptions<T>,
    ast: T,
    isLastComment: boolean,
  ) => boolean) | undefined;
  endOfLine?: ((
    commentNode: any,
    text: string,
    options: ParserOptions<T>,
    ast: T,
    isLastComment: boolean,
  ) => boolean) | undefined;
  remaining?: ((
    commentNode: any,
    text: string,
    options: ParserOptions<T>,
    ast: T,
    isLastComment: boolean,
  ) => boolean) | undefined;
}
```

Advanced comment handling for complex comment attachment scenarios.

## Language Support

### Language Definition
```typescript { .api }
interface SupportLanguage {
  name: string;
  parsers: BuiltInParserName[] | string[];
  group?: string | undefined;
  tmScope?: string | undefined;
  aceMode?: string | undefined;
  codemirrorMode?: string | undefined;
  codemirrorMimeType?: string | undefined;
  aliases?: string[] | undefined;
  extensions?: string[] | undefined;
  filenames?: string[] | undefined;
  linguistLanguageId?: number | undefined;
  vscodeLanguageIds?: string[] | undefined;
  interpreters?: string[] | undefined;
  isSupported?: ((options: { filepath: string }) => boolean) | undefined;
}
```

Defines language support metadata for file recognition and editor integration.

**Required Properties:**
- `name` (string): Display name of the language
- `parsers` (string[]): Parser names that can handle this language

**Optional Properties:**
- `group` (string): Language category grouping
- `extensions` (string[]): File extensions (e.g., ['.js', '.jsx'])
- `filenames` (string[]): Specific filenames (e.g., ['Dockerfile'])
- `aliases` (string[]): Alternative language names
- `interpreters` (string[]): Shebang interpreters (e.g., ['node'])
- `isSupported` (function): Custom support detection

## Option Definition

### Custom Options
```typescript { .api }
interface SupportOptions extends Record<string, SupportOption> {}

type SupportOption =
  | IntSupportOption
  | StringSupportOption
  | BooleanSupportOption
  | ChoiceSupportOption
  | PathSupportOption;

interface BooleanSupportOption extends BaseSupportOption<"boolean"> {
  default?: boolean | undefined;
  description: string;
  oppositeDescription?: string | undefined;
}

interface ChoiceSupportOption<Value = any> extends BaseSupportOption<"choice"> {
  default?: Value | Array<{ value: Value }> | undefined;
  description: string;
  choices: Array<{
    value: Value;
    description: string;
  }>;
}
```

Define custom formatting options for plugins with proper CLI integration and validation.

## Usage Examples

### Basic Plugin Structure
```javascript { .api }
// Example plugin for a custom language
export default {
  languages: [
    {
      name: "MyLanguage",
      parsers: ["mylang-parser"],
      extensions: [".mylang"],
      vscodeLanguageIds: ["mylang"]
    }
  ],
  parsers: {
    "mylang-parser": {
      parse: (text, options) => {
        // Parse text into AST
        return parseMyLanguage(text);
      },
      astFormat: "mylang-ast",
      locStart: (node) => node.start,
      locEnd: (node) => node.end,
    }
  },
  printers: {
    "mylang-ast": {
      print: (path, options, print) => {
        const node = path.getValue();
        // Convert AST node to Doc
        return formatMyLanguageNode(node, print);
      }
    }
  },
  options: {
    myOption: {
      type: "boolean",
      category: "MyLanguage",
      default: false,
      description: "Enable my custom formatting option"
    }
  }
};
```

### Advanced Parser with Preprocessing
```javascript { .api }
const advancedParser = {
  parse: async (text, options) => {
    // Handle async parsing
    const ast = await parseAsync(text);
    return processAst(ast, options);
  },
  astFormat: "custom-ast",
  locStart: (node) => node.loc?.start?.offset ?? 0,
  locEnd: (node) => node.loc?.end?.offset ?? text.length,
  hasPragma: (text) => /@format/.test(text),
  preprocess: (text, options) => {
    // Transform source before parsing
    return text.replace(/oldSyntax/g, 'newSyntax');
  }
};
```

### Custom Printer with Embedded Language Support
```javascript { .api }
const customPrinter = {
  print: (path, options, print) => {
    const node = path.getValue();
    
    switch (node.type) {
      case "Block":
        return [
          "{",
          doc.builders.indent([
            doc.builders.hardline,
            path.map(print, "body")
          ]),
          doc.builders.hardline,
          "}"
        ];
      default:
        return node.value;
    }
  },
  embed: (path, options) => {
    const node = path.getValue();
    
    if (node.type === "EmbeddedCode" && node.lang === "javascript") {
      return async (textToDoc, print, path, options) => {
        // Format embedded JavaScript
        const formatted = await textToDoc(
          node.code,
          { ...options, parser: "babel" }
        );
        return formatted;
      };
    }
    return null;
  }
};
```