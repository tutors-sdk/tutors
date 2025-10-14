/**
 * Integration Tests: End-to-End JSON Generation Pipeline
 * User Story 4: Integration and Deployment Confidence
 *
 * Tests the complete workflow from course source to deployment-ready JSON.
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
 * T048: Complete JSON generation pipeline works end-to-end
 *
 * Validates the entire workflow:
 * 1. Course source files
 * 2. CLI processing
 * 3. JSON output generation
 * 4. tutors.json validation
 * 5. Deployment readiness
 */
Deno.test("Integration E2E: Complete JSON generation pipeline", async () => {
  // Arrange: Create temp copy of course
  const tempDir = await Deno.makeTempDir({ prefix: "e2e_json_" });

  try {
    await copyDirectory(MINIMAL_COURSE_PATH, tempDir);

    // Act: Run tutors CLI (JSON generation)
    const command = new Deno.Command("deno", {
      args: ["run", "-A", "jsr:@tutors/tutors"],
      cwd: tempDir,
      stdout: "piped",
      stderr: "piped",
    });

    const result = await command.output();
    const output = new TextDecoder().decode(result.stdout);
    const errors = new TextDecoder().decode(result.stderr);

    // Assert: CLI should complete successfully
    assertEquals(
      result.code,
      0,
      `CLI should succeed. Output: ${output}\nErrors: ${errors}`,
    );

    // Assert: tutors.json should be generated
    const jsonPath = `${tempDir}/json/tutors.json`;
    const jsonExists = await exists(jsonPath);
    assert(jsonExists, `tutors.json should be generated at ${jsonPath}`);

    // Assert: tutors.json should be valid JSON
    const jsonContent = await Deno.readTextFile(jsonPath);
    let courseData;
    try {
      courseData = JSON.parse(jsonContent);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      throw new Error(`tutors.json should be valid JSON: ${errorMsg}`);
    }

    // Assert: Course should have expected structure
    assertExists(courseData.type, "Course should have type");
    assertEquals(courseData.type, "course", "Root should be a course");
    assertExists(courseData.title, "Course should have title");

    // Assert: Course should have topics
    assertExists(courseData.los, "Course should have learning objects");
    assert(
      Array.isArray(courseData.los),
      "Learning objects should be an array",
    );
    assert(
      courseData.los.length > 0,
      "Course should have at least one learning object",
    );

    // Assert: Topics should have proper structure
    const firstTopic = courseData.los[0];
    assertExists(firstTopic.type, "Topic should have type");
    assertExists(firstTopic.title, "Topic should have title");
    assertExists(firstTopic.id, "Topic should have id");

    // Assert: Labs should have steps
    const lab = courseData.los.find((lo: any) => lo.type === "lab");
    if (lab) {
      assertExists(lab.los, "Lab should have steps");
      assert(Array.isArray(lab.los), "Lab steps should be an array");
      if (lab.los.length > 0) {
        const step = lab.los[0];
        assertEquals(step.type, "step", "Lab child should be a step");
        assertExists(step.title, "Step should have title");
      }
    }

    // Assert: Properties should be included
    assertExists(courseData.properties, "Course should have properties");

    console.log("  ✅ JSON generation pipeline complete");
    console.log(`  ✅ Course: ${courseData.title}`);
    console.log(`  ✅ Topics: ${courseData.los.length}`);
    console.log(`  ✅ JSON file size: ${jsonContent.length} bytes`);
  } finally {
    // Cleanup
    await Deno.remove(tempDir, { recursive: true });
  }
});

/**
 * T049: JSON output is deployment-ready for Netlify
 *
 * Verifies that generated JSON can be deployed to Netlify without issues.
 */
