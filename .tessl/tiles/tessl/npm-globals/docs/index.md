# Globals

Global identifiers from different JavaScript environments. This package provides a comprehensive collection of global variables and their read/write permissions for 47 JavaScript execution environments, serving as the data foundation for static analysis tools like ESLint.

## Package Information

- **Package Name**: globals
- **Package Type**: npm
- **Language**: JavaScript
- **Installation**: `npm install globals`

## Core Imports

```javascript
const globals = require('globals');
```

For ES modules:

```javascript
import globals from 'globals';
```

## Basic Usage

```javascript
import globals from 'globals';

// Access browser globals
const browserGlobals = globals.browser;
console.log(browserGlobals.window); // false (read-only)
console.log(browserGlobals.document); // false (read-only)
console.log(browserGlobals.onload); // true (writable event handler)

// Access Node.js globals
const nodeGlobals = globals.node;
console.log(nodeGlobals.process); // false (read-only)
console.log(nodeGlobals.Buffer); // false (read-only)
console.log(nodeGlobals.exports); // true (writable in CommonJS)

// Combine environments for ESLint
const eslintGlobals = {
  ...globals.browser,
  ...globals.es2022,
  ...globals.jest
};
```

## Architecture

The globals package is structured as a single JSON data file containing:

- **Environment Categories**: 47 distinct JavaScript execution environments
- **Global Variable Mappings**: Each environment maps global names to boolean values
- **Read-Only vs Writable Classification**: `false` indicates read-only, `true` indicates writable
- **Type Safety**: Complete TypeScript definitions for all environments
- **Tool Integration**: Designed specifically for static analysis and linting tools

## Capabilities

### Environment Access

Access global variable definitions for any supported JavaScript environment.

```javascript { .api }
/**
 * Main globals export - object containing all environment definitions
 */
declare const globals: {
  readonly [environment: string]: {
    readonly [globalName: string]: boolean;
  };
};

/**
 * Available environments include:
 * - Web: browser, worker, serviceworker, webextensions
 * - Node.js: node, nodeBuiltin, commonjs, shared-node-browser  
 * - ECMAScript: builtin, es3, es5, es2015-es2026
 * - Testing: jest, mocha, jasmine, qunit, vitest, chai
 * - Libraries: jquery, meteor, prototypejs, shelljs
 * - Specialized: amd, applescript, couch, devtools, greasemonkey, mongo, etc.
 */
```

### Browser Environment Globals

Browser global variables for web development (1000+ globals).

```javascript { .api }
interface BrowserGlobals {
  // DOM Core
  readonly 'window': false;
  readonly 'document': false;
  readonly 'globalThis': false;
  
  // DOM Elements
  readonly 'HTMLElement': false;
  readonly 'Element': false;
  readonly 'Node': false;
  
  // Web APIs
  readonly 'fetch': false;
  readonly 'XMLHttpRequest': false;
  readonly 'WebSocket': false;
  readonly 'localStorage': false;
  readonly 'sessionStorage': false;
  
  // Browser Objects
  readonly 'navigator': false;
  readonly 'location': true; // writable
  readonly 'history': false;
  readonly 'screen': false;
  
  // Timing APIs
  readonly 'setTimeout': false;
  readonly 'setInterval': false;
  readonly 'requestAnimationFrame': false;
  
  // Event Handlers (writable)
  readonly 'onload': true;
  readonly 'onclick': true;
  readonly 'onerror': true;
  readonly 'onunload': true;
  
  // Modern APIs
  readonly 'IntersectionObserver': false;
  readonly 'MutationObserver': false;
  readonly 'PerformanceObserver': false;
  readonly 'ResizeObserver': false;
  
  // And 1000+ more browser globals...
}
```

### Node.js Environment Globals

Node.js global variables and CommonJS scope.

