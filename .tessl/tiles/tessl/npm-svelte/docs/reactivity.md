# Reactivity Control

Svelte provides functions for controlling reactive updates, managing execution timing, handling asynchronous operations, and reactive versions of built-in JavaScript objects for comprehensive reactivity.

## Capabilities

### tick

Returns a Promise that resolves after any pending state changes have been applied to the DOM.

```typescript { .api }
/**
 * Returns a promise that resolves once any pending state changes have been applied
 * @returns Promise that resolves after DOM updates
 */
function tick(): Promise<void>;
```

**Usage Examples:**

```typescript
import { tick } from "svelte";

let count = $state(0);
let element;

async function updateAndRead() {
  count += 1;
  
  // Wait for DOM to update
  await tick();
  
  // Now we can safely read the updated DOM
  console.log("Updated element text:", element.textContent);
}

// Measuring DOM changes
async function measureHeight(newContent) {
  const oldHeight = element.offsetHeight;
  
  // Update content
  content = newContent;
  
  // Wait for DOM update
  await tick();
  
  const newHeight = element.offsetHeight;
  console.log(`Height changed from ${oldHeight} to ${newHeight}`);
}

// Focusing elements after conditional rendering
let showInput = $state(false);
let inputElement;

async function showAndFocus() {
  showInput = true;
  
  // Wait for input to be rendered
  await tick();
  
  // Now we can focus it
  inputElement?.focus();
}
```

### settled

Returns a Promise that resolves when all async state updates have completed. More comprehensive than `tick()` for complex reactive chains.

```typescript { .api }
/**
 * Returns a promise that resolves when all reactive updates have settled
 * @returns Promise that resolves after all async updates
 */
function settled(): Promise<void>;
```

**Usage Examples:**

```typescript
import { settled } from "svelte";

let loading = $state(false);
let data = $state([]);
let processedData = $state([]);

// Derived values that might trigger additional updates
let filteredData = $derived(data.filter(item => item.active));
let sortedData = $derived(filteredData.sort((a, b) => a.name.localeCompare(b.name)));

async function loadAndProcess() {
  loading = true;
  
  // Fetch data
  const response = await fetch("/api/data");
  data = await response.json();
  
  // Wait for all reactive updates to settle
  await settled();
  
  // Now all derived values are up to date
  console.log("Final processed data:", sortedData);
  loading = false;
}

// Complex reactive chains
let userInput = $state("");
let searchResults = $state([]);
let selectedItems = $state([]);

$effect(async () => {
  if (userInput.length > 2) {
    searchResults = await searchAPI(userInput);
  }
});

async function processSelection() {
  // Update multiple reactive values
  selectedItems = [...selectedItems, ...searchResults.slice(0, 3)];
  userInput = "";
  
  // Wait for all reactive updates to complete
  await settled();
  
  // Safe to perform operations that depend on final state
  saveSelections(selectedItems);
}
```

### untrack

Executes a function without creating reactive dependencies or triggering reactive updates.

```typescript { .api }
/**
 * Run a function without creating dependencies on reactive state
 * @param fn - Function to run without tracking
 * @returns Return value of the function
 */
function untrack<T>(fn: () => T): T;
```

**Usage Examples:**

```typescript
import { untrack } from "svelte";

let count = $state(0);
let lastUpdate = $state(Date.now());

// Effect that doesn't depend on lastUpdate changes
$effect(() => {
  console.log(`Count is ${count}`);
  
  // Update timestamp without creating dependency
  untrack(() => {
    lastUpdate = Date.now();
  });
});

// Conditional logging without dependency
let debugMode = $state(false);
let data = $state({ items: [] });

$effect(() => {
  // React to data changes
  processData(data);
  
  // Log only if debug mode, but don't react to debugMode changes
  untrack(() => {
    if (debugMode) {
      console.log("Data processed:", data);
    }
  });
});

// One-time initialization
let config = $state(null);
let initialLoad = $state(false);

$effect(() => {
  if (config && !initialLoad) {
    // Load data based on config
    loadInitialData(config);
    
    // Set flag without creating new reactive dependency
    untrack(() => {
      initialLoad = true;
    });
  }
});
```

### flushSync

Synchronously flushes any pending reactive updates. Forces immediate DOM updates.

```typescript { .api }
/**
 * Synchronously flush any pending state changes and update the DOM
 * @param fn - Optional function to run before flushing
 * @returns Return value of fn, or void if no fn provided
 */
function flushSync<T = void>(fn?: (() => T) | undefined): T;
```

**Usage Examples:**

