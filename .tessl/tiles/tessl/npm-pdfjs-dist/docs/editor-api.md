# Editor API

Interactive annotation creation and editing tools including freetext, highlighting, stamps, and ink annotations. Provides a complete framework for creating and modifying PDF annotations.

## Capabilities

### Annotation Editor Layer

Main layer for interactive annotation editing, supporting multiple editor types and user interactions.

```javascript { .api }
class AnnotationEditorLayer {
  /**
   * Constructor for annotation editor layer
   * @param options - Editor layer options
   */
  constructor(options: AnnotationEditorLayerOptions);
  
  /**
   * Render the editor layer
   * @param parameters - Render parameters
   */
  render(parameters: AnnotationEditorLayerParameters): void;
  
  /**
   * Update the editor layer
   * @param parameters - Update parameters
   */
  update(parameters: AnnotationEditorLayerParameters): void;
  
  /**
   * Update editor mode
   * @param mode - Editor mode (AnnotationEditorType)
   */
  updateMode(mode: number): void;
  
  /**
   * Add ink editor if needed
   * @param isCommitting - Whether committing current editor
   */
  addInkEditorIfNeeded(isCommitting: boolean): void;
  
  /**
   * Add stamp editor if needed
   */
  addStampEditorIfNeeded(): void;
  
  /**
   * Destroy the editor layer
   */
  destroy(): void;
  
  /**
   * Set editing state
   * @param isEditing - Whether currently editing
   */
  setEditingState(isEditing: boolean): void;
  
  /**
   * Enable click events
   * @param enable - Whether to enable
   */
  enableClick(enable: boolean): void;
  
  /**
   * Add editor at coordinates
   * @param x - X coordinate
   * @param y - Y coordinate
   */
  addEditor(x: number, y: number): void;
}
```

### Annotation Editor Layer Parameters

Configuration for editor layer rendering and updates.

```javascript { .api }
interface AnnotationEditorLayerParameters {
  /** Annotation storage for persistence */
  annotationStorage?: AnnotationStorage;
  /** Page div element */
  div: HTMLElement;
  /** Page proxy */
  page: PDFPageProxy;
  /** Page viewport */
  viewport: PageViewport;
  /** UI manager for editor controls */
  uiManager: AnnotationEditorUIManager;
  /** Accessibility manager */
  accessibilityManager?: any;
  /** Additional HTML attributes */
  additionalAttributes?: Map<string, Map<string, any>>;
}

interface AnnotationEditorLayerOptions {
  /** UI manager instance */
  uiManager: AnnotationEditorUIManager;
  /** Page index */
  pageIndex: number;
  /** Page div element */
  div: HTMLElement;
  /** Accessibility manager */
  accessibilityManager?: any;
}
```

**Usage Examples:**

```javascript
import { AnnotationEditorLayer, AnnotationEditorUIManager } from "pdfjs-dist";

// Create UI manager
const uiManager = new AnnotationEditorUIManager();

// Create editor layer
const editorLayer = new AnnotationEditorLayer({
  uiManager: uiManager,
  pageIndex: 0,
  div: pageDiv
});

// Render editor layer
editorLayer.render({
  annotationStorage: annotationStorage,
  div: pageDiv,
  page: page,
  viewport: viewport,
  uiManager: uiManager
});

// Enable freetext editing mode
editorLayer.updateMode(AnnotationEditorType.FREETEXT);
```

### Annotation Editor UI Manager

Manages annotation editing UI, tool selection, and editor lifecycle.

```javascript { .api }
class AnnotationEditorUIManager {
  constructor();
  
  /**
   * Update UI for editor
   * @param editor - Editor instance
   */
  updateUI(editor: any): void;
  
  /**
   * Update editor mode
   * @param mode - Editor mode
   */
  updateMode(mode: number): void;
  
  /**
   * Get current editor mode
   * @returns Current mode
   */
  getMode(): number;
  
  /**
   * Set editor mode
   * @param mode - Editor mode
   * @param editId - Optional edit ID
   */
  setEditingState(mode: number, editId?: string): void;
  
  /**
   * Add editor to manager
   * @param pageIndex - Page index
   * @param editor - Editor instance
   */
  addEditor(pageIndex: number, editor: any): void;
  
  /**
   * Remove editor from manager
   * @param editor - Editor instance
   */
  removeEditor(editor: any): void;
  
  /**
   * Get editor by ID
   * @param id - Editor ID
   * @returns Editor instance
   */
  getEditor(id: string): any;
  
  /**
   * Get all editors on page
   * @param pageIndex - Page index
   * @returns Array of editors
   */
  getEditors(pageIndex: number): any[];
  
  /**
   * Focus editor
   * @param editor - Editor to focus
   */
  focusEditor(editor: any): void;
  
  /**
   * Add commands to undo stack
   * @param commands - Commands to add
   */
  addCommands(commands: any[]): void;
  
  /**
   * Destroy the UI manager
   */
  destroy(): void;
}
```

