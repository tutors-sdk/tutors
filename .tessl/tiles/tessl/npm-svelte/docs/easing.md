# Easing Functions

Svelte provides a comprehensive collection of easing functions for smooth animations and transitions. These functions are mathematical curves that control the rate of change during animations.

## Capabilities

### Linear Easing

The simplest easing function that provides constant rate of change.

```typescript { .api }
/**
 * Linear easing function - constant rate of change
 * @param t - Time progress from 0 to 1
 * @returns Eased value from 0 to 1
 */
function linear(t: number): number;
```

### Back Easing

Easing functions that go slightly beyond their target before settling.

```typescript { .api }
/**
 * Back-in easing - starts slow with slight reverse motion
 * @param t - Time progress from 0 to 1
 * @returns Eased value
 */
function backIn(t: number): number;

/**
 * Back-out easing - ends slow with slight overshoot
 * @param t - Time progress from 0 to 1
 * @returns Eased value
 */
function backOut(t: number): number;

/**
 * Back-in-out easing - combines backIn and backOut
 * @param t - Time progress from 0 to 1
 * @returns Eased value
 */
function backInOut(t: number): number;
```

### Bounce Easing

Easing functions that simulate bouncing motion.

```typescript { .api }
/**
 * Bounce-in easing - bouncing motion at the start
 * @param t - Time progress from 0 to 1
 * @returns Eased value
 */
function bounceIn(t: number): number;

/**
 * Bounce-out easing - bouncing motion at the end
 * @param t - Time progress from 0 to 1
 * @returns Eased value
 */
function bounceOut(t: number): number;

/**
 * Bounce-in-out easing - bouncing motion at start and end
 * @param t - Time progress from 0 to 1
 * @returns Eased value
 */
function bounceInOut(t: number): number;
```

### Circular Easing

Easing functions based on circular motion curves.

```typescript { .api }
/**
 * Circular-in easing - accelerating circular motion
 * @param t - Time progress from 0 to 1
 * @returns Eased value
 */
function circIn(t: number): number;

/**
 * Circular-out easing - decelerating circular motion
 * @param t - Time progress from 0 to 1
 * @returns Eased value
 */
function circOut(t: number): number;

/**
 * Circular-in-out easing - combines circIn and circOut
 * @param t - Time progress from 0 to 1
 * @returns Eased value
 */
function circInOut(t: number): number;
```

### Cubic Easing

Easing functions based on cubic curves (most commonly used).

```typescript { .api }
/**
 * Cubic-in easing - slow start, accelerating
 * @param t - Time progress from 0 to 1
 * @returns Eased value
 */
function cubicIn(t: number): number;

/**
 * Cubic-out easing - fast start, decelerating (most popular)
 * @param t - Time progress from 0 to 1
 * @returns Eased value
 */
function cubicOut(t: number): number;

/**
 * Cubic-in-out easing - slow start and end, fast middle
 * @param t - Time progress from 0 to 1
 * @returns Eased value
 */
function cubicInOut(t: number): number;
```

### Elastic Easing

Easing functions that simulate elastic or spring-like motion.

```typescript { .api }
/**
 * Elastic-in easing - elastic motion at the start
 * @param t - Time progress from 0 to 1
 * @returns Eased value
 */
function elasticIn(t: number): number;

/**
 * Elastic-out easing - elastic motion at the end
 * @param t - Time progress from 0 to 1
 * @returns Eased value
 */
function elasticOut(t: number): number;

/**
 * Elastic-in-out easing - elastic motion at start and end
 * @param t - Time progress from 0 to 1
 * @returns Eased value
 */
function elasticInOut(t: number): number;
```

### Exponential Easing

Easing functions based on exponential curves.

