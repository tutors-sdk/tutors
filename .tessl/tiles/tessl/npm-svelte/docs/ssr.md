# Server-Side Rendering

Svelte provides server-side rendering capabilities that allow you to generate HTML on the server for improved performance, SEO, and user experience.

## Capabilities

### render

Renders a Svelte component on the server and returns HTML string with CSS and metadata.

```typescript { .api }
/**
 * Render a component on the server
 * @param component - Component to render
 * @param options - Server rendering options
 * @returns Rendered HTML with CSS and metadata
 */
function render<Comp extends Component<any>>(
  component: Comp,
  options?: RenderOptions<ComponentProps<Comp>>
): RenderOutput;
```

**Usage Examples:**

```typescript
import { render } from "svelte/server";
import App from "./App.svelte";

// Basic server rendering
const result = render(App, {
  props: {
    title: "My App",
    initialData: { users: [], posts: [] }
  }
});

console.log(result.body); // HTML string
console.log(result.css?.code); // CSS string (if any)
console.log(result.head); // Head elements

// Express.js integration
app.get("*", async (req, res) => {
  const { body, head, css } = render(App, {
    props: {
      url: req.url,
      user: req.user
    }
  });
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>My App</title>
        ${head}
        ${css ? `<style>${css.code}</style>` : ""}
      </head>
      <body>
        <div id="app">${body}</div>
        <script src="/build/bundle.js"></script>
      </body>
    </html>
  `;
  
  res.send(html);
});

// With context and props
const result = render(App, {
  props: {
    initialState: serverData
  },
  context: new Map([
    ["theme", { mode: "dark" }],
    ["api", { baseUrl: process.env.API_URL }]
  ])
});
```

### SvelteKit Integration

```typescript
// In SvelteKit, SSR is handled automatically
// src/routes/+page.server.js
export async function load({ params, url, cookies }) {
  const data = await fetchData(params.id);
  
  return {
    props: {
      data,
      url: url.pathname
    }
  };
}

// src/routes/+page.svelte
let { data } = $props();

// This component will be server-rendered with the data
```

### Hydration Considerations

```typescript
// Client-side hydration
import { hydrate } from "svelte";
import App from "./App.svelte";

// Hydrate server-rendered content
const app = hydrate(App, {
  target: document.getElementById("app"),
  props: {
    // Must match server-side props
    initialData: window.__INITIAL_DATA__
  }
});

// Handle hydration mismatches
const app = hydrate(App, {
  target: document.getElementById("app"),
  props: serverProps,
  recover: true // Attempt to recover from mismatches
});
```

## SSR-Specific Patterns

### Environment Detection

```typescript
import { browser } from "$app/environment"; // SvelteKit
// or
import { BROWSER } from "esm-env"; // Universal

let data = $state([]);

// Only run on client
if (browser || BROWSER) {
  // Browser-only code
  data = JSON.parse(localStorage.getItem("data") || "[]");
}

// Server-safe initialization
onMount(() => {
  // This only runs on the client
  initializeClientOnlyFeatures();
});
```

### Conditional Rendering

```typescript
let mounted = $state(false);

onMount(() => {
  mounted = true;
});

// Template
/*
{#if mounted}
  <ClientOnlyComponent />
{:else}
  <div>Loading...</div>
{/if}
*/
```

### API Integration

```typescript
// Server-side data loading
export async function load({ fetch }) {
  const response = await fetch("/api/data");
  const data = await response.json();
  
  return {
    props: { data }
  };
}

// Component receives pre-loaded data
let { data } = $props();

// Client-side updates still work
async function refreshData() {
  const response = await fetch("/api/data");
  data = await response.json();
}
```

## Types

```typescript { .api }
interface RenderOptions<Props extends Record<string, any> = Record<string, any>> {
  /** Component properties */
  props?: Props;
  /** Context map for the component tree */
  context?: Map<any, any>;
}

interface RenderOutput {
  /** Rendered HTML body */
  body: string;
  /** CSS code (null if no styles) */
  css: null | {
    code: string;
    map: SourceMap;
  };
  /** Head elements to insert */
  head: string;
  /** Server-side warnings */
  warnings: Warning[];
}

interface HydrateOptions<Props extends Record<string, any> = Record<string, any>> {
  /** Target element containing server-rendered content */
  target: Document | Element | ShadowRoot;
  /** Component properties (must match server props) */
  props?: Props;
  /** Context map accessible via getContext() */
  context?: Map<any, any>;
  /** Whether to play transitions during hydration */
  intro?: boolean;
  /** Attempt to recover from hydration mismatches */
  recover?: boolean;
}
```

## Best Practices

### Data Serialization

```typescript
// Serialize complex data safely
function serializeData(data) {
  return JSON.stringify(data, (key, value) => {
    if (value instanceof Date) {
      return { __type: "Date", value: value.toISOString() };
    }
    return value;
  });
}

// Deserialize on client
function deserializeData(serialized) {
  return JSON.parse(serialized, (key, value) => {
    if (value && value.__type === "Date") {
      return new Date(value.value);
    }
    return value;
  });
}
```

### Head Management

```typescript
// In SvelteKit
import { page } from "$app/stores";

// Dynamic head content
$effect(() => {
  document.title = `${$page.data.title} - My App`;
  
  // Meta tags
  let metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.content = $page.data.description;
  }
});
```

### Progressive Enhancement

```typescript
let enhanced = $state(false);

onMount(() => {
  enhanced = true;
});

// Template with progressive enhancement
/*
<form method="POST" action="/api/submit">
  <input name="email" type="email" required />
  
  {#if enhanced}
    <button type="button" on:click={handleClientSubmit}>
      Submit (Enhanced)
    </button>
  {:else}
    <button type="submit">
      Submit
    </button>
  {/if}
</form>
*/

async function handleClientSubmit(event) {
  event.preventDefault();
  // Enhanced client-side submission
  const formData = new FormData(event.target.form);
  const response = await fetch("/api/submit", {
    method: "POST",
    body: formData
  });
  // Handle response...
}
```

## Common Patterns

1. **Data loading**: Use server-side load functions to pre-populate component props
2. **Environment detection**: Check `browser` or `BROWSER` flags for client-only code
3. **Graceful degradation**: Ensure forms and navigation work without JavaScript
4. **Hydration matching**: Server and client props must match exactly
5. **Progressive enhancement**: Add client-side features while maintaining server functionality
6. **Head management**: Use `svelte:head` or meta frameworks for SEO tags
7. **Error boundaries**: Handle both server and client errors appropriately