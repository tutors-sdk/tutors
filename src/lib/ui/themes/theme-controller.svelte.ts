import { currentCodeTheme, currentTheme, lightMode } from "$lib/runes";
import type { IconType, Theme } from "$lib/services/models/lo-types";
import { FluentIconLib } from "./icons/fluent-icons";
import { HeroIconLib } from "./icons/hero-icons";
import { FestiveIcons } from "./icons/festive-icons";
import { makeItSnow, makeItStopSnowing } from "./events/festive.svelte";

export const themeService = {
  themes: [
    { name: "tutors", icons: FluentIconLib },
    { name: "classic", icons: FluentIconLib },
    { name: "dyslexia", icons: FluentIconLib },
    { name: "festive", icons: FestiveIcons },
    { name: "nouveau", icons: FluentIconLib },
    { name: "rose", icons: FluentIconLib },
    { name: "cerberus", icons: FluentIconLib }
  ] as Theme[],

  codeThemes: ["monokai", "night-owl", "github-dark", "catppuccin-mocha", "solarized-dark", "solarized-light"],

  isSnowing: false,

  initDisplay(forceTheme?: string, forceMode?: string): void {
    if (forceTheme && forceMode && !localStorage.forceTheme) {
      this.setDisplayMode(forceMode);
      this.setTheme(forceTheme);
      localStorage.forceTheme = true;
    } else {
      if (localStorage.modeCurrent) {
        lightMode.value = localStorage.modeCurrent;
      } else {
        lightMode.value = "light";
      }
      this.setDisplayMode(localStorage.modeCurrent);
      this.setTheme(localStorage.theme);
      this.setCodeTheme(localStorage.codeTheme);
    }
  },

  setDisplayMode(mode: string): void {
    lightMode.value = mode;
    localStorage.modeCurrent = mode;
    if (mode === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  },

  setTheme(theme: string): void {
    if (!theme) {
      theme = "tutors";
    }
    if (themeService.themes.find((theme) => theme.name === currentTheme.value)) {
      currentTheme.value = theme;
    } else {
      currentTheme.value = "tutors";
    }
    document.body.setAttribute("data-theme", currentTheme.value);
    localStorage.theme = currentTheme.value;
    this.eventTrigger();
  },

  setCodeTheme(theme: string): void {
    if (!theme) {
      theme = "monokai";
    }
    if (themeService.codeThemes.includes(theme)) {
      currentCodeTheme.value = theme;
    } else {
      currentCodeTheme.value = "monokai";
    }
    localStorage.codeTheme = currentCodeTheme.value;
  },

  initCodeTheme() {
    this.setCodeTheme(localStorage.codeTheme);
  },

  getIcon(type: string): IconType {
    const iconLib = themeService.themes.find((theme) => theme.name === currentTheme.value)?.icons;
    if (iconLib && iconLib[type]) {
      return iconLib[type];
    } else {
      console.log("No type found for icon", type);
      return FluentIconLib.tutors;
    }
  },

  addIcon(type: string, icon: IconType) {
    FluentIconLib[type] = icon;
    HeroIconLib[type] = icon;
    FestiveIcons[type] = icon;
  },

  getTypeColour(type: string): string {
    const iconLib = themeService.themes.find((theme) => theme.name === currentTheme.value)?.icons;
    if (iconLib && iconLib[type]) {
      return iconLib[type].color;
    }
    return "primary";
  },

  eventTrigger(): void {
    if (currentTheme.value === "festive") {
      makeItSnow();
      this.isSnowing = true;
    } else {
      if (this.isSnowing) {
        this.isSnowing = false;
        makeItStopSnowing();
      }
    }
  }
};
