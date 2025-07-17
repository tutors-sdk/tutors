import { assertEquals } from "jsr:@std/assert";
import { buildFileStructure, removeTmpDir} from "../utils/test-helpers.ts";
import { REFERENCE_COURSE, REFERENCE_HTML, TEST_FOLDER, tutorsPublishHtml } from "../utils/tutors-runner.ts";
import { compareDirectoryContents } from "../utils/comparators.ts";

Deno.test("Integration - Reference Static Site", async () => {
  const result = await tutorsPublishHtml(REFERENCE_COURSE, `${TEST_FOLDER}/test-course`);
  assertEquals(result, true, `Generator failed`);
  
  const htmlStructure = await buildFileStructure(`${TEST_FOLDER}/test-course/html`);
  const referenceStructure = await buildFileStructure(REFERENCE_HTML);

  await compareDirectoryContents(htmlStructure, referenceStructure);

  console.log(`✓ Basic HTML structure validation`);
  await removeTmpDir(TEST_FOLDER);
});
