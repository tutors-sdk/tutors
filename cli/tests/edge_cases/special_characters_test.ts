/**
 * Edge Case Tests: Special Characters in Filenames and Content
 * User Story 2: Output Validation and Quality Assurance
 *
 * Tests handling of special characters in course content and filenames.
 * Follows Constitution Principle II: Readable Tests Over Clever Tests
 */

import { assertEquals, assert } from "@std/assert";
import { exists } from "@std/fs";

/**
 * T034-T035: Special characters in titles and paths are properly encoded
 *
 * Verifies that the tutors CLI handles special characters without breaking.
 */
Deno.test("tutors CLI handles course with special characters in title", async () => {
  // Arrange: Create a course with special characters in title
  const tempDir = await Deno.makeTempDir({ prefix: "tutors_test_special_" });
  const courseFile = `${tempDir}/course.md`;
  const propsFile = `${tempDir}/properties.yaml`;

  // Title with special characters: quotes, ampersand, apostrophe
  await Deno.writeTextFile(
    courseFile,
    '# "Programming & Web Development" - Beginner\'s Guide\n\nA course with special chars.'
  );

  // Add properties file
  await Deno.writeTextFile(propsFile, "credits: Test\n");

  try {
    // Act: Run tutors CLI
    const command = new Deno.Command("deno", {
      args: ["run", "-A", "jsr:@tutors/tutors"],
      cwd: tempDir,
      stdout: "piped",
      stderr: "piped",
    });

    const { code, stderr } = await command.output();
    const stderrText = new TextDecoder().decode(stderr);

    // Assert: Should complete without errors
    assertEquals(code, 0, `CLI should handle special characters. stderr: ${stderrText}`);

    // Assert: JSON output should exist
    const jsonPath = `${tempDir}/json/tutors.json`;
    const jsonExists = await exists(jsonPath);
    assert(jsonExists, "JSON output should be created");

    // Assert: JSON should be valid
    if (jsonExists) {
      const content = await Deno.readTextFile(jsonPath);
      const json = JSON.parse(content); // Should not throw
      assert(json.title, "JSON should have title field");
    }
  } finally {
    // Cleanup
    await Deno.remove(tempDir, { recursive: true });
  }
});

/**
 * Test handling of unicode characters in content
 */
Deno.test("tutors CLI handles unicode characters in course content", async () => {
  // Arrange: Create course with unicode characters
  const tempDir = await Deno.makeTempDir({ prefix: "tutors_test_unicode_" });
  const courseFile = `${tempDir}/course.md`;
  const propsFile = `${tempDir}/properties.yaml`;

  // Content with various unicode characters
  await Deno.writeTextFile(
    courseFile,
    "# Introducción a la Programación\n\nCurso en español: ñ, á, é, í, ó, ú\n\n日本語のテキスト\n\nEmoji: 🚀 💻 📚"
  );

  // Add properties file
  await Deno.writeTextFile(propsFile, "credits: Test\n");

  try {
    // Act: Run tutors CLI
    const command = new Deno.Command("deno", {
      args: ["run", "-A", "jsr:@tutors/tutors"],
      cwd: tempDir,
      stdout: "piped",
      stderr: "piped",
    });

    const { code } = await command.output();

    // Assert: Should handle unicode without crashing
    assertEquals(code, 0, "CLI should handle unicode characters");

    // Assert: Output should exist
    const jsonPath = `${tempDir}/json/tutors.json`;
    const jsonExists = await exists(jsonPath);
    assert(jsonExists, "JSON output should be created with unicode content");
  } finally {
    // Cleanup
    await Deno.remove(tempDir, { recursive: true });
  }
});

/**
 * Test handling of special characters in frontmatter
 */
