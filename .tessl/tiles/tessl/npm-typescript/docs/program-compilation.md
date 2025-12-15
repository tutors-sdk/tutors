# Program and Compilation

High-level compilation interface that manages multiple source files, handles module resolution, and orchestrates the compilation process from parsing to emit.

## Capabilities

### Program Creation

Create and manage TypeScript compilation programs.

```typescript { .api }
/**
 * Create a TypeScript program from source files and options
 * @param rootNames - Array of root file names to compile
 * @param options - Compiler options
 * @param host - Optional compiler host (defaults to system host)
 * @param oldProgram - Previous program for incremental compilation
 * @param configFileParsingDiagnostics - Diagnostics from config file parsing
 * @returns Program instance
 */
function createProgram(
  rootNames: readonly string[],
  options: CompilerOptions,
  host?: CompilerHost,
  oldProgram?: Program,
  configFileParsingDiagnostics?: readonly Diagnostic[]
): Program;

/**
 * Create a default compiler host
 * @param options - Compiler options
 * @param setParentNodes - Whether to set parent node references
 * @returns Compiler host instance
 */
function createCompilerHost(
  options: CompilerOptions,
  setParentNodes?: boolean
): CompilerHost;

/**
 * Create a watch compiler host for file watching scenarios
 * @param configFileName - Path to tsconfig.json
 * @param optionsToExtend - Additional options to extend config
 * @param system - System interface for file operations
 * @param createProgram - Custom program creation function
 * @param reportDiagnostic - Diagnostic reporting callback
 * @param reportWatchStatus - Watch status reporting callback
 * @returns Watch compiler host
 */
function createWatchCompilerHost<T extends BuilderProgram>(
  configFileName: string,
  optionsToExtend: CompilerOptions | undefined,
  system: System,
  createProgram?: CreateProgram<T>,
  reportDiagnostic?: DiagnosticReporter,
  reportWatchStatus?: WatchStatusReporter
): WatchCompilerHost<T>;
```

**Usage Examples:**

```typescript
import * as ts from "typescript";

// Create a simple program
const program = ts.createProgram({
  rootNames: ["src/index.ts", "src/utils.ts"],
  options: {
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.CommonJS,
    outDir: "dist",
    declaration: true,
    strict: true
  }
});

// Get source files
const sourceFiles = program.getSourceFiles();
console.log(`Program has ${sourceFiles.length} source files`);

// Check for errors
const diagnostics = ts.getPreEmitDiagnostics(program);
if (diagnostics.length > 0) {
  console.log(ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCurrentDirectory: () => ts.sys.getCurrentDirectory(),
    getCanonicalFileName: (fileName) => fileName,
    getNewLine: () => ts.sys.newLine
  }));
}

// Emit JavaScript files
const emitResult = program.emit();
console.log(`Emit skipped: ${emitResult.emitSkipped}`);
```

### Program Interface

Core program methods for accessing compilation information.

```typescript { .api }
interface Program {
  /**
   * Get the root file names passed to the program
   * @returns Array of root file names
   */
  getRootFileNames(): readonly string[];

  /**
   * Get a specific source file by name
   * @param fileName - Name of source file to retrieve
   * @returns Source file or undefined
   */
  getSourceFile(fileName: string): SourceFile | undefined;

  /**
   * Get all source files in the program
   * @returns Array of all source files
   */
  getSourceFiles(): readonly SourceFile[];

  /**
   * Get the compiler options used by the program
   * @returns Compiler options
   */
  getCompilerOptions(): CompilerOptions;

  /**
   * Get the current working directory
   * @returns Current directory path
   */
  getCurrentDirectory(): string;

  /**
   * Get the type checker for semantic analysis
   * @returns Type checker instance
   */
  getTypeChecker(): TypeChecker;

  /**
   * Check if a source file is from an external library
   * @param file - Source file to check
   * @returns True if from external library
   */
  isSourceFileFromExternalLibrary(file: SourceFile): boolean;

  /**
   * Check if a source file is a default library file
   * @param file - Source file to check
   * @returns True if default library file
   */
  isSourceFileDefaultLibrary(file: SourceFile): boolean;
}
```

### Program Diagnostics

Get compilation diagnostics and errors.

