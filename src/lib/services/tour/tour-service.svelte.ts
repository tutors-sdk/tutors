import { rune } from "$lib/runes.svelte";
import type { TourStep } from "./types";
import { courseReaderSteps } from "./steps";
import { browser } from "$app/environment";

const TOUR_COMPLETED_KEY = "tutors-tour-completed";

function createTourService() {
  const isOpen = rune(false);
  const currentStepIndex = rune(0);
  const activeSteps = rune<TourStep[]>([]);

  function isElementVisible(el: Element): boolean {
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function start(steps: TourStep[] = courseReaderSteps) {
    if (!browser) return;
    const visible = steps.filter((step) => {
      const el = document.querySelector(step.target);
      if (!el) return false;
      if (step.optional && !isElementVisible(el)) return false;
      return true;
    });
    if (visible.length === 0) return;
    activeSteps.value = visible;
    currentStepIndex.value = 0;
    isOpen.value = true;
  }

  function next() {
    if (currentStepIndex.value < activeSteps.value.length - 1) {
      currentStepIndex.value++;
    } else {
      complete();
    }
  }

  function prev() {
    if (currentStepIndex.value > 0) {
      currentStepIndex.value--;
    }
  }

  function skip() {
    isOpen.value = false;
    currentStepIndex.value = 0;
    activeSteps.value = [];
  }

  function complete() {
    isOpen.value = false;
    currentStepIndex.value = 0;
    activeSteps.value = [];
    if (browser) {
      localStorage.setItem(TOUR_COMPLETED_KEY, "true");
    }
  }

  return {
    isOpen,
    currentStepIndex,
    activeSteps,

    get currentStep(): TourStep | null {
      return activeSteps.value[currentStepIndex.value] ?? null;
    },

    get totalSteps(): number {
      return activeSteps.value.length;
    },

    get isFirstStep(): boolean {
      return currentStepIndex.value === 0;
    },

    get isLastStep(): boolean {
      return currentStepIndex.value === activeSteps.value.length - 1;
    },

    get hasCompleted(): boolean {
      if (!browser) return false;
      return localStorage.getItem(TOUR_COMPLETED_KEY) === "true";
    },

    start,
    next,
    prev,
    skip,
    complete
  };
}

export const tourService = createTourService();
