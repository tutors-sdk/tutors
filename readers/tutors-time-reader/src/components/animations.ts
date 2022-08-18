import { cubicInOut, cubicOut } from "svelte/easing";

export const cardTransition = () => {
  return {
    css: (t) => {
      return `transform: scale(${t}); `;
    },
    easing: cubicInOut,
    baseScale: 0.5,
    duration: 250,
    delay: 250
  };
};

export const talkTransition = () => {
  return {
    css: (t) => {
      return `transform: scale(${t}); `;
    },
    easing: cubicOut,
    baseScale: 0.2,
    duration: 250,
    delay: 250
  };
};


export const viewDelay = 500;
