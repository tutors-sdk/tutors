/**
 * Utility types and functions for learning objects
 */

import type { Lo } from "./learning-objects.ts";

/**
 * Dynamic property collection for learning objects
 */
export class Properties {
  [key: string]: string;
}

/**
 * Simple learning object types
 * Used for type checking and filtering
 */
export const simpleTypes = [
  "note",
  "archive",
  "web",
  "github",
  "panelnote",
  "paneltalk",
  "panelvideo",
  "talk",
  "book",
  "lab",
];

/**
 * Composite learning object types
 * Used for type checking and filtering
 */
export const loCompositeTypes = ["unit", "side", "topic", "course"];

/**
 * All learning object types
 * Used for type checking and filtering
 */
export const loTypes: string[] = simpleTypes.concat(loCompositeTypes);

/**
 * Type alias for learning object types
 */
export type LoType = (typeof loTypes)[number];

/**
 * Checks if a learning object is composite (contains other Los)
 * @param lo Learning object to check
 * @returns boolean indicating if Lo is composite
 */
export function isCompositeLo(lo: Lo): boolean {
  return loCompositeTypes.includes(lo.type);
}

/**
 * Learning object type ordering
 * Used for sorting and display
 */
export const preOrder: Map<string, number> = new Map([
  ["course", 0],
  ["unit", 1],
  ["side", 2],
  ["topic", 3],
  ["talk", 4],
  ["book", 5],
  ["lab", 6],
  ["note", 7],
  ["web", 8],
  ["github", 9],
  ["archive", 10],
  ["panelnote", 11],
  ["paneltalk", 12],
  ["panelvideo", 13],
]);

/**
 * Student interaction tracking for learning objects
 */
export interface LearningRecord {
  date: Date;
  pageLoads: number;
  timeActive: number;
}

