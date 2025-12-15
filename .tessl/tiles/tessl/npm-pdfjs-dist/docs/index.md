# PDF.js (pdfjs-dist)

PDF.js is a comprehensive PDF viewing and parsing library built entirely with HTML5 technologies. The pdfjs-dist package provides a generic, production-ready build that enables PDF rendering in web browsers without requiring plugins or native browser extensions, offering complete document parsing, rendering, and interactive features including form handling, annotations, and text extraction.

## Package Information

- **Package Name**: pdfjs-dist
- **Package Type**: npm
- **Language**: JavaScript/TypeScript
- **Installation**: `npm install pdfjs-dist`
- **Version**: 5.4.149

## Core Imports

```javascript
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
```

For legacy build (older browsers):

```javascript
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
```

CommonJS:

```javascript
const { getDocument, GlobalWorkerOptions } = require("pdfjs-dist");
```

## Basic Usage

```javascript
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

// Configure worker (required)
GlobalWorkerOptions.workerSrc = "path/to/pdf.worker.mjs";

// Load a PDF document
const loadingTask = getDocument("path/to/document.pdf");
const pdf = await loadingTask.promise;

// Get the first page
const page = await pdf.getPage(1);

// Get page viewport for rendering
const viewport = page.getViewport({ scale: 1.0 });

// Render to canvas
const canvas = document.getElementById("pdf-canvas");
const context = canvas.getContext("2d");
canvas.width = viewport.width;
canvas.height = viewport.height;

const renderContext = {
  canvasContext: context,
  viewport: viewport
};

await page.render(renderContext).promise;
```

## Architecture

PDF.js is built around several key architectural components:

- **Document Layer**: Core PDF parsing and document management (`getDocument`, `PDFDocumentProxy`)
- **Page Layer**: Individual page handling and rendering (`PDFPageProxy`, `PageViewport`)
- **Display Layer**: Canvas rendering, text extraction, and layer management
- **Annotation System**: Interactive annotations and form handling
- **Editor Framework**: Tools for creating and editing annotations
- **Worker System**: Web worker-based PDF parsing for non-blocking operations
- **Utility Layer**: Helper functions for URL handling, data processing, and browser compatibility

## Capabilities

### Document Loading and Management

Core functionality for loading PDF documents from URLs, binary data, or streams. Handles document-level operations like metadata extraction, page navigation, and resource management.

```javascript { .api }
function getDocument(src: DocumentInitParameters): PDFDocumentLoadingTask;

interface DocumentInitParameters {
  url?: string | URL;
  data?: TypedArray | ArrayBuffer | Array<number> | string;
  httpHeaders?: Record<string, string>;
  withCredentials?: boolean;
  password?: string;
  length?: number;
  range?: PDFDataRangeTransport;
  rangeChunkSize?: number;
  worker?: PDFWorker;
  verbosity?: number;
  docBaseUrl?: string;
  cMapUrl?: string;
  cMapPacked?: boolean;
  CMapReaderFactory?: any;
  iccUrl?: string;
  useSystemFonts?: boolean;
  standardFontDataUrl?: string;
  StandardFontDataFactory?: any;
  wasmUrl?: string;
  WasmFactory?: any;
  useWorkerFetch?: boolean;
  useWasm?: boolean;
  stopAtErrors?: boolean;
  maxImageSize?: number;
  isEvalSupported?: boolean;
  isOffscreenCanvasSupported?: boolean;
  isImageDecoderSupported?: boolean;
  canvasMaxAreaInBytes?: number;
  disableFontFace?: boolean;
  fontExtraProperties?: boolean;
  enableXfa?: boolean;
  ownerDocument?: Document;
  disableRange?: boolean;
  disableStream?: boolean;
  disableAutoFetch?: boolean;
  pdfBug?: boolean;
  CanvasFactory?: any;
  FilterFactory?: any;
  enableHWA?: boolean;
}
```

[Document API](./document-api.md)

### Page Rendering and Display

