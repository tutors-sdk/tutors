# Transitions

Svelte provides built-in transition effects for smooth element enter and exit animations. Transitions can be applied to elements conditionally rendered with `{#if}` blocks or list items in `{#each}` blocks.

## Capabilities

### fade

Animates the opacity of an element from 0 to current opacity for in transitions, and from current opacity to 0 for out transitions.

```typescript { .api }
/**
 * Opacity fade transition
 * @param node - Element to animate
 * @param params - Fade animation parameters
 * @returns Transition configuration
 */
function fade(node: Element, params?: FadeParams): TransitionConfig;
```

**Usage Examples:**

```typescript
import { fade } from "svelte/transition";

let visible = $state(false);

// Basic fade
/*
{#if visible}
  <div transition:fade>
    Hello world!
  </div>
{/if}
*/

// Custom fade parameters
/*
{#if visible}
  <div transition:fade={{ duration: 1000, delay: 200 }}>
    Slow fade with delay
  </div>
{/if}
*/

// Separate in/out transitions
/*
{#if visible}
  <div in:fade={{ duration: 300 }} out:fade={{ duration: 150 }}>
    Different in/out timing
  </div>
{/if}
*/
```

### fly

Animates x/y position and opacity. In transitions animate from provided values to element's default values, out transitions reverse this.

```typescript { .api }
/**
 * Position and opacity transition with motion
 * @param node - Element to animate
 * @param params - Fly animation parameters
 * @returns Transition configuration
 */
function fly(node: Element, params?: FlyParams): TransitionConfig;
```

**Usage Examples:**

```typescript
import { fly } from "svelte/transition";
import { cubicOut } from "svelte/easing";

// Fly in from the left
/*
{#if visible}
  <div transition:fly={{ x: -200, duration: 400 }}>
    Slides in from left
  </div>
{/if}
*/

// Fly in from top with custom easing
/*
{#if visible}
  <div transition:fly={{ 
    y: -100, 
    duration: 600,
    easing: cubicOut,
    opacity: 0.3
  }}>
    Slides down with custom easing
  </div>
{/if}
*/

// Different directions for in/out
/*
{#if visible}
  <div 
    in:fly={{ x: -200, duration: 300 }}
    out:fly={{ x: 200, duration: 300 }}
  >
    Slides in from left, out to right
  </div>
{/if}
*/
```

### slide

Animates the height (or width) of an element, revealing content gradually.

```typescript { .api }
/**
 * Height/width slide transition
 * @param node - Element to animate
 * @param params - Slide animation parameters
 * @returns Transition configuration
 */
function slide(node: Element, params?: SlideParams): TransitionConfig;
```

**Usage Examples:**

```typescript
import { slide } from "svelte/transition";

// Vertical slide (default)
/*
{#if expanded}
  <div transition:slide>
    <p>This content slides down/up</p>
  </div>
{/if}
*/

// Horizontal slide
/*
{#if expanded}
  <div transition:slide={{ axis: 'x', duration: 400 }}>
    <p>This content slides left/right</p>
  </div>
{/if}
*/

// Custom duration and easing
/*
{#if expanded}
  <div transition:slide={{ 
    duration: 600,
    easing: t => t * t,
    axis: 'y'
  }}>
    <p>Slow slide with custom easing</p>
  </div>
{/if}
*/
```

### scale

Animates opacity and scale of an element. In transitions animate from provided values to element's defaults.

```typescript { .api }
/**
 * Scale and opacity transition
 * @param node - Element to animate
 * @param params - Scale animation parameters
 * @returns Transition configuration
 */
function scale(node: Element, params?: ScaleParams): TransitionConfig;
```

**Usage Examples:**

```typescript
import { scale } from "svelte/transition";

// Basic scale animation
/*
{#if visible}
  <div transition:scale>
    Scales in/out from center
  </div>
{/if}
*/

// Custom scale parameters
/*
{#if visible}
  <div transition:scale={{ 
    start: 0.5,
    opacity: 0.3,
    duration: 400
  }}>
    Starts at 50% scale, 30% opacity
  </div>
{/if}
*/

// Scale with different in/out values
/*
{#if visible}
  <div 
    in:scale={{ start: 0.8, duration: 200 }}
    out:scale={{ start: 1.2, duration: 150 }}
  >
    Scales up on entry, scales further up on exit
  </div>
{/if}
*/
```

### blur

Animates a blur filter alongside opacity changes.

```typescript { .api }
/**
 * Blur filter and opacity transition
 * @param node - Element to animate
 * @param params - Blur animation parameters
 * @returns Transition configuration
 */
function blur(node: Element, params?: BlurParams): TransitionConfig;
```

**Usage Examples:**