```typescript { .api }
/**
 * Exponential-in easing - very slow start, sharp acceleration
 * @param t - Time progress from 0 to 1
 * @returns Eased value
 */
function expoIn(t: number): number;

/**
 * Exponential-out easing - sharp start, gradual deceleration
 * @param t - Time progress from 0 to 1
 * @returns Eased value
 */
function expoOut(t: number): number;

/**
 * Exponential-in-out easing - combines expoIn and expoOut
 * @param t - Time progress from 0 to 1
 * @returns Eased value
 */
function expoInOut(t: number): number;
```

### Quadratic Easing

Easing functions based on quadratic curves.

```typescript { .api }
/**
 * Quadratic-in easing - gentle acceleration
 * @param t - Time progress from 0 to 1
 * @returns Eased value
 */
function quadIn(t: number): number;

/**
 * Quadratic-out easing - gentle deceleration
 * @param t - Time progress from 0 to 1
 * @returns Eased value
 */
function quadOut(t: number): number;

/**
 * Quadratic-in-out easing - gentle acceleration and deceleration
 * @param t - Time progress from 0 to 1
 * @returns Eased value
 */
function quadInOut(t: number): number;
```

### Quartic Easing

Easing functions based on quartic (fourth power) curves.

```typescript { .api }
/**
 * Quartic-in easing - stronger acceleration than cubic
 * @param t - Time progress from 0 to 1
 * @returns Eased value
 */
function quartIn(t: number): number;

/**
 * Quartic-out easing - stronger deceleration than cubic
 * @param t - Time progress from 0 to 1
 * @returns Eased value
 */
function quartOut(t: number): number;

/**
 * Quartic-in-out easing - combines quartIn and quartOut
 * @param t - Time progress from 0 to 1
 * @returns Eased value
 */
function quartInOut(t: number): number;
```

### Quintic Easing

Easing functions based on quintic (fifth power) curves.

```typescript { .api }
/**
 * Quintic-in easing - very strong acceleration
 * @param t - Time progress from 0 to 1
 * @returns Eased value
 */
function quintIn(t: number): number;

/**
 * Quintic-out easing - very strong deceleration
 * @param t - Time progress from 0 to 1
 * @returns Eased value
 */
function quintOut(t: number): number;

/**
 * Quintic-in-out easing - combines quintIn and quintOut
 * @param t - Time progress from 0 to 1
 * @returns Eased value
 */
function quintInOut(t: number): number;
```

### Sine Easing

Easing functions based on sine wave curves.

```typescript { .api }
/**
 * Sine-in easing - smooth sine wave acceleration
 * @param t - Time progress from 0 to 1
 * @returns Eased value
 */
function sineIn(t: number): number;

/**
 * Sine-out easing - smooth sine wave deceleration
 * @param t - Time progress from 0 to 1
 * @returns Eased value
 */
function sineOut(t: number): number;

/**
 * Sine-in-out easing - smooth sine wave acceleration and deceleration
 * @param t - Time progress from 0 to 1
 * @returns Eased value
 */
function sineInOut(t: number): number;
```

## Usage Examples

```typescript
import { cubicOut, elasticOut, bounceIn } from "svelte/easing";
import { tweened } from "svelte/motion";
import { fly, fade } from "svelte/transition";

// Use with tweened values
const progress = tweened(0, {
  duration: 800,
  easing: cubicOut
});

// Use with transitions
// transition:fly={{ y: -20, duration: 300, easing: elasticOut }}
// transition:fade={{ duration: 400, easing: sineInOut }}

// Use with custom animations
function customAnimation(node, { easing = cubicOut }) {
  return {
    duration: 600,
    easing,
    css: (t) => `transform: scale(${t}); opacity: ${t}`
  };
}
```

## Types

```typescript { .api }
type EasingFunction = (t: number) => number;
```

## Choosing Easing Functions

- **cubicOut**: Most versatile, great for UI interactions
- **cubicInOut**: Good for looping animations
- **elasticOut**: Playful, attention-grabbing effects
- **bounceOut**: Fun, energetic animations
- **sineInOut**: Subtle, organic feeling
- **backOut**: Slight overshoot adds polish
- **linear**: Use sparingly, feels mechanical
- **expoOut**: Dramatic, cinematic effects