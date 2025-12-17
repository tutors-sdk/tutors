# Language Services

Advanced IDE functionality including auto-completion, navigation, refactoring, and code fixes. Provides the foundation for rich development experiences in editors and IDEs.

## Capabilities

### Language Service Creation

Create and configure language service instances.

```typescript { .api }
/**
 * Create a TypeScript language service
 * @param host - Language service host providing project information
 * @param documentRegistry - Document registry for caching (uses default if not provided)
 * @param syntaxOnlyOrLanguageServiceMode - Syntax-only mode or full language service mode
 * @returns Language service instance
 */
function createLanguageService(
  host: LanguageServiceHost,
  documentRegistry?: DocumentRegistry,
  syntaxOnlyOrLanguageServiceMode?: boolean | LanguageServiceMode
): LanguageService;

/**
 * Create a document registry for caching parsed files
 * @param useCaseSensitiveFileNames - Whether file names are case sensitive
 * @param currentDirectory - Current working directory
 * @returns Document registry instance
 */
function createDocumentRegistry(
  useCaseSensitiveFileNames?: boolean,
  currentDirectory?: string
): DocumentRegistry;

enum LanguageServiceMode {
  Semantic = 0,
  PartialSemantic = 1,
  Syntactic = 2
}

interface LanguageServiceHost extends GetEffectiveTypeRootsHost {
  getCompilationSettings(): CompilerOptions;
  getNewLine?(): string;
  getProjectVersion?(): string;
  getScriptFileNames(): string[];
  getScriptKind?(fileName: string): ScriptKind;
  getScriptVersion(fileName: string): string;
  getScriptSnapshot(fileName: string): IScriptSnapshot | undefined;
  getProjectReferences?(): readonly ProjectReference[] | undefined;
  getLocalizedDiagnosticMessages?(): any;
  getCancellationToken?(): HostCancellationToken;
  getCurrentDirectory(): string;
  getDefaultLibFileName(options: CompilerOptions): string;
  log?(s: string): void;
  trace?(s: string): void;
  error?(s: string): void;
  useCaseSensitiveFileNames?(): boolean;
  readDirectory?(
    path: string,
    extensions?: readonly string[],
    exclude?: readonly string[],
    include?: readonly string[],
    depth?: number
  ): string[];
  readFile?(path: string, encoding?: string): string | undefined;
  realpath?(path: string): string;
  fileExists?(path: string): boolean;
  getTypeRootsVersion?(): number;
  resolveModuleNames?(
    moduleNames: string[],
    containingFile: string,
    reusedNames: string[] | undefined,
    redirectedReference: ResolvedProjectReference | undefined,
    options: CompilerOptions
  ): (ResolvedModule | undefined)[];
  getResolvedModuleWithFailedLookupLocationsFromCache?(
    modulename: string,
    containingFile: string
  ): ResolvedModuleWithFailedLookupLocations | undefined;
  resolveTypeReferenceDirectives?(
    typeDirectiveNames: string[],
    containingFile: string,
    redirectedReference: ResolvedProjectReference | undefined,
    options: CompilerOptions
  ): (ResolvedTypeReferenceDirective | undefined)[];
  hasInvalidatedResolution?(filePath: Path): boolean;
  hasChangedAutomaticTypeDirectiveNames?(): boolean;
  getGlobalTypingsCacheLocation?(): string | undefined;
}
```

**Usage Examples:**

```typescript
import * as ts from "typescript";

// Create a simple language service host
const files: Record<string, string> = {
  "example.ts": `
    interface User {
      name: string;
      age: number;
    }
    
    function greet(user: User): string {
      return \`Hello, \${user.name}!\`;
    }
    
    const john = { name: "John", age: 30 };
    greet(jo|n); // cursor at |
  `
};

