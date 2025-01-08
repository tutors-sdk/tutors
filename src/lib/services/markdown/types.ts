import type { Course, Lab, Lo, Note } from "$lib/services/base/lo-types";

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