```typescript { .api }
interface Program {
  /**
   * Get syntactic diagnostics for a source file
   * @param sourceFile - Source file to analyze (all files if undefined)
   * @returns Array of syntactic diagnostics
   */
  getSyntacticDiagnostics(sourceFile?: SourceFile): readonly Diagnostic[];

  /**
   * Get semantic diagnostics for a source file
   * @param sourceFile - Source file to analyze (all files if undefined)
   * @param cancellationToken - Token for cancelling operation
   * @returns Array of semantic diagnostics
   */
  getSemanticDiagnostics(
    sourceFile?: SourceFile,
    cancellationToken?: CancellationToken
  ): readonly Diagnostic[];

  /**
   * Get declaration diagnostics for a source file
   * @param sourceFile - Source file to analyze (all files if undefined)
   * @param cancellationToken - Token for cancelling operation
   * @returns Array of declaration diagnostics
   */
  getDeclarationDiagnostics(
    sourceFile?: SourceFile,
    cancellationToken?: CancellationToken
  ): readonly Diagnostic[];

  /**
   * Get configuration file diagnostics
   * @returns Array of config file diagnostics
   */
  getConfigFileParsingDiagnostics(): readonly Diagnostic[];

  /**
   * Get option diagnostics
   * @param cancellationToken - Token for cancelling operation
   * @returns Array of option diagnostics
   */
  getOptionsDiagnostics(cancellationToken?: CancellationToken): readonly Diagnostic[];

  /**
   * Get global diagnostics
   * @param cancellationToken - Token for cancelling operation
   * @returns Array of global diagnostics
   */
  getGlobalDiagnostics(cancellationToken?: CancellationToken): readonly Diagnostic[];
}

/**
 * Get all pre-emit diagnostics for a program
 * @param program - Program to analyze
 * @param sourceFile - Specific source file (all files if undefined)
 * @param cancellationToken - Token for cancelling operation
 * @returns Combined array of all diagnostics
 */
function getPreEmitDiagnostics(
  program: Program,
  sourceFile?: SourceFile,
  cancellationToken?: CancellationToken
): readonly Diagnostic[];
```

### Code Emission

Emit JavaScript and declaration files from TypeScript.

```typescript { .api }
interface Program {
  /**
   * Emit JavaScript and declaration files
   * @param targetSourceFile - Specific file to emit (all files if undefined)
   * @param writeFile - Custom file writing function
   * @param cancellationToken - Token for cancelling operation
   * @param emitOnlyDtsFiles - Only emit declaration files
   * @param customTransformers - Custom AST transformers
   * @returns Emit result with diagnostics and status
   */
  emit(
    targetSourceFile?: SourceFile,
    writeFile?: WriteFileCallback,
    cancellationToken?: CancellationToken,
    emitOnlyDtsFiles?: boolean,
    customTransformers?: CustomTransformers
  ): EmitResult;
}

interface EmitResult {
  emitSkipped: boolean;
  diagnostics: readonly Diagnostic[];
  emittedFiles?: string[];
}

interface WriteFileCallback {
  (fileName: string, data: string, writeByteOrderMark: boolean, onError?: (message: string) => void, sourceFiles?: readonly SourceFile[]): void;
}

interface CustomTransformers {
  before?: readonly TransformerFactory<SourceFile>[];
  after?: readonly TransformerFactory<SourceFile>[];
  afterDeclarations?: readonly TransformerFactory<Bundle | SourceFile>[];
}
```

### Compiler Host

Interface for providing file system operations to the compiler.

```typescript { .api }
interface CompilerHost extends ModuleResolutionHost {
  /**
   * Get a source file by name
   * @param fileName - Name of file to get
   * @param languageVersion - Target language version
   * @param onError - Error callback
   * @param shouldCreateNewSourceFile - Whether to create new source file
   * @returns Source file or undefined
   */
  getSourceFile(
    fileName: string,
    languageVersion: ScriptTarget,
    onError?: (message: string) => void,
    shouldCreateNewSourceFile?: boolean
  ): SourceFile | undefined;

  /**
   * Write a file to disk
   * @param fileName - Name of file to write
   * @param data - File content
   * @param writeByteOrderMark - Whether to write BOM
   * @param onError - Error callback
   * @param sourceFiles - Source files that generated this output
   */
  writeFile: WriteFileCallback;

  /**
   * Get current directory
   * @returns Current directory path
   */
  getCurrentDirectory(): string;

  /**
   * Get directories in a path
   * @param path - Directory path
   * @returns Array of directory names
   */
  getDirectories(path: string): string[];

  /**
   * Check if file exists
   * @param fileName - File name to check
   * @returns True if file exists
   */
  fileExists(fileName: string): boolean;

  /**
   * Read file content
   * @param fileName - File name to read
   * @returns File content or undefined
   */
  readFile(fileName: string): string | undefined;

  /**
   * Get canonical file name (for case sensitivity)
   * @param fileName - File name to canonicalize
   * @returns Canonical file name
   */
  getCanonicalFileName(fileName: string): string;

  /**
   * Check if file names are case sensitive
   * @returns True if case sensitive
   */
  useCaseSensitiveFileNames(): boolean;

  /**
   * Get new line character
   * @returns New line string
   */
  getNewLine(): string;
}
```

