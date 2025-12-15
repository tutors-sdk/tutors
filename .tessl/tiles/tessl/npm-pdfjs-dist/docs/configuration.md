# Configuration API

Global configuration options and web worker management for optimal performance and browser compatibility. Controls PDF.js runtime behavior and resource loading.

## Capabilities

### Global Worker Options

Configuration for PDF.js web worker, which handles PDF parsing and processing in a separate thread for better performance.

```javascript { .api }
const GlobalWorkerOptions: {
  /** Path to PDF.js worker script */
  workerSrc: string;
  /** Custom worker port for advanced scenarios */
  workerPort?: MessagePort;
};
```

**Usage Examples:**

```javascript
import { GlobalWorkerOptions } from "pdfjs-dist";

// Set worker source (required before loading documents)
GlobalWorkerOptions.workerSrc = "/node_modules/pdfjs-dist/build/pdf.worker.mjs";

// For webpack or bundler environments
GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.149/pdf.worker.mjs";

// For local development
GlobalWorkerOptions.workerSrc = "./pdf.worker.mjs";
```

### PDF Worker

Custom worker management for advanced use cases and multi-document scenarios.

```javascript { .api }
class PDFWorker {
  /** Worker name identifier */
  name: string;
  /** Whether worker is destroyed */
  destroyed: boolean;
  /** Worker message port */
  port: MessagePort;
  /** Worker message handler */
  messageHandler: MessageHandler;
  
  /**
   * Constructor for custom PDF worker
   * @param params - Worker parameters
   */
  constructor(params?: PDFWorkerParameters);
  
  /**
   * Destroy the worker and clean up resources
   */
  destroy(): void;
  
  /**
   * Create worker from existing port
   * @param params - Port parameters
   * @returns PDF worker instance
   */
  static fromPort(params: FromPortParameters): PDFWorker;
  
  /**
   * Get the configured worker source URL
   * @returns Worker source URL
   */
  static getWorkerSrc(): string;
}

interface PDFWorkerParameters {
  /** Worker name */
  name?: string;
  /** Custom worker port */
  port?: MessagePort;
  /** Verbosity level */
  verbosity?: number;
}

interface FromPortParameters {
  /** Worker name */
  name?: string;
  /** Message port */
  port: MessagePort;
  /** Verbosity level */
  verbosity?: number;
}
```

**Usage Examples:**

```javascript
import { PDFWorker } from "pdfjs-dist";

// Create custom worker for multiple documents
const worker = new PDFWorker({ name: "myWorker" });

// Use worker in document loading
const loadingTask = getDocument({
  url: "document1.pdf",
  worker: worker
});

const pdf1 = await loadingTask.promise;

// Reuse same worker for another document
const loadingTask2 = getDocument({
  url: "document2.pdf",
  worker: worker
});

const pdf2 = await loadingTask2.promise;

// Clean up when done
worker.destroy();
```

### Feature Detection

Runtime feature detection for browser capabilities and PDF.js optimizations.

```javascript { .api }
const FeatureTest: {
  /** Platform information */
  platform: {
    isLittleEndian: boolean;
    isEvalSupported: boolean;
    isOffscreenCanvasSupported: boolean;
    canvasMaxAreaInBytes: number;
  };
  
  /** Check for specific feature support */
  checkFeature(feature: string): boolean;
};
```

### Verbosity Levels

Logging and debugging configuration.

```javascript { .api }
enum VerbosityLevel {
  ERRORS = 0,
  WARNINGS = 1,
  INFOS = 5
}

/**
 * Set global verbosity level for debugging
 * @param level - Verbosity level
 */
function setVerbosityLevel(level: number): void;

/**
 * Get current verbosity level
 * @returns Current verbosity level
 */
function getVerbosityLevel(): number;
```

**Usage Examples:**