const servicesHost: ts.LanguageServiceHost = {
  getScriptFileNames: () => Object.keys(files),
  getScriptVersion: () => "1",
  getScriptSnapshot: (fileName) => {
    if (!files[fileName]) return undefined;
    return ts.ScriptSnapshot.fromString(files[fileName]);
  },
  getCurrentDirectory: () => "",
  getCompilationSettings: () => ({
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2015
  }),
  getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
  fileExists: (fileName) => files[fileName] !== undefined,
  readFile: (fileName) => files[fileName]
};

const services = ts.createLanguageService(servicesHost);

// Get completions at cursor position (after "jo")
const completions = services.getCompletionsAtPosition("example.ts", 150, {});
if (completions) {
  completions.entries.forEach(entry => {
    console.log(`${entry.name}: ${entry.kind}`);
  });
}
```

### Auto-Completion

Get intelligent auto-completion suggestions.

```typescript { .api }
interface LanguageService {
  /**
   * Get auto-completion suggestions at a position
   * @param fileName - Name of source file
   * @param position - Character position in file
   * @param options - Completion options
   * @returns Completion information
   */
  getCompletionsAtPosition(
    fileName: string,
    position: number,
    options?: GetCompletionsAtPositionOptions
  ): CompletionInfo | undefined;

  /**
   * Get detailed information for a completion entry
   * @param fileName - Name of source file
   * @param position - Character position in file
   * @param name - Name of completion entry
   * @param formatOptions - Formatting options
   * @param source - Source of completion entry
   * @param preferences - User preferences
   * @returns Detailed completion information
   */
  getCompletionEntryDetails(
    fileName: string,
    position: number,
    name: string,
    formatOptions?: FormatCodeOptions,
    source?: string,
    preferences?: UserPreferences
  ): CompletionEntryDetails | undefined;

  /**
   * Get symbol for a completion entry
   * @param fileName - Name of source file
   * @param position - Character position in file
   * @param name - Name of completion entry
   * @param source - Source of completion entry
   * @returns Symbol information
   */
  getCompletionEntrySymbol(
    fileName: string,
    position: number,
    name: string,
    source?: string
  ): Symbol | undefined;
}

interface CompletionInfo {
  entries: readonly CompletionEntry[];
  isGlobalCompletion: boolean;
  isMemberCompletion: boolean;
  isNewIdentifierLocation: boolean;
  optionalReplacementSpan?: TextSpan;
}

interface CompletionEntry {
  name: string;
  kind: ScriptElementKind;
  kindModifiers?: string;
  sortText: string;
  insertText?: string;
  replacementSpan?: TextSpan;
  hasAction?: true;
  source?: string;
  isRecommended?: true;
  isFromUncheckedFile?: true;
  isPackageJsonImport?: true;
}
```

### Navigation and Definition

Navigate to definitions, implementations, and references.

```typescript { .api }
interface LanguageService {
  /**
   * Get definition locations for a symbol
   * @param fileName - Name of source file
   * @param position - Character position in file
   * @returns Array of definition locations
   */
  getDefinitionAtPosition(
    fileName: string,
    position: number
  ): readonly DefinitionInfo[] | undefined;

  /**
   * Get definition with bound span
   * @param fileName - Name of source file
   * @param position - Character position in file
   * @returns Definition info with bound span
   */
  getDefinitionAndBoundSpan(
    fileName: string,
    position: number
  ): DefinitionInfoAndBoundSpan | undefined;

  /**
   * Get type definition locations
   * @param fileName - Name of source file
   * @param position - Character position in file
   * @returns Array of type definition locations
   */
  getTypeDefinitionAtPosition(
    fileName: string,
    position: number
  ): readonly DefinitionInfo[] | undefined;

  /**
   * Get implementation locations
   * @param fileName - Name of source file
   * @param position - Character position in file
   * @returns Array of implementation locations
   */
  getImplementationAtPosition(
    fileName: string,
    position: number
  ): readonly ImplementationLocation[] | undefined;

  /**
   * Find all references to a symbol
   * @param fileName - Name of source file
   * @param position - Character position in file
   * @returns Array of referenced symbols with locations
   */
  findReferences(
    fileName: string,
    position: number
  ): ReferencedSymbol[] | undefined;

