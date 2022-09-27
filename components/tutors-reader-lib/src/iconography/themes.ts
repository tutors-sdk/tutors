import { FluentIconLib } from "tutors-reader-lib/src/iconography/support/fluent-icons";
// import { currentCourse } from "../stores";
import type { IconType } from "tutors-reader-lib/src/types/icon-types";

let StandardIconLib = FluentIconLib;

export function setIconLib(iconLib: any) {
  StandardIconLib = iconLib;
}

export const themes = ["tutors", "tutors-dark", "tutors-black", "tutors-dyslexia", "tutors-wireframe"];

export const themeIcons = {
  tutors: FluentIconLib,
  "tutors-dark": FluentIconLib,
  "tutors-dyslexia": FluentIconLib,
  "tutors-black": FluentIconLib,
  "tutors-wireframe": FluentIconLib,
};

export function getIcon(type: string): IconType {
  let icon: IconType = StandardIconLib.default;
  if (currentIconLib[type]) {
    icon = currentIconLib[type];
  } else {
    if (StandardIconLib[type]) {
      icon = StandardIconLib[type];
    }
  }
  return icon;
}

export let currentIconLib: any = StandardIconLib;

// currentCourse.subscribe((course) => {
//   if (course && course.lo && course.lo.properties.iconset) {
//     currentIconLib = course.lo.properties.iconset;
//   } else {
//     currentIconLib = StandardIconLib;
//   }
// });

export function addIcon(type: string, icon: IconType) {
  StandardIconLib[type] = icon;
}
