# Svelte Inspector Plugin

Development-time debugging tool that provides interactive inspection of Svelte components in the browser. The inspector allows developers to visually select DOM elements and jump directly to the corresponding Svelte component source code in their editor.

## Capabilities

### Inspector Plugin Factory

Creates a standalone Vite plugin for Svelte component inspection during development.

```typescript { .api }
/**
 * Creates a Vite plugin for Svelte component inspection
 * @param options - Optional inspector configuration options
 * @returns Vite plugin for development-time component inspection
 */
function svelteInspector(options?: Partial<Options>): Plugin;
```

**Usage Examples:**

```javascript
// Standalone usage (independent of main svelte plugin)
import { defineConfig } from 'vite';
import { svelteInspector } from '@sveltejs/vite-plugin-svelte-inspector';

export default defineConfig({
  plugins: [
    // Other plugins...
    svelteInspector({
      toggleKeyCombo: 'control-shift',
      holdMode: true,
      showToggleButton: 'always'
    })
  ]
});

// Basic usage with defaults
export default defineConfig({
  plugins: [
    svelteInspector() // Uses default options
  ]
});

// Integration with main svelte plugin
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [
    svelte({
      inspector: {
        toggleKeyCombo: 'alt-x',
        holdMode: false,
        showToggleButton: 'active'
      }
    })
  ]
});
```

## Inspector Options

### Toggle and Navigation Options

Configure how users activate and navigate the inspector.

```typescript { .api }
interface ToggleOptions {
  /** 
   * Key combination to toggle inspector
   * @default 'alt-x'
   * 
   * Format: any number of modifiers (control, shift, alt, meta) 
   * followed by zero or one regular key, separated by -
   * Examples: 'control-shift', 'control-o', 'control-alt-s', 'meta-x'
   */
  toggleKeyCombo?: string;

  /** 
   * Key to open the editor for the currently selected DOM node
   * @default 'Enter'
   */
  openKey?: string;

  /** 
   * Keys to close the inspector
   * @default ['Backspace', 'Escape']
   */
  escapeKeys?: string[];

  /** 
   * Inspector automatically disables when releasing toggleKeyCombo after holding
   * @default true
   */
  holdMode?: boolean;
}
```

**Usage Examples:**

```javascript
svelteInspector({
  // Modifier-only combination (recommended to avoid conflicts)
  toggleKeyCombo: 'control-shift',
  
  // Custom navigation keys
  openKey: 'Space',
  escapeKeys: ['Escape', 'q'],
  
  // Disable hold mode for persistent inspector
  holdMode: false
});

// Accessibility-friendly configuration
svelteInspector({
  toggleKeyCombo: 'control-alt-i',
  navKeys: {
    parent: 'w',    // Instead of ArrowUp
    prev: 'a',      // Instead of ArrowLeft  
    child: 's',     // Instead of ArrowDown
    next: 'd'       // Instead of ArrowRight
  }
});
```

### Keyboard Navigation Options

Define keys for selecting elements via keyboard navigation.

```typescript { .api }
interface NavigationOptions {
  /** 
   * Keys to select elements with via keyboard
   * @default { parent: 'ArrowUp', child: 'ArrowDown', next: 'ArrowRight', prev: 'ArrowLeft' }
   * 
   * Improves accessibility and helps select elements without hoverable surface area
   */
  navKeys?: {
    /** Select closest parent element */
    parent: string;
    /** Select first child (or grandchild) element */
    child: string;
    /** Select next sibling (or parent if no next sibling) */
    next: string;
    /** Select previous sibling (or parent if no previous sibling) */
    prev: string;
  };
}
```

**Usage Examples:**

```javascript
// Default arrow key navigation
svelteInspector({
  navKeys: {
    parent: 'ArrowUp',
    child: 'ArrowDown', 
    next: 'ArrowRight',
    prev: 'ArrowLeft'
  }
});

// Custom navigation for screen reader users
svelteInspector({
  navKeys: {
    parent: 'w',
    prev: 'a', 
    child: 's',
    next: 'd'
  }
});

// VI-style navigation
svelteInspector({
  navKeys: {
    parent: 'k',    // up
    child: 'j',     // down
    prev: 'h',      // left
    next: 'l'       // right
  }
});
```

