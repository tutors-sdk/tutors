import type { TutorsId } from "$lib/services/connect";
import type { Course, Lo } from "@tutors/tutors-model-lib";


export const rune = <T>(initialValue: T) => {
  let _rune = $state(initialValue);
  return {
    get value() {
      return _rune;
    },
    set value(v: T) {
      _rune = v;
    }
  };
};

export const currentLabStepIndex = rune(0);
export const adobeLoaded = rune(false);
export const animationDelay = rune(200);

export const currentLo = rune<Lo | null>(null);
export const currentCourse = rune<Course | null>(null);

export const tutorsId = rune<TutorsId | null>(null);
