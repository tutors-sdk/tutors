import { animationDelay } from "$lib/runes.svelte";
import { cubicOut, elasticOut, backOut, linear } from "svelte/easing";

export const scaleTransition = {
  duration: animationDelay.value,
  start: 0.4,
  easing: cubicOut
};

export const slideFromLeft = {
  in: { x: -200, duration: animationDelay.value, delay: animationDelay.value },
  out: { x: -200, duration: animationDelay.value }
};

export const slideFromRight = {
  in: { x: 200, duration: animationDelay.value, delay: animationDelay.value },
  out: { x: 200, duration: animationDelay.value }
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
