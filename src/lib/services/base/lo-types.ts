/**
 * @module LoTypes
 * Core type definitions for the Tutors learning object system
 * Defines the structure and relationships between different types of learning objects (Los)
 */

import type { IconNavBar } from "$lib/services/themes";

/**
 * Supported image file extensions for learning objects
 */
export const imageTypes = ["png", "jpg", "jpeg", "gif", "PNG", "JPG", "JPEG", "GIF"];

/**
 * Supported asset file types, including images and documents
 */
export const assetTypes = imageTypes.concat(["pdf", "zip", "html", "htm", "yaml", "xls", "xlsx", "xlsm", "csv"]);

/**
 * Represents a week in the course calendar
 */
export type WeekType = {
  title: string; // Week title/name
  type: string; // Type identifier
  date: string; // Date string
  dateObj: Date; // JavaScript Date object
};

/**
 * Course calendar structure
 */
export type Calendar = {
  title: string; // Calendar title
  weeks: WeekType[]; // Array of course weeks
  currentWeek: WeekType; // Current active week
};

/**
 * Video service identifier
 */
export type VideoIdentifier = {
  service: string; // Video platform (e.g., "youtube", "vimeo")
  id: string; // Video ID on the platform
  url?: string; // Video URL
  externalUrl?: string; // External video URL
};

/**
 * Collection of video identifiers
 */
export type VideoIdentifiers = {
  videoid: string; // Primary video ID
  videoIds: VideoIdentifier[]; // All video sources
};

/**
 * Base structure for learning resources
 */
export type LearningResource = {
  courseRoot: string; // Root path of the course
  route: string; // URL route to the resource
  id: string; // Unique identifier
  lrs: LearningResource[]; // Nested learning resources
  files: Array<string>; // Associated files
  type: string; // Resource type
};

/**
 * Dynamic property collection for learning objects
 */
export class Properties {
  [key: string]: string;
}

/**
 * Icon definition with type and color
 */
export type IconType = {
  type: string; // Icon identifier
  color: string; // Icon color
};

/**
 * Student interaction tracking for learning objects
 */
export interface LearningRecord {
  date: Date; // Interaction date
  pageLoads: number; // Page view count
  timeActive: number; // Active time in seconds
}

/**
 * Core learning object type
 * Represents any content unit in the Tutors system
 */
export type Lo = {
  type: string; // Lo type identifier
  id: string; // Unique identifier (folder name)
  title: string; // Primary title
  summary: string; // Brief description
  contentMd: string; // Markdown content
  frontMatter: Properties; // YAML frontmatter properties
  contentHtml?: string; // Rendered HTML content
  route: string; // URL path
  authLevel: number; // Access control level

  img: string; // Image URL
  imgFile: string; // Image filename
  icon?: IconType; // Fallback icon

  video: string; // Primary video ID
  videoids: VideoIdentifiers; // All video sources

  hide: boolean; // Visibility flag

  parentLo?: Lo; // Parent learning object
  parentTopic?: Topic; // Parent topic
  parentCourse?: Course; // Parent course
  breadCrumbs?: Lo[]; // Navigation hierarchy

  learningRecords?: Map<string, LearningRecord>; // Student interaction data
};

/**
 * Lab step definition
 * Represents a single step in a lab
 */
export type LabStep = {
  title: string; // Step title
  shortTitle: string; // Short title for display
  contentMd: string; // Markdown content
  contentHtml?: string; // Rendered HTML content
  route: string; // URL path
  id: string; // Unique identifier
  parentLo?: Lab; // Parent lab
  type: string; // Step type
};

/**
 * Lab learning object
 * Contains multiple ordered steps
 */
export type Lab = Lo & {
  type: "lab";
  los: LabStep[];
  pdf: string; // Route to PDF for the lo
  pdfFile: string; // PDF file name
};

/**
 * Talk learning object
 * Represents a presentation or lecture
 */
export type Talk = Lo & {
  type: "talk";
  pdf: string; // Route to PDF for the lo
  pdfFile: string; // PDF file name
};