### UI Display Options

Control the inspector's visual interface and toggle button behavior.

```typescript { .api }
interface UIOptions {
  /** 
   * When to show the toggle button
   * @default 'active'
   */
  showToggleButton?: 'always' | 'active' | 'never';

  /** 
   * Where to display the toggle button
   * @default 'top-right'
   */
  toggleButtonPos?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

  /** 
   * Inject custom styles when inspector is active
   */
  customStyles?: boolean;
}
```

**Usage Examples:**

```javascript
// Always show toggle button in bottom-left
svelteInspector({
  showToggleButton: 'always',
  toggleButtonPos: 'bottom-left'
});

// Minimal UI - no toggle button
svelteInspector({
  showToggleButton: 'never'
});

// Custom styling enabled
svelteInspector({
  customStyles: true,
  showToggleButton: 'active',
  toggleButtonPos: 'top-left'
});
```

## Complete Options Interface

```typescript { .api }
interface Options {
  /** Key combo to toggle inspector (default: 'alt-x') */
  toggleKeyCombo?: string;
  /** Keyboard navigation keys */
  navKeys?: {
    parent: string;
    child: string;
    next: string;
    prev: string;
  };
  /** Key to open editor for selected node (default: 'Enter') */
  openKey?: string;
  /** Keys to close inspector (default: ['Backspace', 'Escape']) */
  escapeKeys?: string[];
  /** Auto-disable on key release after hold (default: true) */
  holdMode?: boolean;
  /** When to show toggle button (default: 'active') */
  showToggleButton?: 'always' | 'active' | 'never';
  /** Toggle button position (default: 'top-right') */
  toggleButtonPos?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  /** Inject custom styles when active */
  customStyles?: boolean;
  /** Internal options (automatically set, not for user configuration) */
  __internal?: {
    base: string;
  };
}
```

## Usage Patterns

### Environment-Based Configuration

Configure inspector behavior based on development environment.

```javascript
// Environment variable control
const isDev = process.env.NODE_ENV === 'development';
const enableInspector = process.env.SVELTE_INSPECTOR !== 'false';

export default defineConfig({
  plugins: [
    svelte({
      inspector: isDev && enableInspector ? {
        toggleKeyCombo: 'control-shift',
        showToggleButton: 'always'
      } : false
    })
  ]
});

// Conditional inspector loading
export default defineConfig({
  plugins: [
    svelte(),
    ...(isDev ? [svelteInspector()] : [])
  ]
});
```

### Team Development Configuration

Standardize inspector settings across development teams.

```javascript
// shared-config.js
export const inspectorConfig = {
  toggleKeyCombo: 'control-alt-i',
  holdMode: false,
  showToggleButton: 'always',
  toggleButtonPos: 'bottom-right',
  navKeys: {
    parent: 'ArrowUp',
    child: 'ArrowDown',
    next: 'ArrowRight', 
    prev: 'ArrowLeft'
  }
};

// vite.config.js
import { inspectorConfig } from './shared-config.js';

export default defineConfig({
  plugins: [
    svelte({
      inspector: inspectorConfig
    })
  ]
});
```

### Integration with Editor Setup

Configure inspector to work with different code editors.

```javascript
// For VS Code users
svelteInspector({
  toggleKeyCombo: 'control-shift-i',  // Matches VS Code inspector
  openKey: 'F12',                     // Matches VS Code "Go to Definition"
  holdMode: true
});

// For Vim users  
svelteInspector({
  toggleKeyCombo: 'control-alt-i',
  navKeys: {
    parent: 'k',
    child: 'j', 
    prev: 'h',
    next: 'l'
  },
  openKey: 'Enter',
  escapeKeys: ['Escape', 'q']
});
```

## Error Handling and Debugging

The inspector plugin includes comprehensive error handling and debugging capabilities:

- **Environment Detection**: Automatically disables in production builds
- **Conflict Resolution**: Warns about key combination conflicts
- **File System Integration**: Handles editor opening errors gracefully  
- **Browser Compatibility**: Works across modern browsers with fallbacks

Enable debug logging to troubleshoot inspector issues:

```bash
DEBUG=vite-plugin-svelte-inspector:* npm run dev
```