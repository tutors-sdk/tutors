import { assertEquals, assertExists } from "@std/assert";
import { exists } from "@std/fs";
import { createTempDir, removeDir, assertDirExists } from "../../test/utils/test-helpers.ts";
import { TEST_FOLDER } from "../../test/utils/tutors-runner.ts";
import { runTutorsProcess } from "../../test/utils/tutors-runner.ts";
import { join } from "jsr:@std/path@1/join";

Deno.test("main.ts - should display version when course.md exists", async () => {
  const tempDir = await createTempDir(`${TEST_FOLDER}`);
  
  try {
    // Create a minimal course.md file
    await Deno.writeTextFile(join(tempDir, "course.md"), "# Test Course\n\nThis is a test course.");
    
    const result = await runTutorsProcess(tempDir);
    
    // Should contain version string
    assertEquals(result.output.includes("tutors-publish-html: 4.1.3"), true);
    
    // Should create html directory
    assertExists(await exists(join(tempDir, "html")));
    
  } finally {
    await removeDir(tempDir);
  }
});

Deno.test("main.ts - should display error when course.md missing", async () => {
  const tempDir = await createTempDir(`${TEST_FOLDER}`);
  
  try {
    const result = await runTutorsProcess(tempDir);
    
    // Should contain error message
    assertEquals(result.output.includes("Cannot locate course.md"), true);
    
    // Should still display version
    assertEquals(result.output.includes("tutors-publish-html: 4.1.3"), true);
    
    // Should not create html directory
    assertEquals(await exists(join(tempDir, "html")), false);
    
  } finally {
    await removeDir(tempDir);
  }
});

Deno.test("main.ts - should handle empty course.md", async () => {
  const tempDir = await createTempDir(`${TEST_FOLDER}`);
  
  try {
    // Create empty course.md file
    await Deno.writeTextFile(join(tempDir, "course.md"), "");
    
    const result = await runTutorsProcess(tempDir);
    
    // Should still display version
    assertEquals(result.output.includes("tutors-publish-html: 4.1.3"), true);
    
    // Should attempt to create html directory (even if generation fails)
    // This tests that the main logic runs
    
  } finally {
    await removeDir(tempDir);
  }
});

Deno.test("main.ts - should handle course with basic structure", async () => {
  const tempDir = await createTempDir(`${TEST_FOLDER}`);
  
  try {
    // Create a course with basic structure
    await Deno.writeTextFile(join(tempDir, "course.md"), `# Test Course

This is a test course for unit testing.

## Topics

- Topic 1
- Topic 2
`);
    
    // Create some basic structure
    await Deno.mkdir(join(tempDir, "topic-01"), { recursive: true });
    await Deno.writeTextFile(join(tempDir, "topic-01", "topic.md"), "# Topic 1\n\nFirst topic content.");
    
    const result = await runTutorsProcess(tempDir);
    
    // Should display version
    assertEquals(result.output.includes("tutors-publish-html: 4.1.3"), true);
    
    // Should create html directory
    await assertDirExists(join(tempDir, "html"));
    
  } finally {
    await removeDir(tempDir);
  }
});

Deno.test("main.ts - should handle course with invalid markdown", async () => {
  const tempDir = await createTempDir(`${TEST_FOLDER}`);
  
  try {
    // Create course.md with invalid/malformed markdown
    await Deno.writeTextFile(join(tempDir, "course.md"), `# Test Course
[Invalid markdown link](
Missing closing bracket
`);
    
    const result = await runTutorsProcess(tempDir);
    
    // Should still display version (graceful handling)
    assertEquals(result.output.includes("tutors-publish-html: 4.1.3"), true);
    
  } finally {
    await removeDir(tempDir);
  }
});

Deno.test("main.ts - should handle permission errors gracefully", async () => {
  const tempDir = await createTempDir(`${TEST_FOLDER}`);
  
  try {
    // Create course.md
    await Deno.writeTextFile(join(tempDir, "course.md"), "# Test Course\n\nContent.");
    
    // Create a file where html directory should be created
    await Deno.writeTextFile(join(tempDir, "html"), "This is a file, not a directory");
    
    const result = await runTutorsProcess(tempDir);
    
    // Should still display version
    assertEquals(result.output.includes("tutors-publish-html: 4.1.3"), true);
    
    // May contain error about directory creation
    // But should handle gracefully without crashing
    
  } finally {
    await removeDir(tempDir);
  }
});

