# Legacy Compatibility

Svelte 5 provides compatibility utilities for migrating from Svelte 4 patterns and working with legacy components. These utilities help bridge the gap between the old reactivity system and the new runes-based approach.

## Capabilities

### createClassComponent

Creates a Svelte 4-style class component from a modern Svelte 5 component for backwards compatibility.

```typescript { .api }
/**
 * Create a legacy class component from a modern Svelte 5 component
 * @param component - Modern Svelte 5 component
 * @returns Legacy class component with Svelte 4 API
 */
function createClassComponent<Props extends Record<string, any>, Exports extends Record<string, any>>(
  component: Component<Props, Exports>
): LegacyComponentConstructor<Props, Exports>;
```

**Usage Examples:**

```typescript
import { createClassComponent } from "svelte/legacy";
import ModernComponent from "./ModernComponent.svelte";

// Create legacy wrapper
const LegacyComponent = createClassComponent(ModernComponent);

// Use with Svelte 4 patterns
const instance = new LegacyComponent({
  target: document.getElementById("app"),
  props: {
    name: "World",
    count: 0
  }
});

// Legacy API methods
instance.$set({ count: 5 });
instance.$on("event", (event) => {
  console.log("Event received:", event.detail);
});

// Legacy lifecycle
instance.$destroy();

// Access props and component references
console.log(instance.$$.props);
console.log(instance.$$.component);
```

### asClassComponent

Marks a Svelte 5 component to be compiled with legacy class component API for backwards compatibility.

```typescript { .api }
/**
 * Mark a component to be compiled with legacy class component API
 * @param component - Component constructor to mark as legacy
 * @returns The same component with legacy compilation marker
 */
function asClassComponent<Props extends Record<string, any>, Exports extends Record<string, any>>(
  component: Component<Props, Exports>
): Component<Props, Exports>;
```

**Usage Examples:**

```typescript
// ModernComponent.svelte - in <script> tag
import { asClassComponent } from "svelte/legacy";

// Mark this component for legacy compilation
export default asClassComponent(
  // Component definition here
);

// Or in parent component
import { asClassComponent } from "svelte/legacy";
import Component from "./Component.svelte";

const LegacyWrappedComponent = asClassComponent(Component);

// Now can be used with legacy patterns
const instance = new LegacyWrappedComponent({
  target: document.body,
  props: { message: "Hello" }
});
```

### Legacy Component Patterns

Working with components that expect the old Svelte 4 component API.

**Migration Example:**

```typescript
// Before (Svelte 4)
import Component from "./Component.svelte";

const app = new Component({
  target: document.getElementById("app"),
  props: {
    name: "world"
  }
});

app.$set({ name: "svelte" });
app.$on("close", () => {
  app.$destroy();
});

// After (Svelte 5 with legacy compatibility)
import { createClassComponent } from "svelte/legacy";
import Component from "./Component.svelte"; // Modern Svelte 5 component

const LegacyComponent = createClassComponent(Component);

const app = new LegacyComponent({
  target: document.getElementById("app"),
  props: {
    name: "world"
  }
});

app.$set({ name: "svelte" });
app.$on("close", () => {
  app.$destroy();
});
```

### Interoperability Patterns

**Using Legacy Components in Modern Context:**

```typescript
// Modern parent component using legacy child
import { createClassComponent } from "svelte/legacy";
import LegacyChild from "./LegacyChild.svelte";

const LegacyChildClass = createClassComponent(LegacyChild);

let childInstance = $state(null);
let containerElement;

$effect(() => {
  if (containerElement) {
    childInstance = new LegacyChildClass({
      target: containerElement,
      props: {
        data: someReactiveData
      }
    });

    return () => {
      childInstance?.$destroy();
    };
  }
});

// Update props reactively
$effect(() => {
  if (childInstance) {
    childInstance.$set({ data: someReactiveData });
  }
});
```

**Legacy Event Handling:**

```typescript
import { createClassComponent } from "svelte/legacy";
import EventEmittingComponent from "./EventEmittingComponent.svelte";

const LegacyEventComponent = createClassComponent(EventEmittingComponent);

const instance = new LegacyEventComponent({
  target: document.body
});

// Handle legacy events
instance.$on("customEvent", (event) => {
  console.log("Custom event:", event.detail);
});

instance.$on("click", (event) => {
  console.log("Click event:", event);
});

// Programmatic event dispatch (if supported by component)
instance.$set({ triggerEvent: true });
```

### Third-Party Library Integration

**Integrating with libraries that expect Svelte 4 components:**

```typescript
import { createClassComponent } from "svelte/legacy";
import MyComponent from "./MyComponent.svelte";
import ThirdPartyLibrary from "some-svelte4-library";

// Wrap modern component for legacy library
const WrappedComponent = createClassComponent(MyComponent);

// Use with third-party library that expects Svelte 4 API
const libraryInstance = new ThirdPartyLibrary({
  component: WrappedComponent,
  target: document.getElementById("container"),
  props: {
    title: "Hello World"
  }
});

// Library can now use legacy API methods
libraryInstance.component.$set({ title: "Updated Title" });
libraryInstance.component.$on("change", handleChange);
```

