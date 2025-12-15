# Svelte Check

Svelte Check is a command-line tool that provides comprehensive diagnostics for Svelte applications, detecting unused CSS, Svelte accessibility hints, and JavaScript/TypeScript compiler errors. It integrates with TypeScript configuration files and offers flexible output formats for both human consumption and machine processing in CI/CD pipelines.

## Package Information

- **Package Name**: svelte-check
- **Package Type**: npm
- **Language**: TypeScript
- **Installation**: `npm install svelte-check --save-dev`

## Core Imports

Svelte Check is primarily used as a CLI tool via the binary:

```bash
# Global installation
npm install -g svelte-check
svelte-check

# Local installation (recommended)
npm install svelte-check --save-dev
npx svelte-check
```

For programmatic usage in build scripts:

```typescript
// Import for programmatic usage (advanced)
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Run svelte-check programmatically
const { stdout, stderr } = await execAsync('svelte-check --output machine');
```

## Basic Usage

### CLI Usage

Add to your package.json scripts:

```json
{
  "scripts": {
    "svelte-check": "svelte-check"
  }
}
```

Run basic check:

```bash
npm run svelte-check
```

With configuration options:

```bash
svelte-check --workspace ./src --output machine --tsconfig ./tsconfig.json
```

### Programmatic Usage

```typescript
// Run svelte-check programmatically via child process
import { spawn } from 'child_process';

function runSvelteCheck(options: string[] = []): Promise<{
  stdout: string;
  stderr: string;
  exitCode: number;
}> {
  return new Promise((resolve) => {
    const child = spawn('svelte-check', options);
    let stdout = '';
    let stderr = '';
    
    child.stdout.on('data', (data) => stdout += data);
    child.stderr.on('data', (data) => stderr += data);
    
    child.on('close', (exitCode) => {
      resolve({ stdout, stderr, exitCode: exitCode || 0 });
    });
  });
}

// Usage
const result = await runSvelteCheck(['--workspace', './src', '--output', 'machine']);
if (result.exitCode === 0) {
  console.log('No issues found');
} else {
  console.log('Issues found:', result.stdout);
}
```

## Architecture

Svelte Check is built on top of the Svelte Language Server and integrates several key components:

- **Language Server Integration**: Uses svelte-language-server for core diagnostic capabilities
- **Plugin Architecture**: Leverages TypeScript, Svelte, and CSS plugins for comprehensive checking
- **File System Monitoring**: Supports watch mode with efficient file change detection
- **Configurable Output**: Multiple output formats for different consumption needs (human/machine)
- **TypeScript Integration**: Full TypeScript project support via tsconfig.json

## Capabilities

### Command Line Interface

The primary interface for checking Svelte projects from the command line with extensive configuration options.

```bash { .api }
svelte-check [options]
```

**Available Options:**

- `--workspace <path>` - Path to workspace directory (default: current working directory)
- `--output <format>` - Output format: human, human-verbose, machine, machine-verbose (default: human-verbose)
- `--watch` - Watch mode for continuous checking
- `--preserveWatchOutput` - Don't clear screen in watch mode
- `--tsconfig <path>` - Path to tsconfig or jsconfig file
- `--no-tsconfig` - Only check Svelte files, ignore JS/TS files
- `--ignore <paths>` - Files/folders to ignore, relative to workspace root, comma-separated, inside quotes (only with --no-tsconfig)
- `--fail-on-warnings` - Exit with error code when warnings are found
- `--compiler-warnings <codes>` - Configure Svelte compiler warning levels
- `--diagnostic-sources <sources>` - Limit diagnostic sources: js,svelte,css
- `--threshold <level>` - Filter diagnostics: error, warning
- `--color` - Force enable color output
- `--no-color` - Force disable color output

**Usage Examples:**