```typescript
import { blur } from "svelte/transition";

// Basic blur transition
/*
{#if visible}
  <div transition:blur>
    Blurs in and out
  </div>
{/if}
*/

// Custom blur parameters
/*
{#if visible}
  <div transition:blur={{ 
    amount: 10,
    opacity: 0.4,
    duration: 800
  }}>
    Heavy blur with custom opacity
  </div>
{/if}
*/
```

### draw

Animates SVG path strokes, creating a drawing effect. Only works with elements that have `getTotalLength()` method.

```typescript { .api }
/**
 * SVG path drawing transition
 * @param node - SVG element with getTotalLength method
 * @param params - Draw animation parameters
 * @returns Transition configuration
 */
function draw(
  node: SVGElement & { getTotalLength(): number }, 
  params?: DrawParams
): TransitionConfig;
```

**Usage Examples:**

```typescript
import { draw } from "svelte/transition";

// Basic path drawing
/*
{#if visible}
  <svg>
    <path 
      d="M 0 0 L 100 100" 
      stroke="black" 
      fill="none"
      transition:draw
    />
  </svg>
{/if}
*/

// Custom draw parameters
/*
{#if visible}
  <svg>
    <path 
      d="M 0 0 L 100 100" 
      stroke="black" 
      fill="none"
      transition:draw={{ speed: 2, duration: 1000 }}
    />
  </svg>
{/if}
*/

// Draw based on path length
/*
{#if visible}
  <svg>
    <polyline 
      points="0,0 50,25 100,0" 
      stroke="red" 
      fill="none"
      transition:draw={{ speed: 1 }}
    />
  </svg>
{/if}
*/
```

### crossfade

Creates a pair of transitions for elements that move between different states, with smooth crossfading.

```typescript { .api }
/**
 * Creates crossfade transition pair for moving elements
 * @param params - Crossfade configuration and fallback
 * @returns Tuple of [send, receive] transition functions
 */
function crossfade(params: CrossfadeParams & {
  fallback?: (node: Element, params: CrossfadeParams, intro: boolean) => TransitionConfig;
}): [
  (node: Element, params: CrossfadeParams & { key: any }) => () => TransitionConfig,
  (node: Element, params: CrossfadeParams & { key: any }) => () => TransitionConfig
];
```

**Usage Examples:**

```typescript
import { crossfade } from "svelte/transition";
import { quintOut } from "svelte/easing";

const [send, receive] = crossfade({
  duration: 400,
  easing: quintOut,
  fallback: (node, params) => {
    return fly(node, { y: -30, duration: 400 });
  }
});

let todos = $state([
  { id: 1, done: false, text: "Write docs" },
  { id: 2, done: false, text: "Test code" }
]);

// Usage in template for todo list
/*
<div class="todo">
  {#each todos.filter(t => !t.done) as todo (todo.id)}
    <div out:send={{ key: todo.id }}>
      {todo.text}
    </div>
  {/each}
</div>

<div class="done">
  {#each todos.filter(t => t.done) as todo (todo.id)}
    <div in:receive={{ key: todo.id }}>
      {todo.text}
    </div>
  {/each}
</div>
*/
```

## Types

```typescript { .api }
interface TransitionConfig {
  delay?: number;
  duration?: number;
  easing?: (t: number) => number;
  css?: (t: number, u: number) => string;
  tick?: (t: number, u: number) => void;
}

interface FadeParams {
  delay?: number;
  duration?: number;
  easing?: (t: number) => number;
}

interface FlyParams {
  delay?: number;
  duration?: number;
  easing?: (t: number) => number;
  x?: number | string;
  y?: number | string;
  opacity?: number;
}

interface SlideParams {
  delay?: number;
  duration?: number;
  easing?: (t: number) => number;
  axis?: 'x' | 'y';
}

interface ScaleParams {
  delay?: number;
  duration?: number;
  easing?: (t: number) => number;
  start?: number;
  opacity?: number;
}

interface BlurParams {
  delay?: number;
  duration?: number;
  easing?: (t: number) => number;
  amount?: number | string;
  opacity?: number;
}

interface DrawParams {
  delay?: number;
  speed?: number;
  duration?: number | ((len: number) => number);
  easing?: (t: number) => number;
}

interface CrossfadeParams {
  delay?: number;
  duration?: number | ((len: number) => number);
  easing?: (t: number) => number;
}

type EasingFunction = (t: number) => number;
```

## Best Practices

1. **Use appropriate transitions**: Choose transitions that match your UI's personality
2. **Respect motion preferences**: Check `prefersReducedMotion` and provide alternatives
3. **Keep durations reasonable**: Generally 200-500ms for most UI transitions
4. **Use easing functions**: Import from `svelte/easing` for better motion feel
5. **Test performance**: Complex transitions on many elements can impact performance
6. **Provide fallbacks**: Use `fallback` parameter in `crossfade` for items without pairs