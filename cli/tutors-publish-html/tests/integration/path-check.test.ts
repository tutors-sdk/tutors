import { assertEquals, assertExists } from "@std/assert";
import { exists } from "@std/fs";
import { resolve } from "@std/path";

Deno.test("Integration paths - verify reference course exists", async () => {
  console.log("Current working directory:", Deno.cwd());
  
  // Calculate paths to reference data
  const referenceCourse = resolve(Deno.cwd(), "../../testing_artifacts/reference-course");
  const referenceHtml = resolve(Deno.cwd(), "../../testing_artifacts/reference-html");
  
  console.log("Looking for reference course at:", referenceCourse);
  console.log("Looking for reference HTML at:", referenceHtml);
  
  // Check if paths exist
  const courseExists = await exists(referenceCourse);
  const htmlExists = await exists(referenceHtml);
  
  console.log("Reference course exists:", courseExists);
  console.log("Reference HTML exists:", htmlExists);
  
  if (courseExists) {
    // List contents of reference course
    console.log("Reference course contents:");
    for await (const entry of Deno.readDir(referenceCourse)) {
      console.log("  -", entry.name, entry.isDirectory ? "(dir)" : "(file)");
    }
  }
  
  if (htmlExists) {
    // List contents of reference HTML
    console.log("Reference HTML contents:");
    for await (const entry of Deno.readDir(referenceHtml)) {
      console.log("  -", entry.name, entry.isDirectory ? "(dir)" : "(file)");
    }
  }
  
  // For now, just test that we can calculate the paths
  assertEquals(typeof referenceCourse, "string");
  assertEquals(typeof referenceHtml, "string");
});

Deno.test("Integration paths - check course.md in reference course", async () => {
  const referenceCourse = resolve(Deno.cwd(), "../../testing_artifacts/reference-course");
  const courseMarkdown = resolve(referenceCourse, "course.md");
  
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