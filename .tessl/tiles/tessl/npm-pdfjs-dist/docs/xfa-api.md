# XFA API

XML Forms Architecture (XFA) support for dynamic PDF forms and interactive content. XFA forms provide rich, dynamic form experiences with complex layouts and data binding.

## Capabilities

### XFA Layer Rendering

Renders XFA forms as interactive HTML elements, enabling complex form interactions and dynamic content updates.

```javascript { .api }
class XfaLayer {
  /**
   * Render XFA form content
   * @param parameters - XFA layer parameters
   * @returns XFA layer result
   */
  static render(parameters: XfaLayerParameters): XfaLayerResult;
  
  /**
   * Update existing XFA layer
   * @param parameters - XFA layer parameters
   */
  static update(parameters: XfaLayerParameters): void;
  
  /**
   * Set up XFA layer container
   * @param div - Container element
   * @param parameters - Setup parameters
   */
  static setupStorage(div: HTMLElement, parameters: any): void;
}
```

### XFA Layer Parameters

Configuration for rendering XFA forms.

```javascript { .api }
interface XfaLayerParameters {
  /** Page viewport for positioning */
  viewport: PageViewport;
  /** Container element for XFA content */
  div: HTMLElement;
  /** XFA HTML content */
  xfaHtml: Element;
  /** Annotation storage for form data */
  annotationStorage?: AnnotationStorage;
  /** Link service for navigation */
  linkService: IPDFLinkService;
  /** XFA HTML factory for element creation */
  xfaHtmlFactory: any;
  /** Optional document base URL */
  docBaseUrl?: string;
  /** Page index */
  pageIndex?: number;
}

interface XfaLayerResult {
  /** Root XFA element */
  element: HTMLElement;
  /** Child elements */
  children: HTMLElement[];
  /** Intent of the rendering */
  intent: string;
}
```

**Usage Examples:**

```javascript
import { XfaLayer } from "pdfjs-dist";

// Check if page has XFA content
const xfaHtml = await page.getXfa();

if (xfaHtml) {
  // Create XFA layer container
  const xfaDiv = document.createElement("div");
  xfaDiv.className = "xfaLayer";
  document.body.appendChild(xfaDiv);
  
  // Render XFA form
  const xfaResult = XfaLayer.render({
    viewport: viewport,
    div: xfaDiv,
    xfaHtml: xfaHtml,
    annotationStorage: annotationStorage,
    linkService: linkService,
    xfaHtmlFactory: new XfaHtmlFactory()
  });
  
  console.log("XFA form rendered with", xfaResult.children.length, "elements");
}
```

### XFA HTML Factory

Factory for creating XFA HTML elements with proper event handling and styling.

```javascript { .api }
interface XfaHtmlFactory {
  /**
   * Create XFA element
   * @param data - Element data
   * @returns HTML element
   */
  createElement(data: XfaElementData): HTMLElement;
  
  /**
   * Create XFA text node
   * @param text - Text content
   * @returns Text node
   */
  createTextNode(text: string): Text;
  
  /**
   * Create XFA document fragment
   * @returns Document fragment
   */
  createDocumentFragment(): DocumentFragment;
}

interface XfaElementData {
  /** Element tag name */
  name: string;
  /** Element attributes */
  attributes?: { [key: string]: string };
  /** Child elements */
  children?: XfaElementData[];
  /** Text content */
  value?: string;
  /** Element namespace */
  namespace?: string;
}
```

### XFA Form Controls

Interfaces for different XFA form control types.

```javascript { .api }
interface XfaTextField {
  /** Field name */
  name: string;
  /** Field value */
  value: string;
  /** Whether field is required */
  required: boolean;
  /** Whether field is read-only */
  readOnly: boolean;
  /** Maximum length */
  maxLength?: number;
  /** Input pattern */
  pattern?: string;
  /** Placeholder text */
  placeholder?: string;
  
  /**
   * Set field value
   * @param value - New value
   */
  setValue(value: string): void;
  
  /**
   * Validate field value
   * @returns Validation result
   */
  validate(): boolean;
  
  /**
   * Focus the field
   */
  focus(): void;
}

interface XfaCheckBox {
  /** Field name */
  name: string;
  /** Whether checked */
  checked: boolean;
  /** Whether field is required */
  required: boolean;
  /** Whether field is read-only */
  readOnly: boolean;
  
  /**
   * Set checked state
   * @param checked - Whether to check
   */
  setChecked(checked: boolean): void;
  
  /**
   * Toggle checked state
   */
  toggle(): void;
}

interface XfaDropdownList {
  /** Field name */
  name: string;
  /** Selected value */
  value: string;
  /** Available options */
  options: { value: string; text: string }[];
  /** Whether field is required */
  required: boolean;
  /** Whether field is read-only */
  readOnly: boolean;
  
  /**
   * Set selected value
   * @param value - Value to select
   */
  setValue(value: string): void;
  
  /**
   * Add option
   * @param option - Option to add
   */
  addOption(option: { value: string; text: string }): void;
  
  /**
   * Remove option
   * @param value - Value of option to remove
   */
  removeOption(value: string): void;
}
```

