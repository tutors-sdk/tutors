# Svelte

Svelte is a revolutionary compile-time web application framework that transforms declarative component syntax into highly optimized vanilla JavaScript. Unlike traditional frameworks, Svelte performs the work during the build step, generating minimal and efficient code that surgically updates the DOM without requiring a virtual DOM layer.

## Package Information

- **Package Name**: svelte
- **Package Type**: npm
- **Language**: JavaScript with TypeScript support
- **Installation**: `npm install svelte`

## Core Imports

```typescript
import { onMount, onDestroy } from "svelte";
import { mount, hydrate } from "svelte";
```

For CommonJS:

```javascript
const { onMount, onDestroy } = require("svelte");
const { mount, hydrate } = require("svelte");
```

Module-specific imports:

```typescript
import { compile, parse } from "svelte/compiler";
import { fade, fly, slide } from "svelte/transition";
import { spring, tweened } from "svelte/motion";
import { writable, readable, derived } from "svelte/store";
import { flip } from "svelte/animate";
import { cubicOut, elasticOut, bounceIn } from "svelte/easing";
```

## Basic Usage

```typescript
import { mount } from "svelte";
import App from "./App.svelte";

// Mount a component
const app = mount(App, {
  target: document.getElementById("app"),
  props: {
    name: "World"
  }
});

// Use lifecycle functions in components
import { onMount, onDestroy } from "svelte";

let count = 0;
let interval;

onMount(() => {
  interval = setInterval(() => {
    count += 1;
  }, 1000);
});

onDestroy(() => {
  clearInterval(interval);
});
```

## Architecture

Svelte is built around several key components:

- **Compiler**: Transforms `.svelte` components and rune-based JavaScript into optimized code
- **Runtime**: Minimal runtime for reactivity, lifecycle management, and DOM updates
- **Reactivity System**: Runes-based reactive state with `$state`, `$derived`, and `$effect`
- **Component System**: Component mounting, hydration, and lifecycle management
- **Store System**: External state management with reactive stores
- **Animation & Transitions**: Built-in animation utilities and transition effects
- **Legacy Support**: Compatibility layer for migrating from Svelte 4

## Capabilities

### Component Lifecycle

Core component lifecycle functions for managing component initialization, updates, and cleanup.

```typescript { .api }
function onMount<T>(fn: () => NotFunction<T> | Promise<NotFunction<T>> | (() => any)): void;
function onDestroy(fn: () => any): void;
function beforeUpdate(fn: () => void): void;
function afterUpdate(fn: () => void): void;
```

[Component Lifecycle](./lifecycle.md)

### Component Rendering

Functions for mounting, hydrating, and unmounting Svelte components in the DOM.

```typescript { .api }
function mount<Props extends Record<string, any>, Exports extends Record<string, any>>(
  component: Component<Props, Exports, any>,
  options: MountOptions<Props>
): Exports;

function hydrate<Props extends Record<string, any>, Exports extends Record<string, any>>(
  component: Component<Props, Exports, any>,
  options: {} extends Props ? {
    target: Document | Element | ShadowRoot;
    props?: Props;
    events?: Record<string, (e: any) => any>;
    context?: Map<any, any>;
    intro?: boolean;
    recover?: boolean;
  } : {
    target: Document | Element | ShadowRoot;
    props: Props;
    events?: Record<string, (e: any) => any>;
    context?: Map<any, any>;
    intro?: boolean;
    recover?: boolean;
  }
): Exports;

function unmount(component: Record<string, any>, options?: { outro?: boolean }): Promise<void>;
```

[Component Rendering](./rendering.md)

### Context Management

API for sharing data between parent and child components through context.

```typescript { .api }
function getContext<T>(key: any): T;
function setContext<T>(key: any, context: T): T;
function hasContext(key: any): boolean;
function getAllContexts<T extends Map<any, any> = Map<any, any>>(): T;
```

