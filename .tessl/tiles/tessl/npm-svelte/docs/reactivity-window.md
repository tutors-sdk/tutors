# Window Reactivity

Svelte provides reactive values for common window properties that automatically update when the browser window changes. These are particularly useful for responsive design and window-based interactions.

## Capabilities

### Window Dimensions

Reactive values for window size properties.

```typescript { .api }
/**
 * Reactive view of window.innerWidth
 * @since 5.11.0
 */
const innerWidth: ReactiveValue<number | undefined>;

/**
 * Reactive view of window.innerHeight  
 * @since 5.11.0
 */
const innerHeight: ReactiveValue<number | undefined>;

/**
 * Reactive view of window.outerWidth
 * @since 5.11.0
 */
const outerWidth: ReactiveValue<number | undefined>;

/**
 * Reactive view of window.outerHeight
 * @since 5.11.0
 */
const outerHeight: ReactiveValue<number | undefined>;
```

**Usage Examples:**

```typescript
import { innerWidth, innerHeight, outerWidth, outerHeight } from "svelte/reactivity/window";

// Responsive breakpoints
const isSmallScreen = $derived(innerWidth.current < 768);
const isMediumScreen = $derived(innerWidth.current >= 768 && innerWidth.current < 1024);
const isLargeScreen = $derived(innerWidth.current >= 1024);

// Aspect ratio calculations
const aspectRatio = $derived(
  innerWidth.current && innerHeight.current 
    ? innerWidth.current / innerHeight.current 
    : 16/9
);

// Window size for canvas or dynamic layouts
let canvas;
$effect(() => {
  if (canvas && innerWidth.current && innerHeight.current) {
    canvas.width = innerWidth.current;
    canvas.height = innerHeight.current;
  }
});

// Responsive component behavior
const itemsPerRow = $derived(() => {
  if (!innerWidth.current) return 1;
  if (innerWidth.current < 600) return 1;
  if (innerWidth.current < 900) return 2;
  if (innerWidth.current < 1200) return 3;
  return 4;
});
```

### Window Position

Reactive values for window position properties.

```typescript { .api }
/**
 * Reactive view of window.screenLeft (updated in requestAnimationFrame)
 * @since 5.11.0
 */
const screenLeft: ReactiveValue<number | undefined>;

/**
 * Reactive view of window.screenTop (updated in requestAnimationFrame)
 * @since 5.11.0
 */
const screenTop: ReactiveValue<number | undefined>;
```

**Usage Examples:**

```typescript
import { screenLeft, screenTop } from "svelte/reactivity/window";

// Track window position
const windowPosition = $derived({
  x: screenLeft.current || 0,
  y: screenTop.current || 0
});

// Multi-monitor awareness
$effect(() => {
  const x = screenLeft.current;
  const y = screenTop.current;
  
  if (x !== undefined && y !== undefined) {
    console.log(`Window moved to (${x}, ${y})`);
    
    // Adjust behavior based on screen position
    if (x < 0 || y < 0) {
      console.log("Window is on a secondary monitor");
    }
  }
});
```

### Scroll Position

Reactive values for window scroll position.

```typescript { .api }
/**
 * Reactive view of window.scrollX
 * @since 5.11.0
 */
const scrollX: ReactiveValue<number | undefined>;

/**
 * Reactive view of window.scrollY
 * @since 5.11.0
 */
const scrollY: ReactiveValue<number | undefined>;
```

**Usage Examples:**

```typescript
import { scrollX, scrollY } from "svelte/reactivity/window";

// Scroll-based effects
const isScrolled = $derived((scrollY.current || 0) > 100);
const scrollProgress = $derived(() => {
  const y = scrollY.current || 0;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  return Math.min(y / maxScroll, 1);
});

// Sticky header behavior
let header;
$effect(() => {
  if (header) {
    header.classList.toggle("scrolled", isScrolled);
  }
});

// Parallax effects
let parallaxElement;
$effect(() => {
  if (parallaxElement && scrollY.current !== undefined) {
    const offset = scrollY.current * 0.5;
    parallaxElement.style.transform = `translateY(${offset}px)`;
  }
});

// Hide/show elements based on scroll direction
let lastScrollY = 0;
let scrollDirection = $state("up");

$effect(() => {
  const currentScrollY = scrollY.current || 0;
  
  if (currentScrollY > lastScrollY) {
    scrollDirection = "down";
  } else if (currentScrollY < lastScrollY) {
    scrollDirection = "up";
  }
  
  lastScrollY = currentScrollY;
});
```

### Network Status

Reactive value for network connectivity.

