# Configuration Resolution

Prettier's configuration system allows you to discover and resolve configuration files with support for various formats, EditorConfig integration, and intelligent caching.

## Configuration Functions

### resolveConfig
```javascript { .api }
async function resolveConfig(
  fileUrlOrPath: string | URL, 
  options?: ResolveConfigOptions
): Promise<Options | null>
```

Resolve Prettier configuration for a given file path. Searches up the directory tree for configuration files and merges them with defaults.

**Parameters:**
- `fileUrlOrPath` (string | URL): File path or URL to resolve configuration for
- `options` (ResolveConfigOptions, optional): Resolution options

**Returns:** Promise resolving to merged Options object or null if no config found

**Types:**
```javascript { .api }
interface ResolveConfigOptions {
  useCache?: boolean;         // Use cached results (default: true)
  config?: string | URL;      // Direct path to config file
  editorconfig?: boolean;     // Parse .editorconfig files (default: false)
}
```

**Example:**
```javascript { .api }
// Basic configuration resolution
const config = await prettier.resolveConfig('/project/src/file.js');
// Result: { semi: true, singleQuote: false, ... } or null

// With EditorConfig support
const config = await prettier.resolveConfig('/project/src/file.js', {
  editorconfig: true,
  useCache: false
});

// With explicit config file
const config = await prettier.resolveConfig('/project/src/file.js', {
  config: '/project/.prettierrc.json'
});
```

### resolveConfigFile
```javascript { .api }
async function resolveConfigFile(fileUrlOrPath?: string | URL): Promise<string | null>
```

Find the path to the Prettier configuration file that would be used for a given file path.

**Parameters:**
- `fileUrlOrPath` (string | URL, optional): Starting point for search (default: current working directory)

**Returns:** Promise resolving to config file path or null if not found

**Example:**
```javascript { .api }
// Find config file for specific path
const configPath = await prettier.resolveConfigFile('/project/src/file.js');
// Result: '/project/.prettierrc.json' or null

// Find config file from current directory
const configPath = await prettier.resolveConfigFile();
// Result: '/current/dir/.prettierrc' or null
```

### clearConfigCache
```javascript { .api }
async function clearConfigCache(): Promise<void>
```

Clear the configuration file system cache. Useful for editor integrations and long-running processes that need to detect config changes.

**Example:**
```javascript { .api }
// Clear cache when config files change
await prettier.clearConfigCache();

// Subsequent resolveConfig calls will re-read files
const freshConfig = await prettier.resolveConfig('/project/src/file.js');
```

## Configuration File Formats

Prettier supports multiple configuration file formats, searched in this order:

### Package.json
```json { .api }
{
  "prettier": {
    "semi": false,
    "singleQuote": true,
    "trailingComma": "all"
  }
}
```

### .prettierrc (JSON/YAML)
```json { .api }
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "overrides": [
    {
      "files": "*.md",
      "options": {
        "proseWrap": "always"
      }
    }
  ]
}
```

### .prettierrc.json
```json { .api }
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": false,
  "quoteProps": "as-needed",
  "trailingComma": "all",
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "always"
}
```

### .prettierrc.js/.prettierrc.cjs
```javascript { .api }
module.exports = {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  overrides: [
    {
      files: '*.ts',
      options: {
        parser: 'typescript'
      }
    }
  ]
};
```

### prettier.config.js/prettier.config.cjs
```javascript { .api }
module.exports = {
  plugins: ['prettier-plugin-organize-imports'],
  semi: false,
  singleQuote: true
};
```

### .prettierrc.mjs/prettier.config.mjs (ESM)
```javascript { .api }
export default {
  semi: false,
  singleQuote: true,
  trailingComma: 'all'
};
```

### .prettierrc.ts/prettier.config.ts (TypeScript)
```typescript { .api }
import type { Config } from 'prettier';

const config: Config = {
  semi: false,
  singleQuote: true,
  trailingComma: 'all'
};

export default config;
```

