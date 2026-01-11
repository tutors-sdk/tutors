# Store System

Svelte's store system provides reactive state management that can be shared across multiple components. Stores are particularly useful for application-wide state that needs to persist across component boundaries.

## Capabilities

### writable

Creates a store with both read and write capabilities. Subscribers are notified when the value changes.

```typescript { .api }
/**
 * Create a writable store that allows both updating and reading by subscription
 * @param value - Initial value (optional)
 * @param start - Function called when first subscriber subscribes
 * @returns Writable store instance
 */
function writable<T>(value?: T, start?: StartStopNotifier<T>): Writable<T>;
```

**Usage Examples:**

```typescript
import { writable } from "svelte/store";

// Basic writable store
const count = writable(0);

// Store with initial value
const user = writable({ name: "Alice", age: 30 });

// Store with start/stop logic
const time = writable(new Date(), (set) => {
  const interval = setInterval(() => {
    set(new Date());
  }, 1000);
  
  // Cleanup function called when last subscriber unsubscribes
  return () => clearInterval(interval);
});

// Using stores in components
count.subscribe(value => {
  console.log("Count:", value);
});

// Update store values
count.set(5);
count.update(n => n + 1);

// Auto-subscribe in Svelte components with $
// let currentCount = $count; // Automatically subscribes
```

### readable

Creates a read-only store. The value can only be set from within the store's start function.

```typescript { .api }
/**
 * Creates a readable store that allows reading by subscription
 * @param value - Initial value (optional)
 * @param start - Function called when first subscriber subscribes
 * @returns Readable store instance
 */
function readable<T>(value?: T, start?: StartStopNotifier<T>): Readable<T>;
```

**Usage Examples:**

```typescript
import { readable } from "svelte/store";

// Static readable store
const appName = readable("My App");

// Dynamic readable store
const mousePosition = readable({ x: 0, y: 0 }, (set) => {
  const handleMouseMove = (event) => {
    set({ x: event.clientX, y: event.clientY });
  };
  
  document.addEventListener("mousemove", handleMouseMove);
  
  return () => {
    document.removeEventListener("mousemove", handleMouseMove);
  };
});

// WebSocket store example
const websocketStore = readable(null, (set) => {
  const ws = new WebSocket("ws://localhost:8080");
  
  ws.onmessage = (event) => {
    set(JSON.parse(event.data));
  };
  
  return () => {
    ws.close();
  };
});
```

### derived

Creates a store whose value is computed from one or more other stores. Updates automatically when dependencies change.

```typescript { .api }
/**
 * Derived store that computes its value from other stores
 * @param stores - Single store or array of stores to derive from
 * @param fn - Function that computes the derived value
 * @param initial_value - Initial value before first computation
 * @returns Readable derived store
 */
function derived<S extends Stores, T>(
  stores: S,
  fn: (values: StoresValues<S>) => T,
  initial_value?: T
): Readable<T>;

/**
 * Derived store with async computation
 * @param stores - Single store or array of stores to derive from
 * @param fn - Function that computes value with set callback
 * @param initial_value - Initial value before first computation
 * @returns Readable derived store
 */
function derived<S extends Stores, T>(
  stores: S,
  fn: (values: StoresValues<S>, set: (value: T) => void, update: (fn: Updater<T>) => void) => Unsubscriber | void,
  initial_value?: T
): Readable<T>;
```

**Usage Examples:**

```typescript
import { writable, derived } from "svelte/store";

const firstName = writable("John");
const lastName = writable("Doe");

// Simple derived store
const fullName = derived(
  [firstName, lastName],
  ([first, last]) => `${first} ${last}`
);

// Single store derivation
const doubled = derived(count, n => n * 2);

// Derived with initial value
const greeting = derived(
  fullName,
  name => `Hello, ${name}!`,
  "Hello, Guest!"
);

// Async derived store
const userProfile = derived(
  userId,
  (id, set) => {
    if (!id) {
      set(null);
      return;
    }
    
    const controller = new AbortController();
    
    fetch(`/api/users/${id}`, { signal: controller.signal })
      .then(r => r.json())
      .then(profile => set(profile))
      .catch(err => {
        if (!controller.signal.aborted) {
          console.error("Failed to fetch user:", err);
          set(null);
        }
      });
    
    return () => controller.abort();
  },
  null
);

// Complex derived computation
const statistics = derived(
  [users, posts, comments],
  ([userList, postList, commentList]) => ({
    totalUsers: userList.length,
    totalPosts: postList.length,
    totalComments: commentList.length,
    avgCommentsPerPost: commentList.length / postList.length || 0
  })
);
```

