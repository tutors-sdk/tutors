# Document API

Core functionality for loading PDF documents from URLs, binary data, or streams. Handles document-level operations like metadata extraction, page navigation, and resource management.

## Capabilities

### Document Loading

The primary entry point for loading PDF documents with comprehensive configuration options.

```javascript { .api }
/**
 * Loads a PDF document from various sources
 * @param src - Document source (URL, binary data, or parameters object)
 * @returns Promise-based loading task for document access
 */
function getDocument(src: string | Uint8Array | ArrayBuffer | DocumentInitParameters): PDFDocumentLoadingTask;

interface DocumentInitParameters {
  /** URL to the PDF document */
  url?: string;
  /** Binary PDF data as typed array */
  data?: Uint8Array | ArrayBuffer;
  /** HTTP headers for document requests */
  httpHeaders?: Record<string, string>;
  /** Include credentials in cross-origin requests */
  withCredentials?: boolean;
  /** Password for encrypted PDFs */
  password?: string;
  /** Expected document length for optimization */
  length?: number;
  /** Custom data range transport */
  range?: PDFDataRangeTransport;
  /** Custom worker instance */
  worker?: PDFWorker;
  /** Logging verbosity level (0-5) */
  verbosity?: number;
  /** Base URL for relative links */
  docBaseUrl?: string;
  /** URL path to character mapping files */
  cMapUrl?: string;
  /** Whether character maps are binary packed */
  cMapPacked?: boolean;
  /** Custom character map reader factory */
  CMapReaderFactory?: any;
  /** Use system fonts when available */
  useSystemFonts?: boolean;
  /** URL path to standard font data */
  standardFontDataUrl?: string;
  /** Custom standard font data factory */
  StandardFontDataFactory?: any;
  /** Use worker for fetch operations */
  useWorkerFetch?: boolean;
  /** JavaScript evaluation support */
  isEvalSupported?: boolean;
  /** OffscreenCanvas support for rendering */
  isOffscreenCanvasSupported?: boolean;
  /** Maximum canvas area in bytes */
  canvasMaxAreaInBytes?: number;
  /** Disable @font-face rules */
  disableFontFace?: boolean;
  /** Include extra font properties */
  fontExtraProperties?: boolean;
  /** Enable XFA form support */
  enableXfa?: boolean;
  /** Owner document for DOM operations */
  ownerDocument?: Document;
  /** Disable byte range requests */
  disableRange?: boolean;
  /** Disable streaming */
  disableStream?: boolean;
  /** Disable auto-fetch of missing data */
  disableAutoFetch?: boolean;
  /** Enable PDF debugging features */
  pdfBug?: boolean;
}
```

**Usage Examples:**

```javascript
import { getDocument } from "pdfjs-dist";

// Load from URL
const loadingTask = getDocument("https://example.com/document.pdf");
const pdf = await loadingTask.promise;

// Load from binary data
const arrayBuffer = await fetch("document.pdf").then(r => r.arrayBuffer());
const loadingTask2 = getDocument(new Uint8Array(arrayBuffer));
const pdf2 = await loadingTask2.promise;

// Load with configuration
const loadingTask3 = getDocument({
  url: "document.pdf",
  httpHeaders: { "Authorization": "Bearer token" },
  cMapUrl: "./cmaps/",
  cMapPacked: true
});
const pdf3 = await loadingTask3.promise;
```

### Document Loading Task

Represents an ongoing document loading operation with progress tracking and cancellation support.

```javascript { .api }
interface PDFDocumentLoadingTask {
  /** Promise that resolves to the loaded PDF document */
  promise: Promise<PDFDocumentProxy>;
  /** Destroy/cancel the loading task */
  destroy(): void;
  /** Document loading progress callback */
  onProgress?: (progressData: OnProgressParameters) => void;
  /** Password required callback for encrypted documents */
  onPassword?: (updatePassword: (password: string) => void, reason: number) => void;
}

interface OnProgressParameters {
  /** Bytes loaded so far */
  loaded: number;
  /** Total bytes to load (if known) */
  total?: number;
  /** Loading progress percentage */
  percent?: number;
}
```

