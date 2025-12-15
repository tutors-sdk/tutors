# Context Management

Svelte's context API provides a way to share data between parent and child components without explicitly passing props through every level of the component tree. Context is ideal for themes, user authentication, and other cross-cutting concerns.

## Capabilities

### setContext

Associates an arbitrary context object with the current component and the specified key. Must be called during component initialization.

```typescript { .api }
/**
 * Associates an arbitrary context object with the current component and the specified key
 * @param key - Context key (can be any value, often string or Symbol)
 * @param context - Context value to store
 * @returns The context value
 */
function setContext<T>(key: any, context: T): T;
```

**Usage Examples:**

```typescript
import { setContext } from "svelte";

// Parent component
const THEME_KEY = "theme";

const theme = {
  colors: {
    primary: "#ff3e00",
    secondary: "#40b3ff"
  },
  fonts: {
    body: "Arial, sans-serif",
    heading: "Georgia, serif"
  }
};

// Set context for children
setContext(THEME_KEY, theme);

// Using Symbol keys for uniqueness
const API_KEY = Symbol("api");
setContext(API_KEY, {
  baseUrl: "https://api.example.com",
  headers: { "Authorization": `Bearer ${token}` }
});

// Reactive context (context value itself can be reactive)
let user = $state({ name: "Alice", role: "admin" });
setContext("user", user);
```

### getContext

Retrieves the context associated with the specified key from the nearest parent component.

```typescript { .api }
/**
 * Retrieves the context associated with the specified key
 * @param key - Context key to look up
 * @returns Context value or undefined if not found
 */
function getContext<T>(key: any): T;
```

**Usage Examples:**

```typescript
import { getContext } from "svelte";

// Child component
const THEME_KEY = "theme";

// Get theme from parent context
const theme = getContext(THEME_KEY);

if (theme) {
  console.log("Primary color:", theme.colors.primary);
}

// Type-safe context access with TypeScript
interface ThemeContext {
  colors: { primary: string; secondary: string };
  fonts: { body: string; heading: string };
}

const theme: ThemeContext = getContext(THEME_KEY);

// Using Symbol keys
const API_KEY = Symbol("api");
const api = getContext(API_KEY);

// Fallback for missing context
const settings = getContext("settings") || { defaultSetting: true };

// Context in reactive expressions
let theme = getContext("theme");
let primaryColor = $derived(theme?.colors?.primary || "#000");
```

### hasContext

Checks whether a given key has been set in the context of a parent component.

```typescript { .api }
/**
 * Checks whether a given key has been set in the context of a parent component
 * @param key - Context key to check
 * @returns true if context exists, false otherwise
 */
function hasContext(key: any): boolean;
```

**Usage Examples:**

```typescript
import { hasContext, getContext } from "svelte";

// Check if context exists before using
if (hasContext("theme")) {
  const theme = getContext("theme");
  // Safe to use theme
} else {
  // Handle missing theme context
  console.warn("No theme context provided");
}

// Conditional feature activation
const hasAnalytics = hasContext("analytics");
if (hasAnalytics) {
  const analytics = getContext("analytics");
  analytics.track("page_view");
}

// Optional context consumption
function useOptionalContext(key, fallback) {
  return hasContext(key) ? getContext(key) : fallback;
}

const userPrefs = useOptionalContext("preferences", { lang: "en" });
```

### getAllContexts

Returns a Map of all contexts from the current component. Useful for debugging or context forwarding.

```typescript { .api }
/**
 * Returns a Map of all context entries from the current component
 * @returns Map containing all context key-value pairs
 */
function getAllContexts<T extends Map<any, any> = Map<any, any>>(): T;
```

**Usage Examples:**

```typescript
import { getAllContexts, setContext } from "svelte";

// Debug utility to log all available contexts
function debugContexts() {
  const contexts = getAllContexts();
  console.log("Available contexts:", contexts);
  
  for (const [key, value] of contexts) {
    console.log(`Context ${key}:`, value);
  }
}

// Context forwarding component
function forwardAllContexts(targetComponent) {
  const contexts = getAllContexts();
  
  // Forward all contexts to child component
  for (const [key, value] of contexts) {
    setContext(key, value);
  }
}

// Context merging utility
function mergeContexts(additionalContexts) {
  const existingContexts = getAllContexts();
  
  return new Map([
    ...existingContexts,
    ...Object.entries(additionalContexts)
  ]);
}
```

## Usage Patterns

### Theme Provider Pattern

```typescript
// ThemeProvider.svelte
import { setContext } from "svelte";

let { theme, children } = $props();

setContext("theme", theme);

// Template: {@render children()}

// Child component
import { getContext } from "svelte";

const theme = getContext("theme");
const primaryColor = theme.colors.primary;
```

### Store Provider Pattern

```typescript
// StoreProvider.svelte  
import { setContext } from "svelte";
import { writable } from "svelte/store";

// Create stores
const userStore = writable(null);
const cartStore = writable([]);

// Provide stores via context
setContext("stores", {
  user: userStore,
  cart: cartStore
});

// Child component
import { getContext } from "svelte";

const stores = getContext("stores");
const user = stores.user;
const cart = stores.cart;

// Use with auto-subscription
// let currentUser = $user;
// let cartItems = $cart;
```

### API Client Pattern

```typescript
// APIProvider.svelte
import { setContext } from "svelte";

class APIClient {
  constructor(baseUrl, token) {
    this.baseUrl = baseUrl;
    this.token = token;
  }
  
  async fetch(endpoint, options = {}) {
    return fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Authorization": `Bearer ${this.token}`,
        ...options.headers
      }
    });
  }
}

const apiClient = new APIClient("https://api.example.com", token);
setContext("api", apiClient);

// Child component
import { getContext } from "svelte";

const api = getContext("api");

async function loadData() {
  const response = await api.fetch("/data");
  return response.json();
}
```

## Types

```typescript { .api }
// Context key can be any type
type ContextKey = any;

// Context value can be any type  
type ContextValue = any;

// Map type for getAllContexts
type ContextMap = Map<ContextKey, ContextValue>;
```

## Best Practices

1. **Use descriptive keys**: Use strings or Symbols for context keys to avoid collisions
2. **Set context early**: Call `setContext` during component initialization, not in effects
3. **Provide fallbacks**: Check for context existence with `hasContext` or provide defaults
4. **Keep context focused**: Don't put everything in context - use it for cross-cutting concerns
5. **Document context contracts**: Clearly document what context keys your components expect
6. **Use TypeScript**: Type your context objects for better developer experience
7. **Consider Symbol keys**: Use Symbol keys for private contexts to prevent accidental access