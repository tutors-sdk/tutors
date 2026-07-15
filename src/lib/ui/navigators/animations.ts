import { animationDelay } from "$lib/runes.svelte";
import { cubicOut } from "svelte/easing";

export const scaleTransition = {
  duration: animationDelay.value,
  start: 0.4,
  easing: cubicOut
};

export const slideFromRight = {
  in: { x: 200, duration: animationDelay.value, delay: animationDelay.value },
  out: { x: 200, duration: animationDelay.value }
};