Page-level operations including rendering to canvas, viewport calculations, and visual transformations. Essential for displaying PDF content in web applications.

```javascript { .api }
interface PDFPageProxy {
  render(params: RenderParameters): RenderTask;
  getViewport(params: GetViewportParameters): PageViewport;
  getAnnotations(params?: GetAnnotationsParameters): Promise<any[]>;
  getTextContent(params?: GetTextContentParameters): Promise<TextContent>;
  cleanup(): void;
}

interface RenderParameters {
  canvasContext: CanvasRenderingContext2D;
  viewport: PageViewport;
  intent?: string;
  enableWebGL?: boolean;
  renderInteractiveForms?: boolean;
  transform?: number[];
  background?: string;
}
```

[Rendering API](./rendering-api.md)

### Text Extraction and Selection

Text layer functionality for extracting, searching, and enabling text selection within PDF documents.

```javascript { .api }
class TextLayer {
  static render(parameters: TextLayerRenderParameters): TextLayerRenderTask;
  static update(parameters: TextLayerUpdateParameters): void;
}

interface TextLayerRenderParameters {
  textContentSource: ReadableStream | TextContent;
  container: HTMLElement;
  viewport: PageViewport;
  textDivs?: HTMLElement[];
  textContentItemsStr?: string[];
  isOffscreenCanvasSupported?: boolean;
}
```

[Text Layer API](./text-layer.md)

### Annotation Handling

Interactive PDF annotations including links, form fields, and multimedia content. Supports both rendering existing annotations and creating new ones.

```javascript { .api }
class AnnotationLayer {
  static render(parameters: AnnotationLayerParameters): void;
  static update(parameters: AnnotationLayerParameters): void;
}

interface AnnotationLayerParameters {
  viewport: PageViewport;
  div: HTMLElement;
  annotations: any[];
  page: PDFPageProxy;
  imageResourcesPath?: string;
  renderForms?: boolean;
  linkService: IPDFLinkService;
  downloadManager?: IDownloadManager;
  enableScripting?: boolean;
  hasJSActionsPromise?: Promise<boolean>;
  fieldObjectsPromise?: Promise<{ [id: string]: any }>;
  annotationCanvasMap?: Map<string, HTMLCanvasElement>;
  accessibilityManager?: any;
}
```

[Annotation API](./annotation-api.md)

### Annotation Editing

Interactive annotation creation and editing tools including freetext, highlighting, stamps, and ink annotations.

```javascript { .api }
class AnnotationEditorLayer {
  render(parameters: AnnotationEditorLayerParameters): void;
  update(parameters: AnnotationEditorLayerParameters): void;
  updateMode(mode: number): void;
  addInkEditorIfNeeded(isCommitting: boolean): void;
  addStampEditorIfNeeded(): void;
  destroy(): void;
}

class AnnotationEditorUIManager {
  updateUI(editor: any): void;
  updateMode(mode: number): void;
  getMode(): number;
  destroy(): void;
}
```

[Editor API](./editor-api.md)

### XFA Forms

XML Forms Architecture (XFA) support for dynamic PDF forms and interactive content.

```javascript { .api }
class XfaLayer {
  static render(parameters: XfaLayerParameters): XfaLayerResult;
  static update(parameters: XfaLayerParameters): void;
}

interface XfaLayerParameters {
  viewport: PageViewport;
  div: HTMLElement;
  xfaHtml: Element;
  annotationStorage?: AnnotationStorage;
  linkService: IPDFLinkService;
  xfaHtmlFactory: any;
}
```

[XFA API](./xfa-api.md)

### Configuration and Workers

Global configuration options and web worker management for optimal performance and browser compatibility.

```javascript { .api }
const GlobalWorkerOptions: {
  workerSrc: string;
  workerPort?: MessagePort;
};

class PDFWorker {
  constructor(params?: PDFWorkerParameters);
  destroy(): void;
  static fromPort(params: FromPortParameters): PDFWorker;
  static getWorkerSrc(): string;
}
```

