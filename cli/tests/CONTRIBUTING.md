# Contributing to Tutors CLI Tests

Thank you for contributing to the Tutors test suite! This guide will help you add tests effectively.

## 🚀 Quick Start

```bash
# Clone and navigate
cd cli/tests

# Run all tests
deno task test:sequential

# Run in watch mode while developing
deno task test:watch

# Run specific category
deno task test:critical
```

## 📝 Adding a New Test

### 1. Choose the Right Category

- **`critical_paths/`** - Core functionality that must work
- **`edge_cases/`** - Boundary conditions, special characters, large inputs
- **`regression/`** - Tests for previously fixed bugs
- **`integration/`** - End-to-end workflows

### 2. Create Your Test File

```typescript
/**
 * Test Description
 * Category: Critical Path / Edge Case / Regression / Integration
 */

import { assert, assertEquals, assertExists } from "@std/assert";

Deno.test("descriptive test name that explains what is being tested", async () => {
  // Arrange: Set up test conditions
  const tempDir = await Deno.makeTempDir({ prefix: "test_" });

  try {
    // Act: Perform the action being tested
    const result = await someFunction();

    // Assert: Verify the results
    assertEquals(result, expectedValue);
    assertExists(result.property);
  } finally {
    // Cleanup: Always clean up resources
    await Deno.remove(tempDir, { recursive: true });
  }
});
```

### 3. Follow Testing Best Practices

#### ✅ DO

```typescript
// Clear, descriptive test names
Deno.test("tutors CLI handles Unicode filenames without crashing", async () => {
  // ...
});

// Use the minimal_course fixture
const coursePath = "./fixtures/sample_courses/minimal_course";

// Clean up in finally blocks
try {
  // test code
} finally {
  await Deno.remove(tempDir, { recursive: true });
}

// Add helpful error messages
assert(result, "Expected result to be truthy, but it was not");
```

#### ❌ DON'T

```typescript
// Vague test names
Deno.test("test 1", () => {/* ... */});

// Leave temp files behind
const tempDir = await Deno.makeTempDir();
// ... no cleanup!

// Test implementation details
// Test behavior instead
```

## 🐛 Adding Regression Tests

When fixing a bug:

1. **Create test in `regression/` directory**
2. **Name it after the issue**: `issue_NNN_description_test.ts`
3. **Document the bug** in comments:

```typescript
/**
 * Regression Test: Issue #123 - Unicode filenames crash parser
 *
 * Bug: CLI crashed when processing courses with unicode filenames
 * Fixed: 2025-10-15
 * Issue: https://github.com/tutors-sdk/tutors-apps/issues/123
 */

Deno.test("Regression: Issue #123 - Handle unicode filenames", async () => {
  // Reproduce the original bug scenario
  // Verify the fix works
});
```

## 🎯 Test Categories Explained

### Critical Paths

**When**: Core functionality that must always work\
**Examples**: JSON generation, HTML generation, basic parsing\
**Run**: `deno task test:critical`

### Edge Cases

**When**: Unusual but valid inputs\
**Examples**: Unicode filenames, large courses, special characters\
**Run**: `deno task test:edge`

### Regression

**When**: A bug was fixed and shouldn't reoccur\
**Examples**: Specific crash scenarios, parsing errors\
**Run**: `deno task test:regression`

### Integration

**When**: Testing complete workflows\
**Examples**: Course → JSON → Deployment, multi-step pipelines\
**Run**: `deno task test:integration`

## 📊 Running Tests

```bash
# All tests (sequential - 100% reliable)
deno task test:sequential

# All tests (parallel - fast but may have 1-2 intermittent failures)
deno task test

# By category
deno task test:critical
deno task test:edge
deno task test:regression
deno task test:integration

# Watch mode (re-runs on file changes)
deno task test:watch

# With coverage
deno task test:coverage
deno task coverage:report
deno task coverage:html

# Format code
deno task fmt

# Check formatting
deno task fmt:check

# Lint
deno task lint
```

## 🔧 Using Test Helpers

### Output Validation

```typescript
import { validateWithZod } from "../test_helpers/output_validator.ts";
import { CourseOutputSchema } from "../fixtures/schemas/course_output_schema.ts";

const result = await validateWithZod(jsonContent, CourseOutputSchema);
if (!result.success) {
  console.error(result.errors);
}
```

### Performance Tracking

```typescript
import { compareToBaseline, measureTime } from "../test_helpers/performance_tracker.ts";

const [result, duration] = await measureTime(async () => {
  // Your test code
});

await compareToBaseline("test-id", "tutors", "minimal", { generationTimeMs: duration });
```

### HTML Validation

```typescript
import { validateHtmlStructure } from "../test_helpers/html_validator.ts";

const isValid = validateHtmlStructure(htmlContent);
```

## 🎭 Using Fixtures

### Minimal Course

Use for most tests - fast and simple:

```typescript
const MINIMAL_COURSE = "./fixtures/sample_courses/minimal_course";
```

**Contains**:

- 2 topics (Variables & Data Types, Control Flow)
- 1 lab with 3 steps
- Notes and talks
- Sample assets (images, PDF)

### Creating Test Courses

```typescript
// Create temporary course
const tempDir = await Deno.makeTempDir({ prefix: "test_course_" });

await Deno.writeTextFile(`${tempDir}/course.md`, "# Test Course");
await Deno.writeTextFile(`${tempDir}/properties.yaml`, "credits: Test\n");

// Create topic
await Deno.mkdir(`${tempDir}/topic-01`, { recursive: true });
await Deno.writeTextFile(`${tempDir}/topic-01/topic.md`, "# Topic 1");
```

## 📈 CI/CD

Tests run automatically on:

- **PRs to main/master** → Sequential mode (100% reliable)
- **Pushes to main/master** → Full suite + coverage
- **Feature branches** → Quick parallel tests with retry

### Status Checks

All PRs must pass:

- ✅ All 54 tests
- ✅ Formatting check (`deno fmt --check`)
- ✅ Linter (`deno lint`)
- ✅ Cross-platform (Ubuntu, Windows, macOS)

## 🐞 Debugging Failing Tests

```bash
# Run specific test
deno test --allow-all path/to/test.ts --filter "test name"

# Run with detailed output
deno test --allow-all --trace-ops path/to/test.ts

# Run sequentially if parallel fails
deno task test:sequential

# Check if it's an intermittent failure
for i in {1..5}; do deno task test; done
```

## 💡 Tips

1. **Start with a failing test** - Write the test before fixing the bug
2. **Keep tests focused** - One concept per test
3. **Use descriptive names** - Test names should be sentences
4. **Clean up resources** - Always use try/finally
5. **Check existing tests** - See how similar tests are written
6. **Run tests often** - Use watch mode while developing

## 📚 Resources

- **Main README**: [`README.md`](./README.md) - Test suite overview
- **Test Fixtures**: [`fixtures/`](./fixtures/) - Sample courses and schemas
- **Test Helpers**: [`test_helpers/`](./test_helpers/) - Shared utilities

## ❓ Questions?

Check the [README](./README.md) or look at existing tests for examples.

---

**Happy Testing!** 🎉
