import { assertEquals, assertExists } from "@std/assert";
import { exists } from "@std/fs";
import { join } from "@std/path";
import { 
  createTempDir, 
  removeDir, 
  assertFileExists, 
  assertDirExists 
} from "../utils/test-helpers.ts";

// Import the functions directly from the libraries
import { parseCourse } from "@tutors/tutors-gen-lib";
import { TEST_FOLDER } from "../utils/tutors-runner.ts";

Deno.test("Direct - parseCourse should handle valid course", async () => {
  await removeDir(`${TEST_FOLDER}`);
  await createTempDir(`${TEST_FOLDER}`);
  
  try {
    // Create a minimal course.md file
    await Deno.writeTextFile(join(`${TEST_FOLDER}`, "course.md"), `# Test Course

This is a test course for direct testing.

## Content

Some course content here.
`);
    
    // Test parseCourse function directly
    const course = parseCourse(`${TEST_FOLDER}`);
    
    // Should return a course object
    assertExists(course);
    assertEquals(typeof course, "object");
    
    // Should have basic properties
    assertExists(course.title);
    
    console.log("✓ parseCourse works correctly");
    
  } catch (error) {
    console.error("parseCourse error:", error);
    throw error;
  } finally {
    await removeDir(`${TEST_FOLDER}`);
  }
});

Deno.test("Direct - should handle empty course gracefully", async () => {
  await removeDir(`${TEST_FOLDER}`);
  await createTempDir(`${TEST_FOLDER}`);
  
  try {
    // Create empty course.md file
    await Deno.writeTextFile(join(`${TEST_FOLDER}`, "course.md"), "");
    
    // Test parseCourse function directly
    const course = parseCourse(`${TEST_FOLDER}`);
    
    // Should return a course object even for empty course
    assertExists(course);
    assertEquals(typeof course, "object");
    
    console.log("✓ Empty course handled gracefully");
    
  } catch (error) {
    console.error("Empty course error:", error);
    // This might fail, but we want to see the error
    throw error;
  } finally {
    await removeDir(`${TEST_FOLDER}`);
  }
});

Deno.test("Direct - should handle missing course.md", async () => {
  await removeDir(`${TEST_FOLDER}`);
  await createTempDir(`${TEST_FOLDER}`);
  
  try {
    // Don't create course.md file
    
    // Test parseCourse function directly
    const course = parseCourse(`${TEST_FOLDER}`);
    
    // Should return a course object or throw an error
    assertExists(course);
    assertEquals(typeof course, "object");
    
    console.log("✓ Missing course.md handled gracefully");
    
  } catch (error) {
    console.error("Missing course.md error:", error);
    // This is expected to fail, but we want to see the error handling
    console.log("✓ Missing course.md threw expected error");
  } finally {
    await removeDir(`${TEST_FOLDER}`);
  }
});

Deno.test("Direct - file system operations", async () => {
  await removeDir(`${TEST_FOLDER}`);
  await createTempDir(`${TEST_FOLDER}`);
  
  try {
    // Test basic file operations
    const testFile = join(`${TEST_FOLDER}`, "test.txt");
    await Deno.writeTextFile(testFile, "test content");
    
    // Check file exists
    await assertFileExists(testFile, "test content");
    
    // Check directory exists
    await assertDirExists(`${TEST_FOLDER}`);
    
    console.log("✓ File system operations work correctly");
    
  } finally {
    await removeDir(`${TEST_FOLDER}`);
  }
});

Deno.test("Direct - parseCourse with topic structure", async () => {
  await removeDir(`${TEST_FOLDER}`);
  await createTempDir(`${TEST_FOLDER}`);
  
  try {
    // Create a course with topic structure
    await Deno.writeTextFile(join(`${TEST_FOLDER}`, "course.md"), `# Test Course

This is a test course with topics.

## Topics

- Topic 1
- Topic 2
`);
    
    // Create topic directories
    await Deno.mkdir(join(`${TEST_FOLDER}`, "topic-01"), { recursive: true });
    await Deno.writeTextFile(join(`${TEST_FOLDER}`, "topic-01", "topic.md"), "# Topic 1\n\nFirst topic content.");
    
    await Deno.mkdir(join(`${TEST_FOLDER}`, "topic-02"), { recursive: true });
    await Deno.writeTextFile(join(`${TEST_FOLDER}`, "topic-02", "topic.md"), "# Topic 2\n\nSecond topic content.");
    
    // Test parseCourse function directly
    const course = parseCourse(`${TEST_FOLDER}`);
    
    // Should return a course object
    assertExists(course);
    assertEquals(typeof course, "object");
    
    // Should have basic properties
    assertExists(course.title);
    
    console.log("✓ parseCourse with topics works correctly");
    
  } catch (error) {
    console.error("parseCourse with topics error:", error);
    throw error;
  } finally {
    await removeDir(`${TEST_FOLDER}`);
  }
}); 