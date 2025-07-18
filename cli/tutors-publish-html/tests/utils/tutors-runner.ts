import { parseCourse, generateStaticCourse, copyAssets, generateDynamicCourse } from "@tutors/tutors-gen-lib";
import { join, resolve } from "jsr:@std/path";
import { createTempDir, copyDir, removeTmpDir } from "./test-helpers.ts";
import { exists } from "jsr:@std/fs/exists";

const rootPath = Deno.cwd();

export const REFERENCE_COURSE = resolve(Deno.cwd(), "../test_fixtures/reference-course");
export const REFERENCE_HTML = resolve(Deno.cwd(), "../test_fixtures/reference-html");
export const LAYOUT_REFERENCE_COURSE = resolve(Deno.cwd(), "../test_fixtures/layout-reference-course");
export const LAYOUT_REFERENCE_JSON = resolve(Deno.cwd(), "../test_fixtures/layout-reference-json");

export const FIXTURES = resolve(Deno.cwd(), "../test_fixtures");
export const TEST_FOLDER = `${rootPath}/temp`;

const localVentoTemplates = "/Users/edeleastar/repos/tutor-sdk/apps/tutors-apps/cli/tutors-gen-lib/src/templates/vento";

export async function generateHtml(path: string): Promise<boolean> {
  const [course, lr] = await parseCourse(path, true);
  const success = await generateStaticCourse(course, `${path}/html`, localVentoTemplates);
  copyAssets(lr, `${path}/html`);
  return success
}

export function generateJson(path: string): boolean {
  const [course, lr] = parseCourse(path);
  generateDynamicCourse(course, `${path}/json`);
  copyAssets(lr, `${path}/json`);
  return true
}

export async function tutorsPublishHtml(courseId: string): Promise<boolean> {
  await removeTmpDir(`${TEST_FOLDER}/${courseId}`);
  await createTempDir(`${TEST_FOLDER}/${courseId}`);
  await copyDir(`${FIXTURES}/${courseId}`, `${TEST_FOLDER}/${courseId}`);
  return await generateHtml(`${TEST_FOLDER}/${courseId}`);
}

export async function tutorsPublishJson(courseId: string): Promise<boolean> {
  await removeTmpDir(`${TEST_FOLDER}/${courseId}`);
  await createTempDir(`${TEST_FOLDER}/${courseId}`);
  await copyDir(`${FIXTURES}/${courseId}`, `${TEST_FOLDER}/${courseId}`);
  return await generateJson(`${TEST_FOLDER}/${courseId}`);
}

// Mock the main module functionality for testing
export async function runTutorsProcess(workingDir: string): Promise<{ success: boolean; output: string }> {
  const originalCwd = Deno.cwd();
  
  try {
    // Get the path to main.ts - it should be in the cli/tutors-publish-html directory
    // The test runner starts from cli/tutors-publish-html, so main.ts is in that directory
    const mainPath = join(originalCwd, "main.ts");
    
    // Verify the main.ts file exists
    if (!await exists(mainPath)) {
      throw new Error(`main.ts not found at ${mainPath}`);
    }
    
    // Import the main module - this will execute the main logic
    const process = new Deno.Command("deno", {
      args: ["run", "-A", mainPath],
      cwd: workingDir,
      stdout: "piped",
      stderr: "piped",
    });
    
    const { code, stdout, stderr } = await process.output();
    const output = new TextDecoder().decode(stdout) + new TextDecoder().decode(stderr);
    
    return {
      success: code === 0,
      output: output,
    };
  } finally {
    // Restore original working directory
    Deno.chdir(originalCwd);
  }
}