```typescript
import { flushSync } from "svelte";

let items = $state([]);
let container;

function addItemAndScroll(newItem) {
  // Add item
  items = [...items, newItem];
  
  // Force immediate DOM update
  flushSync();
  
  // Scroll to new item (DOM is already updated)
  const newElement = container.lastElementChild;
  newElement.scrollIntoView();
}

// Batch updates with immediate flush
function batchUpdateWithFlush() {
  flushSync(() => {
    // Multiple state updates
    count = 10;
    name = "Updated";
    active = true;
  });
  
  // DOM is immediately updated here
  measureAndAdjust();
}

// Animation timing
let animationTarget = $state(0);
let element;

function animateWithPreciseTiming() {
  animationTarget = 100;
  
  // Ensure DOM updates immediately
  flushSync();
  
  // Start animation with current DOM state
  element.animate([
    { transform: "translateX(0px)" },
    { transform: `translateX(${animationTarget}px)` }
  ], { duration: 300 });
}
```

### getAbortSignal

Returns an AbortSignal that is aborted when the current effect or derived is re-run or destroyed.

```typescript { .api }
/**
 * Get an AbortSignal for the current effect or derived computation
 * @returns AbortSignal that aborts when effect re-runs or is destroyed
 */
function getAbortSignal(): AbortSignal;
```

**Usage Examples:**

```typescript
import { getAbortSignal } from "svelte";

let userId = $state(null);
let userProfile = $state(null);

// Effect with automatic cancellation
$effect(() => {
  if (!userId) return;
  
  const signal = getAbortSignal();
  
  // Fetch with automatic cancellation
  fetch(`/api/users/${userId}`, { signal })
    .then(r => r.json())
    .then(profile => {
      if (!signal.aborted) {
        userProfile = profile;
      }
    })
    .catch(err => {
      if (!signal.aborted) {
        console.error("Failed to fetch user:", err);
      }
    });
});

// Derived value with async computation
let searchQuery = $state("");
let searchResults = $derived.by(() => {
  if (!searchQuery) return [];
  
  const signal = getAbortSignal();
  let results = [];
  
  // Async search with cancellation
  searchAPI(searchQuery, { signal })
    .then(data => {
      if (!signal.aborted) {
        results = data;
      }
    });
  
  return results;
});

// WebSocket connection management
let connected = $state(false);
let websocket = $state(null);

$effect(() => {
  const signal = getAbortSignal();
  
  const ws = new WebSocket("ws://localhost:8080");
  websocket = ws;
  
  ws.onopen = () => {
    if (!signal.aborted) {
      connected = true;
    }
  };
  
  ws.onclose = () => {
    if (!signal.aborted) {
      connected = false;
    }
  };
  
  // Cleanup when aborted
  signal.addEventListener("abort", () => {
    ws.close();
    websocket = null;
    connected = false;
  });
});
```

### Reactive Built-in Objects

Svelte provides reactive versions of built-in JavaScript objects that automatically trigger updates when their contents change.

#### SvelteDate

A reactive version of the built-in Date object.

```typescript { .api }
/**
 * Reactive Date object that triggers updates when date value changes
 */
class SvelteDate extends Date {
  constructor(...params: any[]);
}
```

**Usage Examples:**

```typescript
import { SvelteDate } from "svelte/reactivity";

const date = new SvelteDate();

// Reactive clock
$effect(() => {
  const interval = setInterval(() => {
    date.setTime(Date.now());
  }, 1000);
  
  return () => clearInterval(interval);
});

// Use in template - updates automatically
// <p>Current time: {date.toLocaleTimeString()}</p>
```

#### SvelteSet

A reactive version of the built-in Set object.

```typescript { .api }
/**
 * Reactive Set that triggers updates when contents change
 */
class SvelteSet<T> extends Set<T> {
  constructor(value?: Iterable<T> | null | undefined);
  add(value: T): this;
}
```

**Usage Examples:**

```typescript
import { SvelteSet } from "svelte/reactivity";

const tags = new SvelteSet(["svelte", "reactive"]);

// Reactive size
const tagCount = $derived(tags.size);

// Reactive membership check
const hasUrgent = $derived(tags.has("urgent"));

function toggleTag(tag) {
  if (tags.has(tag)) {
    tags.delete(tag);
  } else {
    tags.add(tag);
  }
}
```

#### SvelteMap

A reactive version of the built-in Map object.

```typescript { .api }
/**
 * Reactive Map that triggers updates when contents change
 */
class SvelteMap<K, V> extends Map<K, V> {
  constructor(value?: Iterable<readonly [K, V]> | null | undefined);
  set(key: K, value: V): this;
}
```

**Usage Examples:**

```typescript
import { SvelteMap } from "svelte/reactivity";

const gameBoard = new SvelteMap();
let currentPlayer = $state("X");

// Reactive game state
const winner = $derived(checkWinner(gameBoard));
const isFull = $derived(gameBoard.size === 9);

function makeMove(position) {
  if (!gameBoard.has(position) && !winner) {
    gameBoard.set(position, currentPlayer);
    currentPlayer = currentPlayer === "X" ? "O" : "X";
  }
}
```

#### SvelteURL

A reactive version of the built-in URL object.

```typescript { .api }
/**
 * Reactive URL that triggers updates when URL properties change
 */
class SvelteURL extends URL {
  get searchParams(): SvelteURLSearchParams;
}
```