### Configuration Management

Find and parse TypeScript configuration files.

```typescript { .api }
/**
 * Find a configuration file starting from a path
 * @param searchPath - Path to start searching from
 * @param fileExists - Function to check if file exists
 * @param configName - Configuration file name (default: "tsconfig.json")
 * @returns Path to config file or undefined
 */
function findConfigFile(
  searchPath: string,
  fileExists: (fileName: string) => boolean,
  configName?: string
): string | undefined;

/**
 * Read a configuration file
 * @param fileName - Path to configuration file
 * @param readFile - Function to read file content
 * @returns Configuration object and any errors
 */
function readConfigFile(
  fileName: string,
  readFile: (path: string) => string | undefined
): { config?: any; error?: Diagnostic };

/**
 * Parse configuration file JSON text
 * @param fileName - Configuration file name
 * @param jsonText - JSON content of config file
 * @returns Parsed configuration and any errors
 */
function parseConfigFileTextToJson(
  fileName: string,
  jsonText: string
): { config?: any; error?: Diagnostic };

/**
 * Parse a JSON configuration file into compiler options
 * @param json - Parsed JSON configuration
 * @param host - Configuration parsing host
 * @param basePath - Base path for resolving relative paths
 * @param existingOptions - Existing options to extend
 * @param configFileName - Name of configuration file
 * @param resolutionStack - Stack for circular reference detection
 * @returns Parsed command line options
 */
function parseJsonConfigFileContent(
  json: any,
  host: ParseConfigHost,
  basePath: string,
  existingOptions?: CompilerOptions,
  configFileName?: string,
  resolutionStack?: Path[]
): ParsedCommandLine;
```

### Module Resolution

Resolve module names and type reference directives.

```typescript { .api }
/**
 * Resolve a module name to a file
 * @param moduleName - Name of module to resolve
 * @param containingFile - File that contains the import
 * @param compilerOptions - Compiler options
 * @param host - Module resolution host
 * @param cache - Optional resolution cache
 * @param redirectedReferences - Optional redirected project references
 * @returns Resolved module with failed lookup locations
 */
function resolveModuleName(
  moduleName: string,
  containingFile: string,
  compilerOptions: CompilerOptions,
  host: ModuleResolutionHost,
  cache?: ModuleResolutionCache,
  redirectedReferences?: readonly ResolvedProjectReference[]
): ResolvedModuleWithFailedLookupLocations;

/**
 * Resolve type reference directive to declaration file
 * @param typeReferenceDirectiveName - Name of type reference
 * @param containingFile - File that contains the reference
 * @param options - Compiler options
 * @param host - Module resolution host
 * @param redirectedReference - Optional redirected project reference
 * @param cache - Optional resolution cache
 * @returns Resolved type reference directive
 */
function resolveTypeReferenceDirective(
  typeReferenceDirectiveName: string,
  containingFile: string | undefined,
  options: CompilerOptions,
  host: ModuleResolutionHost,
  redirectedReference?: ResolvedProjectReference,
  cache?: TypeReferenceDirectiveResolutionCache
): ResolvedTypeReferenceDirectiveWithFailedLookupLocations;

/**
 * Create module resolution cache for performance
 * @param currentDirectory - Current working directory
 * @param getCanonicalFileName - Function to canonicalize file names
 * @param options - Compiler options
 * @returns Module resolution cache
 */
function createModuleResolutionCache(
  currentDirectory: string,
  getCanonicalFileName: (fileName: string) => string,
  options?: CompilerOptions
): ModuleResolutionCache;

interface ModuleResolutionHost {
  fileExists(fileName: string): boolean;
  readFile(fileName: string): string | undefined;
  trace?(s: string): void;
  directoryExists?(directoryName: string): boolean;
  realpath?(path: string): string;
  getCurrentDirectory?(): string;
  getDirectories?(path: string): string[];
}

interface ResolvedModule {
  resolvedFileName: string;
  isExternalLibraryImport?: boolean;
  packageId?: PackageId;
}

interface ResolvedModuleWithFailedLookupLocations {
  resolvedModule: ResolvedModule | undefined;
  failedLookupLocations: string[];
}
```

### Diagnostic Formatting

Format diagnostics for display.

```typescript { .api }
/**
 * Format diagnostics as plain text
 * @param diagnostics - Array of diagnostics to format
 * @param host - Format host for path resolution
 * @returns Formatted diagnostic string
 */
function formatDiagnostics(
  diagnostics: readonly Diagnostic[],
  host: FormatDiagnosticsHost
): string;

/**
 * Format diagnostics with color and context
 * @param diagnostics - Array of diagnostics to format
 * @param host - Format host for path resolution
 * @returns Formatted diagnostic string with colors
 */
function formatDiagnosticsWithColorAndContext(
  diagnostics: readonly Diagnostic[],
  host: FormatDiagnosticsHost
): string;

interface FormatDiagnosticsHost {
  getCurrentDirectory(): string;
  getCanonicalFileName(fileName: string): string;
  getNewLine(): string;
}
```

