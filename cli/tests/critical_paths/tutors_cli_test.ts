/**
 * Critical Path Tests: Tutors CLI JSON Generation
 * User Story 1: Core CLI Functionality Verification
 *
 * Tests the tutors CLI tool for generating dynamic JSON content from course directories.
 * Follows Constitution Principle II: Readable Tests Over Clever Tests
 */

import { assert, assertEquals, assertExists } from "@std/assert";
import { exists } from "@std/fs";
import { CourseOutputSchema } from "../fixtures/schemas/course_output_schema.ts";
import { fileExists, validateJsonFile } from "../test_helpers/output_validator.ts";

const MINIMAL_COURSE_PATH = "./fixtures/sample_courses/minimal_course";
const TUTORS_CLI = "jsr:@tutors/tutors";

/**
 * T021: Tutors CLI generates valid JSON from minimal course
 *
 * Verifies that the tutors CLI successfully processes a minimal course
 * and produces valid JSON output conforming to the expected schema.
 */
Deno.test("tutors CLI generates valid JSON from minimal course", async () => {
  // Arrange: Set up paths
  const testOutputDir = "./test-output/minimal_json";
  const coursePath = MINIMAL_COURSE_PATH;

  // Clean up any previous test output
  try {
    await Deno.remove(testOutputDir, { recursive: true });
  } catch {
    // Directory doesn't exist, continue
  }

  // Act: Run tutors CLI from the course directory
  const command = new Deno.Command("deno", {
    args: ["run", "-A", TUTORS_CLI],
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
    `Tutors CLI should exit with code 0, got ${code}.\nStderr: ${stderrText}\nStdout: ${stdoutText}`,
  );

  // Assert: JSON output directory should exist
  const jsonOutputPath = `${coursePath}/json`;
  const dirExists = await exists(jsonOutputPath, { isDirectory: true });
  assert(dirExists, `Expected json output directory at ${jsonOutputPath}`);

  // Assert: tutors.json should exist
  const tutorsJsonPath = `${jsonOutputPath}/tutors.json`;
  const jsonExists = await fileExists(tutorsJsonPath);
  assert(jsonExists, `Expected tutors.json file at ${tutorsJsonPath}`);

  // Assert: JSON should be valid and conform to schema
  const validationResult = await validateJsonFile(tutorsJsonPath, CourseOutputSchema);

  if (!validationResult.success) {
    console.error("Schema validation errors:", validationResult.errors);
  }

  assert(
    validationResult.success,
    `JSON output should conform to CourseOutputSchema. Errors: ${validationResult.errors?.join(", ")}`,
  );

  // Assert: Course should have expected content
  const course = validationResult.data!;
  assertEquals(course.title.trim(), "Introduction to Programming");
  assertExists(course.los, "Course should have learning objects array");
  assert(course.los.length > 0, "Course should have at least one learning object");

  // Cleanup
  try {
    await Deno.remove(jsonOutputPath, { recursive: true });
  } catch {
    // Cleanup failed, not critical
  }
});

/**
 * T023: Error handling for empty directory
 *
 * Verifies that the tutors CLI provides clear error messages when
 * processing an empty directory with no course content.
 */
Deno.test("tutors CLI handles empty directory with clear error", async () => {
  // Arrange: Create empty directory
  const emptyDir = await Deno.makeTempDir({ prefix: "tutors_test_empty_" });

  try {
    // Act: Run tutors CLI on empty directory
    const command = new Deno.Command("deno", {
      args: ["run", "-A", TUTORS_CLI],
      cwd: emptyDir,
      stdout: "piped",
      stderr: "piped",
    });

    const { code, stdout, stderr } = await command.output();
    const stderrText = new TextDecoder().decode(stderr);
    const stdoutText = new TextDecoder().decode(stdout);
    const output = stdoutText + stderrText;

    // Assert: Error message should mention missing course.md
    // Note: The actual CLI prints error but exits with code 0
    assert(
      output.includes("course.md") || output.includes("Cannot locate"),
      `Error message should mention missing course.md. Got: ${output}`,
    );

    // The CLI shows an error message, which is sufficient for user feedback
    assert(output.length > 0, "Should provide error message");
  } finally {
    // Cleanup
    await Deno.remove(emptyDir, { recursive: true });
  }
});

/**
 * T024: Hierarchical structure preservation
 *
 * Verifies that the tutors CLI correctly preserves the hierarchical
 * structure of topics and labs from the source course directory.
 */
Deno.test("tutors CLI preserves hierarchical structure", async () => {
  // Arrange: Use minimal course with known structure
  const coursePath = MINIMAL_COURSE_PATH;

  // Clean up any previous output
  const jsonOutputPath = `${coursePath}/json`;
  try {
    await Deno.remove(jsonOutputPath, { recursive: true });
  } catch {
    // Directory doesn't exist, continue
  }

  // Act: Run tutors CLI
  const command = new Deno.Command("deno", {
    args: ["run", "-A", TUTORS_CLI],
    cwd: coursePath,
    stdout: "piped",
    stderr: "piped",
  });

  const { code } = await command.output();
  assertEquals(code, 0, "Tutors CLI should succeed");

  // Assert: Parse and validate structure
  const tutorsJsonPath = `${jsonOutputPath}/tutors.json`;
  const jsonContent = await Deno.readTextFile(tutorsJsonPath);
  const course = JSON.parse(jsonContent);

  // Assert: Learning objects exist
  assertExists(course.los, "Course should have learning objects array");
  assert(Array.isArray(course.los), "Learning objects should be an array");
  assert(course.los.length >= 2, "Should have at least 2 learning objects (topics)");

  // Assert: Each learning object has required structure
  for (const lo of course.los) {
    assertExists(lo.id, "Each learning object should have an id");
    assertExists(lo.title, "Each learning object should have a title");
    assertExists(lo.type, "Each learning object should have a type");
  }

  // Assert: Specific topics are present
  const topicTitles = course.los.map((lo: any) => lo.title);
  assert(
    topicTitles.some((title: string) => title.includes("Variables")),
    "Should include 'Variables and Data Types' topic",
  );

  // Cleanup
  try {
    await Deno.remove(jsonOutputPath, { recursive: true });
  } catch {
    // Cleanup failed, not critical
  }
});

/**
 * T025: Basic error resilience test
 *
 * Verifies that the tutors CLI handles non-standard content gracefully
 * and doesn't crash unexpectedly.
 */
Deno.test("tutors CLI handles course with minimal content without crashing", async () => {
  // Arrange: Create a minimal valid course (just course.md)
  const tempDir = await Deno.makeTempDir({ prefix: "tutors_test_minimal_" });
  const courseFile = `${tempDir}/course.md`;
  await Deno.writeTextFile(courseFile, "# Test Course\n\nMinimal test course.");

  try {
    // Act: Run tutors CLI
    const command = new Deno.Command("deno", {
      args: ["run", "-A", TUTORS_CLI],
      cwd: tempDir,
      stdout: "piped",
      stderr: "piped",
    });

    const { code } = await command.output();

    // Assert: Should complete (may succeed or fail gracefully, but shouldn't crash)
    // Exit code 0 or 1 is acceptable - we're testing for no crashes
    assert(
      code === 0 || code === 1,
      `CLI should handle minimal course gracefully, got exit code ${code}`,
    );

    // If it succeeded, verify output was created
    if (code === 0) {
      const jsonOutputPath = `${tempDir}/json`;
      const jsonExists = await exists(jsonOutputPath, { isDirectory: true });
      assert(jsonExists, "If CLI succeeds, it should create json directory");
    }
  } finally {
    // Cleanup
    try {
      await Deno.remove(tempDir, { recursive: true });
    } catch {
      // Cleanup failed, not critical
    }
  }
});