[Context Management](./context.md)

### Reactivity Control

Functions for controlling reactive updates and execution timing.

```typescript { .api }
function tick(): Promise<void>;
function settled(): Promise<void>;
function untrack<T>(fn: () => T): T;
function flushSync<T = void>(fn?: (() => T) | undefined): T;
function getAbortSignal(): AbortSignal;
```

[Reactivity Control](./reactivity.md)

### Runes System

Svelte 5's runes-based reactivity system for declaring reactive state, derived values, and effects.

```typescript { .api }
declare function $state<T>(initial: T): T;
declare function $state<T>(): T | undefined;

declare function $derived<T>(expression: T): T;

declare function $effect(fn: () => void | (() => void)): void;

declare function $props(): any;

declare function $bindable<T>(fallback?: T): T;

declare function $inspect<T extends any[]>(
  ...values: T
): { with: (fn: (type: 'init' | 'update', ...values: T) => void) => void };

declare function $host<El extends HTMLElement = HTMLElement>(): El;
```

[Runes System](./runes.md)

### Snippet Creation

Functions for creating snippets programmatically from JavaScript functions.

```typescript { .api }
function createRawSnippet<T extends unknown[]>(fn: (...args: T) => {
  render: () => string;
  setup?: (element: Element) => void | (() => void);
}): Snippet<T>;
```

### Compiler API

Functions for compiling Svelte components and parsing source code.

```typescript { .api }
function compile(source: string, options: CompileOptions): CompileResult;
function compileModule(source: string, options: ModuleCompileOptions): CompileResult;
function parse(source: string, options?: ParseOptions): AST.Root;
function preprocess(source: string, preprocessor: PreprocessorGroup | PreprocessorGroup[], options?: PreprocessOptions): Promise<Processed>;
```

[Compiler API](./compiler.md)

### Motion & Animation

Animation utilities including springs, tweens, and FLIP animations.

```typescript { .api }
class Spring<T> {
  constructor(value: T, options?: SpringOpts);
  set(value: T, options?: SpringUpdateOpts): Promise<void>;
  target: T;
  get current(): T;
}

class Tween<T> {
  constructor(value: T, options?: TweenedOptions<T>);
  set(value: T, options?: TweenedOptions<T>): Promise<void>;
  get current(): T;
  target: T;
}

function flip(node: Element, params: FlipParams): AnimationConfig;
```

[Motion & Animation](./motion.md)

### Transitions

Built-in transition effects for element enter/exit animations.

```typescript { .api }
function fade(node: Element, params?: FadeParams): TransitionConfig;
function fly(node: Element, params?: FlyParams): TransitionConfig;
function slide(node: Element, params?: SlideParams): TransitionConfig;
function scale(node: Element, params?: ScaleParams): TransitionConfig;
function blur(node: Element, params?: BlurParams): TransitionConfig;
function draw(node: SVGElement & { getTotalLength(): number }, params?: DrawParams): TransitionConfig;
```

[Transitions](./transitions.md)

### Easing Functions

Mathematical easing functions for smooth animation curves.

```typescript { .api }
function linear(t: number): number;
function cubicOut(t: number): number;
function cubicIn(t: number): number;
function cubicInOut(t: number): number;
function elasticOut(t: number): number;
function bounceOut(t: number): number;
```

[Easing Functions](./easing.md)

### Store System

External state management with reactive stores for sharing state across components.

```typescript { .api }
function writable<T>(value?: T, start?: StartStopNotifier<T>): Writable<T>;
function readable<T>(value?: T, start?: StartStopNotifier<T>): Readable<T>;
function derived<S extends Stores, T>(stores: S, fn: (values: StoresValues<S>) => T, initial_value?: T): Readable<T>;
function get<T>(store: Readable<T>): T;
```

[Store System](./stores.md)

### Events

Utilities for event handling and DOM event management.