### PDF Document Proxy

Main interface for interacting with a loaded PDF document, providing access to pages, metadata, and document-level operations.

```javascript { .api }
interface PDFDocumentProxy {
  /** Number of pages in the document */
  numPages: number;
  /** Document fingerprint for caching */
  fingerprints: string[];
  /** Loading parameters used */
  loadingParams: DocumentInitParameters;
  /** Loading task that created this document */
  loadingTask: PDFDocumentLoadingTask;
  
  /**
   * Get a specific page by number (1-indexed)
   * @param pageNumber - Page number (1 to numPages)
   * @returns Promise resolving to page proxy
   */
  getPage(pageNumber: number): Promise<PDFPageProxy>;
  
  /**
   * Get page index from page reference
   * @param ref - Page reference object
   * @returns Promise resolving to 0-based page index
   */
  getPageIndex(ref: RefProxy): Promise<number>;
  
  /**
   * Get named destinations in the document
   * @returns Promise resolving to destination mapping
   */
  getDestinations(): Promise<{ [name: string]: any }>;
  
  /**
   * Get specific destination by ID
   * @param id - Destination identifier
   * @returns Promise resolving to destination array
   */
  getDestination(id: string): Promise<any[] | null>;
  
  /**
   * Get document outline/bookmarks
   * @returns Promise resolving to outline tree
   */
  getOutline(): Promise<any[]>;
  
  /**
   * Get document permissions
   * @returns Promise resolving to permission flags
   */
  getPermissions(): Promise<number[]>;
  
  /**
   * Get document metadata
   * @returns Promise resolving to metadata object
   */
  getMetadata(): Promise<{ info: any; metadata: Metadata | null; contentDispositionFilename?: string }>;
  
  /**
   * Get document data as Uint8Array
   * @returns Promise resolving to document bytes
   */
  getData(): Promise<Uint8Array>;
  
  /**
   * Get download info for saving
   * @returns Promise resolving to download information
   */
  getDownloadInfo(): Promise<{ length: number }>;
  
  /**
   * Get document statistics
   * @returns Promise resolving to stats object
   */
  getStats(): Promise<{ streamTypes: any; fontTypes: any }>;
  
  /**
   * Get page labels/numbering information
   * @returns Promise resolving to label array
   */
  getPageLabels(): Promise<string[] | null>;
  
  /**
   * Get page layout setting
   * @returns Promise resolving to layout name
   */
  getPageLayout(): Promise<string>;
  
  /**
   * Get page mode setting
   * @returns Promise resolving to mode name
   */
  getPageMode(): Promise<string>;
  
  /**
   * Get viewer preferences
   * @returns Promise resolving to preferences object
   */
  getViewerPreferences(): Promise<any>;
  
  /**
   * Get document attachments
   * @returns Promise resolving to attachments object
   */
  getAttachments(): Promise<{ [filename: string]: any }>;
  
  /**
   * Get document open action
   * @returns Promise resolving to open action
   */
  getOpenAction(): Promise<any>;
  
  /**
   * Get optional content configuration
   * @param params - Configuration parameters
   * @returns Promise resolving to config object
   */
  getOptionalContentConfig(params?: { intent?: string }): Promise<OptionalContentConfig>;
  
  /**
   * Get mark info for accessibility
   * @returns Promise resolving to mark info object
   */
  getMarkInfo(): Promise<any>;
  
  /**
   * Get annotations filtered by type
   * @param types - Array of annotation types to include
   * @param pageIndexesToSkip - Page indices to skip
   * @returns Promise resolving to annotations array
   */
  getAnnotationsByType(types: number[], pageIndexesToSkip?: number[]): Promise<any[]>;
  
  /**
   * Get JavaScript actions in document
   * @returns Promise resolving to actions object
   */
  getJSActions(): Promise<{ [name: string]: any }>;
  
  /**
   * Get field objects for forms
   * @returns Promise resolving to field mapping
   */
  getFieldObjects(): Promise<{ [id: string]: any }>;
  
  /**
   * Check if document has JavaScript actions
   * @returns Promise resolving to boolean
   */
  hasJSActions(): Promise<boolean>;
  
  /**
   * Get calculate order for form fields
   * @returns Promise resolving to field order array
   */
  getCalculationOrderIds(): Promise<string[]>;
  
  /**
   * Clean up document resources
   * @param keepLoadedFonts - Keep loaded fonts in memory
   */
  cleanup(keepLoadedFonts?: boolean): void;
  
  /**
   * Destroy document and release all resources
   */
  destroy(): void;
  
  /**
   * Get structure tree for accessibility
   * @returns Promise resolving to structure tree
   */
  getStructTree(pageIndex: number): Promise<any>;
  
  /**
   * Save document with annotations
   * @param annotationStorage - Annotation storage to include
   * @param filename - Filename for saved document
   * @param options - Save options
   * @returns Promise resolving to saved document bytes
   */
  saveDocument(annotationStorage?: AnnotationStorage, filename?: string, options?: any): Promise<Uint8Array>;
  
  /**
   * Get cached page number for reference
   * @param ref - Page reference object
   * @returns Cached page number or null
   */
  cachedPageNumber(ref: RefProxy): number | null;
}
```

