# Command Line and Configuration

Configuration management and command-line argument parsing for building TypeScript tooling and custom compilers.

## Capabilities

### Command Line Parsing

Parse TypeScript compiler command-line arguments into structured options and file lists.

```typescript { .api }
/**
 * Parse command line arguments into compiler options and file names
 * @param commandLine - Array of command line arguments
 * @param readFile - Optional function to read files
 * @returns Parsed command line with options, file names, and errors
 */
function parseCommandLine(commandLine: readonly string[], readFile?: (path: string) => string | undefined): ParsedCommandLine;

/**
 * Worker function for parsing command line with custom diagnostics
 * @param diagnostics - Diagnostics array to populate
 * @param commandLine - Command line arguments
 * @param readFile - Optional file reading function
 * @returns Parsed command line
 */
function parseCommandLineWorker(
  diagnostics: Diagnostic[],
  commandLine: readonly string[],
  readFile?: (path: string) => string | undefined
): ParsedCommandLine;

interface ParsedCommandLine {
  options: CompilerOptions;
  typeAcquisition?: TypeAcquisition;
  fileNames: string[];
  projectReferences?: readonly ProjectReference[];
  watchOptions?: WatchOptions;
  raw?: any;
  errors: Diagnostic[];
  wildcardDirectories?: MapLike<WatchDirectoryFlags>;
  compileOnSave?: boolean;
}
```

**Usage Examples:**

```typescript
import * as ts from "typescript";

// Parse command line arguments
const commandLine = [
  "--target", "ES2020",
  "--module", "CommonJS", 
  "--strict",
  "--outDir", "./dist",
  "src/index.ts",
  "src/utils.ts"
];

const parsed = ts.parseCommandLine(commandLine);

if (parsed.errors.length > 0) {
  console.log("Command line errors:");
  for (const error of parsed.errors) {
    console.log(ts.flattenDiagnosticMessageText(error.messageText, "\n"));
  }
} else {
  console.log("Target:", parsed.options.target);
  console.log("Module:", parsed.options.module); 
  console.log("Strict:", parsed.options.strict);
  console.log("Output Directory:", parsed.options.outDir);
  console.log("Input Files:", parsed.fileNames);
}
```

### Configuration File Reading

Read and parse TypeScript configuration files (tsconfig.json).

```typescript { .api }
/**
 * Read and parse a configuration file
 * @param fileName - Path to configuration file
 * @param readFile - Function to read file content
 * @returns Configuration object or error
 */
function readConfigFile(fileName: string, readFile: (path: string) => string | undefined): { config?: any; error?: Diagnostic };

/**
 * Parse configuration file JSON text
 * @param fileName - Configuration file name (for error reporting)
 * @param jsonText - JSON content to parse
 * @returns Parsed configuration or error
 */
function parseConfigFileTextToJson(fileName: string, jsonText: string): { config?: any; error?: Diagnostic };

/**
 * Read JSON configuration file with error handling
 * @param fileName - Path to JSON configuration file
 * @param readFile - Function to read file content
 * @returns JSON source file with diagnostics
 */
function readJsonConfigFile(fileName: string, readFile: (path: string) => string | undefined): JsonSourceFile & { parseDiagnostics: Diagnostic[] };

/**
 * Convert parsed JSON to configuration object
 * @param sourceFile - Parsed JSON source file
 * @param errors - Array to collect parsing errors
 * @returns Configuration object
 */
function convertToObject(sourceFile: JsonSourceFile, errors: Diagnostic[]): any;
```

**Usage Examples:**

```typescript
import * as ts from "typescript";
import * as fs from "fs";

// Read tsconfig.json file
function readTsConfig(configPath: string) {
  const readFile = (path: string) => {
    try {
      return fs.readFileSync(path, 'utf8');
    } catch {
      return undefined;
    }
  };

  // Read the configuration file
  const result = ts.readConfigFile(configPath, readFile);
  
  if (result.error) {
    console.error("Error reading config file:", 
      ts.flattenDiagnosticMessageText(result.error.messageText, "\n"));
    return null;
  }

  // Parse the configuration
  const parseResult = ts.parseJsonConfigFileContent(
    result.config,
    ts.sys,
    path.dirname(configPath),
    undefined,
    configPath
  );

  if (parseResult.errors.length > 0) {
    console.error("Configuration errors:");
    for (const error of parseResult.errors) {
      console.error(ts.flattenDiagnosticMessageText(error.messageText, "\n"));
    }
  }

  return parseResult;
}
```

### Configuration File Processing

