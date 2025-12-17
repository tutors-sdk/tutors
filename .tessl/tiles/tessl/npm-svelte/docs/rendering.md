# Component Rendering

Svelte provides functions for mounting, hydrating, and unmounting components in the DOM. These functions are essential for programmatically controlling component lifecycle.

## Capabilities

### mount

Mounts a component to the specified target and returns the component instance with its exports.

```typescript { .api }
/**
 * Mounts a component to the given target and returns the exports
 * @param component - Component to mount
 * @param options - Mount configuration options
 * @returns Component instance with exports
 */
function mount<Props extends Record<string, any>, Exports extends Record<string, any>>(
  component: Component<Props, Exports, any>,
  options: MountOptions<Props>
): Exports;
```

**Usage Examples:**

```typescript
import { mount } from "svelte";
import App from "./App.svelte";

// Basic mounting
const app = mount(App, {
  target: document.getElementById("app")
});

// Mount with props
const app = mount(App, {
  target: document.body,
  props: {
    name: "World",
    count: 42
  }
});

// Mount with anchor and context
const app = mount(App, {
  target: document.body,
  anchor: document.getElementById("insertion-point"),
  props: { message: "Hello" },
  context: new Map([["theme", "dark"]]),
  intro: true
});

// Access component exports
console.log(app.someExportedValue);
app.someExportedFunction();
```

### hydrate

Hydrates a server-rendered component, attaching event listeners and making it interactive.

```typescript { .api }
/**
 * Hydrates a component on the given target and returns the exports
 * @param component - Component to hydrate
 * @param options - Hydration configuration options
 * @returns Component instance with exports
 */
function hydrate<Props extends Record<string, any>, Exports extends Record<string, any>>(
  component: Component<Props, Exports, any>,
  options: HydrateOptions<Props>
): Exports;
```

**Usage Examples:**

```typescript
import { hydrate } from "svelte";
import App from "./App.svelte";

// Hydrate server-rendered content
const app = hydrate(App, {
  target: document.getElementById("app"),
  props: {
    initialData: window.__INITIAL_DATA__
  }
});

// Hydrate with recovery mode
const app = hydrate(App, {
  target: document.getElementById("app"),
  props: { data: serverData },
  recover: true // Attempt to recover from hydration mismatches
});
```

### unmount

Unmounts a component that was previously mounted using `mount` or `hydrate`. Optionally plays outro transitions.

```typescript { .api }
/**
 * Unmounts a component that was previously mounted
 * @param component - Component instance to unmount
 * @param options - Unmount options including outro transitions
 * @returns Promise that resolves after transitions complete
 */
function unmount(component: Record<string, any>, options?: {
  outro?: boolean;
}): Promise<void>;
```

**Usage Examples:**

```typescript
import { mount, unmount } from "svelte";
import App from "./App.svelte";

// Mount component
const app = mount(App, {
  target: document.body
});

// Unmount immediately
await unmount(app);

// Unmount with outro transitions
await unmount(app, { outro: true });

// Programmatic component lifecycle
let currentApp = null;

function showApp() {
  if (currentApp) return;
  
  currentApp = mount(App, {
    target: document.getElementById("app")
  });
}

async function hideApp() {
  if (!currentApp) return;
  
  await unmount(currentApp, { outro: true });
  currentApp = null;
}
```

## Types

```typescript { .api }
interface MountOptions<Props extends Record<string, any> = Record<string, any>> {
  /** Target element where the component will be mounted */
  target: Document | Element | ShadowRoot;
  /** Optional node inside target to render before */
  anchor?: Node;
  /** Component properties */
  props?: Props;
  /** Context map accessible via getContext() */
  context?: Map<any, any>;
  /** Whether to play transitions on initial render */
  intro?: boolean;
  /** Deprecated: Use callback props instead */
  events?: Record<string, (e: any) => any>;
}

interface HydrateOptions<Props extends Record<string, any> = Record<string, any>> {
  /** Target element containing server-rendered content */
  target: Document | Element | ShadowRoot;
  /** Component properties */
  props?: Props;
  /** Context map accessible via getContext() */
  context?: Map<any, any>;
  /** Whether to play transitions during hydration */
  intro?: boolean;
  /** Attempt to recover from hydration mismatches */
  recover?: boolean;
  /** Deprecated: Use callback props instead */
  events?: Record<string, (e: any) => any>;
}

interface Component<
  Props extends Record<string, any> = {},
  Exports extends Record<string, any> = {},
  Bindings extends keyof Props | '' = string
> {
  (internals: ComponentInternals, props: Props): Exports;
}
```

## Best Practices

1. **Always handle cleanup**: Use `unmount` to properly clean up components and prevent memory leaks
2. **Use outro transitions**: Set `outro: true` when unmounting to play exit animations
3. **Handle hydration carefully**: Use `recover: true` in development to handle server/client mismatches
4. **Context inheritance**: Components inherit context from their mounting location
5. **Props reactivity**: Mounted components don't automatically react to prop changes - use stores for dynamic updates