## Configuration Overrides

Use overrides to apply different formatting rules to specific files:

```javascript { .api }
// Configuration with overrides
const config = {
  semi: true,
  singleQuote: false,
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 120,
        tabWidth: 4
      }
    },
    {
      files: ['*.md', '*.mdx'],
      options: {
        proseWrap: 'always',
        printWidth: 70
      }
    },
    {
      files: 'legacy/**/*.js',
      excludeFiles: 'legacy/vendor/**',
      options: {
        semi: false,
        trailingComma: 'none'
      }
    }
  ]
};
```

**Override Types:**
```javascript { .api }
interface Config extends Options {
  overrides?: Array<{
    files: string | string[];      // Glob patterns to match
    excludeFiles?: string | string[]; // Glob patterns to exclude  
    options?: Options;             // Options to apply
  }>;
}
```

## EditorConfig Integration

When `editorconfig: true` is specified, Prettier parses `.editorconfig` files and converts supported properties:

```ini
# .editorconfig
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
max_line_length = 80
```

**Supported EditorConfig Properties:**
- `indent_style` → `useTabs` 
- `indent_size`/`tab_width` → `tabWidth`
- `max_line_length` → `printWidth`
- `end_of_line` → `endOfLine`

**Example:**
```javascript { .api }
const config = await prettier.resolveConfig('/project/src/file.js', {
  editorconfig: true
});
// Result merges .prettierrc with .editorconfig properties
```

## Configuration Resolution Order

Configuration is resolved in this precedence order (highest to lowest):

1. Explicit `options` parameter passed to formatting functions
2. Configuration file options (`.prettierrc`, etc.)
3. EditorConfig properties (if enabled)
4. Prettier defaults

```javascript { .api }
// Explicit options override config files
const formatted = await prettier.format(code, {
  // This config resolution is automatic
  filepath: '/project/src/file.js',
  
  // These explicit options override resolved config
  semi: false,
  singleQuote: true
});
```

## Caching Behavior

Configuration results are cached by file path for performance:

```javascript { .api }
// First call reads from disk
const config1 = await prettier.resolveConfig('/project/src/file.js');

// Second call uses cache
const config2 = await prettier.resolveConfig('/project/src/file.js');

// Clear cache to force re-read
await prettier.clearConfigCache();

// Next call reads from disk again
const config3 = await prettier.resolveConfig('/project/src/file.js');
```

## Ignore Files

Prettier respects `.prettierignore` files to exclude files from formatting:

```gitignore
# .prettierignore
node_modules/
dist/
*.min.js
legacy/
coverage/
```

The ignore patterns affect `getFileInfo()` results but don't directly impact configuration resolution.

## Usage Patterns

### Editor Integration
```javascript { .api }
async function formatFileForEditor(filePath, content) {
  // Get file info including ignore status
  const fileInfo = await prettier.getFileInfo(filePath, {
    resolveConfig: true
  });
  
  if (fileInfo.ignored || !fileInfo.inferredParser) {
    return content; // Don't format
  }
  
  // Resolve config for file
  const config = await prettier.resolveConfig(filePath);
  
  // Format with cursor tracking
  return prettier.formatWithCursor(content, {
    ...config,
    filepath: filePath,
    cursorOffset: cursor.offset
  });
}
```

### Build Tool Integration
```javascript { .api }
async function formatProjectFiles(pattern) {
  const files = await glob(pattern);
  
  for (const file of files) {
    const config = await prettier.resolveConfig(file);
    if (!config) continue; // No config found, skip
    
    const content = await fs.readFile(file, 'utf8');
    const needsFormatting = !(await prettier.check(content, {
      ...config,
      filepath: file
    }));
    
    if (needsFormatting) {
      const formatted = await prettier.format(content, {
        ...config,
        filepath: file
      });
      await fs.writeFile(file, formatted);
    }
  }
}
```