```javascript { .api }
interface NodeGlobals {
  // Node.js Built-ins
  readonly 'process': false;
  readonly 'Buffer': false;
  readonly 'global': false;
  readonly 'console': false;
  
  // CommonJS Module System
  readonly 'require': false;
  readonly 'module': false;
  readonly 'exports': true; // writable
  readonly '__dirname': false;
  readonly '__filename': false;
  
  // Node.js Timers
  readonly 'setTimeout': false;
  readonly 'setInterval': false;
  readonly 'setImmediate': false;
  readonly 'clearTimeout': false;
  readonly 'clearInterval': false;
  readonly 'clearImmediate': false;
  
  // Modern Node.js APIs
  readonly 'fetch': false;
  readonly 'AbortController': false;
  readonly 'URL': false;
  readonly 'URLSearchParams': false;
  readonly 'TextEncoder': false;
  readonly 'TextDecoder': false;
  readonly 'WebAssembly': false;
  
  // And more Node.js globals...
}

interface NodeBuiltinGlobals {
  // Node.js globals excluding CommonJS scope
  // (Same as NodeGlobals but without require, module, exports, __dirname, __filename)
}
```

### ECMAScript Standard Globals

Built-in JavaScript globals for different ECMAScript versions.

```javascript { .api }
interface BuiltinGlobals {
  // Core JavaScript
  readonly 'Object': false;
  readonly 'Array': false;
  readonly 'Function': false;
  readonly 'String': false;
  readonly 'Number': false;
  readonly 'Boolean': false;
  readonly 'Date': false;
  readonly 'RegExp': false;
  readonly 'Math': false;
  readonly 'JSON': false;
  
  // Error Types
  readonly 'Error': false;
  readonly 'TypeError': false;
  readonly 'ReferenceError': false;
  readonly 'SyntaxError': false;
  readonly 'RangeError': false;
  readonly 'URIError': false;
  readonly 'EvalError': false;
  
  // Global Functions
  readonly 'parseInt': false;
  readonly 'parseFloat': false;
  readonly 'isNaN': false;
  readonly 'isFinite': false;
  readonly 'encodeURI': false;
  readonly 'decodeURI': false;
  readonly 'encodeURIComponent': false;
  readonly 'decodeURIComponent': false;
  
  // ES2015+ Features
  readonly 'Map': false;
  readonly 'Set': false;
  readonly 'WeakMap': false;
  readonly 'WeakSet': false;
  readonly 'Symbol': false;
  readonly 'Promise': false;
  readonly 'Proxy': false;
  readonly 'Reflect': false;
  readonly 'BigInt': false; // ES2020+
  readonly 'globalThis': false; // ES2020+
  
  // And more ECMAScript globals...
}
```

### Testing Framework Globals

Global variables provided by popular testing frameworks.

```javascript { .api }
interface JestGlobals {
  readonly 'describe': false;
  readonly 'it': false;
  readonly 'test': false;
  readonly 'expect': false;
  readonly 'beforeAll': false;
  readonly 'beforeEach': false;
  readonly 'afterAll': false;
  readonly 'afterEach': false;
  readonly 'jest': false;
  readonly 'fit': false;
  readonly 'xit': false;
  readonly 'xdescribe': false;
  readonly 'xtest': false;
}

interface MochaGlobals {
  readonly 'describe': false;
  readonly 'context': false;
  readonly 'it': false;
  readonly 'specify': false;
  readonly 'before': false;
  readonly 'beforeEach': false;
  readonly 'after': false;
  readonly 'afterEach': false;
  readonly 'suite': false;
  readonly 'test': false;
  readonly 'suiteSetup': false;
  readonly 'suiteTeardown': false;
  readonly 'setup': false;
  readonly 'teardown': false;
  readonly 'mocha': false;
  readonly 'run': false;
}

interface VitestGlobals {
  readonly 'describe': false;
  readonly 'it': false;
  readonly 'test': false;
  readonly 'suite': false;
  readonly 'expect': false;
  readonly 'assert': false;
  readonly 'chai': false;
  readonly 'vi': false;
  readonly 'vitest': false;
  readonly 'beforeAll': false;
  readonly 'beforeEach': false;
  readonly 'afterAll': false;
  readonly 'afterEach': false;
  readonly 'assertType': false;
  readonly 'expectTypeOf': false;
  readonly 'onTestFailed': false;
  readonly 'onTestFinished': false;
}
```

