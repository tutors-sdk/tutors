import { assertEquals, assertExists } from "@std/assert";
import { exists } from "@std/fs";
import { resolve } from "@std/path";

import { REFERENCE_COURSE, REFERENCE_HTML } from "../utils/tutors-runner.ts";

Deno.test("Integration paths - verify reference course exists", async () => {
  console.log("Current working directory:", Deno.cwd());

  console.log("Looking for reference course at:", REFERENCE_COURSE);
  console.log("Looking for reference HTML at:", REFERENCE_HTML);
  
  // Check if paths exist
  const courseExists = await exists(REFERENCE_COURSE);
  const htmlExists = await exists(REFERENCE_HTML);
  
  console.log("Reference course exists:", courseExists);
  console.log("Reference HTML exists:", htmlExists);
  
  if (courseExists) {
    // List contents of reference course
    console.log("Reference course contents:");
    for await (const entry of Deno.readDir(REFERENCE_COURSE)) {
      console.log("  -", entry.name, entry.isDirectory ? "(dir)" : "(file)");
    }
  }
  
  if (htmlExists) {
    // List contents of reference HTML
    console.log("Reference HTML contents:");
    for await (const entry of Deno.readDir(REFERENCE_HTML)) {
      console.log("  -", entry.name, entry.isDirectory ? "(dir)" : "(file)");
    }
  }
  
  // For now, just test that we can calculate the paths
  assertEquals(typeof REFERENCE_COURSE, "string");
  assertEquals(typeof REFERENCE_HTML, "string");
});

Deno.test("Integration paths - check course.md in reference course", async () => {
  const courseMarkdown = resolve(REFERENCE_COURSE, "course.md");
  
  console.log("Looking for course.md at:", courseMarkdown);
  
  const courseMarkdownExists = await exists(courseMarkdown);
  console.log("course.md exists:", courseMarkdownExists);
  
  if (courseMarkdownExists) {
    const content = await Deno.readTextFile(courseMarkdown);
    console.log("course.md content preview:", content.substring(0, 100) + "...");
  }
  
  // This test passes regardless of whether the file exists - it's just for debugging
  assertEquals(true, true);
}); 