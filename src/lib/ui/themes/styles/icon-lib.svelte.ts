import { currentTheme, lightMode } from "$lib/runes";
import type { IconType } from "$lib/services/models/lo-types";

import { FluentIconLib } from "../icons/fluent-icons";
import { HeroIconLib } from "../icons/hero-icons";

let StandardIconLib: { [key: string]: IconType } = FluentIconLib;
export const themes = ["tutors", "nouveau", "concord", "nosh", "rose", "fennec", "mona", "cerberus"];

export const themeIcons = {
  tutors: FluentIconLib,
  nouveau: FluentIconLib,
  concord: FluentIconLib,
  rose: FluentIconLib,
  nosh: FluentIconLib,
  fennec: FluentIconLib,
  mona: FluentIconLib,
  cerberus: HeroIconLib
};

export function setDisplayMode(mode: string): void {
  if (!mode) {
    mode = "light";
  }
  lightMode.value = mode;
  localStorage.modeCurrent = mode;
  if (mode === "dark") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
}

export function setTheme(theme: string): void {
  currentTheme.value = theme;
  document.body.setAttribute("data-theme", currentTheme.value);
  localStorage.theme = currentTheme.value;
  setIconLibForTheme(currentTheme.value);
}

export function setIconLibForTheme(theme: string) {
  StandardIconLib = themeIcons[currentTheme.value];
}

export function getIcon(type: string): IconType {
  if (StandardIconLib[type]) {
    return StandardIconLib[type];
  } else {
    console.log("No type found for icon", type);
    return StandardIconLib.tutors;
  }
}

export function addIcon(type: string, icon: IconType) {
  FluentIconLib[type] = icon;
  HeroIconLib[type] = icon;
}

export function getTypeColour(type: string): string {
  return StandardIconLib[type].color;
}
