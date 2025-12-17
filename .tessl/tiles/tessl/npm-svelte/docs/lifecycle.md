# Component Lifecycle

Svelte provides lifecycle functions that allow you to run code at specific points in a component's life cycle. These functions must be called during component initialization.

## Capabilities

### onMount

Schedules a function to run as soon as the component has been mounted to the DOM. Unlike `$effect`, the provided function only runs once.

```typescript { .api }
/**
 * Schedules a function to run as soon as the component has been mounted to the DOM
 * @param fn - Function to run on mount, can return cleanup function
 */
function onMount<T>(fn: () => NotFunction<T> | Promise<NotFunction<T>> | (() => any)): void;
```

**Usage Examples:**

```typescript
import { onMount } from "svelte";

let data = [];

onMount(async () => {
  // Fetch data when component mounts
  const response = await fetch("/api/data");
  data = await response.json();
  
  // Return cleanup function (optional)
  return () => {
    console.log("Component unmounted");
  };
});

// Setup intervals or event listeners
onMount(() => {
  const interval = setInterval(() => {
    console.log("Timer tick");
  }, 1000);
  
  // Cleanup interval when component unmounts
  return () => clearInterval(interval);
});
```

### onDestroy

Schedules a callback to run immediately before the component is unmounted. This is the only lifecycle function that runs inside server-side components.

```typescript { .api }
/**
 * Schedules a callback to run immediately before the component is unmounted
 * @param fn - Function to run on component destruction
 */
function onDestroy(fn: () => any): void;
```

**Usage Examples:**

```typescript
import { onDestroy } from "svelte";

let subscription;

// Subscribe to external service
subscription = externalService.subscribe(handleData);

onDestroy(() => {
  // Clean up subscription
  if (subscription) {
    subscription.unsubscribe();
  }
});

// Alternative pattern - cleanup in onMount
import { onMount, onDestroy } from "svelte";

onMount(() => {
  const cleanup = setupSomething();
  onDestroy(cleanup);
});
```

### beforeUpdate (Deprecated)

Schedules a callback to run immediately before the component is updated after any state change. **Deprecated in Svelte 5** - use `$effect.pre` instead.

```typescript { .api }
/**
 * @deprecated Use $effect.pre instead
 * Schedules a callback to run immediately before the component is updated
 * @param fn - Function to run before updates
 */
function beforeUpdate(fn: () => void): void;
```

**Usage Examples:**

```typescript
import { beforeUpdate } from "svelte";

let div;
let autoscroll;

beforeUpdate(() => {
  if (div) {
    const scrollableDistance = div.scrollHeight - div.offsetHeight;
    autoscroll = div.scrollTop > (scrollableDistance - 20);
  }
});
```

### afterUpdate (Deprecated)

Schedules a callback to run immediately after the component has been updated. **Deprecated in Svelte 5** - use `$effect` instead.

```typescript { .api }
/**
 * @deprecated Use $effect instead
 * Schedules a callback to run immediately after the component has been updated
 * @param fn - Function to run after updates
 */
function afterUpdate(fn: () => void): void;
```

**Usage Examples:**

```typescript
import { afterUpdate } from "svelte";

let div;
let autoscroll = false;

afterUpdate(() => {
  if (autoscroll && div) {
    div.scrollTo(0, div.scrollHeight);
  }
});
```

## Types

```typescript { .api }
type NotFunction<T> = T extends Function ? never : T;
```

## Migration Notes

In Svelte 5, prefer using runes over the deprecated lifecycle functions:

- Use `$effect(() => { ... })` instead of `afterUpdate`
- Use `$effect.pre(() => { ... })` instead of `beforeUpdate`
- `onMount` and `onDestroy` remain the preferred way to handle component mounting and cleanup