### XFA Data Binding

Interfaces for XFA data binding and dynamic content.

```javascript { .api }
interface XfaDataConnection {
  /** Connection name */
  name: string;
  /** Data source URL */
  dataSource: string;
  /** Connection type */
  type: "xml" | "json" | "database";
  
  /**
   * Load data from source
   * @returns Promise resolving to data
   */
  loadData(): Promise<any>;
  
  /**
   * Save data to source
   * @param data - Data to save
   * @returns Promise resolving when complete
   */
  saveData(data: any): Promise<void>;
  
  /**
   * Bind data to form
   * @param formData - Form data object
   */
  bindData(formData: any): void;
}

interface XfaCalculation {
  /** Expression to evaluate */
  expression: string;
  /** Target field name */
  target: string;
  /** Dependencies */
  dependencies: string[];
  
  /**
   * Execute calculation
   * @param context - Calculation context
   * @returns Calculated value
   */
  execute(context: any): any;
  
  /**
   * Check if calculation is valid
   * @returns Whether valid
   */
  isValid(): boolean;
}
```

### XFA Events

Event handling for XFA form interactions.

```javascript { .api }
interface XfaEvent {
  /** Event type */
  type: "initialize" | "calculate" | "validate" | "full" | "save" | "print" | "change" | "exit" | "click";
  /** Source element */
  source: HTMLElement;
  /** Event data */
  data: any;
  /** Whether event can be cancelled */
  cancelable: boolean;
  
  /**
   * Cancel event
   */
  cancel(): void;
  
  /**
   * Get field value
   * @param fieldName - Name of field
   * @returns Field value
   */
  getFieldValue(fieldName: string): any;
  
  /**
   * Set field value
   * @param fieldName - Name of field
   * @param value - Value to set
   */
  setFieldValue(fieldName: string, value: any): void;
}

interface XfaEventHandler {
  /**
   * Handle XFA event
   * @param event - XFA event
   */
  handleEvent(event: XfaEvent): void;
  
  /**
   * Register event listener
   * @param eventType - Type of event
   * @param handler - Event handler function
   */
  addEventListener(eventType: string, handler: (event: XfaEvent) => void): void;
  
  /**
   * Remove event listener
   * @param eventType - Type of event
   * @param handler - Event handler function
   */
  removeEventListener(eventType: string, handler: (event: XfaEvent) => void): void;
}
```

### XFA Utilities

Helper functions for XFA form operations.

```javascript { .api }
/**
 * Get XFA page viewport with proper scaling
 * @param xfaPage - XFA page element
 * @param viewport - Base viewport
 * @returns XFA-adjusted viewport
 */
function getXfaPageViewport(xfaPage: Element, viewport: PageViewport): PageViewport;

/**
 * Extract XFA form data
 * @param xfaElement - Root XFA element
 * @returns Form data object
 */
function extractXfaData(xfaElement: HTMLElement): { [key: string]: any };

/**
 * Populate XFA form with data
 * @param xfaElement - Root XFA element
 * @param data - Data to populate
 */
function populateXfaForm(xfaElement: HTMLElement, data: { [key: string]: any }): void;

/**
 * Validate XFA form
 * @param xfaElement - Root XFA element
 * @returns Validation results
 */
function validateXfaForm(xfaElement: HTMLElement): { isValid: boolean; errors: string[] };
```

**Usage Examples:**

