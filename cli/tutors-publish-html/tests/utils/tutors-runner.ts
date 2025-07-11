
import { parseCourse, generateStaticCourse } from "@tutors/tutors-gen-lib";
import { join, resolve } from "@std/path";
import { createTempDir, copyDir, removeTmpDir } from "./test-helpers.ts";
import { exists } from "@std/fs/exists";

const rootPath = Deno.cwd();

export const REFERENCE_COURSE = resolve(Deno.cwd(), "../test_fixtures/reference-course");
export const REFERENCE_HTML = resolve(Deno.cwd(), "../test_fixtures/reference-html");
export const TEST_FOLDER = `${rootPath}/temp`;

const localVentoTemplates = "/Users/edeleastar/repos/tutor-sdk/apps/tutors-apps/cli/tutors-gen-lib/src/templates/vento";

export async function generateHtml(path: string): Promise<boolean> {
  const lo = await parseCourse(path);
  const success = await generateStaticCourse(lo, `${path}/html`, localVentoTemplates);
  return success
}

export async function tutorsPublishHtml(coursePath: string, testDir: string): Promise<boolean> {
  await removeTmpDir(testDir);
  await createTempDir(testDir);
  await copyDir(coursePath, testDir);
  return await generateHtml(testDir);
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