  /**
   * Find rename locations for a symbol
   * @param fileName - Name of source file
   * @param position - Character position in file
   * @param findInStrings - Whether to find in string literals
   * @param findInComments - Whether to find in comments
   * @param providePrefixAndSuffixTextForRename - Whether to provide prefix/suffix text
   * @returns Array of rename locations
   */
  findRenameLocations(
    fileName: string,
    position: number,
    findInStrings: boolean,
    findInComments: boolean,
    providePrefixAndSuffixTextForRename?: boolean
  ): readonly RenameLocation[] | undefined;
}

interface DefinitionInfo extends DocumentSpan {
  kind: ScriptElementKind;
  name: string;
  containerKind: ScriptElementKind;
  containerName: string;
  unverified?: boolean;
}

interface DocumentSpan {
  textSpan: TextSpan;
  fileName: string;
  originalTextSpan?: TextSpan;
  originalFileName?: string;
  contextSpan?: TextSpan;
}

interface ReferenceEntry extends DocumentSpan {
  isWriteAccess: boolean;
  isInString?: true;
}

interface ReferencedSymbol {
  definition?: ReferencedSymbolDefinitionInfo;
  references: ReferenceEntry[];
}
```

### Refactoring and Code Fixes

Get available refactorings and apply code fixes.

```typescript { .api }
interface LanguageService {
  /**
   * Get applicable refactors at a position or range
   * @param fileName - Name of source file
   * @param positionOrRange - Position or text range
   * @param preferences - User preferences
   * @returns Array of applicable refactors
   */
  getApplicableRefactors(
    fileName: string,
    positionOrRange: number | TextRange,
    preferences?: UserPreferences
  ): ApplicableRefactorInfo[];

  /**
   * Get edits for a specific refactor
   * @param fileName - Name of source file
   * @param formatOptions - Code formatting options
   * @param positionOrRange - Position or text range
   * @param refactorName - Name of refactor to apply
   * @param actionName - Name of specific action
   * @param preferences - User preferences
   * @returns File text changes for refactor
   */
  getEditsForRefactor(
    fileName: string,
    formatOptions: FormatCodeOptions,
    positionOrRange: number | TextRange,
    refactorName: string,
    actionName: string,
    preferences?: UserPreferences
  ): RefactorEditInfo | undefined;

  /**
   * Organize import statements
   * @param scope - Scope of organization (file or project)
   * @param formatOptions - Code formatting options
   * @param preferences - User preferences
   * @returns Array of file changes
   */
  organizeImports(
    scope: OrganizeImportsScope,
    formatOptions: FormatCodeOptions,
    preferences?: UserPreferences
  ): readonly FileTextChanges[];

  /**
   * Get edits for renaming a file
   * @param oldFilePath - Current file path
   * @param newFilePath - New file path
   * @param formatOptions - Code formatting options
   * @param preferences - User preferences
   * @returns Array of file changes
   */
  getEditsForFileRename(
    oldFilePath: string,
    newFilePath: string,
    formatOptions: FormatCodeOptions,
    preferences?: UserPreferences
  ): readonly FileTextChanges[];

  /**
   * Get code fixes for errors at a position
   * @param fileName - Name of source file
   * @param start - Start position of error
   * @param end - End position of error
   * @param errorCodes - Error codes to fix
   * @param formatOptions - Code formatting options
   * @param preferences - User preferences
   * @returns Array of code fix actions
   */
  getCodeFixesAtPosition(
    fileName: string,
    start: number,
    end: number,
    errorCodes: readonly number[],
    formatOptions: FormatCodeOptions,
    preferences: UserPreferences
  ): readonly CodeFixAction[];
}

interface ApplicableRefactorInfo {
  name: string;
  description: string;
  actions: RefactorActionInfo[];
  inlineable?: boolean;
}

interface RefactorActionInfo {
  name: string;
  description: string;
  notApplicableReason?: string;
}