### Library and Framework Globals

Global variables from popular JavaScript libraries and frameworks.

```javascript { .api }
interface JQueryGlobals {
  readonly '$': false;
  readonly 'jQuery': false;
}

interface MeteorGlobals {
  readonly 'Meteor': false;
  readonly 'Mongo': false;
  readonly 'Session': false;
  readonly 'Template': false;
  readonly 'Blaze': false;
  readonly 'Tracker': false;
  readonly 'Deps': false;
  readonly 'EJSON': false;
  readonly 'Match': false;
  readonly 'check': false;
  readonly 'Random': false;
  readonly 'ReactiveVar': false;
  readonly 'ReactiveDict': false;
  // And more Meteor globals...
}

interface ShellJSGlobals {
  readonly 'cd': false;
  readonly 'ls': false;
  readonly 'pwd': false;
  readonly 'mkdir': false;
  readonly 'rm': false;
  readonly 'cp': false;
  readonly 'mv': false;
  readonly 'cat': false;
  readonly 'head': false;
  readonly 'tail': false;
  readonly 'grep': false;
  readonly 'find': false;
  readonly 'which': false;
  readonly 'echo': false;
  readonly 'exit': false;
  readonly 'exec': false;
  // And more ShellJS command globals...
}
```

### Environment-Specific Features

Special globals for particular JavaScript execution environments.

```javascript { .api }
interface WorkerGlobals {
  readonly 'self': false;
  readonly 'importScripts': false;
  readonly 'postMessage': false;
  readonly 'close': false;
  readonly 'WorkerGlobalScope': false;
  readonly 'DedicatedWorkerGlobalScope': false;
  readonly 'onmessage': true; // writable event handler
  readonly 'onerror': true; // writable event handler
  // Plus all shared web APIs available in workers...
}

interface ServiceWorkerGlobals {
  readonly 'self': false;
  readonly 'caches': false;
  readonly 'clients': false;
  readonly 'registration': false;
  readonly 'skipWaiting': false;
  readonly 'importScripts': false;
  readonly 'ServiceWorkerGlobalScope': false;
  readonly 'ExtendableEvent': false;
  readonly 'FetchEvent': false;
  readonly 'InstallEvent': false;
  readonly 'NotificationEvent': false;
  readonly 'PushEvent': false;
  readonly 'SyncEvent': false;
  // Plus service worker event handlers...
}

interface WebExtensionGlobals {
  readonly 'browser': false; // WebExtensions API
  readonly 'chrome': false;  // Chrome Extension API
  readonly 'opr': false;     // Opera Extension API
}

interface GreasemonkeyGlobals {
  readonly 'GM': false;
  readonly 'GM_info': false;
  readonly 'GM_getValue': false;
  readonly 'GM_setValue': false;
  readonly 'GM_deleteValue': false;
  readonly 'GM_listValues': false;
  readonly 'GM_xmlhttpRequest': false;
  readonly 'GM_openInTab': false;
  readonly 'GM_notification': false;
  readonly 'unsafeWindow': false;
  // And more Greasemonkey/Tampermonkey APIs...
}
```

## Types

