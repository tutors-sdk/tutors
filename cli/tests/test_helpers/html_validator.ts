/**
 * HTML Validator Helper
 *
 * Provides validation functions for generated HTML output.
 * Validates structure, navigation, and content integrity.
 *
 * Follows KISS principles - direct validation with clear error messages.
 */

import { DOMParser, Element } from "deno-dom";

/**
 * HTML validation result structure
 */
export interface HtmlValidationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate HTML file structure
 *
 * @param htmlPath - Path to HTML file
 * @returns Validation result
 */
export async function validateHtmlStructure(htmlPath: string): Promise<HtmlValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const content = await Deno.readTextFile(htmlPath);
    const doc = new DOMParser().parseFromString(content, "text/html");

    if (!doc) {
      return {
        success: false,
        errors: ["Failed to parse HTML document"],
        warnings: [],
      };
    }

    // Check for basic structure
    if (!doc.querySelector("html")) {
      errors.push("Missing <html> element");
    }

    if (!doc.querySelector("head")) {
      errors.push("Missing <head> element");
    }

    if (!doc.querySelector("body")) {
      errors.push("Missing <body> element");
    }

    // Check for title
    const title = doc.querySelector("title");
    if (!title) {
      warnings.push("Missing <title> element in <head>");
    } else if (!title.textContent || title.textContent.trim().length === 0) {
      warnings.push("Empty <title> element");
    }

    // Check for charset
    const charset = doc.querySelector("meta[charset]");
    if (!charset) {
      warnings.push("Missing charset meta tag");
    }

    return {
      success: errors.length === 0,
      errors,
      warnings,
    };
  } catch (error) {
    return {
      success: false,
      errors: [`Failed to read HTML file: ${error instanceof Error ? error.message : String(error)}`],
      warnings: [],
    };
  }
}

/**
 * Validate HTML navigation links
 *
 * @param htmlPath - Path to HTML file
 * @param baseDir - Base directory for resolving relative links
 * @returns Validation result
 */
export async function validateHtmlLinks(
  htmlPath: string,
  baseDir: string,
): Promise<HtmlValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const content = await Deno.readTextFile(htmlPath);
    const doc = new DOMParser().parseFromString(content, "text/html");

    if (!doc) {
      return {
        success: false,
        errors: ["Failed to parse HTML document"],
        warnings: [],
      };
    }

    // Check all anchor tags
    const links = doc.querySelectorAll("a[href]");
    for (const link of links) {
      const href = (link as Element).getAttribute("href");
      if (!href) continue;

      // Skip external links, anchors, and javascript
      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("#") ||
        href.startsWith("javascript:")
      ) {
        continue;
      }

      // Check if local link file exists
      const linkPath = `${baseDir}/${href}`;
      try {
        await Deno.stat(linkPath);
      } catch {
        warnings.push(`Broken link: ${href}`);
      }
    }

    return {
      success: errors.length === 0,
      errors,
      warnings,
    };
  } catch (error) {
    return {
      success: false,
      errors: [`Failed to validate links: ${error instanceof Error ? error.message : String(error)}`],
      warnings: [],
    };
  }
}

/**
 * Validate HTML contains expected content
 *
 * @param htmlPath - Path to HTML file
 * @param expectedContent - Array of strings that should be present
 * @returns Validation result
 */
export async function validateHtmlContent(
  htmlPath: string,
  expectedContent: string[],
): Promise<HtmlValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const content = await Deno.readTextFile(htmlPath);

    for (const expected of expectedContent) {
      if (!content.includes(expected)) {
        errors.push(`Missing expected content: "${expected}"`);
      }
    }

    return {
      success: errors.length === 0,
      errors,
      warnings,
    };
  } catch (error) {
    return {
      success: false,
      errors: [`Failed to read HTML file: ${error instanceof Error ? error.message : String(error)}`],
      warnings: [],
    };
  }
}

/**
 * Check if HTML file has valid images
 *
 * @param htmlPath - Path to HTML file
 * @param baseDir - Base directory for resolving relative paths
 * @returns Validation result
 */
export async function validateHtmlImages(
  htmlPath: string,
  baseDir: string,
): Promise<HtmlValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const content = await Deno.readTextFile(htmlPath);
    const doc = new DOMParser().parseFromString(content, "text/html");

    if (!doc) {
      return {
        success: false,
        errors: ["Failed to parse HTML document"],
        warnings: [],
      };
    }

    // Check all img tags
    const images = doc.querySelectorAll("img[src]");
    for (const img of images) {
      const src = (img as Element).getAttribute("src");
      if (!src) continue;

      // Skip external images and data URIs
      if (
        src.startsWith("http://") ||
        src.startsWith("https://") ||
        src.startsWith("data:")
      ) {
        continue;
      }

      // Check if local image file exists
      const imgPath = `${baseDir}/${src}`;
      try {
        await Deno.stat(imgPath);
      } catch {
        warnings.push(`Missing image: ${src}`);
      }

      // Check for alt text
      const alt = (img as Element).getAttribute("alt");
      if (!alt) {
        warnings.push(`Missing alt text for image: ${src}`);
      }
    }

    return {
      success: errors.length === 0,
      errors,
      warnings,
    };
  } catch (error) {
    return {
      success: false,
      errors: [`Failed to validate images: ${error instanceof Error ? error.message : String(error)}`],
      warnings: [],
    };
  }
}

/**
 * Comprehensive HTML validation
 *
 * @param htmlPath - Path to HTML file
 * @param baseDir - Base directory for resolving relative paths
 * @returns Validation result
 */
export async function validateHtml(
  htmlPath: string,
  baseDir: string,
): Promise<HtmlValidationResult> {
  const structureResult = await validateHtmlStructure(htmlPath);
  const linksResult = await validateHtmlLinks(htmlPath, baseDir);
  const imagesResult = await validateHtmlImages(htmlPath, baseDir);

  const allErrors = [
    ...structureResult.errors,
    ...linksResult.errors,
    ...imagesResult.errors,
  ];

  const allWarnings = [
    ...structureResult.warnings,
    ...linksResult.warnings,
    ...imagesResult.warnings,
  ];

  return {
    success: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
}

/**
 * Count HTML elements by tag name
 *
 * @param htmlPath - Path to HTML file
 * @param tagName - HTML tag name to count
 * @returns Number of elements found
 */
export async function countHtmlElements(
  htmlPath: string,
  tagName: string,
): Promise<number> {
  try {
    const content = await Deno.readTextFile(htmlPath);
    const doc = new DOMParser().parseFromString(content, "text/html");

    if (!doc) {
      return 0;
    }

    return doc.querySelectorAll(tagName).length;
  } catch {
    return 0;
  }
}

/**
 * Extract text content from HTML element
 *
 * @param htmlPath - Path to HTML file
 * @param selector - CSS selector
 * @returns Text content or null if not found
 */
export async function extractHtmlText(
  htmlPath: string,
  selector: string,
): Promise<string | null> {
  try {
    const content = await Deno.readTextFile(htmlPath);
    const doc = new DOMParser().parseFromString(content, "text/html");

    if (!doc) {
      return null;
    }

    const element = doc.querySelector(selector);
    return element ? element.textContent : null;
  } catch {
    return null;
  }
}
