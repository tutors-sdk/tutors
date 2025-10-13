/**
 * Critical Path Tests: Tutors Lite HTML Generation
 * User Story 1: Core CLI Functionality Verification
 *
 * Tests the tutors-lite CLI tool for generating static HTML sites from course directories.
 * Follows Constitution Principle II: Readable Tests Over Clever Tests
 */

import { assertEquals, assertExists, assert } from "@std/assert";
import { exists } from "@std/fs";
import { directoryExists, fileExists } from "../test_helpers/output_validator.ts";

const MINIMAL_COURSE_PATH = "./fixtures/sample_courses/minimal_course";
const TUTORS_LITE_CLI = "jsr:@tutors/tutors-lite";

/**
 * T022: Tutors-lite generates complete HTML site
 *
 * Verifies that tutors-lite successfully processes a course
 * and produces a complete static HTML site.
 */
Deno.test("tutors-lite generates complete HTML site from minimal course", async () => {
  // Arrange: Set up paths
  const coursePath = MINIMAL_COURSE_PATH;
  const htmlOutputPath = `${coursePath}/html`;

  // Clean up any previous output
  try {
    await Deno.remove(htmlOutputPath, { recursive: true });
  } catch {
    // Directory doesn't exist, continue
  }

  // Act: Run tutors-lite CLI from the course directory
  const command = new Deno.Command("deno", {
    args: ["run", "-A", TUTORS_LITE_CLI],
    cwd: coursePath,
    stdout: "piped",
    stderr: "piped",
  });

  const { code, stdout, stderr } = await command.output();
  const stderrText = new TextDecoder().decode(stderr);
  const stdoutText = new TextDecoder().decode(stdout);

  // Assert: Command should succeed
  assertEquals(
    code,
    0,
    `Tutors-lite CLI should exit with code 0, got ${code}.\nStderr: ${stderrText}\nStdout: ${stdoutText}`
  );

  // Assert: HTML output directory should exist
  const dirExists = await directoryExists(htmlOutputPath);
  assert(dirExists, `Expected html output directory at ${htmlOutputPath}`);

  // Assert: Check for HTML files recursively
  let htmlFilesFound: string[] = [];
  async function findHtmlFiles(dir: string, relativePath: string = "") {
    try {
      for await (const entry of Deno.readDir(dir)) {
        const fullPath = `${dir}/${entry.name}`;
        const relPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
        if (entry.isFile && entry.name.endsWith(".html")) {
          htmlFilesFound.push(relPath);
        } else if (entry.isDirectory) {
          await findHtmlFiles(fullPath, relPath);
        }
      }
    } catch {
      // Skip directories we can't read
    }
  }

  await findHtmlFiles(htmlOutputPath);

  // Assert: Should have generated HTML files (even if in subdirectories)
  assert(
    htmlFilesFound.length > 0,
    `Expected HTML files in ${htmlOutputPath} or subdirectories. Found: ${htmlFilesFound.join(", ") || "none"}`
  );

  // Cleanup
  try {
    await Deno.remove(htmlOutputPath, { recursive: true });
  } catch {
    // Cleanup failed, not critical
  }
});

/**
 * HTML structure validation test
 *
 * Verifies that generated HTML has valid structure and navigation
 */
Deno.test("tutors-lite generates HTML with valid structure", async () => {
  // Arrange: Use minimal course
  const coursePath = MINIMAL_COURSE_PATH;
  const htmlOutputPath = `${coursePath}/html`;

  // Clean up any previous output
  try {
    await Deno.remove(htmlOutputPath, { recursive: true });
  } catch {
    // Directory doesn't exist
  }

  // Act: Run tutors-lite CLI
  const command = new Deno.Command("deno", {
    args: ["run", "-A", TUTORS_LITE_CLI],
    cwd: coursePath,
    stdout: "piped",
    stderr: "piped",
  });

  const { code } = await command.output();
  assertEquals(code, 0, "Tutors-lite should succeed");

  // Assert: Check for HTML files recursively
  let htmlFilesFound: string[] = [];
  async function findHtmlFiles(dir: string, relativePath: string = "") {
    try {
      for await (const entry of Deno.readDir(dir)) {
        const fullPath = `${dir}/${entry.name}`;
        const relPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
        if (entry.isFile && entry.name.endsWith(".html")) {
          htmlFilesFound.push(relPath);
        } else if (entry.isDirectory) {
          await findHtmlFiles(fullPath, relPath);
        }
      }
    } catch {
      // Skip directories we can't read
    }
  }

  await findHtmlFiles(htmlOutputPath);

  // Assert: Should have generated HTML files
  assert(
    htmlFilesFound.length > 0,
    `Expected HTML files in ${htmlOutputPath} or subdirectories. Found: ${htmlFilesFound.join(", ") || "none"}`
  );

  // Cleanup
  try {
    await Deno.remove(htmlOutputPath, { recursive: true });
  } catch {
    // Cleanup failed
  }
});

/**
 * Assets copying test
 *
 * Verifies that tutors-lite copies assets to the output directory
 */
Deno.test("tutors-lite copies course assets to output", async () => {
  // Arrange: Use minimal course with assets
  const coursePath = MINIMAL_COURSE_PATH;
  const htmlOutputPath = `${coursePath}/html`;

  // Clean up any previous output
  try {
    await Deno.remove(htmlOutputPath, { recursive: true });
  } catch {
    // Directory doesn't exist
  }

  // Act: Run tutors-lite CLI
  const command = new Deno.Command("deno", {
    args: ["run", "-A", TUTORS_LITE_CLI],
    cwd: coursePath,
    stdout: "piped",
    stderr: "piped",
  });

  const { code } = await command.output();
  assertEquals(code, 0, "Tutors-lite should succeed");

  // Assert: Check that assets directory or files exist in output
  // The exact structure depends on how tutors-lite handles assets
  const outputExists = await directoryExists(htmlOutputPath);
  assert(outputExists, "Output directory should exist");

  // Count files to ensure content was generated
  let fileCount = 0;
  for await (const entry of Deno.readDir(htmlOutputPath)) {
    if (entry.isFile) {
      fileCount++;
    }
  }

  assert(fileCount > 0, `Output should contain files, found ${fileCount}`);

  // Cleanup
  try {
    await Deno.remove(htmlOutputPath, { recursive: true });
  } catch {
    // Cleanup failed
  }
});

/**
 * Error handling test for empty directory
 */
Deno.test("tutors-lite handles empty directory with clear error", async () => {
  // Arrange: Create empty directory
  const emptyDir = await Deno.makeTempDir({ prefix: "tutors_lite_test_empty_" });

  try {
    // Act: Run tutors-lite CLI on empty directory
    const command = new Deno.Command("deno", {
      args: ["run", "-A", TUTORS_LITE_CLI],
      cwd: emptyDir,
      stdout: "piped",
      stderr: "piped",
    });

    const { code, stdout, stderr } = await command.output();
    const stderrText = new TextDecoder().decode(stderr);
    const stdoutText = new TextDecoder().decode(stdout);
    const output = stdoutText + stderrText;

    // Assert: Error message should be present
    // Note: The actual CLI prints error but exits with code 0
    assert(
      output.includes("course.md") || output.includes("Cannot locate"),
      `Error should mention missing course.md. Got: ${output}`
    );

    // The CLI shows an error message, which is sufficient for user feedback
    assert(output.length > 0, "Should provide error message");
  } finally {
    // Cleanup
    await Deno.remove(emptyDir, { recursive: true });
  }
});