**Usage Examples:**

```typescript
import { SvelteURL } from "svelte/reactivity";

const url = new SvelteURL("https://example.com/path");

// Reactive URL properties
const fullUrl = $derived(url.href);
const currentPath = $derived(url.pathname);

// Update URL reactively
function updatePath(newPath) {
  url.pathname = newPath;
}

function updateQuery(key, value) {
  url.searchParams.set(key, value);
}
```

#### SvelteURLSearchParams

A reactive version of URLSearchParams.

```typescript { .api }
/**
 * Reactive URLSearchParams that triggers updates when parameters change
 */
class SvelteURLSearchParams extends URLSearchParams {
  constructor(init?: string | URLSearchParams | Record<string, string>);
}
```

**Usage Examples:**

```typescript
import { SvelteURLSearchParams } from "svelte/reactivity";

const params = new SvelteURLSearchParams("?page=1&sort=name");

// Reactive parameter access
const currentPage = $derived(params.get("page") || "1");
const sortField = $derived(params.get("sort") || "id");

// Reactive parameter iteration
const allParams = $derived(Array.from(params.entries()));

function updateSort(field) {
  params.set("sort", field);
}
```

#### MediaQuery

Creates a reactive media query that updates based on viewport changes.

```typescript { .api }
/**
 * Reactive media query that updates when conditions change
 */
class MediaQuery {
  constructor(query: string, fallback?: boolean);
  get current(): boolean;
}
```

**Usage Examples:**

```typescript
import { MediaQuery } from "svelte/reactivity";

const isLargeScreen = new MediaQuery("(min-width: 1024px)");
const prefersReducedMotion = new MediaQuery("(prefers-reduced-motion: reduce)");
const isDarkMode = new MediaQuery("(prefers-color-scheme: dark)");

// Use in reactive context
const layoutClass = $derived(
  isLargeScreen.current ? "desktop-layout" : "mobile-layout"
);

const animationDuration = $derived(
  prefersReducedMotion.current ? 0 : 300
);
```

#### createSubscriber

Creates a subscribe function for integrating external event-based systems.

```typescript { .api }
/**
 * Create a subscriber for external event-based systems
 * @param start - Function called when first subscription occurs
 * @returns Subscribe function
 */
function createSubscriber(
  start: (update: () => void) => (() => void) | void
): () => void;
```

**Usage Examples:**

```typescript
import { createSubscriber } from "svelte/reactivity";

// Custom reactive WebSocket
class ReactiveWebSocket {
  #ws;
  #subscribe;
  #data = null;
  
  constructor(url) {
    this.#subscribe = createSubscriber((update) => {
      this.#ws = new WebSocket(url);
      
      this.#ws.onmessage = (event) => {
        this.#data = JSON.parse(event.data);
        update(); // Trigger reactive updates
      };
      
      return () => {
        this.#ws.close();
      };
    });
  }
  
  get data() {
    this.#subscribe(); // Make this getter reactive
    return this.#data;
  }
}

// Usage
const ws = new ReactiveWebSocket("ws://localhost:8080");

$effect(() => {
  console.log("WebSocket data:", ws.data);
});
```

## Advanced Patterns

### Debounced Effects

```typescript
let searchTerm = $state("");
let debouncedSearch = $state("");

$effect(() => {
  const signal = getAbortSignal();
  const timeout = setTimeout(() => {
    if (!signal.aborted) {
      debouncedSearch = searchTerm;
    }
  }, 300);
  
  signal.addEventListener("abort", () => {
    clearTimeout(timeout);
  });
});
```

### Batch Updates

```typescript
function batchUpdates(updates) {
  return new Promise(resolve => {
    updates();
    tick().then(resolve);
  });
}

// Usage
await batchUpdates(() => {
  count = 10;
  name = "New name";
  items = [...items, newItem];
});
```

### Reactive Cleanup

```typescript
let resource = $state(null);

$effect(() => {
  const signal = getAbortSignal();
  
  // Create resource
  resource = createExpensiveResource();
  
  // Cleanup when effect re-runs or component unmounts
  signal.addEventListener("abort", () => {
    resource?.cleanup();
    resource = null;
  });
});
```

## Types

```typescript { .api }
interface AbortSignal {
  readonly aborted: boolean;
  readonly reason: any;
  addEventListener(type: "abort", listener: () => void): void;
  removeEventListener(type: "abort", listener: () => void): void;
}
```

## Best Practices

1. **Use tick() for DOM reads**: Always await `tick()` before reading DOM measurements
2. **Use settled() for complex chains**: When multiple reactive values might update
3. **Use untrack() sparingly**: Only when you truly don't want reactive dependencies
4. **Avoid flushSync() in effects**: Can cause infinite loops or performance issues
5. **Always handle AbortSignal**: Check `signal.aborted` before state updates in async operations
6. **Combine with proper cleanup**: Use abort signals with proper resource cleanup patterns