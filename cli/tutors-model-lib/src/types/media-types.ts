/**
 * Media-related types and constants
 */

/**
 * Supported image file extensions for learning objects
 */
export const imageTypes = [
  "png",
  "jpg",
  "jpeg",
  "gif",
  "svg",
  "PNG",
  "JPG",
  "JPEG",
  "GIF",
  "SVG",
];

/**
 * Supported asset file types, including images and documents
 */
export const assetTypes: string[] = imageTypes.concat([
  "pdf",
  "zip",
  "html",
  "htm",
  "yaml",
  "xls",
  "xlsx",
  "xlsm",
  "csv",
  "pkt",
  "css",
  "kt",
  "json",
  "java",
  "py",
  "js",
]);

/**
 * Video service identifier
 */
export type VideoIdentifier = {
  service: string;
  id: string;
  url?: string;
  externalUrl?: string;
};

/**
 * Collection of video identifiers
 */
export type VideoIdentifiers = {
  videoid: string;
  videoIds: VideoIdentifier[];
};
