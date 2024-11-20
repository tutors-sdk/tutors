import { currentTheme } from "$lib/runes";
import type { IconType } from "$lib/services/models/lo-types";
import { FluentIconLib } from "../icons/fluent-icons";
import { HeroIconLib } from "../icons/hero-icons";

let StandardIconLib = FluentIconLib;
export const themes = ["festive", "tutors", "dyslexia", "skeleton", "seafoam", "vintage"];

export const themeIcons = {
  festive: FluentIconLib,
  tutors: FluentIconLib,
  dyslexia: FluentIconLib,
  skeleton: HeroIconLib,
  seafoam: FluentIconLib,
  vintage: HeroIconLib
};

export function setIconLibForTheme() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  StandardIconLib = themeIcons[currentTheme.value];
}

export function getIcon(type: string): IconType {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return StandardIconLib[type];
}

export function addIcon(type: string, icon: IconType) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  FluentIconLib[type] = icon;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  HeroIconLib[type] = icon;
}