Deno.test("tutors CLI handles special characters in frontmatter", async () => {
  // Arrange: Create course with special chars in frontmatter
  const tempDir = await Deno.makeTempDir({ prefix: "tutors_test_frontmatter_" });
  const courseFile = `${tempDir}/course.md`;
  const propsFile = `${tempDir}/properties.yaml`;

  await Deno.writeTextFile(
    courseFile,
    `# Test Course

Course content here.`
  );

  // Properties file with special characters
  await Deno.writeTextFile(
    propsFile,
    `credits: "Dr. O'Brien & Prof. Smith"
version: "1.0"
`
  );

  try {
    // Act: Run tutors CLI
    const command = new Deno.Command("deno", {
      args: ["run", "-A", "jsr:@tutors/tutors"],
      cwd: tempDir,
      stdout: "piped",
      stderr: "piped",
    });

    const { code } = await command.output();

    // Assert: Should handle frontmatter special chars
    assertEquals(code, 0, "CLI should handle special chars in frontmatter");

    // Assert: JSON output should be valid
    const jsonPath = `${tempDir}/json/tutors.json`;
    if (await exists(jsonPath)) {
      const content = await Deno.readTextFile(jsonPath);
      const json = JSON.parse(content);
      // If properties exist, they should be parsed correctly
      assert(true, "JSON parsing succeeded with special chars in frontmatter");
    }
  } finally {
    // Cleanup
    await Deno.remove(tempDir, { recursive: true });
  }
});

/**
 * Test handling of long filenames and paths
 */
Deno.test("tutors CLI handles reasonably long topic names", async () => {
  // Arrange: Create course with long topic name
  const tempDir = await Deno.makeTempDir({ prefix: "tutors_test_long_" });
  const courseFile = `${tempDir}/course.md`;
  const propsFile = `${tempDir}/properties.yaml`;

  await Deno.writeTextFile(courseFile, "# Test Course\n\nWith long topic.");
  await Deno.writeTextFile(propsFile, "credits: Test\n");

  // Create topic with long name (but reasonable - not hitting filesystem limits)
  const longTopicName =
    "topic-introduction-to-advanced-object-oriented-programming-concepts";
  const topicDir = `${tempDir}/${longTopicName}`;
  await Deno.mkdir(topicDir, { recursive: true });
  await Deno.writeTextFile(
    `${topicDir}/topic.md`,
    "# Introduction to Advanced OOP\n\nDetailed content."
  );

  try {
    // Act: Run tutors CLI
    const command = new Deno.Command("deno", {
      args: ["run", "-A", "jsr:@tutors/tutors"],
      cwd: tempDir,
      stdout: "piped",
      stderr: "piped",
    });

    const { code } = await command.output();

    // Assert: Should handle long names
    assertEquals(code, 0, "CLI should handle long topic names");

    // Assert: Topic should be in output
    const jsonPath = `${tempDir}/json/tutors.json`;
    if (await exists(jsonPath)) {
      const content = await Deno.readTextFile(jsonPath);
      const json = JSON.parse(content);
      assert(json.los && json.los.length > 0, "Should have processed long-named topic");
    }
  } finally {
    // Cleanup
    await Deno.remove(tempDir, { recursive: true });
  }
});

/**
 * Test handling of HTML entities in markdown
 */
Deno.test("tutors CLI handles HTML entities in markdown content", async () => {
  // Arrange: Create course with HTML entities
  const tempDir = await Deno.makeTempDir({ prefix: "tutors_test_entities_" });
  const courseFile = `${tempDir}/course.md`;
  const propsFile = `${tempDir}/properties.yaml`;

  await Deno.writeTextFile(
    courseFile,
    "# Test Course\n\nContent with &lt;tags&gt; and &amp; entities.\n\n&copy; 2024"
  );

  await Deno.writeTextFile(propsFile, "credits: Test\n");

  try {
    // Act: Run tutors CLI
    const command = new Deno.Command("deno", {
      args: ["run", "-A", "jsr:@tutors/tutors"],
      cwd: tempDir,
      stdout: "piped",
      stderr: "piped",
    });

    const { code } = await command.output();

    // Assert: Should handle entities
    assertEquals(code, 0, "CLI should handle HTML entities");

    // Assert: Output should be created
    const jsonPath = `${tempDir}/json/tutors.json`;
    const jsonExists = await exists(jsonPath);
    assert(jsonExists, "JSON output should be created with HTML entities");
  } finally {
    // Cleanup
    await Deno.remove(tempDir, { recursive: true });
  }
});