[Configuration API](./configuration.md)

## Version and Build Information

Core version and build information for the PDF.js library.

```javascript { .api }
const version: string;
const build: string;
```

## Exception Classes

Exception classes thrown by various PDF.js operations.

```javascript { .api }
class AbortException extends Error {
  constructor(msg: string);
  readonly name: "AbortException";
}

class InvalidPDFException extends Error {
  constructor(msg: string);
  readonly name: "InvalidPDFException";
}

class ResponseException extends Error {
  constructor(msg: string, status: number, missing: boolean);
  readonly name: "ResponseException";
  readonly status: number;
  readonly missing: boolean;
}

class PasswordException extends Error {
  constructor(msg: string, code: number);
  readonly name: "PasswordException";
  readonly code: number;
}
```

## Utility Functions

Core utility functions for URL handling, data processing, and browser compatibility.

```javascript { .api }
function createValidAbsoluteUrl(url: string, baseUrl?: string): URL | null;
function isValidExplicitDest(dest: any): boolean;
function fetchData(src: string | URL): Promise<Uint8Array>;
function getRGB(color: string): [number, number, number];
function getFilenameFromUrl(url: string, onlyStripPath?: boolean): string;
function getPdfFilenameFromUrl(url: string, defaultFilename?: string): string;
function isDataScheme(url: string): boolean;
function isPdfFile(filename: string): boolean;
function noContextMenu(element: HTMLElement): void;
function stopEvent(event: Event): void;
```

## Display and Rendering Utilities

Utility classes and functions for rendering, canvas management, and UI components.

```javascript { .api }
class OutputScale {
  constructor(sx: number, sy: number);
  sx: number;
  sy: number;
  scaled: boolean;
}

class DOMSVGFactory {
  create(width: number, height: number): SVGElement;
  createElement(type: string): SVGElement;
}

class DrawLayer {
  constructor(params: DrawLayerParameters);
  render(intent?: string): Promise<void>;
  cancel(): void;
  destroy(): void;
}

class ColorPicker {
  constructor(params: ColorPickerParameters);
  renderMainColor(color: number[]): void;
  renderButton(): HTMLButtonElement;
}

class TouchManager {
  constructor(element: HTMLElement);
  destroy(): void;
}

class SignatureExtractor {
  static extract(data: Uint8Array): Promise<SignatureInfo[]>;
}
```

## Constants and Enumerations

