/**
 * Core type definitions for the Tutors application.
 * Defines interfaces for services, data models, and user interactions.
 */

import type { IconType } from "$lib/services/base/lo-types";
import type { LoUser } from "$lib/services/community";

/**
 * Collection of icon definitions
 */
export type IconLib = Record<string, IconType>;

/**
 * Theme definition with icons
 */
export type Theme = {
  name: string; // Theme name
  icons: IconLib; // Theme icons
};

/** Layout type for card display */
export type LayoutType = "expanded" | "compacted";

/** Card style type for display options */
export type CardStyleType = "portrait" | "landscape" | "circular";

/** Card configuration - to be able to override the ambient settings */
export type CardConfig = {
  style: CardStyleType;
  layout: LayoutType;
};

/**
 * Display information for course/topic/lab cards
 */
export interface CardDetails {
  route: string;
  title?: string;
  type: string;
  summary?: string;
  summaryEx?: string;
  icon?: IconType;
  img?: string;
  student?: LoUser;
  video?: string;
  metric?: string;
}

/**
 * Service for theme management and icon customization
 */
export interface ThemeService {
  /** Available themes with their icon libraries */
  themes: Theme[];
  /** current theme */
  currentTheme: any;
  layout: { value: LayoutType };
  lightMode: any;
  cardStyle: { value: CardStyleType };
  /** Tracks if festive snow animation is active */
  isSnowing: boolean;

  initDisplay(forceTheme?: string, forceMode?: string): void;
  setDisplayMode(mode: string): void;
  toggleDisplayMode(): void;
  setTheme(theme: string): void;
  setLayout(layout: string): void;
  toggleLayout(): void;
  setCardStyle(style: string): void;
  getIcon(type: string): IconType;
  addIcon(type: string, icon: IconType): void;
  getTypeColour(type: string): string;
  eventTrigger(): void;
}