interface FileTextChanges {
  fileName: string;
  textChanges: readonly TextChange[];
  isNewFile?: boolean;
}

interface TextChange {
  span: TextSpan;
  newText: string;
}
```

### Information and Diagnostics

Get hover information, signature help, and diagnostics.

```typescript { .api }
interface LanguageService {
  /**
   * Get quick info (hover) at a position
   * @param fileName - Name of source file
   * @param position - Character position in file
   * @returns Quick info display parts
   */
  getQuickInfoAtPosition(
    fileName: string,
    position: number
  ): QuickInfo | undefined;

  /**
   * Get signature help for function calls
   * @param fileName - Name of source file
   * @param position - Character position in file
   * @param options - Signature help options
   * @returns Signature help information
   */
  getSignatureHelpItems(
    fileName: string,
    position: number,
    options?: SignatureHelpItemsOptions
  ): SignatureHelpItems | undefined;

  /**
   * Get navigation bar items for file outline
   * @param fileName - Name of source file
   * @returns Array of navigation bar items
   */
  getNavigationBarItems(fileName: string): NavigationBarItem[];

  /**
   * Get hierarchical navigation tree
   * @param fileName - Name of source file
   * @returns Navigation tree root
   */
  getNavigationTree(fileName: string): NavigationTree;

  /**
   * Get collapsible regions (outlining spans)
   * @param fileName - Name of source file
   * @returns Array of outlining spans
   */
  getOutliningSpans(fileName: string): OutliningSpan[];

  /**
   * Get document highlights for a symbol
   * @param fileName - Name of source file
   * @param position - Character position in file
   * @param filesToSearch - Files to search for highlights
   * @returns Array of document highlights
   */
  getDocumentHighlights(
    fileName: string,
    position: number,
    filesToSearch: string[]
  ): DocumentHighlights[] | undefined;

  /**
   * Get syntactic diagnostics for a file
   * @param fileName - Name of source file
   * @returns Array of syntactic diagnostics
   */
  getSyntacticDiagnostics(fileName: string): readonly Diagnostic[];

  /**
   * Get semantic diagnostics for a file
   * @param fileName - Name of source file
   * @returns Array of semantic diagnostics
   */
  getSemanticDiagnostics(fileName: string): readonly Diagnostic[];

  /**
   * Get suggestion diagnostics for a file
   * @param fileName - Name of source file
   * @returns Array of suggestion diagnostics
   */
  getSuggestionDiagnostics(fileName: string): readonly DiagnosticWithLocation[];
}

interface QuickInfo {
  kind: ScriptElementKind;
  kindModifiers: string;
  textSpan: TextSpan;
  displayParts?: SymbolDisplayPart[];
  documentation?: SymbolDisplayPart[];
  tags?: JSDocTagInfo[];
}

interface SignatureHelpItems {
  items: SignatureHelpItem[];
  applicableSpan: TextSpan;
  selectedItemIndex: number;
  argumentIndex: number;
  argumentCount: number;
}

interface NavigationBarItem {
  text: string;
  kind: ScriptElementKind;
  kindModifiers: string;
  spans: TextSpan[];
  childItems?: NavigationBarItem[];
  indent: number;
  bolded: boolean;
  grayed: boolean;
}
```

### Code Formatting

Format TypeScript code according to style rules.

```typescript { .api }
interface LanguageService {
  /**
   * Get formatting edits for a text range
   * @param fileName - Name of source file
   * @param start - Start position of range
   * @param end - End position of range
   * @param options - Formatting options
   * @returns Array of text changes
   */
  getFormattingEditsForRange(
    fileName: string,
    start: number,
    end: number,
    options: FormatCodeOptions
  ): readonly TextChange[];

  /**
   * Get formatting edits for entire document
   * @param fileName - Name of source file
   * @param options - Formatting options
   * @returns Array of text changes
   */
  getFormattingEditsForDocument(
    fileName: string,
    options: FormatCodeOptions
  ): readonly TextChange[];

