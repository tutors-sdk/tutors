# File Analysis and Language Support

Prettier provides comprehensive APIs for analyzing files, determining appropriate parsers, checking ignore status, and discovering supported languages and formatting options.

## File Analysis Functions

### getFileInfo
```javascript { .api }
async function getFileInfo(
  file: string | URL, 
  options?: FileInfoOptions
): Promise<FileInfoResult>
```

Get comprehensive information about a file including inferred parser, ignore status, and configuration resolution.

**Parameters:**
- `file` (string | URL): File path or URL to analyze
- `options` (FileInfoOptions, optional): Analysis options

**Returns:** Promise resolving to FileInfoResult with file analysis data

**Types:**
```javascript { .api }
interface FileInfoOptions {
  ignorePath?: string | URL | (string | URL)[]; // Custom ignore file paths
  withNodeModules?: boolean;                    // Include node_modules (default: false)
  plugins?: Array<string | URL | Plugin>;      // Plugins for parser inference
  resolveConfig?: boolean;                      // Resolve config for file (default: false)
}

interface FileInfoResult {
  ignored: boolean;              // Whether file should be ignored
  inferredParser: string | null; // Inferred parser name or null
}
```

**Example:**
```javascript { .api }
// Basic file analysis
const fileInfo = await prettier.getFileInfo('/project/src/component.tsx');
// Result: { ignored: false, inferredParser: 'typescript' }

// With ignore file and config resolution
const fileInfo = await prettier.getFileInfo('/project/src/utils.js', {
  ignorePath: '/project/.prettierignore',
  resolveConfig: true,
  withNodeModules: false
});

// Check multiple ignore files
const fileInfo = await prettier.getFileInfo('/project/src/file.js', {
  ignorePath: ['/project/.prettierignore', '/project/.gitignore']
});
```

### getSupportInfo
```javascript { .api }
async function getSupportInfo(options?: SupportInfoOptions): Promise<SupportInfo>
```

Get comprehensive information about supported languages, parsers, and formatting options.

**Parameters:**
- `options` (SupportInfoOptions, optional): Options for support information

**Returns:** Promise resolving to SupportInfo with languages and options data

**Types:**
```javascript { .api }
interface SupportInfoOptions {
  plugins?: Array<string | URL | Plugin>; // Include plugin-provided languages
  showDeprecated?: boolean;               // Include deprecated options (default: false)
}

interface SupportInfo {
  languages: SupportLanguage[]; // Supported languages
  options: SupportOption[];     // Available formatting options
}
```

**Example:**
```javascript { .api }
// Get all supported languages and options
const supportInfo = await prettier.getSupportInfo();
console.log(supportInfo.languages.length); // Number of supported languages
console.log(supportInfo.options.length);   // Number of formatting options

// Include deprecated options
const fullInfo = await prettier.getSupportInfo({ 
  showDeprecated: true 
});

// Include plugin-provided languages
const pluginInfo = await prettier.getSupportInfo({
  plugins: ['prettier-plugin-java', 'prettier-plugin-kotlin']
});
```

## Language Support Information

### SupportLanguage Interface
```javascript { .api }
interface SupportLanguage {
  name: string;                    // Language display name
  parsers: string[];              // Available parser names
  group?: string;                 // Language group
  tmScope?: string;               // TextMate scope
  aceMode?: string;               // Ace editor mode
  codemirrorMode?: string;        // CodeMirror mode
  codemirrorMimeType?: string;    // CodeMirror MIME type
  aliases?: string[];             // Language aliases
  extensions?: string[];          // File extensions
  filenames?: string[];           // Specific filenames
  linguistLanguageId?: number;    // GitHub Linguist ID
  vscodeLanguageIds?: string[];   // VS Code language IDs
  interpreters?: string[];        // Interpreter names
  isSupported?: (options: { filepath: string }) => boolean; // Custom support check
}
```

**Example Language Objects:**
```javascript { .api }
// JavaScript language support
{
  "name": "JavaScript",
  "parsers": ["babel", "acorn", "espree"],
  "group": "JavaScript",
  "tmScope": "source.js",
  "aceMode": "javascript",
  "codemirrorMode": "javascript",
  "codemirrorMimeType": "text/javascript",
  "extensions": [".js", ".jsx", ".mjs", ".cjs"],
  "filenames": [],
  "linguistLanguageId": 183,
  "vscodeLanguageIds": ["javascript", "javascriptreact"]
}

// TypeScript language support
{
  "name": "TypeScript",
  "parsers": ["typescript", "babel-ts"],
  "group": "JavaScript", 
  "extensions": [".ts", ".tsx", ".cts", ".mts"],
  "vscodeLanguageIds": ["typescript", "typescriptreact"]
}
```

### Built-in Language Support

**JavaScript Family:**
```javascript { .api }
const jsLanguages = supportInfo.languages.filter(lang => 
  lang.group === 'JavaScript' || lang.parsers.includes('babel')
);
// Includes: JavaScript, TypeScript, JSX, Flow
```

**CSS Family:**
```javascript { .api }
const cssLanguages = supportInfo.languages.filter(lang =>
  lang.parsers.some(p => ['css', 'scss', 'less'].includes(p))
);
// Includes: CSS, SCSS, Less
```

**Markup Languages:**
```javascript { .api }
const markupLanguages = supportInfo.languages.filter(lang =>
  ['HTML', 'Vue', 'Angular'].includes(lang.name)
);
// Includes: HTML, Vue, Angular templates, LWC
```

**Data Formats:**
```javascript { .api }
const dataLanguages = supportInfo.languages.filter(lang =>
  lang.parsers.some(p => ['json', 'json5', 'yaml'].includes(p))
);
// Includes: JSON, JSON5, JSONC, YAML
```

