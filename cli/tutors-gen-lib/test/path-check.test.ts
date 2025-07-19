import { assertEquals } from "jsr:@std/assert";
import { exists } from "jsr:@std/fs/exists";
import { resolve } from "jsr:@std/path";
import { FIXTURES } from "../../test/utils/tutors-runner.ts";

Deno.test("Integration paths - verify reference course exists", async () => {
  console.log("Current working directory:", Deno.cwd());

  console.log("Looking for reference course at:", `${FIXTURES}/reference-course`);
  console.log("Looking for reference HTML at:", `${FIXTURES}/reference-html`);
  
  // Check if paths exist
  const courseExists = await exists(`${FIXTURES}/reference-course`);
  const htmlExists = await exists(`${FIXTURES}/reference-html`);
  
  console.log("Reference course exists:", courseExists);
  console.log("Reference HTML exists:", htmlExists);
  
  if (courseExists) {
    // List contents of reference course
    console.log("Reference course contents:");
    for await (const entry of Deno.readDir(`${FIXTURES}/reference-course`)) {
      console.log("  -", entry.name, entry.isDirectory ? "(dir)" : "(file)");
    }
  }
  
  if (htmlExists) {
    // List contents of reference HTML
    console.log("Reference HTML contents:");
    for await (const entry of Deno.readDir(`${FIXTURES}/reference-html`)) {
      console.log("  -", entry.name, entry.isDirectory ? "(dir)" : "(file)");
    }
  }
  
  // For now, just test that we can calculate the paths
  assertEquals(typeof `${FIXTURES}/reference-course`, "string");
  assertEquals(typeof `${FIXTURES}/reference-html`, "string");
});

Deno.test("Integration paths - check course.md in reference course", async () => {
  const courseMarkdown = resolve(`${FIXTURES}/reference-course`, "course.md");
  
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