import { assertEquals } from "@std/assert";
import { join } from "@std/path";
import { createTempDir, removeDir } from "../utils/test-helpers.ts";
import { TEST_FOLDER } from "../utils/tutors-runner.ts";

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
    console.log("Contains version:", output.includes("tutors-publish-html: 4.1.1"));
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
    console.log("Contains version:", output.includes("tutors-publish-html: 4.1.1"));
    
    // Simple assertion that always passes
    assertEquals(true, true);
    
  } finally {
    Deno.chdir(originalCwd);
    await removeDir(tempDir);
  }
}); 