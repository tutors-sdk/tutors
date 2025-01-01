/**
 * Theme management service for the Tutors application.
 * Handles theme switching, display modes, icon libraries, and special theme effects.
 * Supports multiple icon sets and persists user preferences.
 */

import type { IconType, Theme } from "$lib/services/models/lo-types";
import { FluentIconLib } from "../ui/themes/icons/fluent-icons";
import { HeroIconLib } from "../ui/themes/icons/hero-icons";
import { FestiveIcons } from "../ui/themes/icons/festive-icons";
import { makeItSnow, makeItStopSnowing } from "../ui/themes/events/festive.svelte";
import type { ThemeService } from "$lib/services/types.svelte";
import { rune } from "./utils/runes.svelte";

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

  /** Current display layout */
  layout: rune<string>("expanded"),

  /** Current card style */
  cardStyle: rune<string>("portrait"),

  /** Current light move layout */
  lightMode: rune<string>("light"),

  /** Current theme */
  currentTheme: rune<string>("tutors"),

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
      this.setDisplayMode(localStorage.modeCurrent);
      this.setTheme(localStorage.theme);
      this.setLayout(localStorage.layout);
      this.setCardStyle(localStorage.cardStyle);
    }
  },

  /**
   * Sets and persists the display mode (light/dark)
   * Updates DOM classes for theme application
   * @param mode - Display mode to set
   */
  setDisplayMode(mode: string): void {
    if (!mode) {
      mode = "light";
    }
    this.lightMode.value = mode;
    localStorage.modeCurrent = mode;
    if (mode === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  },

  /**
   * Toggles the display mode between light and dark
   */
  toggleDisplayMode(): void {
    if (this.lightMode.value === "dark") {
      this.setDisplayMode("light");
    } else {
      this.setDisplayMode("dark");
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
    if (themeService.themes.find((theme) => theme.name === this.currentTheme.value)) {
      this.currentTheme.value = theme;
    } else {
      this.currentTheme.value = "tutors";
    }
    document.body.setAttribute("data-theme", this.currentTheme.value);
    localStorage.theme = this.currentTheme.value;
    this.eventTrigger();
  },

  /**
   * Sets and persists the current display layout
   * @param layout - Layout name to set
   */
  setLayout(layout: string): void {
    if (!layout) {
      layout = "expanded";
    }
    this.layout.value = layout;
    localStorage.layout = layout;
  },

  /**
   * Sets and persists the current card style
   * @param style - Card style to set (portrait/landscape)
   */
  setCardStyle(style: string): void {
    if (!style) {
      style = "portrait";
    }
    this.cardStyle.value = style;
    localStorage.cardStyle = style;
  },

  /**
   * Toggles between portrait, landscape, and circular card styles
   */
  toggleCardStyle(): void {
    const styles = ["portrait", "landscape", "circular"];
    const currentIndex = styles.indexOf(this.cardStyle.value);
    const nextIndex = (currentIndex + 1) % styles.length;
    this.setCardStyle(styles[nextIndex]);
  },

  /**
   * Toggles the layout between expanded & compact
   */
  toggleLayout(): void {
    if (this.layout.value === "expanded") {
      this.setLayout("compacted");
    } else {
      this.setLayout("expanded");
    }
  },

  /**
   * Retrieves an icon from the current theme's icon library
   * Falls back to default icon if not found
   * @param type - Icon type to retrieve
   * @returns IconType definition for requested type
   */
  getIcon(type: string): IconType {
    const iconLib = themeService.themes.find((theme) => theme.name === this.currentTheme.value)?.icons;
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
    const iconLib = themeService.themes.find((theme) => theme.name === this.currentTheme.value)?.icons;
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
    if (this.currentTheme.value === "festive") {
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
