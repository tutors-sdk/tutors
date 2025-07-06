import type { Course, Lab, Lo, Note } from "@tutors/tutors-model-lib";

/**
 * Service for processing and rendering markdown content
 */
export interface MarkdownService {
  /** Available syntax highlighting themes */
  codeThemes: any;

  setCodeTheme(theme: string): void;
  convertLabToHtml(course: Course, lab: Lab, refreshOnly?: boolean): void;
  convertNoteToHtml(course: Course, note: Note, refreshOnly?: boolean): void;
}
