/**
 * Output Validator Helper
 *
 * Provides validation functions for generated output using Zod schemas.
 * Follows KISS principles - direct validation with clear error messages.
 */

import { z } from "zod";

/**
 * Validation result structure
 */
export interface ValidationResult<T = unknown> {
  success: boolean;
  data?: T;
  errors?: string[];
}

/**
 * Validate data against a Zod schema
 *
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validation result with success flag, data, or errors
 *
 * @example
 * ```ts
 * const result = validateWithZod(CourseOutputSchema, jsonData);
 * if (!result.success) {
 *   console.error("Validation failed:", result.errors);
 * }
 * ```
 */
export function validateWithZod<T>(
  schema: z.ZodType<T>,
  data: unknown,
): ValidationResult<T> {
  try {
    const result = schema.safeParse(data);

    if (result.success) {
      return {
        success: true,
        data: result.data,
      };
    } else {
      // Convert Zod errors to readable strings
      const errors = result.error.issues.map((issue) => {
        const path = issue.path.join(".");
        return `${path}: ${issue.message}`;
      });

      return {
        success: false,
        errors,
      };
    }
  } catch (error) {
    return {
      success: false,
      errors: [`Validation error: ${error instanceof Error ? error.message : String(error)}`],
    };
  }
}

/**
 * Validate JSON file against schema
 *
 * @param filePath - Path to JSON file
 * @param schema - Zod schema to validate against
 * @returns Validation result
 *
 * @example
 * ```ts
 * const result = await validateJsonFile("./output/tutors.json", CourseOutputSchema);
 * ```
 */
export async function validateJsonFile<T>(
  filePath: string,
  schema: z.ZodType<T>,
): Promise<ValidationResult<T>> {
  try {
    const content = await Deno.readTextFile(filePath);
    const data = JSON.parse(content);
    return validateWithZod(schema, data);
  } catch (error) {
    return {
      success: false,
      errors: [`Failed to read/parse JSON file: ${error instanceof Error ? error.message : String(error)}`],
    };
  }
}

/**
 * Validate that a file exists
 *
 * @param filePath - Path to file
 * @returns True if file exists, false otherwise
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    const stat = await Deno.stat(filePath);
    return stat.isFile;
  } catch {
    return false;
  }
}

/**
 * Validate that a directory exists
 *
 * @param dirPath - Path to directory
 * @returns True if directory exists, false otherwise
 */
export async function directoryExists(dirPath: string): Promise<boolean> {
  try {
    const stat = await Deno.stat(dirPath);
    return stat.isDirectory;
  } catch {
    return false;
  }
}

/**
 * Count files in a directory (non-recursive)
 *
 * @param dirPath - Path to directory
 * @returns Number of files in directory
 */
export async function countFiles(dirPath: string): Promise<number> {
  try {
    let count = 0;
    for await (const entry of Deno.readDir(dirPath)) {
      if (entry.isFile) {
        count++;
      }
    }
    return count;
  } catch {
    return 0;
  }
}

/**
 * Count files in a directory recursively
 *
 * @param dirPath - Path to directory
 * @returns Number of files in directory and subdirectories
 */
export async function countFilesRecursive(dirPath: string): Promise<number> {
  let count = 0;

  async function traverse(path: string): Promise<void> {
    try {
      for await (const entry of Deno.readDir(path)) {
        const fullPath = `${path}/${entry.name}`;
        if (entry.isFile) {
          count++;
        } else if (entry.isDirectory) {
          await traverse(fullPath);
        }
      }
    } catch {
      // Ignore errors (permission issues, etc.)
    }
  }

  await traverse(dirPath);
  return count;
}

/**
 * Get file size in bytes
 *
 * @param filePath - Path to file
 * @returns File size in bytes, or -1 if file doesn't exist
 */
export async function getFileSize(filePath: string): Promise<number> {
  try {
    const stat = await Deno.stat(filePath);
    return stat.size;
  } catch {
    return -1;
  }
}

/**
 * Validate that output directory has expected structure
 *
 * @param outputPath - Path to output directory
 * @param expectedFiles - Array of expected file paths (relative to outputPath)
 * @returns Validation result with list of missing files
 */
export async function validateOutputStructure(
  outputPath: string,
  expectedFiles: string[],
): Promise<ValidationResult<string[]>> {
  const missingFiles: string[] = [];

  for (const file of expectedFiles) {
    const fullPath = `${outputPath}/${file}`;
    const exists = await fileExists(fullPath);
    if (!exists) {
      missingFiles.push(file);
    }
  }

  if (missingFiles.length > 0) {
    return {
      success: false,
      errors: [`Missing expected files: ${missingFiles.join(", ")}`],
      data: missingFiles,
    };
  }

  return {
    success: true,
    data: [],
  };
}