Process and validate TypeScript configuration files with full compiler option support.

```typescript { .api }
/**
 * Parse JSON configuration file content into compiler options
 * @param json - Parsed JSON configuration object
 * @param host - Configuration parsing host
 * @param basePath - Base path for resolving relative paths
 * @param existingOptions - Existing options to extend
 * @param configFileName - Configuration file name
 * @param resolutionStack - Stack for circular reference detection
 * @param extraFileExtensions - Additional file extensions to recognize
 * @returns Parsed configuration
 */
function parseJsonConfigFileContent(
  json: any,
  host: ParseConfigHost,
  basePath: string,
  existingOptions?: CompilerOptions,
  configFileName?: string,
  resolutionStack?: Path[],
  extraFileExtensions?: readonly FileExtensionInfo[]
): ParsedCommandLine;

/**
 * Parse JSON source file into configuration
 * @param sourceFile - JSON source file to parse
 * @param host - Configuration parsing host  
 * @param basePath - Base path for resolving relative paths
 * @param existingOptions - Existing options to extend
 * @param configFileName - Configuration file name
 * @param resolutionStack - Stack for circular reference detection
 * @param extraFileExtensions - Additional file extensions
 * @returns Parsed configuration
 */
function parseJsonSourceFileConfigFileContent(
  sourceFile: JsonSourceFile,
  host: ParseConfigHost,
  basePath: string,
  existingOptions?: CompilerOptions,
  configFileName?: string,
  resolutionStack?: Path[],
  extraFileExtensions?: readonly FileExtensionInfo[]
): ParsedCommandLine;

interface ParseConfigHost {
  useCaseSensitiveFileNames: boolean;
  readDirectory(rootDir: string, extensions: readonly string[], excludes: readonly string[] | undefined, includes: readonly string[], depth?: number): readonly string[];
  fileExists(path: string): boolean;
  readFile(path: string): string | undefined;
  trace?(s: string): void;
}
```

### Configuration File Discovery

Find TypeScript configuration files in directory hierarchies.

```typescript { .api }
/**
 * Find configuration file by searching up directory tree
 * @param searchPath - Starting directory path
 * @param fileExists - Function to check if file exists
 * @param configName - Configuration file name to search for
 * @returns Path to configuration file or undefined
 */
function findConfigFile(searchPath: string, fileExists: (fileName: string) => boolean, configName?: string): string | undefined;

/**
 * Get canonical file name for configuration
 * @param fileName - File name to canonicalize
 * @param useCaseSensitiveFileNames - Whether file system is case sensitive
 * @returns Canonical file name
 */
function getCanonicalFileName(fileName: string, useCaseSensitiveFileNames: boolean): string;

/**
 * Create incremental configuration parsing host
 * @param system - File system interface
 * @returns Configuration parsing host
 */
function createIncrementalConfigHost(system: System): ParseConfigHost;
```

**Usage Examples:**

```typescript
import * as ts from "typescript";
import * as path from "path";

// Find tsconfig.json starting from current directory
function findTsConfig(startPath: string = process.cwd()): string | undefined {
  return ts.findConfigFile(startPath, ts.sys.fileExists, "tsconfig.json");
}

// Complete configuration loading example
function loadTypeScriptConfig(projectPath: string) {
  // Find configuration file
  const configFile = ts.findConfigFile(projectPath, ts.sys.fileExists);
  if (!configFile) {
    throw new Error("Could not find tsconfig.json");
  }

  // Read and parse configuration
  const configResult = ts.readConfigFile(configFile, ts.sys.readFile);
  if (configResult.error) {
    throw new Error(ts.formatDiagnostic(configResult.error, {
      getCanonicalFileName: fileName => fileName,
      getCurrentDirectory: ts.sys.getCurrentDirectory,
      getNewLine: () => ts.sys.newLine
    }));
  }

  // Parse JSON into compiler options
  const parseResult = ts.parseJsonConfigFileContent(
    configResult.config,
    ts.sys,
    path.dirname(configFile)
  );

  if (parseResult.errors.length > 0) {
    const errorMessage = ts.formatDiagnosticsWithColorAndContext(parseResult.errors, {
      getCanonicalFileName: fileName => fileName,
      getCurrentDirectory: ts.sys.getCurrentDirectory,
      getNewLine: () => ts.sys.newLine
    });
    throw new Error(errorMessage);
  }

  return parseResult;
}
```

### Option Management

Manage and validate TypeScript compiler options.