```javascript { .api }
/**
 * Main globals object containing all environment definitions
 */
type Globals = {
  // Web Environments
  readonly 'browser': BrowserGlobals;
  readonly 'worker': WorkerGlobals;
  readonly 'serviceworker': ServiceWorkerGlobals;
  readonly 'webextensions': WebExtensionGlobals;
  readonly 'shared-node-browser': SharedNodeBrowserGlobals;

  // Node.js Environments
  readonly 'node': NodeGlobals;
  readonly 'nodeBuiltin': NodeBuiltinGlobals;
  readonly 'commonjs': CommonJSGlobals;

  // ECMAScript Versions
  readonly 'builtin': BuiltinGlobals;
  readonly 'es3': ES3Globals;
  readonly 'es5': ES5Globals;
  readonly 'es2015': ES2015Globals;
  readonly 'es2016': ES2016Globals;
  readonly 'es2017': ES2017Globals;
  readonly 'es2018': ES2018Globals;
  readonly 'es2019': ES2019Globals;
  readonly 'es2020': ES2020Globals;
  readonly 'es2021': ES2021Globals;
  readonly 'es2022': ES2022Globals;
  readonly 'es2023': ES2023Globals;
  readonly 'es2024': ES2024Globals;
  readonly 'es2025': ES2025Globals;
  readonly 'es2026': ES2026Globals;

  // Testing Frameworks
  readonly 'jest': JestGlobals;
  readonly 'mocha': MochaGlobals;
  readonly 'jasmine': JasmineGlobals;
  readonly 'qunit': QUnitGlobals;
  readonly 'vitest': VitestGlobals;
  readonly 'chai': ChaiGlobals;
  readonly 'atomtest': AtomTestGlobals;
  readonly 'embertest': EmberTestGlobals;
  readonly 'protractor': ProtractorGlobals;

  // Libraries and Frameworks
  readonly 'jquery': JQueryGlobals;
  readonly 'meteor': MeteorGlobals;
  readonly 'prototypejs': PrototypeJSGlobals;
  readonly 'yui': YUIGlobals;
  readonly 'shelljs': ShellJSGlobals;

  // Module Systems
  readonly 'amd': AMDGlobals;

  // Specialized Environments
  readonly 'applescript': AppleScriptGlobals;
  readonly 'couch': CouchDBGlobals;
  readonly 'devtools': DevToolsGlobals;
  readonly 'greasemonkey': GreasemonkeyGlobals;
  readonly 'mongo': MongoDBGlobals;
  readonly 'nashorn': NashornGlobals;
  readonly 'phantomjs': PhantomJSGlobals;
  readonly 'rhino': RhinoGlobals;
  readonly 'wsh': WindowsScriptHostGlobals;
};

/**
 * Individual environment type - maps global names to read/write permissions
 */
type EnvironmentGlobals = {
  readonly [globalName: string]: boolean;
};

/**
 * Global variable permissions
 * - false: Read-only global (cannot be reassigned)
 * - true: Writable global (can be reassigned)
 */
type GlobalPermission = boolean;
```

## Common Integration Patterns

**ESLint Configuration:**

```javascript
const globals = require('globals');

module.exports = {
  env: {
    browser: true,
    node: true,
    es2022: true,
    jest: true
  },
  globals: {
    ...globals.browser,
    ...globals.node,
    ...globals.es2022,
    ...globals.jest,
    // Custom globals
    myCustomGlobal: 'readonly',
    myWritableGlobal: 'writable'
  }
};
```

**Combining Multiple Environments:**

```javascript
const globals = require('globals');

// For a React app with testing
const reactAppGlobals = {
  ...globals.browser,
  ...globals.es2022, 
  ...globals.jest
};

// For a Node.js CLI tool
const nodeToolGlobals = {
  ...globals.node,
  ...globals.es2022
};

// For a universal/isomorphic app
const universalAppGlobals = {
  ...globals.shared-node-browser,
  ...globals.es2022
};
```

**Custom Environment Detection:**

```javascript
const globals = require('globals');

function getGlobalsForEnvironment(env) {
  const baseGlobals = { ...globals.builtin };
  
  switch (env) {
    case 'browser':
      return { ...baseGlobals, ...globals.browser };
    case 'node':
      return { ...baseGlobals, ...globals.node };
    case 'worker':
      return { ...baseGlobals, ...globals.worker };
    default:
      return baseGlobals;
  }
}
```