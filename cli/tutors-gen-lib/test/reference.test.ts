import { assertEquals } from "jsr:@std/assert";
import { buildFileStructure, removeTmpDir } from "../../test/utils/test-helpers.ts";
import { FIXTURES, TEST_FOLDER, tutorsPublishHtml, tutorsPublishJson } from "../../test/utils/tutors-runner.ts";
import { compareDirectoryContents } from "../../test/utils/comparators.ts";

Deno.test("Integration - Reference Static Site", async () => {
  const result = await tutorsPublishHtml("reference-course");
  assertEquals(result, true, `Generator failed`);

  const htmlStructure = await buildFileStructure(`${TEST_FOLDER}/reference-course/html`);
  const referenceStructure = await buildFileStructure(`${FIXTURES}/reference-html`);

  await compareDirectoryContents(htmlStructure, referenceStructure);

  console.log(`✓ Basic HTML structure validation`);
  await removeTmpDir(`${TEST_FOLDER}/reference-course`);
});

Deno.test("Integration - Reference Dynamic Site", async () => {
  const result = await tutorsPublishJson("layout-reference-course");
  assertEquals(result, true, `Generator failed`);

  const jsonStructure = await buildFileStructure(`${TEST_FOLDER}/layout-reference-course/json`);
  const referenceStructure = await buildFileStructure(`${FIXTURES}/layout-reference-json`);

  await compareDirectoryContents(jsonStructure, referenceStructure);

  console.log(`✓ Basic JSON structure validation`);
  await removeTmpDir(`${TEST_FOLDER}/layout-reference-course`);
});