### Editor Types and Parameters

Configuration for different annotation editor types.

```javascript { .api }
enum AnnotationEditorType {
  DISABLE = -1,
  NONE = 0,
  FREETEXT = 3,
  HIGHLIGHT = 9,
  STAMP = 13,
  INK = 15
}

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
  HIGHLIGHT_DEFAULT_COLOR = 32
}
```

### Color Picker

Color selection component for annotation editors.

```javascript { .api }
class ColorPicker {
  /**
   * Constructor for color picker
   * @param options - Color picker options
   */
  constructor(options: ColorPickerOptions);
  
  /**
   * Render main dropdown
   * @param buttons - Button configurations
   * @param className - CSS class name
   */
  renderMainDropdown(buttons: any[], className: string): HTMLElement;
  
  /**
   * Hide dropdown
   */
  hideDropdown(): void;
  
  /**
   * Show dropdown
   */
  showDropdown(): void;
  
  /**
   * Set color
   * @param color - Color value
   */
  setColor(color: string): void;
  
  /**
   * Get current color
   * @returns Current color
   */
  getColor(): string;
  
  /**
   * Destroy color picker
   */
  destroy(): void;
}

interface ColorPickerOptions {
  /** UI manager instance */
  uiManager: AnnotationEditorUIManager;
  /** Default colors */
  defaultColors?: string[];
  /** Current color */
  color?: string;
}
```

**Usage Examples:**

```javascript
// Create color picker for annotation editing
const colorPicker = new ColorPicker({
  uiManager: uiManager,
  defaultColors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00"],
  color: "#FF0000"
});

// Handle color changes
colorPicker.addEventListener("colorchange", (event) => {
  const newColor = event.detail.color;
  // Apply color to current editor
  uiManager.updateUI({ color: newColor });
});
```

### Freetext Editor

Text annotation editor for adding text annotations to PDFs.

```javascript { .api }
interface FreetextEditor {
  /** Editor type */
  editorType: number;
  /** Text content */
  content: string;
  /** Font size */
  fontSize: number;
  /** Text color */
  color: string;
  /** Font family */
  fontFamily: string;
  
  /**
   * Set font size
   * @param size - Font size in points
   */
  setFontSize(size: number): void;
  
  /**
   * Set text color
   * @param color - Color value
   */
  setColor(color: string): void;
  
  /**
   * Set font family
   * @param family - Font family name
   */
  setFontFamily(family: string): void;
  
  /**
   * Commit text changes
   */
  commit(): void;
  
  /**
   * Cancel editing
   */
  cancel(): void;
}
```

### Ink Editor

Drawing annotation editor for creating freehand drawings and signatures.

```javascript { .api }
interface InkEditor {
  /** Editor type */
  editorType: number;
  /** Stroke paths */
  paths: number[][];
  /** Stroke color */
  color: string;
  /** Stroke thickness */
  thickness: number;
  /** Stroke opacity */
  opacity: number;
  
  /**
   * Set stroke color
   * @param color - Color value
   */
  setColor(color: string): void;
  
  /**
   * Set stroke thickness
   * @param thickness - Thickness in pixels
   */
  setThickness(thickness: number): void;
  
  /**
   * Set stroke opacity
   * @param opacity - Opacity (0-1)
   */
  setOpacity(opacity: number): void;
  
  /**
   * Add stroke path
   * @param path - Array of coordinates
   */
  addPath(path: number[]): void;
  
  /**
   * Clear all paths
   */
  clear(): void;
  
  /**
   * Commit drawing
   */
  commit(): void;
}
```

### Stamp Editor

Stamp annotation editor for adding predefined stamps and images.

