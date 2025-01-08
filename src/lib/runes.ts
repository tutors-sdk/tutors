import type { Course, Lo } from "./services/course/models/lo-types";
import type { TutorsId } from "./services/types.svelte";
import { rune } from "./services/utils/runes.svelte";

export const currentLabStepIndex = rune(0);
export const adobeLoaded = rune(false);
export const animationDelay = rune(200);

export const currentLo = rune<Lo | null>(null);
export const currentCourse = rune<Course | null>(null);

export const tutorsId = rune<TutorsId | null>(null);
