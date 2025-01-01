import type { Course, Lo } from "./services/models/lo-types";
import { rune } from "./services/utils/runes.svelte";

export const currentLabStepIndex = rune(0);
export const adobeLoaded = rune(false);
export const animationDelay = rune(200);


export const currentLo = rune<Lo | null>(null);
export const currentCourse = rune<Course | null>(null);