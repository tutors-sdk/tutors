# Rendering API

Page-level operations including rendering to canvas, viewport calculations, and visual transformations. Essential for displaying PDF content in web applications.

## Capabilities

### PDF Page Proxy

Interface for individual PDF pages providing rendering, text extraction, and annotation access.

```javascript { .api }
interface PDFPageProxy {
  /** Page number (1-indexed) */
  pageNumber: number;
  /** Page rotation in degrees */
  rotate: number;
  /** Page reference object */
  ref: RefProxy;
  /** User unit (typically 1.0) */
  userUnit: number;
  /** Page dimensions in points */
  view: number[];
  
  /**
   * Render page to canvas context
   * @param params - Rendering parameters
   * @returns Render task for controlling operation
   */
  render(params: RenderParameters): RenderTask;
  
  /**
   * Get page viewport for given parameters
   * @param params - Viewport parameters
   * @returns Viewport with dimensions and transforms
   */
  getViewport(params: GetViewportParameters): PageViewport;
  
  /**
   * Get page annotations
   * @param params - Annotation parameters
   * @returns Promise resolving to annotation array
   */
  getAnnotations(params?: GetAnnotationsParameters): Promise<any[]>;
  
  /**
   * Extract text content from page
   * @param params - Text extraction parameters
   * @returns Promise resolving to text content
   */
  getTextContent(params?: GetTextContentParameters): Promise<TextContent>;
  
  /**
   * Get operator list for advanced rendering
   * @param params - Operator list parameters
   * @returns Promise resolving to operation list
   */
  getOperatorList(params?: GetOperatorListParameters): Promise<any>;
  
  /**
   * Get page structure tree for accessibility
   * @returns Promise resolving to structure tree
   */
  getStructTree(): Promise<any>;
  
  /**
   * Get JavaScript actions for this page
   * @returns Promise resolving to actions object
   */
  getJSActions(): Promise<{ [name: string]: any }>;
  
  /**
   * Clean up page resources
   * @param resetStats - Reset page statistics
   */
  cleanup(resetStats?: boolean): void;
  
  /**
   * Get page statistics
   * @returns Statistics object
   */
  getStats(): any;
}
```

### Render Parameters

Configuration for page rendering operations.

```javascript { .api }
interface RenderParameters {
  /** Canvas 2D rendering context */
  canvasContext: CanvasRenderingContext2D;
  /** Page viewport defining dimensions and transforms */
  viewport: PageViewport;
  /** Rendering intent (default: "display") */
  intent?: "display" | "print" | "any";
  /** Enable WebGL acceleration */
  enableWebGL?: boolean;
  /** Render interactive form elements */
  renderInteractiveForms?: boolean;
  /** Additional transform matrix */
  transform?: number[];
  /** Background color */
  background?: string;
  /** Image layer for background images */
  imageLayer?: any;
  /** Canvas factory for creating additional canvases */
  canvasFactory?: any;
  /** Optional content configuration */
  optionalContentConfigPromise?: Promise<any>;
  /** Annotation canvas map */
  annotationCanvasMap?: Map<string, HTMLCanvasElement>;
  /** Page colors for forced color mode */
  pageColors?: any;
}
```

**Usage Examples:**

```javascript
import { getDocument } from "pdfjs-dist";

// Load document and get page
const pdf = await getDocument("document.pdf").promise;
const page = await pdf.getPage(1);

// Set up canvas
const canvas = document.getElementById("pdf-canvas");
const context = canvas.getContext("2d");

// Get viewport and configure canvas
const viewport = page.getViewport({ scale: 1.5 });
canvas.width = viewport.width;
canvas.height = viewport.height;

// Render page
const renderContext = {
  canvasContext: context,
  viewport: viewport,
  intent: "display"
};

const renderTask = page.render(renderContext);
await renderTask.promise;
console.log("Page rendered successfully");
```

### Page Viewport

Represents page dimensions and coordinate transformations for rendering.

```javascript { .api }
class PageViewport {
  /** Viewport width in pixels */
  width: number;
  /** Viewport height in pixels */
  height: number;
  /** Scaling factor applied */
  scale: number;
  /** Rotation angle in degrees */
  rotation: number;
  /** Horizontal offset */
  offsetX: number;
  /** Vertical offset */
  offsetY: number;
  /** Transformation matrix */
  transform: number[];
  /** Raw dimensions from PDF */
  viewBox: number[];
  
  /**
   * Clone viewport with new parameters
   * @param params - Parameters to override
   * @returns New viewport instance
   */
  clone(params?: Partial<GetViewportParameters>): PageViewport;
  
  /**
   * Convert PDF coordinates to viewport coordinates
   * @param x - PDF X coordinate
   * @param y - PDF Y coordinate
   * @returns Viewport coordinates [x, y]
   */
  convertToViewportPoint(x: number, y: number): number[];
  
  /**
   * Convert viewport coordinates to PDF coordinates
   * @param x - Viewport X coordinate
   * @param y - Viewport Y coordinate
   * @returns PDF coordinates [x, y]
   */
  convertToPdfPoint(x: number, y: number): number[];
  
  /**
   * Convert PDF rectangle to viewport rectangle
   * @param rect - PDF rectangle [x1, y1, x2, y2]
   * @returns Viewport rectangle [x1, y1, x2, y2]
   */
  convertToViewportRectangle(rect: number[]): number[];
}
```

### Viewport Parameters

Configuration for creating page viewports.

```javascript { .api }
interface GetViewportParameters {
  /** Scaling factor (default: 1.0) */
  scale?: number;
  /** Rotation angle in degrees (0, 90, 180, 270) */
  rotation?: number;
  /** Horizontal offset in pixels */
  offsetX?: number;
  /** Vertical offset in pixels */
  offsetY?: number;
  /** Don't flip Y axis (default: false) */
  dontFlip?: boolean;
}
```

