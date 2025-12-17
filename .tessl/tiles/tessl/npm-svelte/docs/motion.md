# Motion & Animation

Svelte provides powerful animation utilities including springs, tweens, and FLIP animations for creating smooth, physics-based motion effects.

## Capabilities

### Spring

A reactive spring animation class that moves values towards targets with physics-based motion.

```typescript { .api }
/**
 * A wrapper for a value that behaves in a spring-like fashion
 */
class Spring<T> {
  constructor(value: T, options?: SpringOpts);
  
  /** Create a spring whose value is bound to the return value of fn */
  static of<U>(fn: () => U, options?: SpringOpts): Spring<U>;
  
  /** Sets target value and returns promise that resolves when spring settles */
  set(value: T, options?: SpringUpdateOpts): Promise<void>;
  
  /** Current value of the spring */
  get current(): T;
  
  /** Target value the spring is moving towards */
  target: T;
  
  /** Spring stiffness (0-1, higher = more responsive) */
  stiffness: number;
  
  /** Spring damping (0-1, higher = less oscillation) */
  damping: number;
  
  /** Precision threshold for settling */
  precision: number;
}
```

**Usage Examples:**

```typescript
import { Spring } from "svelte/motion";

// Basic spring
const spring = new Spring(0);

// Spring with options
const spring = new Spring(0, {
  stiffness: 0.1,
  damping: 0.25,
  precision: 0.01
});

// Use in reactive context
let targetValue = $state(0);
const animatedValue = Spring.of(() => targetValue);

// Set target values
spring.target = 100; // Sets target immediately
await spring.set(100); // Returns promise when settled

// Set with options
await spring.set(100, {
  instant: true, // Jump immediately
  preserveMomentum: 500 // Continue current trajectory for 500ms
});

// Access current value
console.log(spring.current); // Current animated value
```

### Tween

A reactive tween animation class that smoothly interpolates between values over time.

```typescript { .api }
/**
 * A wrapper for a value that tweens smoothly to its target value
 */
class Tween<T> {
  constructor(value: T, options?: TweenedOptions<T>);
  
  /** Create a tween whose value is bound to the return value of fn */
  static of<U>(fn: () => U, options?: TweenedOptions<U>): Tween<U>;
  
  /** Sets target value and returns promise when tween completes */
  set(value: T, options?: TweenedOptions<T>): Promise<void>;
  
  /** Current value of the tween */
  get current(): T;
  
  /** Target value the tween is moving towards */
  get target(): T;
  set target(value: T);
}
```

**Usage Examples:**

```typescript
import { Tween } from "svelte/motion";
import { cubicOut } from "svelte/easing";

// Basic tween
const tween = new Tween(0);

// Tween with options
const tween = new Tween(0, {
  duration: 400,
  easing: cubicOut,
  delay: 100
});

// Use in reactive context
let targetValue = $state(0);
const animatedValue = Tween.of(() => targetValue);

// Set target values
await tween.set(100); // Uses default options

// Set with custom options
await tween.set(100, {
  duration: 1000,
  easing: t => t * t, // Custom easing
  delay: 200
});

// Custom interpolation for complex values
const colorTween = new Tween({ r: 255, g: 0, b: 0 }, {
  interpolate: (from, to) => t => ({
    r: Math.round(from.r + (to.r - from.r) * t),
    g: Math.round(from.g + (to.g - from.g) * t),
    b: Math.round(from.b + (to.b - from.b) * t)
  })
});
```

### FLIP Animation

The `flip` function calculates start and end positions of elements and animates between them using the FLIP technique.

```typescript { .api }
/**
 * FLIP animation for element position changes
 * @param node - Element to animate
 * @param params - From/to rectangles and animation options
 * @returns Animation configuration
 */
function flip(
  node: Element,
  { from, to }: { from: DOMRect; to: DOMRect },
  params?: FlipParams
): AnimationConfig;
```

**Usage Examples:**

```typescript
import { flip } from "svelte/animate";

// In a Svelte component with keyed each block
let items = $state([
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
  { id: 3, name: "Item 3" }
]);

function shuffle() {
  items = items.sort(() => Math.random() - 0.5);
}

// Template usage with animate directive
/*
{#each items as item (item.id)}
  <div animate:flip={{ duration: 300 }}>
    {item.name}
  </div>
{/each}
*/

// Programmatic usage
function animateMove(element, fromRect, toRect) {
  const animation = flip(element, 
    { from: fromRect, to: toRect },
    { duration: 400, easing: cubicOut }
  );
  
  // Apply animation manually
  element.style.animation = animation.css(0, 1);
}
```

### Legacy Motion Stores

Legacy store-based motion utilities for Svelte 4 compatibility.

```typescript { .api }
/**
 * @deprecated Use Spring class instead
 * Creates a spring store with reactive value
 */
function spring<T = any>(value?: T, opts?: SpringOpts): Spring<T>;

/**
 * @deprecated Use Tween class instead  
 * Creates a tweened store with reactive value
 */
function tweened<T>(value?: T, defaults?: TweenedOptions<T>): Tweened<T>;
```

**Usage Examples:**

```typescript
import { spring, tweened } from "svelte/motion";

// Legacy spring store
const springStore = spring(0, {
  stiffness: 0.1,
  damping: 0.25
});

springStore.set(100);

// Legacy tweened store
const tweenedStore = tweened(0, {
  duration: 400,
  easing: t => t * t
});

tweenedStore.set(100);

// Subscribe to changes
springStore.subscribe(value => {
  console.log("Spring value:", value);
});
```

### Motion Utilities

Additional utilities for motion and accessibility.

```typescript { .api }
/**
 * MediaQuery for reduced motion preference
 */
const prefersReducedMotion: MediaQuery;
```

**Usage Examples:**

```typescript
import { prefersReducedMotion } from "svelte/motion";

// Check user's motion preference
const shouldAnimate = !prefersReducedMotion.current;

// Use in animation decisions
const duration = prefersReducedMotion.current ? 0 : 400;

// Reactive usage
$effect(() => {
  if (prefersReducedMotion.current) {
    // Disable animations
    spring.set(targetValue, { instant: true });
  } else {
    // Enable animations
    spring.set(targetValue);
  }
});
```

## Types

```typescript { .api }
interface SpringOpts {
  stiffness?: number;
  damping?: number;
  precision?: number;
}

interface SpringUpdateOpts {
  instant?: boolean;
  preserveMomentum?: number;
}

interface TweenedOptions<T> {
  delay?: number;
  duration?: number | ((from: T, to: T) => number);
  easing?: (t: number) => number;
  interpolate?: (a: T, b: T) => (t: number) => T;
}

interface FlipParams {
  delay?: number;
  duration?: number | ((len: number) => number);
  easing?: (t: number) => number;
}

interface AnimationConfig {
  delay?: number;
  duration?: number;
  easing?: (t: number) => number;
  css?: (t: number, u: number) => string;
  tick?: (t: number, u: number) => void;
}

interface MediaQuery {
  current: boolean;
}
```

## Best Practices

1. **Use Spring for interactive elements**: Springs feel more natural for user-driven animations
2. **Use Tween for choreographed sequences**: Tweens provide precise timing control
3. **Respect user preferences**: Always check `prefersReducedMotion` for accessibility
4. **Clean up animations**: Use cleanup functions in effects to cancel ongoing animations
5. **Performance considerations**: Prefer `transform` and `opacity` properties for smooth animations