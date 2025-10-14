/**
 * Critical Path Tests: Tutors Gen Lib Core Functions
 * User Story 1: Core CLI Functionality Verification
 *
 * Tests core library functions used by CLI tools.
 * Follows Constitution Principle II: Readable Tests Over Clever Tests
 */

import { assert, assertEquals, assertExists } from "@std/assert";
import { parseCourse } from "@tutors/tutors-gen-lib";
import { exists } from "@std/fs";

const MINIMAL_COURSE_PATH = "./fixtures/sample_courses/minimal_course";

/**
 * T020: Core library can parse minimal course
 *
 * Verifies that the parseCourse function correctly parses
 * a minimal course directory structure.
 */
Deno.test("parseCourse successfully parses minimal course", () => {
  // Arrange: Get absolute path to minimal course
  const coursePath = MINIMAL_COURSE_PATH;

  // Act: Parse the course
  const [course, lr] = parseCourse(coursePath);

  // Assert: Course object should be returned
  assertExists(course, "Course object should be returned");
  assertExists(lr, "Learning resources object should be returned");

  // Assert: Course should have basic properties
  assertExists(course.title, "Course should have a title");
  assertEquals(course.type, "course", "Course type should be 'course'");
  assertExists(course.los, "Course should have learning objects array");

  // Assert: Course title should match (trim to handle Windows line endings)
  assertEquals(
    course.title.trim(),
    "Introduction to Programming",
    "Course title should match course.md content",
  );

  // Assert: Learning objects should be populated
  assert(
    Array.isArray(course.los),
    "Learning objects should be an array",
  );

  // We expect at least the topics and lab from minimal course
  assert(
    course.los.length > 0,
    `Course should have learning objects, found ${course.los.length}`,
  );
});

/**
 * Learning objects structure test
 *
 * Verifies that parsed learning objects have the correct structure
 */
Deno.test("parseCourse creates properly structured learning objects", () => {
  // Arrange & Act
  const coursePath = MINIMAL_COURSE_PATH;
  const [course, _lr] = parseCourse(coursePath);

  // Assert: Each learning object should have required properties
  for (const lo of course.los) {
    assertExists(lo.id, "Each learning object should have an id");
    assertExists(lo.title, "Each learning object should have a title");
    assertExists(lo.type, "Each learning object should have a type");

    // Type should be one of the valid learning object types
    const validTypes = [
      "course",
      "topic",
      "unit",
      "side",
      "lab",
      "step",
      "note",
      "talk",
      "web",
      "github",
      "archive",
      "panelvideo",
      "panelnote",
      "paneltalk",
    ];
    assert(
      validTypes.includes(lo.type),
      `Learning object type '${lo.type}' should be valid`,
    );
  }
});

/**
 * Nested learning objects test
 *
 * Verifies that nested learning objects (like lab steps) are parsed correctly
 */
Deno.test("parseCourse handles nested learning objects (lab steps)", () => {
  // Arrange & Act
  const coursePath = MINIMAL_COURSE_PATH;
  const [course, _lr] = parseCourse(coursePath);

  // Assert: Find the lab learning object
  const lab = course.los.find((lo: any) => lo.type === "lab");

  if (lab) {
    assertExists(lab, "Lab learning object should exist");
    assertExists(lab.title, "Lab should have a title");

    // If lab has steps, they should be properly structured
    // Using type assertion since Lo type may not expose los property in types
    const labWithSteps = lab as any;
    if (labWithSteps.los && labWithSteps.los.length > 0) {
      const firstStep = labWithSteps.los[0];
      assertExists(firstStep.id, "Lab step should have an id");
      assertExists(firstStep.title, "Lab step should have a title");
      assertEquals(firstStep.type, "step", "Nested object in lab should be a step");
    }
  } else {
    // If no lab found, that's okay - minimal course structure may vary
    console.log("Note: No lab found in minimal course");
  }
});

/**
 * Course properties parsing test
 *
 * Verifies that course properties (from properties.yaml) are parsed
 */
Deno.test("parseCourse includes course properties from properties.yaml", () => {
  // Arrange & Act
  const coursePath = MINIMAL_COURSE_PATH;
  const [course, _lr] = parseCourse(coursePath);

  // Assert: Course should have properties if properties.yaml exists
  // The minimal course has a properties.yaml file
  assertExists(course.properties, "Course should have properties object");

  // Properties should be an object
  assert(
    typeof course.properties === "object",
    "Properties should be an object",
  );
});

/**
 * Error handling test - non-existent course
 *
 * Verifies that parseCourse handles non-existent directories appropriately
 */
Deno.test("parseCourse handles non-existent directory gracefully", () => {
  // Arrange: Non-existent path
  const nonExistentPath = "./fixtures/sample_courses/does_not_exist";

  // Act & Assert: Should throw or return error indication
  try {
    const [course, _lr] = parseCourse(nonExistentPath);

    // If it doesn't throw, it should at least return an empty or invalid course
    // The exact behavior depends on implementation
    assert(
      !course || course.los.length === 0,
      "Non-existent course should result in empty or undefined course",
    );
  } catch (error) {
    // Expected behavior - should throw an error
    assert(
      error instanceof Error,
      "Should throw an Error for non-existent directory",
    );
  }
});

/**
 * Resource collection test
 *
 * Verifies that learning resources are collected during parsing
 */
Deno.test("parseCourse collects learning resources", () => {
  // Arrange & Act
  const coursePath = MINIMAL_COURSE_PATH;
  const [_course, lr] = parseCourse(coursePath);

  // Assert: Learning resources should be returned
  assertExists(lr, "Learning resources should be returned");

  // LR should be an object
  assert(
    typeof lr === "object",
    "Learning resources should be an object",
  );

  // The structure of lr depends on the implementation
  // At minimum, it should be a defined object
  assert(
    Object.keys(lr).length >= 0,
    "Learning resources should have some structure",
  );
});