**Usage Examples:**

```javascript
// Different viewport configurations
const viewport1 = page.getViewport({ scale: 1.0 });
const viewport2 = page.getViewport({ scale: 2.0, rotation: 90 });
const viewport3 = page.getViewport({ 
  scale: 1.5, 
  offsetX: 100, 
  offsetY: 50 
});

// Convert coordinates
const pdfPoint = [100, 200];
const viewportPoint = viewport1.convertToViewportPoint(pdfPoint[0], pdfPoint[1]);
console.log(`PDF ${pdfPoint} -> Viewport ${viewportPoint}`);

// Handle different page orientations
const isLandscape = viewport.width > viewport.height;
```

### Render Task

Controls an ongoing rendering operation with progress tracking and cancellation.

```javascript { .api }
interface RenderTask {
  /** Promise that resolves when rendering completes */
  promise: Promise<void>;
  
  /**
   * Cancel the rendering operation
   * @param extraDelay - Extra delay before cleanup
   */
  cancel(extraDelay?: number): void;
  
  /** Whether task is cancelled */
  cancelled: boolean;
  
  /** Rendering progress callback */
  onProgress?: (progressData: { percent: number }) => void;
  
  /** Continue rendering callback for chunked rendering */
  onContinue?: (cont: () => void) => void;
}
```

**Usage Examples:**

```javascript
// Render with progress tracking
const renderTask = page.render(renderContext);

renderTask.onProgress = (progress) => {
  console.log(`Rendering progress: ${progress.percent}%`);
};

try {
  await renderTask.promise;
  console.log("Rendering complete");
} catch (error) {
  if (renderTask.cancelled) {
    console.log("Rendering was cancelled");
  } else {
    console.error("Rendering failed:", error);
  }
}

// Cancel rendering if needed
if (shouldCancel) {
  renderTask.cancel();
}
```

### Annotation Parameters

Configuration for retrieving page annotations.

```javascript { .api }
interface GetAnnotationsParameters {
  /** Rendering intent */
  intent?: "display" | "print" | "any";
}
```

### Text Content Extraction

Parameters and interfaces for extracting text from PDF pages.

```javascript { .api }
interface GetTextContentParameters {
  /** Normalize whitespace */
  normalizeWhitespace?: boolean;
  /** Disable text combining */
  disableCombineTextItems?: boolean;
  /** Include marked content */
  includeMarkedContent?: boolean;
}

interface TextContent {
  /** Text items on the page */
  items: TextItem[];
  /** Text styles */
  styles: { [fontName: string]: TextStyle };
  /** Language information */
  lang?: string;
}

interface TextItem {
  /** Text string */
  str: string;
  /** Text direction */
  dir: "ltr" | "rtl" | "ttb";
  /** Text width */
  width: number;
  /** Text height */
  height: number;
  /** Text transform matrix */
  transform: number[];
  /** Font name */
  fontName: string;
  /** Whether text has end-of-line */
  hasEOL?: boolean;
}

interface TextStyle {
  /** Text ascent */
  ascent: number;
  /** Text descent */
  descent: number;
  /** Vertical alignment */
  vertical?: boolean;
  /** Font family */
  fontFamily: string;
}
```

**Usage Examples:**

```javascript
// Extract text content
const textContent = await page.getTextContent({
  normalizeWhitespace: true,
  disableCombineTextItems: false
});

// Process text items
let pageText = "";
textContent.items.forEach(item => {
  pageText += item.str;
  if (item.hasEOL) {
    pageText += "\n";
  }
});

console.log("Page text:", pageText);

// Access text positioning
textContent.items.forEach(item => {
  const [x, y] = item.transform.slice(4, 6);
  console.log(`Text "${item.str}" at position (${x}, ${y})`);
});
```

### Operator List Parameters

Configuration for retrieving low-level drawing operations.

```javascript { .api }
interface GetOperatorListParameters {
  /** Rendering intent */
  intent?: "display" | "print" | "any";
  /** Render interactive forms */
  renderInteractiveForms?: boolean;
  /** Transform matrix */
  transform?: number[];
  /** Optional content configuration */
  optionalContentConfigPromise?: Promise<any>;
}
```

### Display Utilities

Helper functions for rendering operations.

```javascript { .api }
/**
 * Calculate output scale for high-DPI displays
 * @param ctx - Canvas rendering context
 * @returns Scale factors for X and Y axes
 */
function getOutputScale(ctx: CanvasRenderingContext2D): { sx: number; sy: number };

/**
 * Set layer dimensions to match viewport
 * @param layer - HTML element to resize
 * @param viewport - Target viewport
 */
function setLayerDimensions(layer: HTMLElement, viewport: PageViewport): void;

/**
 * Check if URL uses data scheme
 * @param url - URL to check
 * @returns Whether URL is data scheme
 */
function isDataScheme(url: string): boolean;

/**
 * Check if file appears to be PDF
 * @param filename - Filename to check
 * @returns Whether file is likely PDF
 */
function isPdfFile(filename: string): boolean;
```

**Usage Examples:**

```javascript
import { getOutputScale, setLayerDimensions } from "pdfjs-dist";

// Handle high-DPI displays
const outputScale = getOutputScale(context);
if (outputScale.sx !== 1 || outputScale.sy !== 1) {
  canvas.width = Math.floor(viewport.width * outputScale.sx);
  canvas.height = Math.floor(viewport.height * outputScale.sy);
  context.scale(outputScale.sx, outputScale.sy);
}

// Set up text layer
const textLayer = document.getElementById("text-layer");
setLayerDimensions(textLayer, viewport);
```