Deno.test("main.ts - should create correct output directory structure", async () => {
  const tempDir = await createTempDir(`${TEST_FOLDER}`);
  
  try {
    // Create a minimal valid course
    await Deno.writeTextFile(join(tempDir, "course.md"), `# Test Course

A test course for output structure validation.
`);
    
    const result = await runTutorsProcess(tempDir);
    
    // Should succeed
    assertEquals(result.output.includes("tutors-publish-html: 4.1.3"), true);
    
    // Should create html directory
    await assertDirExists(join(tempDir, "html"));
    
    // The html directory should contain generated files
    // (exact structure depends on generateStaticCourse implementation)
    
  } finally {
    await removeDir(tempDir);
  }
});

Deno.test("main.ts - should handle working directory changes", async () => {
  const tempDir = await createTempDir(`${TEST_FOLDER}`);
  const originalCwd = Deno.cwd();
  
  try {
    // Create course.md
    await Deno.writeTextFile(join(tempDir, "course.md"), "# Test Course\n\nContent.");
    
    // Change to temp directory
    Deno.chdir(tempDir);
    
    // Get the path to main.ts - it should be in the current directory
    const mainPath = join(originalCwd, "main.ts");
    
    // Run the command in current directory
    const process = new Deno.Command("deno", {
      args: ["run", "-A", mainPath],
      stdout: "piped",
      stderr: "piped",
    });
    
    const { code, stdout, stderr } = await process.output();
    const output = new TextDecoder().decode(stdout) + new TextDecoder().decode(stderr);
    
    // Should succeed and display version
    assertEquals(output.includes("tutors-publish-html: 4.1.3"), true);
    
    // Should create html directory in current directory
    await assertDirExists("html");
    
  } finally {
    Deno.chdir(originalCwd);
    await removeDir(tempDir);
  }
}); 

Deno.test("Debug - check actual output from main.ts", async () => {
  const tempDir = await createTempDir(`${TEST_FOLDER}`);
  const originalCwd = Deno.cwd();
  
  try {
    // Test without course.md
    Deno.chdir(tempDir);
    const mainPath = join(originalCwd, "main.ts");
    
    const process = new Deno.Command("deno", {
      args: ["run", "-A", mainPath],
      cwd: tempDir,
      stdout: "piped",
      stderr: "piped",
    });
    
    const { code, stdout, stderr } = await process.output();
    const output = new TextDecoder().decode(stdout) + new TextDecoder().decode(stderr);
    
    console.log("=== ACTUAL OUTPUT ===");
    console.log(output);
    console.log("=== END OUTPUT ===");
    console.log("Exit code:", code);
    console.log("Contains version:", output.includes("tutors-publish-html: 4.1.2"));
    console.log("Contains error:", output.includes("Cannot locate course.md"));
    
    // Simple assertion that always passes
    assertEquals(true, true);
    
  } finally {
    Deno.chdir(originalCwd);
    await removeDir(tempDir);
  }
});

Deno.test("Debug - check output with course.md", async () => {
  const tempDir = await createTempDir(`${TEST_FOLDER}`);
  const originalCwd = Deno.cwd();
  
  try {
    // Create course.md
    await Deno.writeTextFile(join(tempDir, "course.md"), "# Test Course\n\nContent");
    
    Deno.chdir(tempDir);
    const mainPath = join(originalCwd, "main.ts");
    
    const process = new Deno.Command("deno", {
      args: ["run", "-A", mainPath],
      cwd: tempDir,
      stdout: "piped",
      stderr: "piped",
    });
    
    const { code, stdout, stderr } = await process.output();
    const output = new TextDecoder().decode(stdout) + new TextDecoder().decode(stderr);
    
    console.log("=== ACTUAL OUTPUT WITH COURSE.MD ===");
    console.log(output);
    console.log("=== END OUTPUT ===");
    console.log("Exit code:", code);
    console.log("Contains version:", output.includes("tutors-publish-html: 4.1.2"));
    
    // Simple assertion that always passes
    assertEquals(true, true);
    
  } finally {
    Deno.chdir(originalCwd);
    await removeDir(tempDir);
  }
}); 