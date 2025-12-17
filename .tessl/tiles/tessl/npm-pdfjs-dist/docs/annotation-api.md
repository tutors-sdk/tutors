# Annotation API

Interactive PDF annotations including links, form fields, and multimedia content. Supports both rendering existing annotations and creating new ones.

## Capabilities

### Annotation Layer Rendering

Renders interactive PDF annotations including links, form fields, stamps, and multimedia content over the PDF page.

```javascript { .api }
class AnnotationLayer {
  /**
   * Render annotations on a page
   * @param parameters - Annotation layer parameters
   */
  static render(parameters: AnnotationLayerParameters): void;
  
  /**
   * Update existing annotation layer
   * @param parameters - Annotation layer parameters
   */
  static update(parameters: AnnotationLayerParameters): void;
}
```

### Annotation Layer Parameters

Configuration for rendering annotation layers.

```javascript { .api }
interface AnnotationLayerParameters {
  /** Page viewport for positioning */
  viewport: PageViewport;
  /** Container element for annotations */
  div: HTMLElement;
  /** Array of annotation objects */
  annotations: any[];
  /** Page proxy for annotation interactions */
  page: PDFPageProxy;
  /** Path to image resources */
  imageResourcesPath?: string;
  /** Whether to render form elements */
  renderForms?: boolean;
  /** Link service for navigation */
  linkService: IPDFLinkService;
  /** Download manager for file attachments */
  downloadManager?: IDownloadManager;
  /** Enable JavaScript in annotations */
  enableScripting?: boolean;
  /** Promise for JavaScript actions check */
  hasJSActionsPromise?: Promise<boolean>;
  /** Promise for form field objects */
  fieldObjectsPromise?: Promise<{ [id: string]: any }>;
  /** Map of annotation canvases */
  annotationCanvasMap?: Map<string, HTMLCanvasElement>;
  /** Accessibility manager */
  accessibilityManager?: any;
  /** Annotation storage for form data */
  annotationStorage?: AnnotationStorage;
  /** Additional HTML attributes */
  additionalAttributes?: Map<string, Map<string, any>>;
}
```

**Usage Examples:**

```javascript
import { AnnotationLayer } from "pdfjs-dist";

// Get annotations from page
const annotations = await page.getAnnotations();

// Create annotation layer container
const annotationDiv = document.createElement("div");
annotationDiv.className = "annotationLayer";
document.body.appendChild(annotationDiv);

// Render annotations
AnnotationLayer.render({
  viewport: viewport,
  div: annotationDiv,
  annotations: annotations,
  page: page,
  linkService: linkService,
  renderForms: true,
  enableScripting: false
});
```

### Link Service Interface

Service for handling PDF navigation and external links.

```javascript { .api }
interface IPDFLinkService {
  /** Current page number */
  page: number;
  /** Current rotation */
  rotation: number;
  /** Current scale */
  scale: number;
  
  /**
   * Navigate to page
   * @param pageNumber - Target page number
   */
  goToPage(pageNumber: number): void;
  
  /**
   * Navigate to destination
   * @param dest - PDF destination
   */
  goToDestination(dest: any): void;
  
  /**
   * Get destination hash fragment
   * @param dest - PDF destination
   * @returns Hash string
   */
  getDestinationHash(dest: any): string;
  
  /**
   * Get anchor URL
   * @param anchor - Anchor string
   * @returns Full URL
   */
  getAnchorUrl(anchor: string): string;
  
  /**
   * Set document reference
   * @param pdfDocument - PDF document proxy
   */
  setDocument(pdfDocument: PDFDocumentProxy): void;
  
  /**
   * Set viewer reference
   * @param pdfViewer - PDF viewer instance
   */
  setViewer(pdfViewer: any): void;
  
  /**
   * Execute named action
   * @param action - Action name
   */
  executeNamedAction(action: string): void;
  
  /**
   * Execute set OCG state action
   * @param action - OCG action
   */
  executeSetOCGState(action: any): void;
}
```

### Download Manager Interface

Service for handling file downloads from PDF attachments.

```javascript { .api }
interface IDownloadManager {
  /**
   * Download file from URL
   * @param url - File URL
   * @param filename - Suggested filename
   * @param options - Download options
   */
  downloadUrl(url: string, filename: string, options?: any): void;
  
  /**
   * Download binary data
   * @param data - File data
   * @param filename - Filename
   * @param contentType - MIME type
   */
  downloadData(data: Uint8Array, filename: string, contentType: string): void;
  
  /**
   * Open file in new window
   * @param data - File data
   * @param filename - Filename
   * @param dest - Optional destination
   * @param options - Open options
   * @returns Whether file was opened
   */
  openOrDownloadData(data: Uint8Array, filename: string, dest?: any, options?: any): boolean;
  
  /**
   * Download PDF document
   * @param data - PDF data
   * @param filename - Filename
   */
  download(data: Uint8Array, filename: string): void;
}
```

### Annotation Types

Constants and interfaces for different annotation types.

```javascript { .api }
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

enum AnnotationFlag {
  INVISIBLE = 0x01,
  HIDDEN = 0x02,
  PRINT = 0x04,
  NOZOOM = 0x08,
  NOROTATE = 0x10,
  NOVIEW = 0x20,
  READONLY = 0x40,
  LOCKED = 0x80,
  TOGGLENOVIEW = 0x100,
  LOCKEDCONTENTS = 0x200
}
```

### Annotation Storage

Storage system for annotation data and form field values.