```typescript { .api }
/**
 * Get compiler option definition by name
 * @param optionName - Name of the option
 * @param allowShort - Whether to allow short option names
 * @returns Option definition or undefined
 */
function getOptionFromName(optionName: string, allowShort?: boolean): CommandLineOption | undefined;

/**
 * Get map of all available compiler options
 * @returns Map from option names to option definitions
 */
function getOptionsNameMap(): Map<string, CommandLineOption>;

/**
 * Create diagnostic for invalid custom type
 * @param opt - Option with invalid custom type
 * @returns Diagnostic for the error
 */
function createCompilerDiagnosticForInvalidCustomType(opt: CommandLineOptionOfCustomType): Diagnostic;

/**
 * Convert compiler option value to proper type
 * @param option - Option definition
 * @param value - Raw option value
 * @returns Converted option value
 */
function convertCompilerOptionsFromJson(jsonOptions: any, basePath: string, configFileName?: string): { options: CompilerOptions; errors: Diagnostic[] };

/**
 * Get default compiler options
 * @returns Default compiler options object
 */
function getDefaultCompilerOptions(): CompilerOptions;
```

### Project References

Work with TypeScript project references for multi-project builds.

```typescript { .api }
interface ProjectReference {
  /** Path to referenced project */
  path: string;
  /** Whether reference should be prepended to output */
  prepend?: boolean;
  /** Whether reference is circular */
  circular?: boolean;
}

/**
 * Resolve project references for a configuration
 * @param projectReferences - Array of project references
 * @param resolveProjectPath - Function to resolve project paths
 * @returns Resolved project references
 */
function resolveProjectReferencePath(ref: ProjectReference): ResolvedProjectReference;

interface ResolvedProjectReference {
  commandLine: ParsedCommandLine;
  sourceFile: SourceFile;
  references?: readonly (ResolvedProjectReference | undefined)[];
}

/**
 * Create solution builder for project references
 * @param host - Solution builder host
 * @param rootNames - Root project names
 * @param defaultOptions - Default compiler options
 * @returns Solution builder instance
 */
function createSolutionBuilder<T extends BuilderProgram>(
  host: SolutionBuilderHost<T>,
  rootNames: readonly string[],
  defaultOptions: BuildOptions
): SolutionBuilder<T>;
```

## Types

### Compiler Options

```typescript { .api }
interface CompilerOptions {
  /** Language version target */
  target?: ScriptTarget;
  
  /** Module system */
  module?: ModuleKind;
  
  /** Library files to include */
  lib?: string[];
  
  /** Allow JavaScript files */
  allowJs?: boolean;
  
  /** Check JavaScript files */
  checkJs?: boolean;
  
  /** Include source maps */
  sourceMap?: boolean;
  
  /** Include inline source maps */
  inlineSourceMap?: boolean;
  
  /** Output directory */
  outDir?: string;
  
  /** Output file */
  outFile?: string;
  
  /** Root directory */
  rootDir?: string;
  
  /** Remove comments */
  removeComments?: boolean;
  
  /** Don't emit output */
  noEmit?: boolean;
  
  /** Don't emit on error */
  noEmitOnError?: boolean;
  
  /** Enable strict type checking */
  strict?: boolean;
  
  /** Enable strict null checks */
  strictNullChecks?: boolean;
  
  /** Enable strict function types */
  strictFunctionTypes?: boolean;
  
  /** Enable strict property initialization */
  strictPropertyInitialization?: boolean;
  
  /** No implicit any */
  noImplicitAny?: boolean;
  
  /** No implicit returns */
  noImplicitReturns?: boolean;
  
  /** No implicit this */
  noImplicitThis?: boolean;
  
  /** No unused locals */
  noUnusedLocals?: boolean;
  
  /** No unused parameters */
  noUnusedParameters?: boolean;
  
  /** Module resolution strategy */
  moduleResolution?: ModuleResolutionKind;
  
  /** Base URL for module resolution */
  baseUrl?: string;
  
  /** Path mapping */
  paths?: MapLike<string[]>;
  
  /** Root directories */
  rootDirs?: string[];
  
  /** Type roots */
  typeRoots?: string[];
  
  /** Types to include */
  types?: string[];
  
  /** Allow synthetic default imports */
  allowSyntheticDefaultImports?: boolean;
  
  /** ES module interop */
  esModuleInterop?: boolean;
  
  /** Preserve symlinks */
  preserveSymlinks?: boolean;
  
  /** Allow UMD global access */
  allowUmdGlobalAccess?: boolean;
  
  /** Source root */
  sourceRoot?: string;
  
  /** Map root */
  mapRoot?: string;
  
  /** Include source content */
  inlineSources?: boolean;
  
  /** Experimental decorators */
  experimentalDecorators?: boolean;
  
  /** Emit decorator metadata */
  emitDecoratorMetadata?: boolean;
  
  /** Generate declaration files */
  declaration?: boolean;
  
  /** Declaration output directory */
  declarationDir?: string;
  
  /** Generate declaration maps */
  declarationMap?: boolean;
  
  /** Skip library check */
  skipLibCheck?: boolean;
  
  /** Skip default library */
  skipDefaultLibCheck?: boolean;
  
  /** Composite project */
  composite?: boolean;
  
  /** Incremental compilation */
  incremental?: boolean;
  
  /** Build info file */
  tsBuildInfoFile?: string;
  
  /** Disable size limit */
  disableSizeLimit?: boolean;
  
  /** Charset */
  charset?: string;
  
  /** New line character */
  newLine?: NewLineKind;
  
  /** No error truncation */
  noErrorTruncation?: boolean;
  
  /** No lib */
  noLib?: boolean;
  
  /** No resolve */
  noResolve?: boolean;
  
  /** Suppress excess property errors */
  suppressExcessPropertyErrors?: boolean;
  
  /** Suppress implicit any index errors */
  suppressImplicitAnyIndexErrors?: boolean;
  
  /** Force consistent casing */
  forceConsistentCasingInFileNames?: boolean;
  
  // JSX options
  jsx?: JsxEmit;
  jsxFactory?: string;
  jsxFragmentFactory?: string;
  jsxImportSource?: string;
  
  // Watch options
  watchFile?: WatchFileKind;
  watchDirectory?: WatchDirectoryKind;
  fallbackPolling?: PollingWatchKind;
  synchronousWatchDirectory?: boolean;
  
  // Advanced options
  resolveJsonModule?: boolean;
  isolatedModules?: boolean;
  verbatimModuleSyntax?: boolean;
  allowImportingTsExtensions?: boolean;
  noCheck?: boolean;
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

enum ModuleResolutionKind {
  Legacy = 1,
  Node = 2,
  Node16 = 3,
  NodeNext = 99
}

enum JsxEmit {
  None = 0,
  Preserve = 1,
  React = 2,
  ReactNative = 3,
  ReactJSX = 4,
  ReactJSXDev = 5
}
```

