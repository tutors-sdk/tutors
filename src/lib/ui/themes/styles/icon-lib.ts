import { browser } from "$app/environment";
import { storeTheme } from "$lib/stores";
import type { IconType } from "$lib/services/models/lo-types";
import { FluentIconLib } from "../icons/fluent-icons";
import { HeroIconLib } from "../icons/hero-icons";

let StandardIconLib: any = FluentIconLib;
export const themes = ["tutors", "dyslexia", "skeleton", "seafoam", "vintage"];

export const themeIcons: Record<string, any> = {
  tutors: FluentIconLib,
  dyslexia: FluentIconLib,
  skeleton: HeroIconLib,
  seafoam: FluentIconLib,
  vintage: HeroIconLib
};

let currentTheme = "tutors";
storeTheme.subscribe((current) => {
  currentTheme = current;
  StandardIconLib = themeIcons[current] || FluentIconLib;
});

// Subscribe to the theme store and update the body class
storeTheme.subscribe((value) => {
  console.log(`Theme changed to: ${value}`);
  if (browser) {
    document.body.className = `theme-${value}`;
  }
});

export function setIconLib(iconLib: any) {
  StandardIconLib = iconLib;
}

export function getIcon(type: string): IconType {
  return StandardIconLib[type] || StandardIconLib.default;
}

export const currentIconLib: any = StandardIconLib;

export function addIcon(type: string, icon: IconType) {
  StandardIconLib[type] = icon;
}
