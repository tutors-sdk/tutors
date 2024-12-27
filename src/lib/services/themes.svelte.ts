/**
 * Theme management service for the Tutors application.
 * Handles theme switching, display modes, icon libraries, and special theme effects.
 * Supports multiple icon sets and persists user preferences.
 */

import { currentTheme, lightMode } from "$lib/runes";
import type { IconType, Theme } from "$lib/services/models/lo-types";
import { FluentIconLib } from "../ui/themes/icons/fluent-icons";
import { HeroIconLib } from "../ui/themes/icons/hero-icons";
import { FestiveIcons } from "../ui/themes/icons/festive-icons";
import { makeItSnow, makeItStopSnowing } from "../ui/themes/events/festive.svelte";
import type { ThemeService } from "$lib/services/types.svelte";

/**
 * Implementation of the ThemeService interface.
 * Manages application theming, icon sets, and theme-specific effects.
 */
export const themeService: ThemeService = {
  /** Available themes with their associated icon libraries */
  themes: [
    { name: "tutors", icons: FluentIconLib },
    { name: "classic", icons: FluentIconLib },
    { name: "dyslexia", icons: FluentIconLib },
    { name: "festive", icons: FestiveIcons },
    { name: "nouveau", icons: FluentIconLib },
    { name: "rose", icons: FluentIconLib },
    { name: "cerberus", icons: FluentIconLib }
  ] as Theme[],

  /** State tracker for festive theme snow animation */
  isSnowing: false,

  /**
   * Initializes theme display settings on application start
   * Handles both forced themes and user preferences
   * @param forceTheme - Optional theme to enforce
   * @param forceMode - Optional display mode to enforce
   */
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
    }
  },

  /**
   * Sets and persists the display mode (light/dark)
   * Updates DOM classes for theme application
   * @param mode - Display mode to set
   */
  setDisplayMode(mode: string): void {
    lightMode.value = mode;
    localStorage.modeCurrent = mode;
    if (mode === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  },

  /**
   * Sets and persists the current theme
   * Updates DOM attributes and triggers theme-specific events
   * @param theme - Theme name to set
   */
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

  /**
   * Retrieves an icon from the current theme's icon library
   * Falls back to default icon if not found
   * @param type - Icon type to retrieve
   * @returns IconType definition for requested type
   */
  getIcon(type: string): IconType {
    const iconLib = themeService.themes.find((theme) => theme.name === currentTheme.value)?.icons;
    if (iconLib && iconLib[type]) {
      return iconLib[type];
    } else {
      console.log("No type found for icon", type);
      return FluentIconLib.tutors;
    }
  },

  /**
   * Adds a new icon to all available icon libraries
   * @param type - Icon type identifier
   * @param icon - Icon definition to add
   */
  addIcon(type: string, icon: IconType) {
    FluentIconLib[type] = icon;
    HeroIconLib[type] = icon;
    FestiveIcons[type] = icon;
  },

  /**
   * Gets the color associated with a type in the current theme
   * @param type - Type to get color for
   * @returns Color string or 'primary' if not found
   */
  getTypeColour(type: string): string {
    const iconLib = themeService.themes.find((theme) => theme.name === currentTheme.value)?.icons;
    if (iconLib && iconLib[type]) {
      return iconLib[type].color;
    }
    return "primary";
  },

  /**
   * Triggers theme-specific events
   * Currently handles festive theme snow animation
   */
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
