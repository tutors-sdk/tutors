/**
 * Core type definitions for the Tutors application.
 * Defines interfaces for services, data models, and user interactions.
 */

import type { Course, IconType, Lab, Lo, Note, Theme } from "./course/models/lo-types";

/** Layout type for card display */
export type LayoutType = "expanded" | "compacted";

/** Card style type for display options */
export type CardStyleType = "portrait" | "landscape" | "circular";

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
}

/**
 * Service for tracking user interactions and learning analytics
 */
export interface AnalyticsService {
  /** Current learning object route being tracked */
  loRoute: string;

  learningEvent(course: Course, params: Record<string, unknown>, lo: Lo, student: TutorsId): void;
  reportPageLoad(course: Course, lo: Lo, student: TutorsId): void;
  updatePageCount(course: Course, lo: Lo, student: TutorsId): void;
  updateLogin(courseId: string, session: any): void;
}

/**
 * Service for processing and rendering markdown content
 */
export interface MarkdownService {
  /** Available syntax highlighting themes */
  codeThemes: any;

  setCodeTheme(theme: string): void;
  convertLabToHtml(course: Course, lab: Lab, refreshOnly?: boolean): void;
  convertNoteToHtml(course: Course, note: Note, refreshOnly?: boolean): void;
  convertLoToHtml(course: Course, lo: Lo): void;
  replaceAll(str: string, find: string, replace: string): string;
  filter(src: string, url: string): string;
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