### get

Synchronously retrieves the current value from a store without subscribing.

```typescript { .api }
/**
 * Get the current value from a store by subscribing and immediately unsubscribing
 * @param store - Store to get value from
 * @returns Current store value
 */
function get<T>(store: Readable<T>): T;
```

**Usage Examples:**

```typescript
import { writable, get } from "svelte/store";

const count = writable(42);

// Get current value without subscribing
const currentCount = get(count);
console.log(currentCount); // 42

// Useful for one-off operations
function logCurrentState() {
  console.log({
    count: get(count),
    user: get(user),
    settings: get(settings)
  });
}

// In event handlers where you need current value
function handleClick() {
  const current = get(count);
  if (current > 10) {
    // Do something
  }
}
```

### readonly

Creates a read-only version of a writable store, preventing external modifications.

```typescript { .api }
/**
 * Takes a store and returns a new one derived from the old one that is readable
 * @param store - Store to make readonly
 * @returns Readonly version of the store
 */
function readonly<T>(store: Readable<T>): Readable<T>;
```

**Usage Examples:**

```typescript
import { writable, readonly } from "svelte/store";

// Internal writable store
const _settings = writable({
  theme: "light",
  language: "en"
});

// Public readonly interface
export const settings = readonly(_settings);

// Internal functions can still modify
export function updateTheme(theme) {
  _settings.update(s => ({ ...s, theme }));
}

export function updateLanguage(language) {
  _settings.update(s => ({ ...s, language }));
}

// External consumers can only read
// settings.set(...) // This would cause a TypeScript error
```

### Store Conversion Utilities

Convert between Svelte 5 runes and stores for interoperability.

```typescript { .api }
/**
 * Create a store from a function that returns state
 * @param get - Function that returns current value
 * @param set - Optional function to update value (makes it writable)
 * @returns Store (readable or writable based on parameters)
 */
function toStore<V>(get: () => V, set: (v: V) => void): Writable<V>;
function toStore<V>(get: () => V): Readable<V>;

/**
 * Convert a store to an object with a reactive current property
 * @param store - Store to convert
 * @returns Object with current property
 */
function fromStore<V>(store: Writable<V>): { current: V };
function fromStore<V>(store: Readable<V>): { readonly current: V };
```

**Usage Examples:**

```typescript
import { toStore, fromStore } from "svelte/store";

// Convert rune state to store
let count = $state(0);
const countStore = toStore(
  () => count,
  (value) => count = value
);

// Convert store to rune-like object
const settings = writable({ theme: "light" });
const settingsRune = fromStore(settings);

// Use like rune state
$effect(() => {
  console.log("Theme:", settingsRune.current.theme);
});

// Update through original store
settings.update(s => ({ ...s, theme: "dark" }));
```

## Types

```typescript { .api }
interface Readable<T> {
  /**
   * Subscribe to store changes
   * @param run - Function called with current value and on changes
   * @param invalidate - Optional cleanup function
   * @returns Unsubscribe function
   */
  subscribe(run: Subscriber<T>, invalidate?: () => void): Unsubscriber;
}

interface Writable<T> extends Readable<T> {
  /**
   * Set the store value and notify subscribers
   * @param value - New value to set
   */
  set(value: T): void;
  
  /**
   * Update the store value using a function and notify subscribers
   * @param updater - Function that receives current value and returns new value
   */
  update(updater: Updater<T>): void;
}

type Subscriber<T> = (value: T) => void;
type Unsubscriber = () => void;
type Updater<T> = (value: T) => T;

type StartStopNotifier<T> = (
  set: (value: T) => void,
  update: (fn: Updater<T>) => void
) => void | (() => void);

type Stores = Readable<any> | [Readable<any>, ...Array<Readable<any>>] | Array<Readable<any>>;

type StoresValues<T> = T extends Readable<infer U> 
  ? U 
  : { [K in keyof T]: T[K] extends Readable<infer U> ? U : never };
```

## Best Practices

1. **Use stores for global state**: Perfect for user authentication, app settings, shopping carts
2. **Prefer derived over manual subscriptions**: Let Svelte handle the reactivity
3. **Clean up subscriptions**: Always call the unsubscriber function to prevent memory leaks
4. **Use readonly for public APIs**: Expose readonly stores when you want to control mutations
5. **Consider custom stores**: Create specialized stores with domain-specific methods
6. **Lazy loading**: Use start/stop notifiers to manage expensive resources like WebSocket connections