```javascript
// Complete XFA form handling
class XfaFormHandler {
  constructor(container, annotationStorage, linkService) {
    this.container = container;
    this.annotationStorage = annotationStorage;
    this.linkService = linkService;
    this.xfaElements = new Map();
    this.eventHandlers = new Map();
  }
  
  async renderXfaPage(page, viewport) {
    const xfaHtml = await page.getXfa();
    
    if (!xfaHtml) {
      return null; // No XFA content
    }
    
    const xfaDiv = document.createElement("div");
    xfaDiv.className = "xfaLayer";
    this.container.appendChild(xfaDiv);
    
    const xfaResult = XfaLayer.render({
      viewport: viewport,
      div: xfaDiv,
      xfaHtml: xfaHtml,
      annotationStorage: this.annotationStorage,
      linkService: this.linkService,
      xfaHtmlFactory: new XfaHtmlFactory()
    });
    
    this.setupXfaEventHandlers(xfaResult.element);
    this.xfaElements.set(page.pageNumber, xfaResult.element);
    
    return xfaResult;
  }
  
  setupXfaEventHandlers(xfaElement) {
    // Handle form field changes
    xfaElement.addEventListener('change', (event) => {
      const field = event.target;
      if (field.name) {
        this.annotationStorage.setValue(field.name, this.getFieldValue(field));
        this.triggerCalculations();
      }
    });
    
    // Handle validations
    xfaElement.addEventListener('blur', (event) => {
      const field = event.target;
      if (field.name && field.required && !field.value) {
        this.showValidationError(field, "This field is required");
      }
    });
  }
  
  getFieldValue(field) {
    switch (field.type) {
      case 'checkbox':
        return field.checked;
      case 'radio':
        return field.checked ? field.value : null;
      case 'select-one':
        return field.value;
      case 'select-multiple':
        return Array.from(field.selectedOptions).map(opt => opt.value);
      default:
        return field.value;
    }
  }
  
  triggerCalculations() {
    // Find all calculated fields and update them
    this.xfaElements.forEach(element => {
      const calculatedFields = element.querySelectorAll('[data-calculate]');
      calculatedFields.forEach(field => {
        const expression = field.dataset.calculate;
        try {
          const result = this.evaluateExpression(expression);
          field.value = result;
          this.annotationStorage.setValue(field.name, result);
        } catch (error) {
          console.warn('Calculation error:', error);
        }
      });
    });
  }
  
  evaluateExpression(expression) {
    // Simple expression evaluator (implement based on XFA spec)
    // This would need a full XFA expression parser in practice
    return expression;
  }
  
  showValidationError(field, message) {
    // Show validation error UI
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'validation-error';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
    
    setTimeout(() => {
      field.classList.remove('error');
      errorDiv.remove();
    }, 3000);
  }
  
  getFormData() {
    const formData = {};
    this.xfaElements.forEach(element => {
      const fields = element.querySelectorAll('input, select, textarea');
      fields.forEach(field => {
        if (field.name) {
          formData[field.name] = this.getFieldValue(field);
        }
      });
    });
    return formData;
  }
  
  setFormData(data) {
    this.xfaElements.forEach(element => {
      Object.entries(data).forEach(([name, value]) => {
        const field = element.querySelector(`[name="${name}"]`);
        if (field) {
          this.setFieldValue(field, value);
        }
      });
    });
  }
  
  setFieldValue(field, value) {
    switch (field.type) {
      case 'checkbox':
      case 'radio':
        field.checked = Boolean(value);
        break;
      case 'select-multiple':
        Array.from(field.options).forEach(option => {
          option.selected = Array.isArray(value) && value.includes(option.value);
        });
        break;
      default:
        field.value = value || '';
    }
    
    // Trigger change event
    field.dispatchEvent(new Event('change', { bubbles: true }));
  }
}
```

### CSS Styling

Required CSS for XFA form display:

```css
.xfaLayer {
  position: absolute;
  left: 0;
  top: 0;
  transform-origin: 0% 0%;
  line-height: 1.2;
}

.xfaLayer * {
  color: inherit;
  font: inherit;
  font-style: inherit;
  font-weight: inherit;
  font-kerning: inherit;
  letter-spacing: -0.01px;
}

.xfaLayer input,
.xfaLayer textarea,
.xfaLayer select {
  background-color: rgba(0, 54, 255, 0.13);
  border: 1px solid transparent;
  border-radius: 2px;
  padding: 2px;
}

.xfaLayer input:focus,
.xfaLayer textarea:focus,
.xfaLayer select:focus {
  background-color: rgba(0, 54, 255, 0.13);
  border: 1px solid rgba(0, 54, 255, 1);
  outline: none;
}

.xfaLayer .validation-error {
  color: red;
  font-size: 12px;
  margin-top: 2px;
}

.xfaLayer input.error {
  border-color: red;
  background-color: rgba(255, 0, 0, 0.1);
}
```