```javascript { .api }
class AnnotationStorage {
  constructor();
  
  /**
   * Get stored value for annotation
   * @param key - Annotation key
   * @returns Stored value
   */
  getValue(key: string): any;
  
  /**
   * Get raw stored value
   * @param key - Annotation key
   * @returns Raw value
   */
  getRawValue(key: string): any;
  
  /**
   * Remove stored value
   * @param key - Annotation key
   */
  remove(key: string): void;
  
  /**
   * Store annotation value
   * @param key - Annotation key
   * @param value - Value to store
   */
  setValue(key: string, value: any): void;
  
  /**
   * Check if annotation has stored data
   * @param key - Annotation key
   * @returns Whether data exists
   */
  has(key: string): boolean;
  
  /**
   * Get all stored values
   * @returns Map of all values
   */
  getAll(): Map<string, any>;
  
  /**
   * Get size of stored data
   * @returns Number of stored items
   */
  get size(): number;
  
  /**
   * Reset all stored data
   * @param keepTransformMatrix - Keep transform matrices
   */
  resetModified(keepTransformMatrix?: boolean): void;
  
  /**
   * Get serializable representation
   * @returns Serializable object
   */
  serializable: any;
}
```

**Usage Examples:**

```javascript
// Create annotation storage for forms
const annotationStorage = new AnnotationStorage();

// Store form field value
annotationStorage.setValue("field1", "John Doe");
annotationStorage.setValue("checkbox1", true);

// Retrieve values
const name = annotationStorage.getValue("field1");
const isChecked = annotationStorage.getValue("checkbox1");

// Check for modifications
if (annotationStorage.size > 0) {
  console.log("Form has been modified");
}
```

### Form Field Interactions

Handling form field events and validation.

```javascript { .api }
interface FormFieldEvent {
  /** Field name */
  name: string;
  /** Field value */
  value: any;
  /** Event type */
  type: "focus" | "blur" | "change" | "validate" | "calculate";
  /** Source element */
  source: HTMLElement;
}

interface FormValidationResult {
  /** Whether field is valid */
  isValid: boolean;
  /** Validation message */
  message?: string;
  /** Suggested value */
  value?: any;
}
```

### Accessibility Support

Annotation accessibility features and interfaces.

```javascript { .api }
interface AccessibilityManager {
  /**
   * Enable accessibility for annotation
   * @param annotation - Annotation element
   * @param data - Annotation data
   */
  enable(annotation: HTMLElement, data: any): void;
  
  /**
   * Disable accessibility
   * @param annotation - Annotation element
   */
  disable(annotation: HTMLElement): void;
  
  /**
   * Move focus to annotation
   * @param annotation - Target annotation
   */
  focusAnnotation(annotation: HTMLElement): void;
}
```

**Usage Examples:**

```javascript
// Complete annotation layer setup with form handling
class InteractiveAnnotationLayer {
  constructor(page, container, viewport) {
    this.page = page;
    this.container = container;
    this.viewport = viewport;
    this.annotationStorage = new AnnotationStorage();
    this.linkService = new SimpleLinkService();
  }
  
  async render() {
    const annotations = await this.page.getAnnotations({
      intent: "display"
    });
    
    AnnotationLayer.render({
      viewport: this.viewport,
      div: this.container,
      annotations: annotations,
      page: this.page,
      linkService: this.linkService,
      annotationStorage: this.annotationStorage,
      renderForms: true,
      enableScripting: false
    });
    
    // Handle form field changes
    this.container.addEventListener('change', (event) => {
      if (event.target.dataset.annotationId) {
        const key = event.target.dataset.annotationId;
        const value = this.getFieldValue(event.target);
        this.annotationStorage.setValue(key, value);
      }
    });
  }
  
  getFieldValue(element) {
    switch (element.type) {
      case 'checkbox':
      case 'radio':
        return element.checked;
      case 'select-one':
        return element.selectedIndex;
      case 'select-multiple':
        return Array.from(element.selectedOptions).map(opt => opt.value);
      default:
        return element.value;
    }
  }
  
  getFormData() {
    const formData = {};
    for (const [key, value] of this.annotationStorage.getAll()) {
      formData[key] = value;
    }
    return formData;
  }
}

// Simple link service implementation
class SimpleLinkService {
  constructor() {
    this.page = 1;
    this.rotation = 0;
    this.scale = 1.0;
  }
  
  goToPage(pageNumber) {
    this.page = pageNumber;
    // Implement page navigation
  }
  
  goToDestination(dest) {
    // Handle PDF destinations
    console.log("Navigate to destination:", dest);
  }
  
  getDestinationHash(dest) {
    return `#page=${dest[0]?.num || 1}`;
  }
  
  getAnchorUrl(anchor) {
    return `#${anchor}`;
  }
  
  executeNamedAction(action) {
    switch (action) {
      case "NextPage":
        this.goToPage(this.page + 1);
        break;
      case "PrevPage":
        this.goToPage(this.page - 1);
        break;
      case "FirstPage":
        this.goToPage(1);
        break;
      case "LastPage":
        // Navigate to last page
        break;
    }
  }
}
```

### CSS Styling

Required CSS for proper annotation display:

```css
.annotationLayer {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.annotationLayer section {
  position: absolute;
  text-align: initial;
}

.annotationLayer .buttonWidgetAnnotation.checkBox input,
.annotationLayer .buttonWidgetAnnotation.radioButton input {
  width: 100%;
  height: 100%;
}

.annotationLayer .textWidgetAnnotation input,
.annotationLayer .textWidgetAnnotation textarea,
.annotationLayer .choiceWidgetAnnotation select {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font: inherit;
}

.annotationLayer .linkAnnotation a {
  position: absolute;
  font-size: 1em;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.annotationLayer .linkAnnotation a:hover {
  opacity: 0.2;
  background: rgba(255, 211, 0, 1);
  box-shadow: 0 2px 10px rgba(255, 211, 0, 1);
}
```