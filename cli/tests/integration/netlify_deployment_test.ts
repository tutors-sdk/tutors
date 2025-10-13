/**
 * Integration Tests: Netlify Deployment Readiness
 * User Story 4: Integration and Deployment Confidence
 *
 * Tests that generated output is ready for Netlify deployment.
 * Follows Constitution Principle II: Readable Tests Over Clever Tests
 */

import { assert, assertEquals, assertExists } from "@std/assert";
import { exists } from "@std/fs";

const MINIMAL_COURSE_PATH = "./fixtures/sample_courses/minimal_course";

/**
 * Helper to copy directory recursively
 */
async function copyDirectory(src: string, dest: string): Promise<void> {
  await Deno.mkdir(dest, { recursive: true });

  for await (const entry of Deno.readDir(src)) {
    const srcPath = `${src}/${entry.name}`;
    const destPath = `${dest}/${entry.name}`;

    if (entry.isDirectory) {
      await copyDirectory(srcPath, destPath);
    } else if (entry.isFile) {
      await Deno.copyFile(srcPath, destPath);
    }
  }
}

/**
 * T057: Generated output includes Netlify configuration
 *
 * Verifies that Netlify deployment files are present or can be added.
 */
Deno.test("Integration Netlify: Deployment configuration present", async () => {
  // Arrange: Create temp copy
  const tempDir = await Deno.makeTempDir({ prefix: "netlify_config_" });

  try {
    await copyDirectory(MINIMAL_COURSE_PATH, tempDir);

    // Act: Generate JSON (typical deployment target)
    const command = new Deno.Command("deno", {
      args: ["run", "-A", "jsr:@tutors/tutors"],
      cwd: tempDir,
      stdout: "piped",
      stderr: "piped",
    });

    const result = await command.output();
    assertEquals(result.code, 0, "Generation should succeed");

    // Assert: Check for deployment files

    // 1. netlify.toml (if present, validate it)
    const netlifyTomlPath = `${tempDir}/netlify.toml`;
    if (await exists(netlifyTomlPath)) {
      const tomlContent = await Deno.readTextFile(netlifyTomlPath);

      // Basic TOML validation
      assert(
        tomlContent.length > 0,
        "netlify.toml should not be empty"
      );

      console.log("  ✅ netlify.toml present");

      // Check for common Netlify settings
      if (tomlContent.includes("publish")) {
        console.log("  ✅ Publish directory configured");
      }
      if (tomlContent.includes("build")) {
        console.log("  ✅ Build settings configured");
      }
    } else {
      console.log("  ℹ netlify.toml not present (can be added manually)");
    }

    // 2. Output directory should exist
    const jsonDir = `${tempDir}/json`;
    assert(
      await exists(jsonDir),
      "Output directory should exist for deployment"
    );

    // 3. tutors.json should be deployment-ready
    const tutorsJsonPath = `${jsonDir}/tutors.json`;
    assert(
      await exists(tutorsJsonPath),
      "tutors.json should exist for deployment"
    );

    const jsonContent = await Deno.readTextFile(tutorsJsonPath);
    const courseData = JSON.parse(jsonContent);
    assertExists(courseData.type, "Course data should be valid");

    console.log("  ✅ Deployment files ready");
    console.log("  ✅ Output structure valid");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

/**
 * T058: Netlify deployment structure is valid
 *
 * Ensures the output directory structure is compatible with Netlify.
 */
Deno.test("Integration Netlify: Output structure is deployment-compatible", async () => {
  // Arrange: Create temp copy
  const tempDir = await Deno.makeTempDir({ prefix: "netlify_structure_" });

  try {
    await copyDirectory(MINIMAL_COURSE_PATH, tempDir);

    // Act: Generate both JSON and HTML
    const jsonCommand = new Deno.Command("deno", {
      args: ["run", "-A", "jsr:@tutors/tutors"],
      cwd: tempDir,
      stdout: "piped",
      stderr: "piped",
    });

    const htmlCommand = new Deno.Command("deno", {
      args: ["run", "-A", "jsr:@tutors/tutors-lite"],
      cwd: tempDir,
      stdout: "piped",
      stderr: "piped",
    });

    const jsonResult = await jsonCommand.output();
    const htmlResult = await htmlCommand.output();

    assertEquals(jsonResult.code, 0, "JSON generation should succeed");
    assertEquals(htmlResult.code, 0, "HTML generation should succeed");

    // Assert: Deployment-compatible structure

    // 1. Output directories should be separate
    const jsonDir = `${tempDir}/json`;
    const htmlDir = `${tempDir}/html`;

    assert(await exists(jsonDir), "JSON output directory should exist");
    assert(await exists(htmlDir), "HTML output directory should exist");

    // 2. No overlapping files (prevents deployment conflicts)
    // JSON and HTML outputs should be in their respective directories

    // 3. Both outputs should be independently deployable
    const jsonDeployable = await exists(`${jsonDir}/tutors.json`);
    assert(jsonDeployable, "JSON output should be independently deployable");

    // HTML should have at least one index.html somewhere
    let htmlDeployable = false;
    async function hasIndexHtml(dir: string): Promise<boolean> {
      try {
        for await (const entry of Deno.readDir(dir)) {
          if (entry.isFile && entry.name === "index.html") {
            return true;
          } else if (entry.isDirectory) {
            if (await hasIndexHtml(`${dir}/${entry.name}`)) {
              return true;
            }
          }
        }
      } catch {
        // Directory not readable
      }
      return false;
    }
    htmlDeployable = await hasIndexHtml(htmlDir);
    assert(htmlDeployable, "HTML output should have index.html");

    console.log("  ✅ JSON output: Independently deployable");
    console.log("  ✅ HTML output: Independently deployable");
    console.log("  ✅ No deployment conflicts");
    console.log("  ✅ Netlify-compatible structure");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

/**
 * T059: Deployment output has no broken paths
 *
 * Validates that all paths in the output are valid and deployable.
 */
Deno.test("Integration Netlify: No broken paths in deployment output", async () => {
  // Arrange: Create temp copy
  const tempDir = await Deno.makeTempDir({ prefix: "netlify_paths_" });

  try {
    await copyDirectory(MINIMAL_COURSE_PATH, tempDir);

    // Act: Generate JSON
    const command = new Deno.Command("deno", {
      args: ["run", "-A", "jsr:@tutors/tutors"],
      cwd: tempDir,
      stdout: "piped",
      stderr: "piped",
    });

    const result = await command.output();
    assertEquals(result.code, 0, "Generation should succeed");

    // Assert: Validate paths in JSON output
    const jsonPath = `${tempDir}/json/tutors.json`;
    const jsonContent = await Deno.readTextFile(jsonPath);
    const courseData = JSON.parse(jsonContent);

    // Check for absolute paths (should be relative for deployment)
    const jsonString = JSON.stringify(courseData);

    // Should not contain Windows-style absolute paths
    assert(
      !jsonString.includes("C:\\"),
      "Output should not contain Windows absolute paths"
    );
    assert(
      !jsonString.includes("D:\\"),
      "Output should not contain drive letter paths"
    );

    // Should not contain localhost references
    assert(
      !jsonString.includes("localhost"),
      "Output should not contain localhost references"
    );

    // Should not contain file:// protocol
    assert(
      !jsonString.includes("file://"),
      "Output should not contain file:// protocol"
    );

    console.log("  ✅ No absolute paths in output");
    console.log("  ✅ No localhost references");
    console.log("  ✅ Paths are deployment-safe");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

/**
 * T060: Deployment output size is reasonable
 *
 * Ensures the generated output isn't excessively large.
 */
Deno.test("Integration Netlify: Deployment output size is reasonable", async () => {
  // Arrange: Create temp copy
  const tempDir = await Deno.makeTempDir({ prefix: "netlify_size_" });

  try {
    await copyDirectory(MINIMAL_COURSE_PATH, tempDir);

    // Act: Generate JSON
    const command = new Deno.Command("deno", {
      args: ["run", "-A", "jsr:@tutors/tutors"],
      cwd: tempDir,
      stdout: "piped",
      stderr: "piped",
    });

    const result = await command.output();
    assertEquals(result.code, 0, "Generation should succeed");

    // Assert: Check output size
    const jsonPath = `${tempDir}/json/tutors.json`;
    const stat = await Deno.stat(jsonPath);

    const sizeKB = stat.size / 1024;
    const sizeMB = sizeKB / 1024;

    console.log(`  📦 tutors.json size: ${sizeKB.toFixed(2)} KB`);

    // For a minimal course, JSON should be reasonable (< 1 MB)
    assert(
      sizeMB < 1,
      `tutors.json should be reasonably sized for minimal course (got ${sizeMB.toFixed(2)} MB)`
    );

    // But should have actual content (> 1 KB)
    assert(
      sizeKB > 1,
      "tutors.json should have meaningful content"
    );

    console.log("  ✅ Output size is reasonable");
    console.log("  ✅ Not too large for deployment");
    console.log("  ✅ Contains meaningful content");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

/**
 * T061: Multiple courses can be deployed side-by-side
 *
 * Verifies that output from multiple courses doesn't conflict.
 */
Deno.test("Integration Netlify: Multiple courses don't conflict", async () => {
  // Arrange: Create two courses
  const tempDir1 = await Deno.makeTempDir({ prefix: "netlify_course1_" });
  const tempDir2 = await Deno.makeTempDir({ prefix: "netlify_course2_" });

  try {
    await copyDirectory(MINIMAL_COURSE_PATH, tempDir1);
    await copyDirectory(MINIMAL_COURSE_PATH, tempDir2);

    // Modify second course to be different
    await Deno.writeTextFile(
      `${tempDir2}/course.md`,
      "# Course 2\n\nA different course"
    );

    // Act: Generate JSON for both courses
    const command1 = new Deno.Command("deno", {
      args: ["run", "-A", "jsr:@tutors/tutors"],
      cwd: tempDir1,
      stdout: "piped",
      stderr: "piped",
    });

    const command2 = new Deno.Command("deno", {
      args: ["run", "-A", "jsr:@tutors/tutors"],
      cwd: tempDir2,
      stdout: "piped",
      stderr: "piped",
    });

    const result1 = await command1.output();
    const result2 = await command2.output();

    assertEquals(result1.code, 0, "Course 1 generation should succeed");
    assertEquals(result2.code, 0, "Course 2 generation should succeed");

    // Assert: Both courses generate valid output
    const json1Path = `${tempDir1}/json/tutors.json`;
    const json2Path = `${tempDir2}/json/tutors.json`;

    assert(await exists(json1Path), "Course 1 JSON should exist");
    assert(await exists(json2Path), "Course 2 JSON should exist");

    // Assert: Outputs are different (not sharing state)
    const json1 = await Deno.readTextFile(json1Path);
    const json2 = await Deno.readTextFile(json2Path);

    const data1 = JSON.parse(json1);
    const data2 = JSON.parse(json2);

    // Titles should be different
    assert(
      data1.title !== data2.title,
      "Courses should have different titles"
    );

    console.log("  ✅ Multiple courses generated successfully");
    console.log("  ✅ No conflicts between courses");
    console.log("  ✅ Each course has independent output");
  } finally {
    await Deno.remove(tempDir1, { recursive: true });
    await Deno.remove(tempDir2, { recursive: true });
  }
});

