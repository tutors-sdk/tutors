# Text Layer API

Text layer functionality for extracting, searching, and enabling text selection within PDF documents. The text layer renders transparent, selectable text elements over the PDF canvas.

## Capabilities

### Text Layer Rendering

Creates a selectable text layer that overlays the PDF page canvas, enabling text selection, copying, and searching.

```javascript { .api }
class TextLayer {
  /**
   * Constructor for text layer
   * @param parameters - Text layer construction parameters
   */
  constructor(parameters: TextLayerConstructorParameters);
  
  /**
   * Render text layer over PDF page
   * @returns Promise that resolves when rendering is complete
   */
  render(): Promise<void>;
  
  /**
   * Update existing text layer
   * @param parameters - Text layer update parameters
   */
  update(parameters: TextLayerUpdateParameters): void;
  
  /**
   * Cancel text layer rendering
   */
  cancel(): void;
  
  /** HTML elements that correspond to the text items */
  get textDivs(): HTMLElement[];
}
```

### Text Layer Constructor Parameters

Configuration for creating a text layer instance.

```javascript { .api }
interface TextLayerConstructorParameters {
  /** Text content source (from page.getTextContent()) */
  textContentSource: ReadableStream | Promise<TextContent> | TextContent;
  /** Container element for text layer */
  container: HTMLElement;
  /** Page viewport for positioning */
  viewport: PageViewport;
}
```

**Usage Examples:**

```javascript
import { TextLayer } from "pdfjs-dist";

// Get text content from page
const textContent = await page.getTextContent();

// Create text layer container
const textLayerDiv = document.createElement("div");
textLayerDiv.className = "textLayer";
document.body.appendChild(textLayerDiv);

// Create and render text layer
const textLayer = new TextLayer({
  textContentSource: textContent,
  container: textLayerDiv,
  viewport: viewport
});

await textLayer.render();
console.log("Text layer rendered");
```


### Text Layer Update Parameters

Configuration for updating an existing text layer.

```javascript { .api }
interface TextLayerUpdateParameters {
  /** New viewport for repositioning */
  viewport: PageViewport;
  /** Callback invoked before the text layer is updated */
  onBefore?: () => void;
}
```

**Usage Examples:**

```javascript
// Update text layer when viewport changes
const newViewport = page.getViewport({ scale: 2.0 });

textLayer.update({
  viewport: newViewport,
  onBefore: () => console.log("Updating text layer")
});
```


### Text Content Interfaces

Data structures for text content and positioning.

```javascript { .api }
interface TextContent {
  /** Array of text items on the page */
  items: TextItem[];
  /** Font and style information */
  styles: { [fontName: string]: TextStyle };
  /** Page language */
  lang?: string;
}

interface TextItem {
  /** Text string content */
  str: string;
  /** Text direction (left-to-right, right-to-left, top-to-bottom) */
  dir: "ltr" | "rtl" | "ttb";
  /** Text width in user space units */
  width: number;
  /** Text height in user space units */
  height: number;
  /** Transformation matrix [a, b, c, d, e, f] */
  transform: number[];
  /** Font name reference */
  fontName: string;
  /** Whether text has end-of-line marker */
  hasEOL?: boolean;
}

interface TextStyle {
  /** Font ascent */
  ascent: number;
  /** Font descent */
  descent: number;
  /** Whether font is vertical */
  vertical?: boolean;
  /** CSS font family */
  fontFamily: string;
}
```

### Text Layer Utilities

Helper functions for text layer management.

```javascript { .api }
/**
 * Get text layer builder for custom text layer implementation
 * @param options - Builder options
 * @returns Text layer builder instance
 */
function getTextLayerBuilder(options: any): any;

/**
 * Normalize Unicode text for better searching
 * @param text - Input text
 * @returns Normalized text
 */
function normalizeUnicode(text: string): string;
```

**Usage Examples:**

```javascript
// Extract plain text from text content
function extractPlainText(textContent) {
  return textContent.items
    .map(item => item.str + (item.hasEOL ? '\n' : ''))
    .join('');
}

// Find text positions for highlighting
function findTextPositions(textContent, searchTerm) {
  const positions = [];
  let currentIndex = 0;
  
  textContent.items.forEach((item, index) => {
    if (item.str.toLowerCase().includes(searchTerm.toLowerCase())) {
      positions.push({
        index: index,
        item: item,
        coordinates: {
          x: item.transform[4],
          y: item.transform[5],
          width: item.width,
          height: item.height
        }
      });
    }
  });
  
  return positions;
}

// Create searchable text layer with highlighting
async function createSearchableTextLayer(page, container, viewport) {
  const textContent = await page.getTextContent({
    normalizeWhitespace: true
  });
  
  const textLayer = new TextLayer({
    textContentSource: textContent,
    container: container,
    viewport: viewport
  });
  
  await textLayer.render();
  
  // Enable text search
  return {
    textContent: textContent,
    search: (term) => findTextPositions(textContent, term),
    extractText: () => extractPlainText(textContent)
  };
}
```

### CSS Styling

The text layer requires CSS styling for proper positioning and appearance:

```css
.textLayer {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  opacity: 0.2;
  line-height: 1.0;
}

.textLayer > span {
  color: transparent;
  position: absolute;
  white-space: pre;
  cursor: text;
  transform-origin: 0% 0%;
}

.textLayer .highlight {
  background-color: rgba(180, 0, 170, 0.2);
}

.textLayer .highlight.appended {
  background-color: rgba(0, 100, 0, 0.2);
}

.textLayer .highlight.begin {
  background-color: rgba(255, 255, 0, 0.2);
}

.textLayer .highlight.end {
  background-color: rgba(255, 0, 0, 0.2);
}

.textLayer .highlight.middle {
  background-color: rgba(255, 255, 0, 0.2);
}

.textLayer .highlight.selected {
  background-color: rgba(0, 100, 0, 0.2);
}
```

### Advanced Text Layer Features

```javascript { .api }
/**
 * Enhanced text layer with search and highlight capabilities
 */
interface EnhancedTextLayer {
  /** Highlight text matching search term */
  highlightText(searchTerm: string, className?: string): void;
  
  /** Clear all highlights */
  clearHighlights(): void;
  
  /** Get text in selection */
  getSelectedText(): string;
  
  /** Get all text content as string */
  getAllText(): string;
  
  /** Find and scroll to text */
  findAndScrollTo(searchTerm: string): boolean;
}
```

**Usage Examples:**

```javascript
// Complete text layer implementation with search
class SearchableTextLayer {
  constructor(page, container, viewport) {
    this.page = page;
    this.container = container;
    this.viewport = viewport;
    this.textContent = null;
    this.textDivs = [];
  }
  
  async render() {
    this.textContent = await this.page.getTextContent({
      normalizeWhitespace: true
    });
    
    this.textLayer = new TextLayer({
      textContentSource: this.textContent,
      container: this.container,
      viewport: this.viewport
    });
    
    await this.textLayer.render();
    this.textDivs = this.textLayer.textDivs;
  }
  
  search(term) {
    this.clearHighlights();
    
    const normalizedTerm = term.toLowerCase();
    let matches = [];
    
    this.textContent.items.forEach((item, index) => {
      const normalizedText = item.str.toLowerCase();
      if (normalizedText.includes(normalizedTerm)) {
        matches.push(index);
        if (this.textDivs[index]) {
          this.textDivs[index].classList.add('highlight');
        }
      }
    });
    
    return matches;
  }
  
  clearHighlights() {
    this.textDivs.forEach(div => {
      div.classList.remove('highlight');
    });
  }
}
```