### Component Factory Pattern

**Creating reusable legacy component factories:**

```typescript
import { createClassComponent } from "svelte/legacy";

// Factory function for creating legacy versions
function createLegacyFactory(modernComponent) {
  const LegacyClass = createClassComponent(modernComponent);
  
  return function createInstance(target, props = {}) {
    return new LegacyClass({
      target,
      props,
      // Default legacy options
      intro: true,
      anchor: null
    });
  };
}

// Usage
import Modal from "./Modal.svelte";
import Tooltip from "./Tooltip.svelte";

const createLegacyModal = createLegacyFactory(Modal);
const createLegacyTooltip = createLegacyFactory(Tooltip);

// Create instances with legacy API
const modal = createLegacyModal(document.body, {
  title: "Confirmation",
  message: "Are you sure?"
});

const tooltip = createLegacyTooltip(document.getElementById("help"), {
  text: "Click for help",
  position: "top"
});
```

## Types

```typescript { .api }
interface LegacyComponentConstructor<Props extends Record<string, any>, Exports extends Record<string, any>> {
  new (options: {
    target: Element | Document | ShadowRoot;
    anchor?: Element;
    props?: Props;
    context?: Map<any, any>;
    hydrate?: boolean;
    intro?: boolean;
    $$inline?: boolean;
  }): LegacyComponentInstance<Props, Exports>;
}

interface LegacyComponentInstance<Props extends Record<string, any>, Exports extends Record<string, any>> {
  /** Update component props */
  $set(props: Partial<Props>): void;
  
  /** Subscribe to component events */
  $on(event: string, callback: (event: CustomEvent) => void): () => void;
  
  /** Destroy component instance */
  $destroy(): void;
  
  /** Access to internal component state */
  $$: {
    props: Props;
    component: Exports;
    ctx: any;
  };
}

interface Component<
  Props extends Record<string, any> = {},
  Exports extends Record<string, any> = {},
  Bindings extends keyof Props | '' = string
> {
  (internals: ComponentInternals, props: Props): Exports;
}
```

## Migration Strategies

### Gradual Migration

```typescript
// Phase 1: Wrap legacy components
import { createClassComponent } from "svelte/legacy";
import OldComponent from "./OldComponent.svelte";

const WrappedOldComponent = createClassComponent(OldComponent);

// Phase 2: Update usage patterns gradually
// Instead of: new OldComponent({...})
// Use: new WrappedOldComponent({...})

// Phase 3: Migrate component internals to runes
// Update OldComponent.svelte to use $state, $derived, etc.

// Phase 4: Remove legacy wrapper when ready
// import OldComponent from "./OldComponent.svelte";
// const instance = mount(OldComponent, {...});
```

### Testing Legacy Components

```typescript
import { createClassComponent } from "svelte/legacy";
import { render } from "@testing-library/svelte";
import Component from "./Component.svelte";

// Test modern component
test("modern component", () => {
  const { getByText } = render(Component, { props: { name: "test" } });
  expect(getByText("Hello test")).toBeInTheDocument();
});

// Test legacy wrapped component
test("legacy wrapped component", () => {
  const LegacyComponent = createClassComponent(Component);
  const container = document.createElement("div");
  
  const instance = new LegacyComponent({
    target: container,
    props: { name: "test" }
  });
  
  expect(container.textContent).toContain("Hello test");
  
  instance.$set({ name: "updated" });
  expect(container.textContent).toContain("Hello updated");
  
  instance.$destroy();
});
```

## Best Practices

1. **Use sparingly**: Legacy compatibility should be temporary during migration
2. **Test thoroughly**: Ensure legacy wrappers maintain expected behavior
3. **Document usage**: Clearly mark where legacy compatibility is being used
4. **Plan migration**: Create timeline for removing legacy compatibility
5. **Monitor performance**: Legacy wrappers may have performance overhead
6. **Update incrementally**: Migrate components one at a time rather than all at once

## Common Pitfalls

1. **Event handling differences**: Some events may behave differently between Svelte 4 and 5
2. **Lifecycle timing**: Component lifecycle may have subtle timing differences
3. **SSR compatibility**: Ensure legacy components work with server-side rendering
4. **Bundle size**: Legacy compatibility adds to bundle size
5. **Type compatibility**: TypeScript types may need adjustment for legacy components

## Debugging Legacy Components

```typescript
import { createClassComponent } from "svelte/legacy";
import Component from "./Component.svelte";

const LegacyComponent = createClassComponent(Component);

const instance = new LegacyComponent({
  target: document.body,
  props: { debug: true }
});

// Access internal state for debugging
console.log("Component props:", instance.$$.props);
console.log("Component context:", instance.$$.ctx);

// Monitor prop changes
const originalSet = instance.$set;
instance.$set = function(props) {
  console.log("Legacy $set called with:", props);
  return originalSet.call(this, props);
};

// Monitor events
const originalOn = instance.$on;
instance.$on = function(event, callback) {
  console.log("Legacy $on registered for:", event);
  return originalOn.call(this, event, callback);
};
```