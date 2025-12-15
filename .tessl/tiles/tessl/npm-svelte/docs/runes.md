# Runes System

Svelte 5 introduces runes - a powerful reactivity system that replaces the previous assignment-based reactivity. Runes provide explicit, fine-grained reactivity with better TypeScript support and more predictable behavior.

## Capabilities

### $state

Declares reactive state that triggers updates when changed.

```typescript { .api }
/**
 * Declares reactive state
 * @param initial - Initial value for the state
 * @returns Reactive state value
 */
declare function $state<T>(initial: T): T;
declare function $state<T>(): T | undefined;
```

**Usage Examples:**

```typescript
// Basic state
let count = $state(0);
let name = $state("Alice");
let items = $state([]);

// State without initial value
let user = $state(); // undefined initially

// Object state (deeply reactive by default)
let settings = $state({
  theme: "dark",
  language: "en",
  notifications: {
    email: true,
    push: false
  }
});

// Updating state triggers reactivity
count += 1; // This will trigger updates
settings.theme = "light"; // This will trigger updates
settings.notifications.email = false; // Deep updates work too
```

### $state.raw

Declares state that is not deeply reactive - you must reassign the entire value to trigger updates.

```typescript { .api }
/**
 * Declares state that is not made deeply reactive
 * @param initial - Initial value for the raw state
 * @returns Non-deeply reactive state value
 */
declare function raw<T>(initial: T): T;
declare function raw<T>(): T | undefined;
```

**Usage Examples:**

```typescript
let items = $state.raw([{ id: 1, name: "Item 1" }]);

// This won't trigger updates
items[0].name = "Updated Item";

// This will trigger updates
items = [...items, { id: 2, name: "Item 2" }];
items = items.map(item => 
  item.id === 1 ? { ...item, name: "Updated Item" } : item
);
```

### $state.snapshot

Takes a static snapshot of deeply reactive state, useful for logging or serialization.

```typescript { .api }
/**
 * Takes a static snapshot of a deeply reactive state proxy
 * @param state - The state to snapshot
 * @returns Static snapshot of the state
 */
declare function snapshot<T>(state: T): Snapshot<T>;
```

**Usage Examples:**

```typescript
let counter = $state({ count: 0, history: [] });

function logState() {
  // Will log the actual object, not the Proxy
  console.log($state.snapshot(counter));
}

function saveToLocalStorage() {
  const snapshot = $state.snapshot(counter);
  localStorage.setItem("counter", JSON.stringify(snapshot));
}
```

### $derived

Creates derived state that automatically updates when its dependencies change.

```typescript { .api }
/**
 * Declares derived state that depends on other reactive values
 * @param expression - Expression that computes the derived value
 * @returns Derived reactive value
 */
declare function $derived<T>(expression: T): T;
```

**Usage Examples:**

```typescript
let count = $state(0);
let name = $state("Alice");

// Simple derived values
let doubled = $derived(count * 2);
let greeting = $derived(`Hello, ${name}!`);
let isEven = $derived(count % 2 === 0);

// Derived from multiple sources
let summary = $derived(`${name} has clicked ${count} times`);

// Complex derived values
let expensiveComputation = $derived(() => {
  return someHeavyCalculation(count);
});
```

### $derived.by

Creates complex derived state using a function for more elaborate computations.

```typescript { .api }
/**
 * Creates complex derived state using a function
 * @param fn - Function that computes the derived value
 * @returns Derived reactive value
 */
declare function by<T>(fn: () => T): T;
```

**Usage Examples:**

```typescript
let numbers = $state([1, 2, 3, 4, 5]);

let total = $derived.by(() => {
  let result = 0;
  for (const n of numbers) {
    result += n;
  }
  return result;
});

let filtered = $derived.by(() => {
  return numbers.filter(n => n > 2);
});

// Complex async-like patterns (though derived should be sync)
let processedData = $derived.by(() => {
  if (!rawData.length) return [];
  
  return rawData
    .map(item => processItem(item))
    .filter(item => item.isValid)
    .sort((a, b) => a.priority - b.priority);
});
```

### $effect

Runs side effects when reactive dependencies change.

```typescript { .api }
/**
 * Runs code when dependencies change, after DOM updates
 * @param fn - Function to run, can return cleanup function
 */
declare function $effect(fn: () => void | (() => void)): void;
```

**Usage Examples:**

```typescript
let count = $state(0);
let name = $state("Alice");

// Basic effect
$effect(() => {
  console.log(`Count is now ${count}`);
});

// Effect with cleanup
$effect(() => {
  const interval = setInterval(() => {
    console.log(`Count: ${count}`);
  }, 1000);
  
  return () => clearInterval(interval);
});

// Effect with multiple dependencies
$effect(() => {
  document.title = `${name} - Count: ${count}`;
});

// Conditional effects
$effect(() => {
  if (count > 10) {
    console.log("Count is getting high!");
  }
});
```

