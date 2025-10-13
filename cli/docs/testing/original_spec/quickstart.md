# Quickstart: Test Strategy Implementation

**Feature**: Comprehensive Test Strategy for Tutors CLI Tools
**Date**: 2025-10-13
**Purpose**: Get started with implementing and running tests for Tutors CLI tools

## Prerequisites

- **Deno 2.1+** installed ([installation guide](https://deno.land/manual/getting_started/installation))
- Access to Tutors CLI source code
- Basic familiarity with TypeScript and testing concepts

## Quick Start (5 Minutes)

### 1. Install Deno

```bash
# macOS/Linux
curl -fsSL https://deno.land/x/install/install.sh | sh

# Windows (PowerShell)
irm https://deno.land/install.ps1 | iex

# Verify installation
deno --version  # Should show 2.1.0 or higher
```

### 2. Set Up Project Dependencies

Create or update `deno.json` in the project root:

```json
{
  "imports": {
    "@std/assert": "jsr:@std/assert@^1",
    "@std/testing": "jsr:@std/testing@^1",
    "@std/html": "jsr:@std/html@^1",
    "zod": "jsr:@zod/zod@^4.1",
    "deno-dom": "jsr:@b-fuze/deno-dom@^0.1"
  },
  "tasks": {
    "test": "deno test --parallel",
    "test:watch": "deno test --watch",
    "test:coverage": "deno test --coverage=./cov_profile",
    "coverage:report": "deno coverage cov_profile --lcov --output=coverage.lcov",
    "bench": "deno bench",
    "test:critical": "deno test tests/critical_paths/",
    "test:integration": "deno test tests/integration/"
  }
}
```

### 3. Run Your First Test

Create a simple test file to verify setup:

**tests/critical_paths/hello_test.ts**:
```typescript
import { assertEquals } from "@std/assert";

Deno.test("verify test setup works", () => {
  assertEquals(1 + 1, 2);
});
```

Run it:
```bash
deno test tests/critical_paths/hello_test.ts
```

Expected output:
```
Check file:///.../tests/critical_paths/hello_test.ts
running 1 test from ./tests/critical_paths/hello_test.ts
verify test setup works ... ok (2ms)

ok | 1 passed | 0 failed (15ms)
```

✅ If you see this, your setup is working!

---

## Project Structure Setup

Create the directory structure:

```bash
mkdir -p tests/{critical_paths,edge_cases,regression,integration}
mkdir -p fixtures/{sample_courses,expected_outputs,schemas}
mkdir -p test_helpers
mkdir -p baselines
```

Your project should now look like:

```
project/
├── deno.json
├── tests/
│   ├── critical_paths/
│   ├── edge_cases/
│   ├── regression/
│   └── integration/
├── fixtures/
│   ├── sample_courses/
│   ├── expected_outputs/
│   └── schemas/
├── test_helpers/
└── baselines/
```

---

## Writing Your First Real Test

Let's test the tutors CLI with a minimal course.

### Step 1: Create a Minimal Sample Course

**fixtures/sample_courses/minimal_course/course.md**:
```markdown
# Introduction to Programming

A basic course for beginners.
```

**fixtures/sample_courses/minimal_course/topic-01/topic.md**:
```markdown
# Variables

Learn about variables in programming.
```

### Step 2: Define Expected Output Schema

**fixtures/schemas/course_output_schema.ts**:
```typescript
import { z } from "zod";

export const CourseOutputSchema = z.object({
  title: z.string().min(1),
  topics: z.array(z.object({
    id: z.string(),
    title: z.string()
  }))
});
```

### Step 3: Write the Test

**tests/critical_paths/tutors_cli_test.ts**:
```typescript
import { assertEquals, assertExists } from "@std/assert";
import { CourseOutputSchema } from "../../fixtures/schemas/course_output_schema.ts";

Deno.test("tutors CLI generates valid JSON from minimal course", async () => {
  // Arrange: Set up paths
  const inputPath = "./fixtures/sample_courses/minimal_course";
  const outputPath = "./test-output/minimal";

  // Act: Run tutors CLI
  const command = new Deno.Command("deno", {
    args: [
      "run",
      "-A",
      "jsr:@tutors/tutors",
      inputPath,
      "--output",
      outputPath
    ]
  });

  const { code, stdout, stderr } = await command.output();

  // Assert: Check execution
  assertEquals(code, 0, `CLI failed with stderr: ${new TextDecoder().decode(stderr)}`);

  // Assert: Check output file exists
  const outputFile = `${outputPath}/tutors.json`;
  try {
    await Deno.stat(outputFile);
  } catch {
    throw new Error(`Output file not found: ${outputFile}`);
  }

  // Assert: Validate JSON structure
  const content = await Deno.readTextFile(outputFile);
  const json = JSON.parse(content);

  const result = CourseOutputSchema.safeParse(json);
  if (!result.success) {
    console.error("Schema validation failed:", result.error.issues);
    throw new Error("Generated JSON does not match schema");
  }

  // Assert: Check content
  assertEquals(json.title, "Introduction to Programming");
  assertExists(json.topics);

  // Cleanup
  await Deno.remove(outputPath, { recursive: true });
});
```

### Step 4: Run the Test

```bash
deno task test:critical
```

---

## Common Test Patterns

### Pattern 1: Simple CLI Execution Test

```typescript
Deno.test("CLI tool exits with code 0", async () => {
  const command = new Deno.Command("deno", {
    args: ["run", "-A", "jsr:@tutors/tutors", "./fixtures/sample_courses/minimal_course"]
  });

  const { code } = await command.output();
  assertEquals(code, 0);
});
```

### Pattern 2: Output Validation with Schema

```typescript
import { z } from "zod";

Deno.test("generated JSON matches schema", async () => {
  // ... run CLI to generate output ...

  const json = JSON.parse(await Deno.readTextFile(outputPath));
  const schema = z.object({ title: z.string(), topics: z.array(z.any()) });

  const result = schema.safeParse(json);
  assert(result.success, `Schema validation failed: ${result.error}`);
});
```

### Pattern 3: HTML Validation

```typescript
import { DOMParser } from "deno-dom";

Deno.test("generated HTML has valid structure", async () => {
  const html = await Deno.readTextFile("./test-output/index.html");
  const doc = new DOMParser().parseFromString(html, "text/html");

  assertExists(doc?.querySelector("html"), "Missing <html> element");
  assertExists(doc?.querySelector("head"), "Missing <head> element");
  assertExists(doc?.querySelector("body"), "Missing <body> element");
});
```

### Pattern 4: Error Testing

```typescript
Deno.test("CLI reports clear error for empty directory", async () => {
  const emptyDir = await Deno.makeTempDir();

  const command = new Deno.Command("deno", {
    args: ["run", "-A", "jsr:@tutors/tutors", emptyDir]
  });

  const { code, stderr } = await command.output();
  const errorMsg = new TextDecoder().decode(stderr);

  assertEquals(code, 1, "Should exit with error code");
  assert(errorMsg.includes("course.md"), "Error should mention missing course.md");

  await Deno.remove(emptyDir);
});
```

### Pattern 5: Performance Baseline Testing

```typescript
Deno.test("course generation completes within performance baseline", async () => {
  const start = performance.now();

  // Run CLI tool
  const command = new Deno.Command("deno", {
    args: ["run", "-A", "jsr:@tutors/tutors", "./fixtures/sample_courses/standard_course"]
  });
  await command.output();

  const duration = performance.now() - start;

  // Assert: Should complete in under 5 seconds for standard course
  assert(duration < 5000, `Too slow: ${duration}ms (baseline: 5000ms)`);
});
```

---

## Running Tests

### Run All Tests

```bash
deno task test
```

### Run Specific Category

```bash
# Critical paths only
deno task test:critical

# Integration tests only
deno task test:integration

# Edge cases
deno test tests/edge_cases/

# Regression tests
deno test tests/regression/
```

### Run with Coverage

```bash
# Collect coverage
deno task test:coverage

# Generate report
deno task coverage:report

# View coverage summary
deno coverage cov_profile
```

### Watch Mode (Development)

```bash
deno task test:watch
```

Tests will re-run automatically when files change.

### Filter by Name

```bash
# Run only tests matching "JSON"
deno test --filter "JSON"

# Run only tests matching "tutors CLI"
deno test --filter "tutors CLI"
```

### Parallel Execution

```bash
# Run tests in parallel (faster)
deno test --parallel

# Run sequentially (for debugging)
deno test --jobs=1
```

---

## Debugging Failed Tests

### 1. Read the Error Message

Test failures include:
- Which assertion failed
- Expected vs. actual values
- File paths and line numbers

Example:
```
AssertionError: Values are not equal.

    [Diff] Actual / Expected

-   "Introduction to TypeScript"
+   "Introduction to Programming"

    at assertEquals (jsr:@std/assert@1/assert_equals.ts:10:11)
    at file:///tests/critical_paths/tutors_cli_test.ts:42:3
```

### 2. Inspect Generated Output

Failed tests often leave artifacts:

```bash
# Check generated files
ls -la ./test-output/

# View generated JSON
cat ./test-output/minimal/tutors.json | jq

# View generated HTML
open ./test-output/minimal/index.html
```

### 3. Run Test in Isolation

```bash
# Run single test file
deno test tests/critical_paths/tutors_cli_test.ts

# Run specific test by name
deno test --filter "generates valid JSON"
```

### 4. Add Debug Logging

```typescript
Deno.test("my test", async () => {
  const result = await someFunction();

  console.log("Debug: result =", result);  // Add logging
  console.log("Debug: result type =", typeof result);

  assertEquals(result, expected);
});
```

### 5. Use Deno Debugger

```bash
# Run with inspector
deno test --inspect-brk tests/critical_paths/tutors_cli_test.ts

# Then open chrome://inspect in Chrome
```

---

## Best Practices

### ✅ DO: Write Clear Test Names

```typescript
// Good: Describes what is tested and expected outcome
Deno.test("tutors CLI generates valid JSON from minimal course", async () => { /* ... */ });

// Bad: Vague and unclear
Deno.test("test1", async () => { /* ... */ });
```

### ✅ DO: Use Arrange-Act-Assert Pattern

```typescript
Deno.test("example test", async () => {
  // Arrange: Set up test data
  const input = "./fixtures/sample_courses/minimal_course";

  // Act: Execute the code under test
  const result = await generateCourse(input);

  // Assert: Verify the outcome
  assertEquals(result.status, "success");
});
```

### ✅ DO: Clean Up After Tests

```typescript
Deno.test("test with temporary files", async () => {
  const tempDir = await Deno.makeTempDir();

  try {
    // Test code here
  } finally {
    // Always clean up, even if test fails
    await Deno.remove(tempDir, { recursive: true });
  }
});
```

### ❌ DON'T: Use Magic Numbers

```typescript
// Bad
assert(duration < 5000);

// Good
const MAX_GENERATION_TIME_MS = 5000;
assert(duration < MAX_GENERATION_TIME_MS, `Generation too slow: ${duration}ms`);
```

### ❌ DON'T: Write Tests That Depend on Execution Order

```typescript
// Bad: Tests should be independent
Deno.test("setup data", async () => {
  globalState.data = await loadData();
});

Deno.test("use data", () => {
  assertEquals(globalState.data.length, 5);  // Fails if run alone!
});

// Good: Each test is self-contained
Deno.test("process data", async () => {
  const data = await loadData();  // Load within test
  assertEquals(data.length, 5);
});
```

### ❌ DON'T: Test Implementation Details

```typescript
// Bad: Testing internal structure
Deno.test("uses specific parser class", () => {
  assert(parser instanceof MarkdownParserV2);
});

// Good: Testing behavior/outcome
Deno.test("correctly parses markdown frontmatter", () => {
  const result = parseMarkdown("---\ntitle: Test\n---\n# Content");
  assertEquals(result.frontmatter.title, "Test");
});
```

---

## Troubleshooting

### Issue: "Module not found" errors

**Solution**: Check `deno.json` imports and ensure all dependencies are listed:

```json
{
  "imports": {
    "@std/assert": "jsr:@std/assert@^1",
    "zod": "jsr:@zod/zod@^4.1"
  }
}
```

### Issue: Permission denied errors

**Solution**: Add required permissions to test command:

```bash
# For file system access
deno test --allow-read --allow-write

# Or use -A for all permissions (development only)
deno test -A
```

### Issue: Tests timeout

**Solution**: Increase timeout in test:

```typescript
Deno.test({
  name: "slow test",
  fn: async () => { /* ... */ },
  sanitizeResources: false,
  sanitizeOps: false
}, { timeout: 30000 });  // 30 seconds
```

### Issue: Tests pass locally but fail in CI

**Solution**: Check for:
- Hardcoded absolute paths (use relative paths)
- Missing environment variables
- Different Deno versions
- Insufficient CI permissions

---

## Next Steps

1. **Read the full specification**: [spec.md](./spec.md)
2. **Review data model**: [data-model.md](./data-model.md)
3. **Check contracts**: [contracts/test_interface.ts](./contracts/test_interface.ts)
4. **Explore research findings**: [research.md](./research.md)
5. **Implement tests following**: [plan.md](./plan.md)

---

## Quick Reference

### Essential Commands

```bash
# Run all tests
deno task test

# Run with coverage
deno task test:coverage && deno task coverage:report

# Run critical tests only
deno task test:critical

# Watch mode
deno task test:watch

# Run benchmarks
deno task bench

# Specific file
deno test tests/critical_paths/tutors_cli_test.ts

# Filter by name
deno test --filter "JSON"
```

### Common Imports

```typescript
// Assertions
import { assertEquals, assertExists, assert, assertThrows } from "@std/assert";

// Schema validation
import { z } from "zod";

// HTML parsing
import { DOMParser } from "deno-dom";

// Test organization
import { describe, it, beforeEach, afterEach } from "@std/testing/bdd";
```

### File Naming

- Test files: `*_test.ts`
- Benchmark files: `*_bench.ts`
- Helper modules: `*_helper.ts` or `*_util.ts`

---

## Support

- **Deno Documentation**: https://docs.deno.com/runtime/fundamentals/testing/
- **Test Strategy Spec**: [spec.md](./spec.md)
- **Constitution**: [/.specify/memory/constitution.md](/.specify/memory/constitution.md)

---

**Remember**: Tests should be simple, readable, and clearly document what they're verifying. When in doubt, favor clarity over cleverness (Constitution Principle II).