## Types

### Compiler Options

```typescript { .api }
interface CompilerOptions {
  // Target and Module
  target?: ScriptTarget;
  module?: ModuleKind;
  lib?: string[];
  allowJs?: boolean;
  checkJs?: boolean;
  declaration?: boolean;
  declarationMap?: boolean;
  emitDeclarationOnly?: boolean;
  sourceMap?: boolean;
  inlineSourceMap?: boolean;
  inlineSources?: boolean;

  // Output
  outFile?: string;
  outDir?: string;
  rootDir?: string;
  composite?: boolean;
  tsBuildInfoFile?: string;
  removeComments?: boolean;
  noEmit?: boolean;
  importHelpers?: boolean;
  importsNotUsedAsValues?: ImportsNotUsedAsValues;
  downlevelIteration?: boolean;
  isolatedModules?: boolean;

  // Strict Checks
  strict?: boolean;
  noImplicitAny?: boolean;
  strictNullChecks?: boolean;
  strictFunctionTypes?: boolean;
  strictBindCallApply?: boolean;
  strictPropertyInitialization?: boolean;
  noImplicitThis?: boolean;
  useUnknownInCatchVariables?: boolean;
  alwaysStrict?: boolean;

  // Additional Checks
  noUnusedLocals?: boolean;
  noUnusedParameters?: boolean;
  exactOptionalPropertyTypes?: boolean;
  noImplicitReturns?: boolean;
  noFallthroughCasesInSwitch?: boolean;
  noUncheckedIndexedAccess?: boolean;
  noImplicitOverride?: boolean;
  noPropertyAccessFromIndexSignature?: boolean;

  // Module Resolution
  moduleResolution?: ModuleResolutionKind;
  baseUrl?: string;
  paths?: MapLike<string[]>;
  rootDirs?: string[];
  typeRoots?: string[];
  types?: string[];
  allowSyntheticDefaultImports?: boolean;
  esModuleInterop?: boolean;
  preserveSymlinks?: boolean;
  allowUmdGlobalAccess?: boolean;

  // Source Maps
  sourceRoot?: string;
  mapRoot?: string;

  // Experimental
  experimentalDecorators?: boolean;
  emitDecoratorMetadata?: boolean;

  // Advanced
  skipLibCheck?: boolean;
  skipDefaultLibCheck?: boolean;
  maxNodeModuleJsDepth?: number;
  allowUnusedLabels?: boolean;
  allowUnreachableCode?: boolean;
  suppressExcessPropertyErrors?: boolean;
  suppressImplicitAnyIndexErrors?: boolean;
  forceConsistentCasingInFileNames?: boolean;
  allowArbitraryExtensions?: boolean;
  noErrorTruncation?: boolean;
  preserveWatchOutput?: boolean;
  pretty?: boolean;
  disableSizeLimit?: boolean;
  disableSourceOfProjectReferenceRedirect?: boolean;
  disableReferencedProjectLoad?: boolean;

  // Plugin System
  plugins?: PluginImport[];

  // Project References
  incremental?: boolean;
  assumeChangesOnlyAffectDirectDependencies?: boolean;
}

enum ScriptTarget {
  ES3 = 0,
  ES5 = 1,
  ES2015 = 2,
  ES2016 = 3,
  ES2017 = 4,
  ES2018 = 5,
  ES2019 = 6,
  ES2020 = 7,
  ES2021 = 8,
  ES2022 = 9,
  ESNext = 99,
  Latest = ESNext
}

enum ModuleKind {
  None = 0,
  CommonJS = 1,
  AMD = 2,
  UMD = 3,
  System = 4,
  ES2015 = 5,
  ES2020 = 6,
  ES2022 = 7,
  ESNext = 99,
  Node16 = 100,
  NodeNext = 199
}
```

### Parse Results

```typescript { .api }
interface ParsedCommandLine {
  options: CompilerOptions;
  typeAcquisition?: TypeAcquisition;
  fileNames: string[];
  projectReferences?: readonly ProjectReference[] | undefined;
  watchOptions?: WatchOptions;
  raw?: any;
  errors: Diagnostic[];
  wildcardDirectories?: MapLike<WatchDirectoryFlags>;
  compileOnSave?: boolean;
}

interface ProjectReference {
  path: string;
  originalPath?: string;
  prepend?: boolean;
  circular?: boolean;
}
```