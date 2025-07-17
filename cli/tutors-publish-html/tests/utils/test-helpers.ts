import { assert, assertEquals, assertExists } from "jsr:@std/assert";
import { exists, walk } from "jsr:@std/fs";
import { join, relative } from "jsr:@std/path";

export interface FileStructure {
  path: string;
  type: "file" | "directory";
  size?: number;
  children?: FileStructure[];
}

/**
 * Recursively builds a file structure representation
 */
export async function buildFileStructure(rootPath: string): Promise<FileStructure> {

  const stats = await Deno.stat(rootPath);
  const structure: FileStructure = {
    path: rootPath,
    type: stats.isDirectory ? "directory" : "file",
    size: stats.size,
  };

  if (stats.isDirectory) {
    structure.children = [];
    for await (const entry of Deno.readDir(rootPath)) {
      const childPath = join(rootPath, entry.name);
      if (childPath.endsWith(".DS_Store")) {
        continue;
      }
      const childStructure = await buildFileStructure(childPath);
      structure.children.push(childStructure);
    }
    // Sort children by name for consistent comparison
    structure.children.sort((a, b) => a.path.localeCompare(b.path));
  }

  return structure;
}

/**
 * Compares two file structures for equality
 */
export function compareFileStructures(
  actual: FileStructure,
  expected: FileStructure,
  ignoreSizes = false
): boolean {
  if (actual.type !== expected.type) {
    return false;
  }

  const actualName = relative(".", actual.path);
  const expectedName = relative(".", expected.path);
  
  if (actualName !== expectedName) {
    return false;
  }

  if (!ignoreSizes && actual.type === "file" && actual.size !== expected.size) {
    return false;
  }

  if (actual.type === "directory" && expected.type === "directory") {
    const actualChildren = actual.children || [];
    const expectedChildren = expected.children || [];
    
    if (actualChildren.length !== expectedChildren.length) {
      return false;
    }

    for (let i = 0; i < actualChildren.length; i++) {
      if (!compareFileStructures(actualChildren[i], expectedChildren[i], ignoreSizes)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Creates a temporary directory for testing
 */
export async function createTempDir(dirName: string): Promise<string> {
  try {
    await Deno.remove(dirName, { recursive: true });
  } catch (_) {
    // Ignore error if directory doesn't exist
  }
  await Deno.mkdir(dirName, { recursive: true });
  return dirName;
}

/**
 * Creates a temporary directory for testing
 */
export async function removeTmpDir(dirName: string): Promise<void> {  
  try {
    await Deno.remove(dirName, { recursive: true });
  } catch (_) {
    // Ignore error if directory doesn't exist
  }
}


/**
 * Copies a directory recursively
 */
export async function copyDir(src: string, dest: string): Promise<void> {
  await Deno.mkdir(dest, { recursive: true });
  
  for await (const entry of walk(src)) {
    const relativePath = relative(src, entry.path);
    const destPath = join(dest, relativePath);
    
    if (entry.isDirectory) {
      await Deno.mkdir(destPath, { recursive: true });
    } else {
      await Deno.copyFile(entry.path, destPath);
    }
  }
}

/**
 * Removes a directory recursively
 */
export async function removeDir(path: string): Promise<void> {
  if (await exists(path)) {
    await Deno.remove(path, { recursive: true });
  }
}

/**
 * Asserts that a file exists and contains expected content
 */
export async function assertFileExists(filePath: string, expectedContent?: string): Promise<void> {
  assertExists(await exists(filePath), `File should exist: ${filePath}`);
  
  if (expectedContent !== undefined) {
    const content = await Deno.readTextFile(filePath);
    assertEquals(content, expectedContent, `File content mismatch: ${filePath}`);
  }
}

/**
 * Asserts that a directory exists and contains expected files
 */
export async function assertDirExists(dirPath: string, expectedFiles?: string[]): Promise<void> {
  assertExists(await exists(dirPath), `Directory should exist: ${dirPath}`);
  
  if (expectedFiles) {
    const actualFiles: string[] = [];
    for await (const entry of Deno.readDir(dirPath)) {
      actualFiles.push(entry.name);
    }
    
    for (const expectedFile of expectedFiles) {
      assert(actualFiles.includes(expectedFile), `Expected file missing: ${expectedFile}`);
    }
  }
}

// Helper function to extract all paths from directory structure
export function extractPaths(structure: FileStructure): string[] {
  const paths: string[] = [];
  
  function traverse(node: FileStructure) {
    if (node.path) {
      paths.push(node.path);
    }
    if (node.children) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }
  
  traverse(structure);
  return paths;
}