**Usage Examples:**

```javascript
import { getDocument } from "pdfjs-dist";

// Load and inspect document
const pdf = await getDocument("document.pdf").promise;

console.log(`Document has ${pdf.numPages} pages`);

// Get metadata
const metadata = await pdf.getMetadata();
console.log("Title:", metadata.info.Title);
console.log("Author:", metadata.info.Author);

// Get first page
const page = await pdf.getPage(1);

// Get outline
const outline = await pdf.getOutline();
if (outline) {
  console.log("Document has bookmarks");
}

// Check permissions
const permissions = await pdf.getPermissions();
const canPrint = permissions.includes(4); // PRINT permission
```

### Data Range Transport

Custom transport mechanism for handling byte-range requests, useful for streaming large documents or custom data sources.

```javascript { .api }
class PDFDataRangeTransport {
  /**
   * Constructor for custom data range transport
   * @param length - Total data length
   * @param initialData - Initial chunk of data
   * @param progressiveDone - Whether progressive loading is complete
   * @param contentDispositionFilename - Suggested filename
   */
  constructor(
    length: number,
    initialData: Uint8Array,
    progressiveDone?: boolean,
    contentDispositionFilename?: string
  );
  
  /**
   * Request a specific data range
   * @param begin - Start byte position
   * @param end - End byte position
   */
  requestDataRange(begin: number, end: number): void;
  
  /**
   * Abort all pending requests
   * @param reason - Abort reason
   */
  abort(reason?: any): void;
}
```

### Document Build Information

Version and build information for the PDF.js library.

```javascript { .api }
const build: {
  version: string;
  date: string;
};

const version: string;
```

**Usage Examples:**

```javascript
import { build, version } from "pdfjs-dist";

console.log(`PDF.js version: ${version}`);
console.log(`Build date: ${build.date}`);
```

## Error Handling

```javascript { .api }
class InvalidPDFException extends Error {
  constructor(msg: string);
}

class MissingPDFException extends Error {
  constructor(msg: string);
}

class PasswordException extends Error {
  constructor(msg: string, code: number);
}

class UnexpectedResponseException extends Error {
  constructor(msg: string, status: number);
}
```

Common error scenarios:
- Invalid PDF files throw `InvalidPDFException`
- Missing or network-inaccessible files throw `MissingPDFException`  
- Password-protected documents throw `PasswordException`
- HTTP errors throw `UnexpectedResponseException`