```javascript { .api }
// Annotation types
enum AnnotationType {
  TEXT = 1,
  LINK = 2,
  FREETEXT = 3,
  LINE = 4,
  SQUARE = 5,
  CIRCLE = 6,
  POLYGON = 7,
  POLYLINE = 8,
  HIGHLIGHT = 9,
  UNDERLINE = 10,
  SQUIGGLY = 11,
  STRIKEOUT = 12,
  STAMP = 13,
  CARET = 14,
  INK = 15,
  POPUP = 16,
  FILEATTACHMENT = 17,
  SOUND = 18,
  MOVIE = 19,
  WIDGET = 20,
  SCREEN = 21,
  PRINTERMARK = 22,
  TRAPNET = 23,
  WATERMARK = 24,
  THREED = 25,
  REDACT = 26
}

// Annotation editor types  
enum AnnotationEditorType {
  DISABLE = -1,
  NONE = 0,
  FREETEXT = 3,
  HIGHLIGHT = 9,
  STAMP = 13,
  INK = 15,
  POPUP = 16,
  SIGNATURE = 101,
  COMMENT = 102
}

// Annotation editor parameter types
enum AnnotationEditorParamsType {
  RESIZE = 1,
  CREATE = 2,
  FREETEXT_SIZE = 11,
  FREETEXT_COLOR = 12,
  FREETEXT_OPACITY = 13,
  INK_COLOR = 21,
  INK_THICKNESS = 22,
  INK_OPACITY = 23,
  HIGHLIGHT_COLOR = 31,
  HIGHLIGHT_THICKNESS = 32,
  HIGHLIGHT_FREE = 33,
  HIGHLIGHT_SHOW_ALL = 34,
  DRAW_STEP = 41
}

// Annotation mode
enum AnnotationMode {
  DISABLE = 0,
  ENABLE = 1,
  ENABLE_FORMS = 2,
  ENABLE_STORAGE = 3
}

// Permission flags
enum PermissionFlag {
  PRINT = 0x04,
  MODIFY_CONTENTS = 0x08,
  COPY = 0x10,
  MODIFY_ANNOTATIONS = 0x20,
  FILL_INTERACTIVE_FORMS = 0x100,
  COPY_FOR_ACCESSIBILITY = 0x200,
  ASSEMBLE = 0x400,
  PRINT_HIGH_QUALITY = 0x800
}

// Verbosity levels
enum VerbosityLevel {
  ERRORS = 0,
  WARNINGS = 1,
  INFOS = 5
}

// Image formats
enum ImageKind {
  GRAYSCALE_1BPP = 1,
  RGB_24BPP = 2,
  RGBA_32BPP = 3
}

// Password response codes
enum PasswordResponses {
  NEED_PASSWORD = 1,
  INCORRECT_PASSWORD = 2
}

// Operation codes for internal PDF operations
const OPS: {
  dependency: number;
  setLineWidth: number;
  setLineCap: number;
  setLineJoin: number;
  setMiterLimit: number;
  setDash: number;
  setRenderingIntent: number;
  setFlatness: number;
  setGState: number;
  save: number;
  restore: number;
  transform: number;
  moveTo: number;
  lineTo: number;
  curveTo: number;
  curveTo2: number;
  curveTo3: number;
  closePath: number;
  rectangle: number;
  stroke: number;
  closeStroke: number;
  fill: number;
  eoFill: number;
  fillStroke: number;
  eoFillStroke: number;
  closeFillStroke: number;
  closeEOFillStroke: number;
  endPath: number;
  clip: number;
  eoClip: number;
  beginText: number;
  endText: number;
  setCharSpacing: number;
  setWordSpacing: number;
  setHScale: number;
  setLeading: number;
  setFont: number;
  setTextRenderingMode: number;
  setTextRise: number;
  moveText: number;
  setLeadingMoveText: number;
  setTextMatrix: number;
  nextLine: number;
  showText: number;
  showSpacedText: number;
  nextLineShowText: number;
  nextLineSetSpacingShowText: number;
  setCharWidth: number;
  setCharWidthAndBounds: number;
  setStrokeColorSpace: number;
  setFillColorSpace: number;
  setStrokeColor: number;
  setStrokeColorN: number;
  setFillColor: number;
  setFillColorN: number;
  setStrokeGray: number;
  setFillGray: number;
  setStrokeRGBColor: number;
  setFillRGBColor: number;
  setStrokeCMYKColor: number;
  setFillCMYKColor: number;
  shadingFill: number;
  beginInlineImage: number;
  beginImageData: number;
  endInlineImage: number;
  paintXObject: number;
  markPoint: number;
  markPointProps: number;
  beginMarkedContent: number;
  beginMarkedContentProps: number;
  endMarkedContent: number;
  beginCompat: number;
  endCompat: number;
  paintFormXObjectBegin: number;
  paintFormXObjectEnd: number;
  beginGroup: number;
  endGroup: number;
  beginAnnotations: number;
  endAnnotations: number;
  beginAnnotation: number;
  endAnnotation: number;
  paintJpegXObject: number;
  paintImageMaskXObject: number;
  paintImageMaskXObjectGroup: number;
  paintImageXObject: number;
  paintInlineImageXObject: number;
  paintInlineImageXObjectGroup: number;
  paintImageXObjectRepeat: number;
  paintImageMaskXObjectRepeat: number;
  paintSolidColorImageMask: number;
  constructPath: number;
};
```