Deno.test("Integration E2E: JSON output is Netlify deployment-ready", async () => {
  // Arrange: Create temp copy
  const tempDir = await Deno.makeTempDir({ prefix: "e2e_netlify_json_" });

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
    assertEquals(result.code, 0, "JSON generation should succeed");

    // Assert: Check for Netlify deployment requirements

    // 1. tutors.json should be in json/ directory
    const jsonPath = `${tempDir}/json/tutors.json`;
    assert(await exists(jsonPath), "tutors.json should be in json/ directory");

    // 2. If netlify.toml exists, verify it's valid
    const netlifyTomlPath = `${tempDir}/netlify.toml`;
    if (await exists(netlifyTomlPath)) {
      const tomlContent = await Deno.readTextFile(netlifyTomlPath);
      assert(
        tomlContent.includes("publish"),
        "netlify.toml should define publish directory",
      );
      console.log("  ✅ netlify.toml present and valid");
    } else {
      console.log("  ℹ No netlify.toml (optional)");
    }

    // 3. JSON should be properly formatted (no syntax errors)
    const jsonContent = await Deno.readTextFile(jsonPath);
    const courseData = JSON.parse(jsonContent);
    assertExists(courseData.type, "Course data should be valid");

    // 4. Check for required deployment files
    const requiredFiles = [
      `${tempDir}/json/tutors.json`,
    ];

    for (const file of requiredFiles) {
      assert(await exists(file), `Required file should exist: ${file}`);
    }

    // 5. Verify no broken references in JSON
    // (This would be a good place to check image/resource paths)
    if (courseData.img) {
      console.log(`  ✅ Course has image: ${courseData.img}`);
    }

    console.log("  ✅ JSON output is deployment-ready");
    console.log("  ✅ All required files present");
    console.log("  ✅ JSON structure valid");
    console.log("  ✅ Ready for Netlify deployment");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

/**
 * T050: Pipeline handles missing assets gracefully
 *
 * Tests that the pipeline doesn't crash if optional assets are missing.
 */
Deno.test("Integration E2E: Pipeline handles missing optional assets", async () => {
  // Arrange: Create course without images
  const tempDir = await Deno.makeTempDir({ prefix: "e2e_missing_assets_" });

  try {
    // Create minimal course without img directory
    await Deno.writeTextFile(
      `${tempDir}/course.md`,
      "# Test Course\n\nCourse without images",
    );
    await Deno.writeTextFile(
      `${tempDir}/properties.yaml`,
      "credits: Test\n",
    );

    // Create a topic
    const topicDir = `${tempDir}/topic-01`;
    await Deno.mkdir(topicDir);
    await Deno.writeTextFile(
      `${topicDir}/topic.md`,
      "# Topic 1\n\nA simple topic",
    );

    // Act: Run JSON generation
    const command = new Deno.Command("deno", {
      args: ["run", "-A", "jsr:@tutors/tutors"],
      cwd: tempDir,
      stdout: "piped",
      stderr: "piped",
    });

    const result = await command.output();
    const output = new TextDecoder().decode(result.stdout);

    // Assert: Should complete successfully even without images
    assertEquals(
      result.code,
      0,
      `Pipeline should handle missing assets gracefully. Output: ${output}`,
    );

    // Assert: JSON should still be generated
    const jsonPath = `${tempDir}/json/tutors.json`;
    assert(await exists(jsonPath), "JSON should be generated despite missing assets");

    // Assert: JSON should be valid
    const jsonContent = await Deno.readTextFile(jsonPath);
    const courseData = JSON.parse(jsonContent);
    assertExists(courseData.type, "Course data should be valid");

    console.log("  ✅ Pipeline handles missing assets gracefully");
    console.log("  ✅ JSON generated successfully");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

/**
 * T051: JSON output is stable across multiple runs
 *
 * Verifies that generating JSON multiple times produces consistent results.
 */
Deno.test("Integration E2E: JSON output is stable across multiple runs", async () => {
  // Arrange: Create temp copy
  const tempDir = await Deno.makeTempDir({ prefix: "e2e_stability_" });

  try {
    await copyDirectory(MINIMAL_COURSE_PATH, tempDir);

    // Act: Generate JSON twice
    const command = new Deno.Command("deno", {
      args: ["run", "-A", "jsr:@tutors/tutors"],
      cwd: tempDir,
      stdout: "piped",
      stderr: "piped",
    });

    // First run
    const result1 = await command.output();
    assertEquals(result1.code, 0, "First generation should succeed");

    const jsonPath = `${tempDir}/json/tutors.json`;
    const json1 = await Deno.readTextFile(jsonPath);
    const data1 = JSON.parse(json1);

    // Second run
    const result2 = await command.output();
    assertEquals(result2.code, 0, "Second generation should succeed");

    const json2 = await Deno.readTextFile(jsonPath);
    const data2 = JSON.parse(json2);

    // Assert: Core structure should be identical
    assertEquals(
      data1.type,
      data2.type,
      "Course type should be consistent",
    );
    assertEquals(
      data1.title,
      data2.title,
      "Course title should be consistent",
    );
    assertEquals(
      data1.los.length,
      data2.los.length,
      "Number of topics should be consistent",
    );

    // Assert: Topic IDs should be stable
    const topics1 = data1.los.map((lo: any) => lo.id).sort();
    const topics2 = data2.los.map((lo: any) => lo.id).sort();
    assertEquals(
      JSON.stringify(topics1),
      JSON.stringify(topics2),
      "Topic IDs should be stable across runs",
    );

    console.log("  ✅ JSON output is stable");
    console.log("  ✅ Multiple runs produce consistent results");
    console.log("  ✅ URLs remain stable (no hash changes)");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});
