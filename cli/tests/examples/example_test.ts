/**
 * Example Test - Hello World
 *
 * This example demonstrates the basic structure of a Tutors CLI test.
 * Use this as a template when creating new tests.
 */

import { assert, assertEquals, assertExists } from "@std/assert";

/**
 * EXAMPLE 1: Simple Unit Test
 *
 * Tests a single function or behavior with clear assertions.
 */
Deno.test("Example: Simple assertion test", () => {
  // Arrange: Set up test data
  const greeting = "Hello, Tutors!";

  // Act: Perform the operation (in this case, it's just a string)
  const result = greeting.toUpperCase();

  // Assert: Verify the results
  assertEquals(result, "HELLO, TUTORS!");
  assertExists(greeting);
  assert(greeting.length > 0, "Greeting should not be empty");
});

/**
 * EXAMPLE 2: Async Test with File Operations
 *
 * Shows how to test async operations with proper cleanup.
 */
Deno.test("Example: Async test with file operations", async () => {
  // Arrange: Create a temporary directory
  const tempDir = await Deno.makeTempDir({ prefix: "example_test_" });

  try {
    // Act: Write a test file
    const testFile = `${tempDir}/test.md`;
    const content = "# Test Course\n\nThis is a test.";
    await Deno.writeTextFile(testFile, content);

    // Assert: Verify file was created and has correct content
    const stat = await Deno.stat(testFile);
    assert(stat.isFile, "Should create a file");

    const readContent = await Deno.readTextFile(testFile);
    assertEquals(readContent, content, "Content should match");
  } finally {
    // Cleanup: ALWAYS remove temporary files
    await Deno.remove(tempDir, { recursive: true });
  }
});

/**
 * EXAMPLE 3: Testing CLI Command Execution
 *
 * Demonstrates how to test a CLI tool by running it as a subprocess.
 */
Deno.test("Example: CLI command execution", async () => {
  // Arrange: Prepare command
  const command = new Deno.Command("deno", {
    args: ["--version"],
    stdout: "piped",
    stderr: "piped",
  });

  // Act: Execute command
  const { code, stdout, stderr } = await command.output();
  const output = new TextDecoder().decode(stdout);

  // Assert: Verify execution
  assertEquals(code, 0, "Command should succeed");
  assert(output.includes("deno"), "Output should contain 'deno'");
  assert(stderr.length === 0 || new TextDecoder().decode(stderr).length === 0, "Should have no errors");
});

/**
 * EXAMPLE 4: Testing with the Minimal Course Fixture
 *
 * Shows how to use the test fixtures for realistic testing.
 */
Deno.test("Example: Using minimal course fixture", async () => {
  // Arrange: Use the minimal course fixture
  const coursePath = "./fixtures/sample_courses/minimal_course";

  // Act: Verify course structure
  const courseFile = `${coursePath}/course.md`;
  const propertiesFile = `${coursePath}/properties.yaml`;

  // Assert: Check fixture exists and is valid
  const courseStat = await Deno.stat(courseFile);
  assert(courseStat.isFile, "Course markdown should exist");

  const propertiesStat = await Deno.stat(propertiesFile);
  assert(propertiesStat.isFile, "Properties file should exist");

  const courseContent = await Deno.readTextFile(courseFile);
  assert(
    courseContent.includes("Introduction to Programming"),
    "Course should have expected title",
  );
});

/**
 * EXAMPLE 5: Test with Descriptive Error Messages
 *
 * Shows how to write clear assertions that help debugging.
 */
Deno.test("Example: Descriptive error messages", () => {
  // Arrange
  const numbers = [1, 2, 3, 4, 5];

  // Act
  const sum = numbers.reduce((a, b) => a + b, 0);
  const average = sum / numbers.length;

  // Assert: With helpful error messages
  assertEquals(
    sum,
    15,
    `Expected sum to be 15, but got ${sum}`,
  );

  assertEquals(
    average,
    3,
    `Expected average to be 3, but got ${average}`,
  );

  assert(
    numbers.length > 0,
    "Numbers array should not be empty",
  );
});

/**
 * EXAMPLE 6: Testing Error Conditions
 *
 * Demonstrates how to test that errors are properly handled.
 */
Deno.test("Example: Testing error conditions", async () => {
  // Arrange: Try to read a non-existent file
  const nonExistentFile = "./this-file-does-not-exist.txt";

  // Act & Assert: Verify error is thrown
  try {
    await Deno.readTextFile(nonExistentFile);
    // If we get here, the test should fail
    assert(false, "Should have thrown an error for non-existent file");
  } catch (error) {
    // Assert: Verify it's the right kind of error
    assert(error instanceof Deno.errors.NotFound, "Should be a NotFound error");
  }
});

/**
 * EXAMPLE 7: Filtering Tests
 *
 * You can run specific tests using --filter flag:
 *
 * deno test --allow-all examples/example_test.ts --filter "Simple assertion"
 * deno test --allow-all examples/example_test.ts --filter "CLI command"
 */

/**
 * KEY TAKEAWAYS:
 *
 * 1. Use descriptive test names that explain WHAT is being tested
 * 2. Follow Arrange-Act-Assert pattern
 * 3. Always clean up resources in finally blocks
 * 4. Add helpful error messages to assertions
 * 5. Use existing fixtures when possible
 * 6. Test behavior, not implementation
 * 7. Keep tests focused on one thing
 *
 * For more examples, see:
 * - critical_paths/tutors_cli_test.ts (CLI testing)
 * - edge_cases/special_characters_test.ts (Edge case testing)
 * - integration/e2e_json_generation_test.ts (Integration testing)
 */
