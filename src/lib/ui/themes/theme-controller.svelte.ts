import { currentTheme, lightMode } from "$lib/runes";
import type { IconType } from "$lib/services/models/lo-types";
import { FluentIconLib } from "./icons/fluent-icons";
import { HeroIconLib } from "./icons/hero-icons";
import { FestiveIcons } from "./icons/festive-icons";
import { makeItSnow, makeItStopSnowing } from "./events/festive.svelte";

export const themes = [
  { name: "tutors", icons: FluentIconLib },
  { name: "classic", icons: FluentIconLib },
  { name: "dyslexia", icons: FluentIconLib },
  { name: "festive", icons: FestiveIcons },
  { name: "nouveau", icons: FluentIconLib },
  { name: "rose", icons: FluentIconLib },
  { name: "cerberus", icons: FluentIconLib }
];

export function initDisplay(): void {
  if (localStorage.modeCurrent) {
    lightMode.value = localStorage.modeCurrent;
  } else {
    lightMode.value = "light";
  }
  setDisplayMode(localStorage.modeCurrent);
  setTheme(localStorage.theme);
}

export function setDisplayMode(mode: string): void {
  lightMode.value = mode;
  localStorage.modeCurrent = mode;
  if (mode === "dark") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
}

export function setTheme(theme: string): void {
  if (!theme) {
    theme = "tutors";
  }
  if (themes.find((theme) => theme.name === currentTheme.value)) {
    currentTheme.value = theme;
  } else {
    currentTheme.value = "tutors";
  }
  document.body.setAttribute("data-theme", currentTheme.value);
  localStorage.theme = currentTheme.value;

  if (currentTheme.value === "festive") {
    makeItSnow();
  } else {
    makeItStopSnowing();
  }
}

export function getIcon(type: string): IconType {
  const iconLib = themes.find((theme) => theme.name === currentTheme.value)?.icons;
  if (iconLib && iconLib[type]) {
    return iconLib[type];
  } else {
    console.log("No type found for icon", type);
    return FluentIconLib.tutors;
  }
}

export function addIcon(type: string, icon: IconType) {
  FluentIconLib[type] = icon;
  HeroIconLib[type] = icon;
  FestiveIcons[type] = icon;
}

export function getTypeColour(type: string): string {
  const iconLib = themes.find((theme) => theme.name === currentTheme.value)?.icons;
  if (iconLib && iconLib[type]) {
    return iconLib[type].color;
  }
  return "primary";
}