```bash
# Basic check
svelte-check

# Check specific workspace with TypeScript config
svelte-check --workspace ./src --tsconfig ./tsconfig.json

# Machine-readable output for CI
svelte-check --output machine --fail-on-warnings

# Watch mode with custom ignore patterns
svelte-check --watch --ignore "dist,build" --no-tsconfig

# Configure compiler warnings
svelte-check --compiler-warnings "css-unused-selector:ignore,unused-export-let:error"

# Filter diagnostic sources
svelte-check --diagnostic-sources "js,svelte" --threshold error
```

### Programmatic Integration

For build tool integration and programmatic usage via child process execution.

```typescript { .api }
/**
 * Run svelte-check programmatically
 * @param args - Command line arguments array
 * @returns Promise resolving to execution result
 */
function runSvelteCheck(args: string[]): Promise<SvelteCheckResult>;

/**
 * Result of svelte-check execution
 */
interface SvelteCheckResult {
  /** Standard output from svelte-check */
  stdout: string;
  /** Standard error output */
  stderr: string;
  /** Exit code (0 for success, 1 for errors/warnings) */
  exitCode: number;
}

/**
 * Parse machine-readable output from svelte-check
 * @param output - Machine format output string
 * @returns Parsed diagnostic results
 */
function parseMachineOutput(output: string): ParsedDiagnostic[];

/**
 * Parsed diagnostic from machine output
 */
interface ParsedDiagnostic {
  /** Diagnostic type */
  type: 'ERROR' | 'WARNING';
  /** File path relative to workspace */
  filename: string;
  /** Line number (1-based) */
  line: number;
  /** Character position (1-based) */
  character: number;
  /** Diagnostic message */
  message: string;
  /** Diagnostic timestamp */
  timestamp: number;
}

/**
 * Individual diagnostic issue (from language server protocol)
 */
interface Diagnostic {
  /** Source location range */
  range: Range;
  /** Issue severity level */
  severity: DiagnosticSeverity;
  /** Human-readable error message */
  message: string;
  /** Error/warning code */
  code?: number | string;
  /** Diagnostic source (e.g., "svelte", "typescript") */
  source?: string;
  /** Additional diagnostic tags */
  tags?: DiagnosticTag[];
}

/**
 * Position range in source code
 */
interface Range {
  start: Position;
  end: Position;
}

/**
 * Line and character position
 */
interface Position {
  /** Zero-based line number */
  line: number;
  /** Zero-based character offset */
  character: number;
}

/**
 * Diagnostic tag for additional metadata
 */
interface DiagnosticTag {
  /** Tag type identifier */
  type: number;
}
```

### Output Writers

Customizable output formatting for different consumption needs.

```typescript { .api }
/**
 * Base interface for diagnostic output writers
 */
interface Writer {
  /** Initialize writer with workspace directory */
  start(workspaceDir: string): void;
  /** Write diagnostics for a single file */
  file(diagnostics: Diagnostic[], workspaceDir: string, filename: string, text: string): void;
  /** Write completion summary */
  completion(fileCount: number, errorCount: number, warningCount: number, fileCountWithProblems: number): void;
  /** Write failure message */
  failure(err: Error): void;
}

/**
 * Human-readable console output writer
 */
class HumanFriendlyWriter implements Writer {
  constructor(
    stream: Writable, 
    isVerbose?: boolean, 
    isWatchMode?: boolean, 
    clearScreen?: boolean, 
    diagnosticFilter?: DiagnosticFilter
  );
}

/**
 * Machine-readable structured output writer
 */
class MachineFriendlyWriter implements Writer {
  constructor(
    stream: Writable, 
    isVerbose?: boolean, 
    diagnosticFilter?: DiagnosticFilter
  );
}

/**
 * Function to filter which diagnostics to include in output
 */
type DiagnosticFilter = (diagnostic: Diagnostic) => boolean;

/** Default filter that includes all diagnostics */
const DEFAULT_FILTER: DiagnosticFilter;
```

### CLI Option Parsing

Internal option parsing functionality for command-line interface.