```typescript { .api }
/**
 * Reactive view of navigator.onLine
 * @since 5.11.0
 */
const online: ReactiveValue<boolean | undefined>;
```

**Usage Examples:**

```typescript
import { online } from "svelte/reactivity/window";

// Network status indicator
const isOnline = $derived(online.current ?? true);
const networkStatus = $derived(isOnline ? "online" : "offline");

// Conditional behavior based on connectivity
$effect(() => {
  if (isOnline) {
    console.log("Connected - syncing data");
    syncOfflineData();
  } else {
    console.log("Disconnected - switching to offline mode");
    enableOfflineMode();
  }
});

// Queue operations when offline
let pendingOperations = $state([]);

function performOperation(operation) {
  if (isOnline) {
    executeOperation(operation);
  } else {
    pendingOperations = [...pendingOperations, operation];
  }
}

$effect(() => {
  if (isOnline && pendingOperations.length > 0) {
    // Process queued operations when back online
    pendingOperations.forEach(executeOperation);
    pendingOperations = [];
  }
});
```

### Device Pixel Ratio

Reactive value for device pixel ratio (display scaling).

```typescript { .api }
/**
 * Reactive view of window.devicePixelRatio
 * Note: Behavior differs between browsers - Chrome responds to zoom, Firefox/Safari don't
 * @since 5.11.0
 */
const devicePixelRatio: {
  get current(): number | undefined;
};
```

**Usage Examples:**

```typescript
import { devicePixelRatio } from "svelte/reactivity/window";

// High DPI canvas rendering
let canvas;
let ctx;

$effect(() => {
  if (canvas && ctx) {
    const ratio = devicePixelRatio.current || 1;
    const rect = canvas.getBoundingClientRect();
    
    // Scale canvas for high DPI displays
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    
    ctx.scale(ratio, ratio);
    
    // Redraw with high DPI scaling
    redrawCanvas();
  }
});

// Image loading based on pixel density
const imageSource = $derived(() => {
  const ratio = devicePixelRatio.current || 1;
  
  if (ratio >= 3) {
    return "image@3x.jpg";
  } else if (ratio >= 2) {
    return "image@2x.jpg";
  } else {
    return "image.jpg";
  }
});

// CSS-in-JS with device pixel ratio
const styles = $derived(() => ({
  fontSize: `${16 * (devicePixelRatio.current || 1)}px`,
  borderWidth: `${1 / (devicePixelRatio.current || 1)}px`
}));
```

## Server-Side Behavior

All window reactivity values return `undefined` on the server since window properties are not available during server-side rendering.

```typescript
// Safe server-side usage
const isMobile = $derived((innerWidth.current || 1024) < 768);
const scrolled = $derived((scrollY.current || 0) > 0);
const isOnline = $derived(online.current ?? true); // Default to online
```

## Types

```typescript { .api }
interface ReactiveValue<T> {
  get current(): T;
}
```

## Best Practices

1. **Handle undefined values**: Always provide fallbacks for server-side rendering
2. **Debounce expensive operations**: Window events can fire frequently
3. **Use for responsive design**: Perfect for JavaScript-based responsive behavior
4. **Combine with CSS**: Use alongside CSS media queries for complete responsive design
5. **Consider performance**: Some values update in `requestAnimationFrame` loops
6. **Test across browsers**: `devicePixelRatio` behavior varies between browsers

## Common Patterns

### Responsive Breakpoints

```typescript
import { innerWidth } from "svelte/reactivity/window";

const breakpoints = {
  sm: 640,
  md: 768, 
  lg: 1024,
  xl: 1280
};

const screen = $derived(() => {
  const width = innerWidth.current || 1024;
  
  if (width >= breakpoints.xl) return "xl";
  if (width >= breakpoints.lg) return "lg";
  if (width >= breakpoints.md) return "md";
  if (width >= breakpoints.sm) return "sm";
  return "xs";
});
```

### Scroll-Based Navigation

```typescript
import { scrollY } from "svelte/reactivity/window";

let sections = [];
let activeSection = $state(0);

$effect(() => {
  const currentScroll = scrollY.current || 0;
  
  // Find active section based on scroll position
  const active = sections.findIndex((section, index) => {
    const nextSection = sections[index + 1];
    const sectionTop = section.offsetTop;
    const sectionBottom = nextSection ? nextSection.offsetTop : document.body.scrollHeight;
    
    return currentScroll >= sectionTop - 100 && currentScroll < sectionBottom - 100;
  });
  
  if (active !== -1) {
    activeSection = active;
  }
});
```