## Parser Inference

### Automatic Parser Detection
```javascript { .api }
// Parser inferred from file extension
const info1 = await prettier.getFileInfo('component.tsx');
// Result: { inferredParser: 'typescript' }

const info2 = await prettier.getFileInfo('styles.scss');
// Result: { inferredParser: 'scss' }

const info3 = await prettier.getFileInfo('data.json');
// Result: { inferredParser: 'json' }
```

### Custom Parser Mapping
```javascript { .api }
// Use plugins to extend parser inference
import javaPlugin from 'prettier-plugin-java';

const info = await prettier.getFileInfo('App.java', {
  plugins: [javaPlugin]
});
// Result: { inferredParser: 'java' } (if plugin provides java parser)
```

### Manual Parser Override
```javascript { .api }
// Override inferred parser
const formatted = await prettier.format(code, {
  parser: 'babel', // Force babel parser regardless of file extension
  filepath: 'file.unknown'
});
```

## Ignore File Processing

### Default Ignore Patterns
Prettier automatically respects these ignore files:
- `.prettierignore`
- `.gitignore` (when no .prettierignore exists)

### Custom Ignore Files
```javascript { .api }
// Single custom ignore file
const info = await prettier.getFileInfo('/project/src/file.js', {
  ignorePath: '/project/custom.ignore'
});

// Multiple ignore files (precedence order)
const info = await prettier.getFileInfo('/project/src/file.js', {
  ignorePath: [
    '/project/.prettierignore',
    '/project/.gitignore',
    '/project/custom.ignore'
  ]
});
```

### Ignore File Format
```gitignore
# .prettierignore - supports .gitignore syntax
node_modules/
dist/
build/
*.min.js
*.bundle.js
coverage/
.next/
.nuxt/

# Negative patterns (re-include)
!src/important.min.js

# Comments and blank lines are ignored
```

### Node Modules Handling
```javascript { .api }
// By default, files in node_modules are ignored
const info1 = await prettier.getFileInfo('node_modules/package/file.js');
// Result: { ignored: true, inferredParser: 'babel' }

// Include node_modules files
const info2 = await prettier.getFileInfo('node_modules/package/file.js', {
  withNodeModules: true
});
// Result: { ignored: false, inferredParser: 'babel' }
```

## Formatting Options Information

### SupportOption Interface
```javascript { .api }
interface SupportOption {
  name: string;           // Option name
  category: string;       // Option category
  type: string;          // Option type (int, string, boolean, choice, path)
  description?: string;   // Option description
  deprecated?: boolean | string; // Deprecation status
  default?: any;         // Default value
  range?: {              // For int type
    start: number;
    end: number; 
    step: number;
  };
  choices?: Array<{      // For choice type
    value: any;
    description: string;
  }>;
}
```

### Querying Available Options
```javascript { .api }
const supportInfo = await prettier.getSupportInfo();

// Find specific option
const semiOption = supportInfo.options.find(opt => opt.name === 'semi');
console.log(semiOption);
// Result: { name: 'semi', type: 'boolean', default: true, ... }

// Get options by category
const formatOptions = supportInfo.options.filter(opt => 
  opt.category === 'Format'
);

// Get choice options
const choiceOptions = supportInfo.options.filter(opt => 
  opt.type === 'choice'
);
```

## Usage Patterns

### File Type Detection
```javascript { .api }
async function detectFileType(filepath) {
  const fileInfo = await prettier.getFileInfo(filepath);
  
  if (fileInfo.ignored) {
    return 'ignored';
  }
  
  if (!fileInfo.inferredParser) {
    return 'unsupported';
  }
  
  const supportInfo = await prettier.getSupportInfo();
  const language = supportInfo.languages.find(lang =>
    lang.parsers.includes(fileInfo.inferredParser)
  );
  
  return language ? language.name : 'unknown';
}
```

### Bulk File Analysis
```javascript { .api }
async function analyzeProjectFiles(pattern) {
  const files = await glob(pattern);
  const results = [];
  
  for (const file of files) {
    const info = await prettier.getFileInfo(file, {
      resolveConfig: true
    });
    
    results.push({
      file,
      ignored: info.ignored,
      parser: info.inferredParser,
      supported: info.inferredParser !== null
    });
  }
  
  return results;
}
```

### Plugin Integration
```javascript { .api }
async function getSupportedExtensions(plugins = []) {
  const supportInfo = await prettier.getSupportInfo({ plugins });
  
  const extensions = new Set();
  supportInfo.languages.forEach(lang => {
    if (lang.extensions) {
      lang.extensions.forEach(ext => extensions.add(ext));
    }
  });
  
  return Array.from(extensions).sort();
}

// Usage
const extensions = await getSupportedExtensions([
  'prettier-plugin-java',
  'prettier-plugin-kotlin'
]);
console.log(extensions); // ['.java', '.kt', '.js', '.ts', ...]
```

### Configuration Validation
```javascript { .api }
async function validateConfig(config) {
  const supportInfo = await prettier.getSupportInfo({ showDeprecated: true });
  const errors = [];
  
  for (const [key, value] of Object.entries(config)) {
    const option = supportInfo.options.find(opt => opt.name === key);
    
    if (!option) {
      errors.push(`Unknown option: ${key}`);
      continue;
    }
    
    if (option.deprecated) {
      errors.push(`Deprecated option: ${key}`);
    }
    
    // Validate option value based on type
    if (option.type === 'choice' && option.choices) {
      const validValues = option.choices.map(c => c.value);
      if (!validValues.includes(value)) {
        errors.push(`Invalid value for ${key}: ${value}`);
      }
    }
  }
  
  return errors;
}
```