```typescript { .api }
/**
 * Parsed CLI options structure
 */
interface SvelteCheckCliOptions {
  /** Workspace URI object */
  workspaceUri: URI;
  /** Selected output format */
  outputFormat: OutputFormat;
  /** Watch mode enabled */
  watch: boolean;
  /** Preserve output in watch mode */
  preserveWatchOutput: boolean;
  /** TypeScript config file path */
  tsconfig?: string;
  /** File paths to ignore */
  filePathsToIgnore: string[];
  /** Fail on warnings flag */
  failOnWarnings: boolean;
  /** Compiler warning configuration */
  compilerWarnings: Record<string, 'error' | 'ignore'>;
  /** Enabled diagnostic sources */
  diagnosticSources: DiagnosticSource[];
  /** Diagnostic threshold level */
  threshold: Threshold;
}

```

## Types

```typescript { .api }
/** Supported output formats */
type OutputFormat = "human" | "human-verbose" | "machine" | "machine-verbose";

/** Available diagnostic sources */
type SvelteCheckDiagnosticSource = "js" | "css" | "svelte";

/** Diagnostic source type alias */
type DiagnosticSource = "js" | "css" | "svelte";

/** Diagnostic threshold levels */
type Threshold = "warning" | "error";

/** Diagnostic severity levels */
enum DiagnosticSeverity {
  Error = 1,
  Warning = 2,
  Information = 3,
  Hint = 4
}

/** URI class for file system paths */
class URI {
  static file(path: string): URI;
  readonly fsPath: string;
  toString(): string;
}
```

## Error Handling

Svelte Check reports various types of issues:

**JavaScript/TypeScript Errors:**
- Syntax errors
- Type checking errors
- Import resolution failures
- Missing type declarations

**Svelte Component Errors:**
- Component compilation errors
- Invalid Svelte syntax
- Unused export properties
- Accessibility warnings

**CSS Errors:**
- Unused CSS selectors
- CSS syntax errors
- SCSS/PostCSS compilation errors

**Configuration Errors:**
- Invalid TypeScript configuration
- Missing or invalid workspace paths
- File access permissions

## Machine Output Format

### Standard Format (`--output machine`)

Timestamp-prefixed space-separated format:

```
1590680325583 START "/path/to/workspace"
1590680326283 ERROR "component.svelte" 1:16 "Type error message"
1590680326778 WARNING "component.svelte" 0:37 "Warning message"
1590680326807 COMPLETED 20 FILES 21 ERRORS 1 WARNINGS 3 FILES_WITH_PROBLEMS
```

### Verbose Format (`--output machine-verbose`)

Timestamp-prefixed JSON format:

```
1590680326283 {"type":"ERROR","filename":"component.svelte","start":{"line":1,"character":16},"end":{"line":1,"character":23},"message":"Type error message","code":2307,"source":"js"}
1590680326778 {"type":"WARNING","filename":"component.svelte","start":{"line":0,"character":37},"end":{"line":0,"character":51},"message":"Warning message","code":"unused-export-let","source":"svelte"}
```

## Integration Examples

### CI/CD Pipeline

```bash
# Exit with error code on any issues
svelte-check --output machine --fail-on-warnings

# Check only errors for faster CI
svelte-check --threshold error --diagnostic-sources "js,svelte"
```

### Build Tool Integration

```typescript
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function runSvelteCheck(workspacePath: string) {
  try {
    const { stdout, stderr } = await execAsync(
      `svelte-check --workspace "${workspacePath}" --output machine --fail-on-warnings`
    );
    console.log('Svelte check passed');
    return { success: true, output: stdout };
  } catch (error: any) {
    console.error('Svelte check failed:', error.stdout || error.message);
    throw new Error('Svelte check failed with errors');
  }
}
```

### Watch Mode Integration

```typescript
// Watch mode via CLI in a separate process
const watcher = spawn('svelte-check', ['--watch', '--workspace', workspacePath]);

watcher.stdout.on('data', (data) => {
  console.log('Diagnostics updated:', data.toString());
});

watcher.on('close', (code) => {
  console.log('Watch mode ended with code:', code);
});
```