```javascript
import { setVerbosityLevel, VerbosityLevel } from "pdfjs-dist";

// Enable detailed logging for debugging
setVerbosityLevel(VerbosityLevel.INFOS);

// Show only warnings and errors
setVerbosityLevel(VerbosityLevel.WARNINGS);

// Show only errors (production)
setVerbosityLevel(VerbosityLevel.ERRORS);
```

### Canvas Factory Configuration

Canvas creation and management for different environments.

```javascript { .api }
interface CanvasFactory {
  /**
   * Create new canvas element
   * @param width - Canvas width
   * @param height - Canvas height
   * @returns Canvas and context
   */
  create(width: number, height: number): {
    canvas: HTMLCanvasElement | OffscreenCanvas;
    context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  };
  
  /**
   * Reset canvas dimensions
   * @param canvasAndContext - Canvas and context object
   * @param width - New width
   * @param height - New height
   */
  reset(canvasAndContext: any, width: number, height: number): void;
  
  /**
   * Destroy canvas
   * @param canvasAndContext - Canvas and context to destroy
   */
  destroy(canvasAndContext: any): void;
}

class DOMCanvasFactory implements CanvasFactory {
  constructor(options?: { ownerDocument?: Document });
  create(width: number, height: number): any;
  reset(canvasAndContext: any, width: number, height: number): void;
  destroy(canvasAndContext: any): void;
}
```

### CMap Reader Factory

Character mapping configuration for complex text rendering.

```javascript { .api }
interface CMapReaderFactory {
  /**
   * Fetch character mapping data
   * @param params - Fetch parameters
   * @returns Promise resolving to CMap data
   */
  fetch(params: { 
    name: string; 
    url: string; 
    packed: boolean; 
  }): Promise<{
    cMapData: Uint8Array;
    compressionType: number;
  }>;
}

class DOMCMapReaderFactory implements CMapReaderFactory {
  constructor(options?: { 
    baseUrl?: string; 
    isCompressed?: boolean;
  });
  fetch(params: any): Promise<any>;
}
```

### Standard Font Data Factory

Font data loading configuration for PDF standard fonts.

```javascript { .api }
interface StandardFontDataFactory {
  /**
   * Fetch standard font data
   * @param params - Font parameters
   * @returns Promise resolving to font data
   */
  fetch(params: { filename: string }): Promise<Uint8Array>;
}

class DOMStandardFontDataFactory implements StandardFontDataFactory {
  constructor(options?: { baseUrl?: string });
  fetch(params: any): Promise<Uint8Array>;
}
```

### Environment Detection

Runtime environment detection and configuration.

```javascript { .api }
/**
 * Check if running in Node.js environment
 * @returns Whether in Node.js
 */
function isNodeJS(): boolean;

/**
 * Check if data URL scheme is supported
 * @param url - URL to check
 * @returns Whether data scheme is supported
 */
function isDataScheme(url: string): boolean;

/**
 * Create valid absolute URL
 * @param url - URL to validate
 * @param baseUrl - Base URL for relative URLs
 * @returns Valid absolute URL or null
 */
function createValidAbsoluteUrl(url: string, baseUrl?: string): string | null;
```

### Advanced Configuration

Advanced configuration options for specialized use cases.

```javascript { .api }
interface AdvancedPDFConfiguration {
  /** Disable web fonts (@font-face) */
  disableFontFace?: boolean;
  /** Include extra font properties */
  fontExtraProperties?: boolean;
  /** Enable XFA form support */
  enableXfa?: boolean;
  /** Disable byte range requests */
  disableRange?: boolean;
  /** Disable streaming */
  disableStream?: boolean;
  /** Disable automatic data fetching */
  disableAutoFetch?: boolean;
  /** Maximum canvas area in bytes */
  canvasMaxAreaInBytes?: number;
  /** Use system fonts when available */
  useSystemFonts?: boolean;
  /** Enable WebGL acceleration */
  enableWebGL?: boolean;
}
```

**Usage Examples:**