  /**
   * Get formatting edits after a keystroke
   * @param fileName - Name of source file
   * @param position - Position of keystroke
   * @param key - Character that was typed
   * @param options - Formatting options
   * @returns Array of text changes
   */
  getFormattingEditsAfterKeystroke(
    fileName: string,
    position: number,
    key: string,
    options: FormatCodeOptions
  ): readonly TextChange[];
}

interface FormatCodeOptions extends EditorOptions {
  insertSpaceAfterCommaDelimiter?: boolean;
  insertSpaceAfterSemicolonInForStatements?: boolean;
  insertSpaceBeforeAndAfterBinaryOperators?: boolean;
  insertSpaceAfterConstructor?: boolean;
  insertSpaceAfterKeywordsInControlFlowStatements?: boolean;
  insertSpaceAfterFunctionKeywordForAnonymousFunctions?: boolean;
  insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis?: boolean;
  insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets?: boolean;
  insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces?: boolean;
  insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces?: boolean;
  insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces?: boolean;
  insertSpaceAfterTypeAssertion?: boolean;
  insertSpaceBeforeFunctionParenthesis?: boolean;
  placeOpenBraceOnNewLineForFunctions?: boolean;
  placeOpenBraceOnNewLineForControlBlocks?: boolean;
  insertSpaceBeforeTypeAnnotation?: boolean;
  semicolons?: SemicolonPreference;
}
```

## Types

### Core Service Types

```typescript { .api }
enum ScriptElementKind {
  unknown = "",
  warning = "warning",
  keyword = "keyword",
  scriptElement = "script",
  moduleElement = "module",
  classElement = "class",
  localClassElement = "local class",
  interfaceElement = "interface",
  typeElement = "type",
  enumElement = "enum",
  enumMemberElement = "enum member",
  variableElement = "var",
  localVariableElement = "local var",
  functionElement = "function",
  localFunctionElement = "local function",
  memberFunctionElement = "method",
  memberGetAccessorElement = "getter",
  memberSetAccessorElement = "setter",
  memberVariableElement = "property",
  constructorImplementationElement = "constructor",
  callSignatureElement = "call",
  indexSignatureElement = "index",
  constructSignatureElement = "construct",
  parameterElement = "parameter",
  typeParameterElement = "type parameter",
  primitiveType = "primitive type",
  label = "label",
  alias = "alias",
  constElement = "const",
  letElement = "let",
  directory = "directory",
  externalModuleName = "external module name",
  jsxAttribute = "JSX attribute",
  string = "string"
}

interface TextSpan {
  start: number;
  length: number;
}

interface SymbolDisplayPart {
  text: string;
  kind: string;
}

interface JSDocTagInfo {
  name: string;
  text?: SymbolDisplayPart[];
}
```

### User Preferences

```typescript { .api }
interface UserPreferences {
  readonly disableSuggestions?: boolean;
  readonly quotePreference?: "auto" | "double" | "single";
  readonly includeCompletionsForModuleExports?: boolean;
  readonly includeCompletionsForImportStatements?: boolean;
  readonly includeCompletionsWithSnippetText?: boolean;
  readonly includeAutomaticOptionalChainCompletions?: boolean;
  readonly includeCompletionsWithInsertText?: boolean;
  readonly allowTextChangesInNewFiles?: boolean;
  readonly providePrefixAndSuffixTextForRename?: boolean;
  readonly includePackageJsonAutoImports?: "auto" | "on" | "off";
  readonly provideRefactorNotApplicableReason?: boolean;
  readonly allowRenameOfImportPath?: boolean;
  readonly includeCompletionsWithClassMemberSnippets?: boolean;
  readonly includeCompletionsWithObjectLiteralMethodSnippets?: boolean;
  readonly useLabelDetailsInCompletionEntries?: boolean;
  readonly allowIncompleteCompletions?: boolean;
  readonly displayPartsForJSDoc?: boolean;
  readonly generateReturnInDocTemplate?: boolean;
}
```