/**
 * Archive learning object
 * Represents downloadable content
 */
export type Archive = Lo & {
  type: "archive";
  archiveFile?: string; // Archive file in the lo
};

/**
 * Web resource learning object
 */
export type Web = Lo & {
  type: "web";
};

/**
 * GitHub repository learning object
 */
export type Github = Lo & {
  type: "github";
};

/**
 * Note learning object
 * Simple text content
 */
export type Note = Lo & {
  type: "note";
};

/**
 * Panel-style note learning object
 */
export type PanelNote = Lo & {
  type: "panelnote";
};

/**
 * Panel-style talk learning object
 */
export type PanelTalk = Talk & {
  type: "paneltalk";
};

/**
 * Panel-style video learning object
 */
export type PanelVideo = Lo & {
  type: "panelvideo";
};

/**
 * Collection of panel-style learning objects
 */
export type Panels = {
  panelVideos: PanelVideo[]; // Collection of panel videos
  panelTalks: PanelTalk[]; // Collection of panel talks
  panelNotes: PanelNote[]; // Collection of panel notes
};

/**
 * Collection of course units and sides
 */
export type Units = {
  units: Unit[]; // Main course units
  sides: Side[]; // Supplementary units
  standardLos: Lo[]; // Standard learning objects
};

/**
 * Composite learning object structure
 */
export type Composite = Lo & {
  toc: Lo[]; // Table of contents
  los: Lo[]; // Child los
  panels: Panels; // Child panel los
  units: Units; // Child units and sides
};

/**
 * Topic learning object
 * Groups related content
 */
export type Topic = Composite & {
  type: "topic";
};

/**
 * Unit learning object
 * Major course section
 */
export type Unit = Composite & {
  type: "unit";
};

/**
 * Side learning object
 * Supplementary content
 */
export type Side = Composite & {
  type: "side";
};

/**
 * Course learning object
 * Top-level container for all course content
 */
export type Course = Composite & {
  type: "course";
  courseId: string; // Unique course identifier
  courseUrl: string; // Course URL
  topicIndex: Map<string, Topic>; // Index of all topics
  loIndex: Map<string, Lo>; // Index of all los
  walls?: Lo[][]; // 2D array of learning objects
  wallMap?: Map<string, Lo[]>; // Map of learning objects
  properties: Properties; // Contents of properties.yaml
  calendar?: Properties; // Contents of calendar.yaml
  enrollment?: string[]; // Contents of enrollment.yaml
  courseCalendar?: Calendar; // Course calendar
  authLevel: number; // Access control level
  isPortfolio: boolean; // Portfolio flag
  isPrivate: boolean; // Privacy flag
  llms: boolean; // LLM flag
  areVideosHidden: boolean; // Video visibility flag
  areLabStepsAutoNumbered: boolean; // Lab step numbering flag
  hasEnrollment: boolean; // Enrollment flag
  hasCalendar: boolean; // Calendar flag
  hasWhiteList: boolean; // Whitelist flag
  defaultPdfReader: string; // PDF reader setting
  footer: string; // Footer content
  ignorePin: string; // Ignore pin
  companions: IconNavBar; // Companion navigation
  wallBar: IconNavBar; // Wall navigation
};

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
  "lab"
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
export const loTypes = simpleTypes.concat(loCompositeTypes);

/**
 * Type alias for learning object types
 */
export type LoType = (typeof loTypes)[number];

/**
 * Checks if a learning object is composite (contains other Los)
 * @param lo Learning object to check
 * @returns boolean indicating if Lo is composite
 */
export function isCompositeLo(lo: Lo) {
  return loCompositeTypes.includes(lo.type);
}

/**
 * Learning object type ordering
 * Used for sorting and display
 */
export const preOrder = new Map([
  ["unit", 1],
  ["side", 2],
  ["talk", 3],
  ["book", 4],
  ["archive", 5],
  ["github", 6],
  ["web", 7],
  ["note", 8],
  ["panelnote", 9],
  ["paneltalk", 10],
  ["panelvideo", 11]
]);