```javascript
// Complete PDF.js configuration setup
class PDFConfiguration {
  static setup(options = {}) {
    // Set required worker source
    GlobalWorkerOptions.workerSrc = options.workerSrc || 
      "/node_modules/pdfjs-dist/build/pdf.worker.mjs";
    
    // Configure verbosity for debugging
    if (options.debug) {
      setVerbosityLevel(VerbosityLevel.INFOS);
    } else {
      setVerbosityLevel(VerbosityLevel.ERRORS);
    }
    
    // Feature detection
    console.log("PDF.js Configuration:");
    console.log("- Little Endian:", FeatureTest.platform.isLittleEndian);
    console.log("- Eval Supported:", FeatureTest.platform.isEvalSupported);
    console.log("- OffscreenCanvas:", FeatureTest.platform.isOffscreenCanvasSupported);
    console.log("- Max Canvas Area:", FeatureTest.platform.canvasMaxAreaInBytes);
    
    return {
      // Standard configuration
      cMapUrl: options.cMapUrl || "/node_modules/pdfjs-dist/cmaps/",
      cMapPacked: options.cMapPacked !== false,
      standardFontDataUrl: options.standardFontDataUrl || 
        "/node_modules/pdfjs-dist/standard_fonts/",
      
      // Factory configuration
      canvasFactory: new DOMCanvasFactory(),
      cMapReaderFactory: new DOMCMapReaderFactory({
        baseUrl: options.cMapUrl,
        isCompressed: options.cMapPacked
      }),
      standardFontDataFactory: new DOMStandardFontDataFactory({
        baseUrl: options.standardFontDataUrl
      }),
      
      // Advanced options
      disableFontFace: options.disableFontFace || false,
      fontExtraProperties: options.fontExtraProperties || false,
      enableXfa: options.enableXfa || false,
      useSystemFonts: options.useSystemFonts || false,
      enableWebGL: options.enableWebGL || false
    };
  }
  
  static createWorker(name = "pdf-worker") {
    return new PDFWorker({ name });
  }
  
  static async loadDocument(src, options = {}) {
    const config = this.setup(options);
    
    const loadingTask = getDocument({
      ...config,
      ...((typeof src === 'string') ? { url: src } : { data: src }),
      ...options
    });
    
    return await loadingTask.promise;
  }
}

// Usage
const config = {
  workerSrc: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.149/pdf.worker.mjs",
  cMapUrl: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.149/cmaps/",
  standardFontDataUrl: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.149/standard_fonts/",
  debug: process.env.NODE_ENV === 'development',
  enableXfa: true,
  useSystemFonts: true
};

// Load document with configuration
const pdf = await PDFConfiguration.loadDocument("document.pdf", config);
```

### Environment-Specific Configuration

```javascript { .api }
// Browser configuration
if (typeof window !== 'undefined') {
  GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';
}

// Node.js configuration
if (typeof process !== 'undefined' && process.versions?.node) {
  // Node.js-specific setup
  GlobalWorkerOptions.workerSrc = require.resolve('pdfjs-dist/build/pdf.worker.js');
}

// Webpack configuration
if (typeof __webpack_require__ !== 'undefined') {
  GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker.entry');
}
```

### Performance Optimization

```javascript { .api }
/**
 * Performance optimization settings
 */
interface PerformanceConfig {
  /** Enable OffscreenCanvas for background rendering */
  useOffscreenCanvas: boolean;
  /** Maximum number of pages to cache */
  maxPageCache: number;
  /** Enable worker fetch for better streaming */
  useWorkerFetch: boolean;
  /** Canvas memory limit */
  canvasMaxAreaInBytes: number;
  /** Enable image caching */
  enableImageCaching: boolean;
}

// Optimal performance configuration
const performanceConfig: PerformanceConfig = {
  useOffscreenCanvas: FeatureTest.platform.isOffscreenCanvasSupported,
  maxPageCache: 10,
  useWorkerFetch: true,
  canvasMaxAreaInBytes: 268435456, // 256MB
  enableImageCaching: true
};
```