### Command Line Option Types

```typescript { .api }
interface CommandLineOption {
  name: string;
  type: "string" | "number" | "boolean" | "object" | "list" | Map<string | number, string | number>;
  isFilePath?: boolean;
  shortName?: string;
  description?: DiagnosticMessage;
  paramType?: DiagnosticMessage;
  isTSConfigOnly?: boolean;
  isCommandLineOnly?: boolean;
  showInSimplifiedHelpView?: boolean;
  category?: DiagnosticMessage;
  strictFlag?: true;
  affectsSourceFile?: true;
  affectsModuleResolution?: true;
  affectsBindDiagnostics?: true;
  affectsSemanticDiagnostics?: true;
  affectsEmit?: true;
}

interface CommandLineOptionOfCustomType extends CommandLineOption {
  type: Map<string, string | number>;
}

interface TsConfigOnlyOption extends CommandLineOption {
  type: "object";
  elementOptions?: Map<string, CommandLineOption>;
}

interface CommandLineOptionOfListType extends CommandLineOption {
  type: "list";
  element: CommandLineOption;
}

type CompilerOptionsValue = string | number | boolean | (string | number)[] | string[] | MapLike<string[]> | PluginImport[] | ProjectReference[] | null | undefined;
```

### Watch Options

```typescript { .api }
interface WatchOptions {
  watchFile?: WatchFileKind;
  watchDirectory?: WatchDirectoryKind;
  fallbackPolling?: PollingWatchKind;
  synchronousWatchDirectory?: boolean;
  excludeDirectories?: string[];
  excludeFiles?: string[];
}

enum WatchFileKind {
  FixedPollingInterval = 0,
  PriorityPollingInterval = 1,
  DynamicPriorityPolling = 2,
  UseFsEvents = 3,
  UseFsEventsOnParentDirectory = 4
}

enum WatchDirectoryKind {
  UseFsEvents = 0,
  FixedPollingInterval = 1,
  DynamicPriorityPolling = 2
}

enum PollingWatchKind {
  FixedInterval = 0,
  PriorityInterval = 1,
  DynamicPriority = 2
}

interface TypeAcquisition {
  enable?: boolean;
  include?: string[];
  exclude?: string[];
  disableFilenameBasedTypeAcquisition?: boolean;
}
```