import { animationDelay } from "$lib/runes.svelte";
import { prefersReducedMotion } from "$lib/services/a11y/reduced-motion.svelte";
import { cubicOut, elasticOut, backOut, linear } from "svelte/easing";

function duration() {
  return prefersReducedMotion.value ? 0 : animationDelay.value;
}

export const scaleTransition = {
  get duration() { return duration(); },
  get start() { return prefersReducedMotion.value ? 1 : 0.4; },
  easing: cubicOut
};

export const slideFromRight = {
  get in() { return { x: prefersReducedMotion.value ? 0 : 200, duration: duration(), delay: duration() }; },
  get out() { return { x: prefersReducedMotion.value ? 0 : 200, duration: duration() }; }
};

// export const popTransition = {
//   duration: 100,
//   start: 0.2,
//   easing: elasticOut,
//   opacity: 0
// };

// export const slideTransition = {
//   duration: 250,
//   y: 20,
//   easing: cubicOut,
//   opacity: 0
// };

// export const bounceTransition = {
//   duration: 100,
//   y: 20,
//   easing: backOut,
//   opacity: 0
// };