```javascript { .api }
interface StampEditor {
  /** Editor type */
  editorType: number;
  /** Stamp image */
  bitmap: ImageBitmap;
  /** Stamp dimensions */
  dimensions: { width: number; height: number };
  
  /**
   * Set stamp image
   * @param bitmap - Image bitmap
   */
  setBitmap(bitmap: ImageBitmap): void;
  
  /**
   * Set stamp from file
   * @param file - Image file
   */
  setFromFile(file: File): Promise<void>;
  
  /**
   * Resize stamp
   * @param width - New width
   * @param height - New height
   */
  resize(width: number, height: number): void;
  
  /**
   * Commit stamp placement
   */
  commit(): void;
}
```

### Highlight Editor

Text highlighting editor for marking and annotating text selections.

```javascript { .api }
interface HighlightEditor {
  /** Editor type */
  editorType: number;
  /** Highlight color */
  color: string;
  /** Selected text */
  text: string;
  /** Text rectangles */
  quadPoints: number[];
  
  /**
   * Set highlight color
   * @param color - Color value
   */
  setColor(color: string): void;
  
  /**
   * Set text selection
   * @param quadPoints - Selection rectangles
   */
  setSelection(quadPoints: number[]): void;
  
  /**
   * Commit highlight
   */
  commit(): void;
  
  /**
   * Remove highlight
   */
  remove(): void;
}
```

### Drawing Utilities

Helper classes and functions for drawing operations.

```javascript { .api }
class HighlightOutliner {
  /**
   * Create outline for text highlighting
   * @param boxes - Text boxes to outline
   * @param borderWidth - Border width
   * @param innerMargin - Inner margin
   * @param isLTR - Left-to-right text direction
   * @returns SVG path string
   */
  static createOutline(
    boxes: number[][],
    borderWidth: number,
    innerMargin: number,
    isLTR: boolean
  ): string;
}

class SignatureExtractor {
  /**
   * Extract signature paths from drawing input
   * @param paths - Input drawing paths
   * @param box - Bounding box
   * @returns Extracted signature data
   */
  static extract(paths: number[][], box: number[]): any;
}
```

**Usage Examples:**

```javascript
// Complete annotation editor setup
class PDFAnnotationEditor {
  constructor(container, annotationStorage) {
    this.container = container;
    this.annotationStorage = annotationStorage;
    this.uiManager = new AnnotationEditorUIManager();
    this.editorLayers = new Map();
    this.currentMode = AnnotationEditorType.NONE;
  }
  
  setupPage(pageIndex, page, viewport) {
    const pageDiv = document.createElement("div");
    pageDiv.className = "page";
    this.container.appendChild(pageDiv);
    
    const editorLayer = new AnnotationEditorLayer({
      uiManager: this.uiManager,
      pageIndex: pageIndex,
      div: pageDiv
    });
    
    editorLayer.render({
      annotationStorage: this.annotationStorage,
      div: pageDiv,
      page: page,
      viewport: viewport,
      uiManager: this.uiManager
    });
    
    this.editorLayers.set(pageIndex, editorLayer);
  }
  
  setMode(mode) {
    this.currentMode = mode;
    this.uiManager.updateMode(mode);
    
    // Update all editor layers
    for (const editorLayer of this.editorLayers.values()) {
      editorLayer.updateMode(mode);
    }
  }
  
  enableTextEditing() {
    this.setMode(AnnotationEditorType.FREETEXT);
  }
  
  enableInkDrawing() {
    this.setMode(AnnotationEditorType.INK);
  }
  
  enableHighlighting() {
    this.setMode(AnnotationEditorType.HIGHLIGHT);
  }
  
  enableStamps() {
    this.setMode(AnnotationEditorType.STAMP);
  }
  
  disableEditing() {
    this.setMode(AnnotationEditorType.DISABLE);
  }
  
  saveAnnotations() {
    return this.annotationStorage.serializable;
  }
  
  loadAnnotations(data) {
    // Load annotation data into storage
    Object.entries(data).forEach(([key, value]) => {
      this.annotationStorage.setValue(key, value);
    });
  }
}

// Usage example
const editor = new PDFAnnotationEditor(container, annotationStorage);

// Set up pages
pages.forEach((page, index) => {
  const viewport = page.getViewport({ scale: 1.0 });
  editor.setupPage(index, page, viewport);
});

// Enable different editing modes
document.getElementById("text-btn").onclick = () => editor.enableTextEditing();
document.getElementById("ink-btn").onclick = () => editor.enableInkDrawing();
document.getElementById("highlight-btn").onclick = () => editor.enableHighlighting();
document.getElementById("stamp-btn").onclick = () => editor.enableStamps();
document.getElementById("disable-btn").onclick = () => editor.disableEditing();
```