```typescript { .api }
function on(
  element: EventTarget, 
  event: string, 
  handler: EventListener, 
  options?: AddEventListenerOptions | boolean
): () => void;
```

### Attachments

System for creating and managing element attachments as an alternative to actions.

```typescript { .api }
function createAttachmentKey(): symbol;
function fromAction<E extends EventTarget, T>(
  action: Action<E, T>,
  fn?: () => T
): Attachment<E>;
```

### Server-Side Rendering

Functions for rendering Svelte components on the server.

```typescript { .api }
function render<Comp extends Component<any>>(
  component: Comp,
  options?: RenderOptions<ComponentProps<Comp>>
): RenderOutput;
```

[Server-Side Rendering](./ssr.md)

### Window Reactivity

Reactive values for window properties like dimensions, scroll position, and device characteristics.

```typescript { .api }
const innerWidth: ReactiveValue<number | undefined>;
const innerHeight: ReactiveValue<number | undefined>;
const scrollX: ReactiveValue<number | undefined>;
const scrollY: ReactiveValue<number | undefined>;
const online: ReactiveValue<boolean | undefined>;
const devicePixelRatio: ReactiveValue<number | undefined>;
```

[Window Reactivity](./reactivity-window.md)

### Legacy Compatibility

Utilities for migrating from Svelte 4 and working with legacy components.

```typescript { .api }
function createClassComponent<Props, Exports>(
  component: Component<Props, Exports>
): LegacyComponentConstructor<Props, Exports>;

function asClassComponent<Props, Exports>(
  component: Component<Props, Exports>
): Component<Props, Exports>;
```

[Legacy Compatibility](./legacy.md)

## Types

```typescript { .api }
interface Component<
  Props extends Record<string, any> = {},
  Exports extends Record<string, any> = {},
  Bindings extends keyof Props | '' = string
> {
  (internals: ComponentInternals, props: Props): Exports;
}

interface MountOptions<Props extends Record<string, any> = Record<string, any>> {
  target: Document | Element | ShadowRoot;
  anchor?: Node;
  events?: Record<string, (e: any) => any>;
  context?: Map<any, any>;
  intro?: boolean;
} & ({} extends Props
  ? { props?: Props }
  : { props: Props });

interface HydrateOptions<Props extends Record<string, any> = Record<string, any>> {
  target: Document | Element | ShadowRoot;
  events?: Record<string, (e: any) => any>;
  context?: Map<any, any>;
  intro?: boolean;
  recover?: boolean;
} & ({} extends Props
  ? { props?: Props }
  : { props: Props });

interface Snippet<Parameters extends unknown[] = []> {
  (...args: Parameters): SnippetReturn;
}

type ComponentProps<Comp extends Component<any, any>> = 
  Comp extends Component<infer Props, any> ? Props : never;

type NotFunction<T> = T extends Function ? never : T;

interface ComponentInternals {}

interface SnippetReturn {}

interface EventDispatcher<EventMap extends Record<string, any>> {
  <Type extends keyof EventMap>(
    ...args: null extends EventMap[Type]
      ? [type: Type, parameter?: EventMap[Type] | null | undefined]
      : undefined extends EventMap[Type]
        ? [type: Type, parameter?: EventMap[Type] | null | undefined]
        : [type: Type, parameter: EventMap[Type]]
  ): boolean;
}

interface Action<Element = HTMLElement, Parameter = undefined> {
  <Node extends Element>(
    ...args: undefined extends Parameter
      ? [node: Node, parameter?: Parameter]
      : [node: Node, parameter: Parameter]
  ): void | ActionReturn<Parameter>;
}

interface ActionReturn<Parameter = undefined> {
  update?: (parameter: Parameter) => void;
  destroy?: () => void;
}

interface Attachment<T extends EventTarget = Element> {
  (element: T): void | (() => void);
}

interface RenderOutput {
  head: string;
  html: string;
  body: string;
}
```