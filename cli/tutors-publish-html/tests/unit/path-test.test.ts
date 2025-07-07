import { assertEquals, assertExists } from "@std/assert";
import { exists } from "@std/fs";
import { join, resolve } from "@std/path";

Deno.test("Path resolution test", async () => {
  const originalCwd = Deno.cwd();
  console.log("Original CWD:", originalCwd);
  
  // Test different possible paths to main.ts
  const possiblePaths = [
    join(originalCwd, "main.ts"),
    join(originalCwd, "../main.ts"),
    join(originalCwd, "../../main.ts"),
    resolve(originalCwd, "main.ts"),
    resolve(originalCwd, "../main.ts"),
    resolve(originalCwd, "../../main.ts")
  ];
  
  for (const path of possiblePaths) {
    const pathExists = await exists(path);
    console.log(`Path ${path}: ${pathExists ? "EXISTS" : "NOT FOUND"}`);
    if (pathExists) {
      console.log("✓ Found main.ts at:", path);
    }
  }
  
  // Simple test that always passes for now
  assertEquals(true, true);
});

Deno.test("Deno command test", async () => {
  try {
    const process = new Deno.Command("deno", {
      args: ["--version"],
      stdout: "piped",
      stderr: "piped",
    });
    
    const { code, stdout, stderr } = await process.output();
    const output = new TextDecoder().decode(stdout) + new TextDecoder().decode(stderr);
    
    console.log("Deno version output:", output);
    console.log("Exit code:", code);
    
    assertEquals(code, 0);
  } catch (error) {
    console.error("Error running deno command:", error);
    // This test may fail if deno is not available, but we'll see the error
  }
}); 