### $effect.pre

Runs effects before DOM updates, useful for reading DOM state before changes.

```typescript { .api }
/**
 * Runs code before DOM updates when dependencies change
 * @param fn - Function to run, can return cleanup function
 */
declare function pre(fn: () => void | (() => void)): void;
```

**Usage Examples:**

```typescript
let items = $state([]);
let container;

$effect.pre(() => {
  if (container) {
    const scrollableDistance = container.scrollHeight - container.offsetHeight;
    const shouldAutoScroll = container.scrollTop > (scrollableDistance - 20);
    
    if (shouldAutoScroll) {
      // Will scroll after DOM updates
      $effect(() => {
        container.scrollTo(0, container.scrollHeight);
      });
    }
  }
});
```

### $effect.root

Creates a non-tracked effect scope that doesn't auto-cleanup and can be manually controlled.

```typescript { .api }
/**
 * Creates a non-tracked scope that doesn't auto-cleanup
 * @param fn - Function to run, can return cleanup function
 * @returns Cleanup function to manually destroy the effect
 */
declare function root(fn: () => void | (() => void)): () => void;
```

**Usage Examples:**

```typescript
let count = $state(0);

const cleanup = $effect.root(() => {
  $effect(() => {
    console.log(`Count: ${count}`);
  });
  
  return () => {
    console.log("Root effect cleaned up");
  };
});

// Later, manually cleanup
cleanup();
```

### $effect.tracking

Checks whether code is running inside a tracking context.

```typescript { .api }
/**
 * Checks if code is running inside a tracking context
 * @returns true if inside an effect or template, false otherwise
 */
declare function tracking(): boolean;
```

**Usage Examples:**

```typescript
function myUtility() {
  if ($effect.tracking()) {
    // We're inside an effect or template, safe to read reactive state
    return someReactiveValue;
  } else {
    // Not in tracking context, perhaps return cached value
    return cachedValue;
  }
}
```

### $props

Declares component props with proper typing and reactivity.

```typescript { .api }
/**
 * Declares the props that a component accepts
 * @returns Props object with reactive properties
 */
declare function $props(): any;
```

**Usage Examples:**

```typescript
// Basic props
let { name, age, email } = $props();

// Props with defaults
let { theme = "light", size = "medium" } = $props();

// Typed props (in TypeScript)
interface Props {
  name: string;
  age?: number;
  onSubmit?: (data: any) => void;
}

let { name, age = 0, onSubmit }: Props = $props();

// Bindable props
let { value = $bindable() } = $props();
```

### $bindable

Declares a prop as bindable, allowing parent components to bind to it.

```typescript { .api }
/**
 * Declares a prop as bindable
 * @param fallback - Default value if not bound
 * @returns Bindable prop value
 */
declare function $bindable<T>(fallback?: T): T;
```

**Usage Examples:**

```typescript
// Child component
let { value = $bindable("") } = $props();

// Parent can now use bind:value
// <ChildComponent bind:value={parentValue} />

// With default value
let { isOpen = $bindable(false) } = $props();

// The parent can bind to it
// <Modal bind:isOpen={showModal} />
```

### $inspect

Development utility for inspecting reactive values and their changes.

```typescript { .api }
/**
 * Inspects reactive values and logs changes
 * @param values - Values to inspect
 * @returns Object with 'with' method for custom inspection
 */
declare function $inspect<T extends any[]>(
  ...values: T
): { with: (fn: (type: 'init' | 'update', ...values: T) => void) => void };
```

**Usage Examples:**

```typescript
let count = $state(0);
let name = $state("Alice");

// Basic inspection (logs to console)
$inspect(count);
$inspect(count, name);

// Custom inspection
$inspect(count).with((type, value) => {
  console.log(`${type}: count is ${value}`);
});

$inspect(count, name).with((type, countVal, nameVal) => {
  if (type === 'update') {
    console.log(`Update: ${nameVal} has count ${countVal}`);
  }
});
```

## Types

```typescript { .api }
type Snapshot<T> = T extends Primitive
  ? T
  : T extends Cloneable
    ? NonReactive<T>
    : T extends { toJSON(): infer R }
      ? R
      : T extends Array<infer U>
        ? Array<Snapshot<U>>
        : T extends object
          ? { [K in keyof T]: Snapshot<T[K]> }
          : never;

type Primitive = string | number | boolean | null | undefined;

type NotFunction<T> = T extends Function ? never : T;
```

## Migration from Svelte 4

- Replace `let count = 0` with `let count = $state(0)`
- Replace `$: doubled = count * 2` with `let doubled = $derived(count * 2)`
- Replace `$: { console.log(count); }` with `$effect(() => { console.log(count); })`
- Use `$props()` instead of `export let` for component props