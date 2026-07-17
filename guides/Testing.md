# Testing Guide for Tutors Reader

## Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [The Testing Pyramid](#the-testing-pyramid)
- [BDD with EARS](#bdd-with-ears)
- [Mutation Testing](#mutation-testing)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Testing Workflow](#testing-workflow)
- [Quality Gates](#quality-gates)

---

## Testing Philosophy

The Tutors Reader testing strategy is built on three core principles:

### 1. **Safety for Contributors**

New developers should be able to contribute confidently without fear of breaking existing functionality. Comprehensive automated tests catch regressions before code reaches production.

### 2. **Fast Feedback Loops**

Tests execute quickly to support rapid development:

- Unit tests: <5ms each
- Integration tests: <100ms each
- Full suite: <5 minutes
- Watch mode provides instant feedback on changes

### 3. **Test Quality Over Quantity**

We use mutation testing to ensure tests actually verify behavior, not just execute code. A test that doesn't catch bugs when code changes is worse than no test at all.

---

## The Testing Pyramid

Our testing strategy follows a four-layer pyramid that balances speed, confidence, and maintainability:

```
           ╱╲
          ╱  ╲  E2E (5%)
         ╱────╲  ~20 tests
        ╱      ╲
       ╱ Component╲ (25%)
      ╱  ~150 tests ╲
     ╱──────────────╲
    ╱  Integration   ╲ (30%)
   ╱   ~100 tests     ╲
  ╱────────────────────╲
 ╱      Unit Tests      ╲ (40%)
╱      ~300 tests        ╲
──────────────────────────
```

### Layer 1: Unit Tests (40% of suite)

**What**: Pure functions, utilities, and business logic  
**Speed**: <5ms per test  
**Environment**: happy-dom (lightweight DOM simulation)

**Examples**:

```typescript
// src/lib/services/course/services/__tests__/lo-tree.test.ts

describe("determineCourseUrl()", () => {
  it("should extract courseId from Netlify URL", () => {
    const result = determineCourseUrl("https://test-course.netlify.app");

    expect(result.courseId).toBe("test-course");
    expect(result.courseUrl).toBe("test-course.netlify.app");
  });

  it("should handle localhost URLs", () => {
    const result = determineCourseUrl("localhost:3000");

    expect(result.courseId).toBe("localhost:3000");
    expect(courseProtocol.value).toBe("http://");
  });
});
```

**Key Files to Test**:

- `/src/lib/services/course/services/lo-tree.ts` - Course tree decoration, URL determination
- `/src/lib/services/community/utils/supabase-utils.ts` - Data formatters
- `/src/lib/runes.svelte.ts` - Rune factory functions

**Best Practices**:

- ✅ Test one function per describe block
- ✅ No I/O operations (file system, network, database)
- ✅ Deterministic - same input always produces same output
- ✅ Fast - entire unit test suite runs in <2 seconds
- ❌ Don't test framework code (Svelte internals, SvelteKit routing)
- ❌ Don't mock pure functions - test them directly

---

### Layer 2: Integration Tests (30% of suite)

**What**: Service layer with mocked external dependencies  
**Speed**: <100ms per test  
**Environment**: MSW for HTTP mocking, mocked Supabase/PartyKit

**Examples**:

```typescript
// tests/integration/course-service.test.ts

import { server } from "../setup";
import { http, HttpResponse } from "msw";

describe("Course Service Integration", () => {
  describe("WHEN a course is successfully loaded", () => {
    it("shall cache the course with correct courseId key", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ title: "Test Course", los: [] })
      });

      await courseService.getOrLoadCourse("cache-test", mockFetch);

      expect(courseService.courses.has("cache-test")).toBe(true);
      expect(courseService.courses.get("cache-test")?.title).toBe("Test Course");
    });
  });

  describe("IF the course JSON fetch fails", () => {
    it("THEN shall throw error with status code", async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });

      await expect(courseService.getOrLoadCourse("missing-course", mockFetch)).rejects.toThrow("Fetch failed with status 404");
    });
  });
});
```

**Key Areas to Test**:

- Course service fetching and caching
- Analytics service with mocked Supabase
- Authentication flow with mocked Auth.js
- WebSocket presence with mocked PartyKit

**MSW Setup**:

```typescript
// tests/mocks/handlers.ts

export const handlers = [
  http.get("https://*.netlify.app/tutors.json", () => {
    return HttpResponse.json({
      courseId: "mock-course",
      title: "Mock Course",
      los: []
    });
  }),

  http.post("https://*.supabase.co/rest/v1/:table", () => {
    return HttpResponse.json({ data: {}, error: null });
  })
];
```

**Best Practices**:

- ✅ Mock external services (HTTP, database, WebSockets)
- ✅ Test service contracts and error handling
- ✅ Verify side effects (cache updates, state changes)
- ✅ Test realistic data flows
- ❌ Don't make real network requests
- ❌ Don't test implementation details - focus on behavior

---

### Layer 3: Component Tests (25% of suite)

**What**: Svelte components with user interactions  
**Speed**: <500ms per test  
**Environment**: Vitest browser mode (real Chromium for Svelte 5 runes)

**Examples**:

```typescript
// tests/components/Lab.test.ts

import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import Lab from "$lib/ui/learning-objects/content/Lab.svelte";

describe("Lab Component", () => {
  describe("WHEN a user clicks the Next button", () => {
    it("shall navigate to the next lab step", async () => {
      const mockLab = createMockLiveLab({
        currentStepIndex: 0,
        totalSteps: 5
      });

      render(Lab, { props: { lab: mockLab } });

      const nextButton = screen.getByRole("button", { name: /next/i });
      await userEvent.click(nextButton);

      expect(mockLab.currentStepIndex).toBe(1);
    });
  });

  describe("WHILE on the last step", () => {
    it("the Next button shall be disabled", () => {
      const mockLab = createMockLiveLab({
        currentStepIndex: 4,
        totalSteps: 5
      });

      render(Lab, { props: { lab: mockLab } });

      const nextButton = screen.getByRole("button", { name: /next/i });
      expect(nextButton).toBeDisabled();
    });
  });
});
```

**Key Components to Test**:

- Navigation: MainNavigator, Breadcrumbs, Sidebar
- Learning Objects: Lab.svelte, Video.svelte, TalkClient.svelte
- Time Tracking: StudentCard.svelte, Course.svelte

**Testing Svelte 5 Runes**:

```typescript
// tests/unit/runes.test.ts

import { rune } from "$lib/runes.svelte";

describe("Svelte 5 Runes", () => {
  it("WHEN a rune value is updated THEN reactive subscribers are notified", () => {
    const count = rune(0);

    expect(count.value).toBe(0);

    count.value = 5;
    expect(count.value).toBe(5);
  });
});
```

**Best Practices**:

- ✅ Test user interactions (clicks, keyboard, form input)
- ✅ Verify accessibility (ARIA labels, keyboard navigation)
- ✅ Mock service dependencies via props
- ✅ Test runes reactivity
- ❌ Don't test CSS styling
- ❌ Don't test internal component implementation

---

### Layer 4: E2E Tests (5% of suite)

**What**: Critical user journeys in real browser  
**Speed**: 3-5 seconds per test  
**Environment**: Playwright (Chromium + Firefox)

**Examples**:

```typescript
// tests/e2e/authentication.spec.ts

import { test, expect } from "@playwright/test";

test.describe("GitHub OAuth Authentication", () => {
  test("WHEN a user signs in with GitHub THEN they can access protected courses", async ({ page }) => {
    // Navigate to protected course
    await page.goto("/course/protected-course");

    // Should redirect to auth
    await expect(page).toHaveURL(/\/auth/);

    // Sign in with GitHub
    await page.getByRole("button", { name: /sign in with github/i }).click();

    // Mock OAuth flow
    // ... OAuth simulation ...

    // Should redirect back to course
    await expect(page).toHaveURL("/course/protected-course");

    // Verify authenticated state
    const tutorsId = await page.evaluate(() => localStorage.getItem("tutorsId"));
    expect(tutorsId).toBeTruthy();
  });
});
```

**Critical Flows to Test**:

1. Anonymous user browsing public course
2. GitHub OAuth login → protected course access
3. Lab step navigation with time tracking
4. Markdown rendering with syntax highlighting
5. Analytics event tracking
6. Real-time presence updates

**Best Practices**:

- ✅ Test critical user journeys only
- ✅ Use page object pattern for reusable selectors
- ✅ Retry on failure (2 retries in CI)
- ✅ Record video on failure for debugging
- ❌ Don't test edge cases (unit/integration level)
- ❌ Don't duplicate lower-level test coverage

---

## BDD with EARS

### What is EARS?

**EARS (Easy Approach to Requirements Syntax)** is a structured template for writing requirements that makes them:

- **Unambiguous** - Only one interpretation possible
- **Testable** - Can be directly converted to test cases
- **Traceable** - Requirements map 1:1 to tests

### The Five EARS Templates

#### 1. Ubiquitous Requirements (Applies Everywhere)

```
The <system> shall <system response>
```

**Example**:

```
The Tutors Reader shall display a loading indicator while fetching resources
```

**Test**:

```typescript
it("shall display loading indicator while fetching", async () => {
  render(CourseView);
  expect(screen.getByRole("status")).toHaveTextContent("Loading");
});
```

---

#### 2. Event-Driven Requirements (Most Common)

```
WHEN <trigger> the <system> shall <response>
```

**Example**:

```
WHEN a user navigates to /course/{courseId} the Tutors Reader shall fetch tutors.json from the course URL
```

**Test**:

```typescript
describe("WHEN a user navigates to /course/{courseId}", () => {
  it("the Tutors Reader shall fetch tutors.json from the course URL", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ courseId: "test", title: "Test" })
    });

    await courseService.getOrLoadCourse("test-course", mockFetch);

    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining("/tutors.json"));
  });
});
```

---

#### 3. State-Driven Requirements

```
WHILE <in state> the <system> shall <response>
```

**Example**:

```
WHILE a course is being loaded the Tutors Reader shall display a loading indicator
```

**Test**:

```typescript
describe("WHILE a course is being loaded", () => {
  it("the Tutors Reader shall display a loading indicator", async () => {
    render(CourseView, { props: { loading: true } });

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
```

---

#### 4. Unwanted Behaviors (Error Cases)

```
IF <condition> THEN the <system> shall <response>
```

**Example**:

```
IF the course JSON fetch fails THEN the Tutors Reader shall display an error message and log the failure
```

**Test**:

```typescript
describe("IF the course JSON fetch fails", () => {
  it("THEN the Tutors Reader shall display an error message and log the failure", async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: false, status: 404 });
    const consoleErrorSpy = vi.spyOn(console, "error");

    await expect(courseService.getOrLoadCourse("missing-course", mockFetch)).rejects.toThrow("Fetch failed with status 404");

    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
```

---

#### 5. Optional Features

```
WHERE <feature enabled> the <system> shall <response>
```

**Example**:

```
WHERE analytics are enabled the Tutors Reader shall record learning events to Supabase
```

**Test**:

```typescript
describe("WHERE analytics are enabled", () => {
  it("the Tutors Reader shall record learning events to Supabase", async () => {
    const mockSupabase = createMockSupabaseClient();

    await analyticsService.learningEvent("course-1", "lab-1", "lab");

    expect(mockSupabase.from).toHaveBeenCalledWith("learning_records");
    expect(mockSupabase.upsert).toHaveBeenCalled();
  });
});
```

---

### EARS Requirements Documents

We store EARS specifications in `/tests/requirements/`:

```markdown
<!-- tests/requirements/course-loading.ears.md -->

# Course Loading Requirements

## Event-Driven Requirements

**R1**: WHEN a user navigates to /course/{courseId} the Tutors Reader shall fetch tutors.json from the course URL

**R2**: WHEN a course is successfully loaded the Tutors Reader shall cache it in courseService.courses Map

**R3**: WHEN the same course is requested again the Tutors Reader shall return the cached version without fetching

**R4**: WHEN a user clicks on a topic the Tutors Reader shall navigate to /topic/{topicId}

## State-Driven Requirements

**R5**: WHILE a course is being loaded the Tutors Reader shall display a loading indicator

**R6**: WHILE offline the Tutors Reader shall display cached course data if available

## Unwanted Behaviors

**R7**: IF the course JSON fetch fails THEN the Tutors Reader shall display an error message and log the failure

**R8**: IF the course JSON is malformed THEN the Tutors Reader shall display a parsing error

**R9**: IF the courseId is invalid THEN the Tutors Reader shall show a 404 page

## Optional Features

**R10**: WHERE the course has a calendar the Tutors Reader shall display calendar events
```

---

### BDD End-User Expectations

#### For Product Owners / Stakeholders

**What you can expect**:

- ✅ Requirements written in plain English (no code)
- ✅ Each requirement maps to 1+ automated tests
- ✅ Test reports show which requirements pass/fail
- ✅ Can verify behavior without running the app

**How to write good EARS requirements**:

1. **Be specific about triggers**: "WHEN a user clicks Login" not "WHEN logging in"
2. **State expected outcome clearly**: "shall display error message" not "shall handle error"
3. **Include acceptance criteria**: "shall fetch within 3 seconds" not "shall fetch quickly"
4. **One requirement per statement**: Avoid "and" - split into multiple requirements

**Example - Bad Requirement**:

```
The system should handle authentication properly
```

**Example - Good Requirements**:

```
WHEN a user enters valid credentials the Tutors Reader shall redirect to the dashboard
IF a user enters invalid credentials THEN the Tutors Reader shall display "Invalid username or password"
WHEN a session expires the Tutors Reader shall redirect to the login page
```

---

#### For Developers

**How to use EARS in development**:

1. **Read the requirement document first**
   - Check `/tests/requirements/` for the feature you're implementing
   - Understand all event-driven and error cases

2. **Write tests that match requirement IDs**

   ```typescript
   // Implements R1 from course-loading.ears.md
   describe("R1: WHEN a user navigates to /course/{courseId}", () => {
     it("the Tutors Reader shall fetch tutors.json from the course URL", async () => {
       // Test implementation
     });
   });
   ```

3. **Create new requirements for new features**
   - Add to existing `.ears.md` file or create new one
   - Use the correct EARS template
   - Get stakeholder review before implementing

4. **Update requirements when behavior changes**
   - EARS docs are living documentation
   - When fixing bugs, add the unwanted behavior requirement

---

#### For QA / Testers

**Using EARS for test planning**:

1. **Requirements are your test cases**
   - Each EARS requirement = at least one test scenario
   - Group related requirements into test suites

2. **Exploratory testing focus**
   - Automated tests cover documented requirements
   - Spend manual testing time on:
     - Edge cases not in requirements
     - UX quality (not captured by EARS)
     - Cross-browser compatibility

3. **Bug reporting with EARS**
   - Reference requirement ID: "R7 is not working - error not displayed on fetch failure"
   - Propose new requirement: "IF network is slow THEN shall show loading spinner after 1 second"

---

## Mutation Testing

### What is Mutation Testing?

Mutation testing validates **test quality** by introducing bugs into your code and checking if tests catch them.

**How it works**:

1. Stryker creates "mutants" - small code changes like:
   - `if (x > 5)` → `if (x >= 5)` (boundary change)
   - `return true` → `return false` (boolean flip)
   - `a + b` → `a - b` (operator change)
2. Runs your test suite against each mutant
3. If tests fail → **mutant killed** ✅ (test quality good)
4. If tests pass → **mutant survived** ❌ (test quality bad - code changed but tests didn't notice)

### Mutation Score Metrics

```
Mutation Score = (Killed Mutants / Total Mutants) × 100%
```

**Our Thresholds**:

- **High (80%+)**: Excellent test quality - most code changes caught
- **Low (60%)**: Acceptable minimum - basic coverage
- **Break (50%)**: CI fails below this - insufficient testing

**Current Scores**:

- `lo-tree.ts`: 70.63% (113 killed / 160 covered)
- `course.svelte.ts`: 76.19% (16 killed / 21 covered)

### Running Mutation Tests

```bash
# Full mutation test (slow - runs all mutants)
npm run test:mutation

# Incremental (only changed files - fast)
npm run test:mutation:incremental

# View HTML report
open reports/mutation/mutation.html
```

### Interpreting Mutation Reports

**Example Surviving Mutant**:

```typescript
// Original code
if (courseUrl.endsWith(".netlify.app")) {
  return courseUrl.replace(".netlify.app", "");
}

// Stryker creates mutant:
if (courseUrl.endsWith(".netlify.app")) {
  return courseUrl.replace(".netlify.app", "MUTATED"); // Changed '' to 'MUTATED'
}

// If no test fails, you need a test like:
it("should remove .netlify.app completely", () => {
  const result = determineCourseUrl("test.netlify.app");
  expect(result.courseId).toBe("test"); // Not 'testMUTATED'
});
```

### Writing Mutant-Killing Tests

**Bad Test** (executes code but doesn't verify behavior):

```typescript
it("should process course URL", () => {
  const result = determineCourseUrl("test.netlify.app");
  expect(result).toBeDefined(); // Weak assertion!
});
```

**Good Test** (verifies exact behavior):

```typescript
it("should extract courseId from Netlify URL", () => {
  const result = determineCourseUrl("test.netlify.app");

  // Exact value assertions kill mutants
  expect(result.courseId).toBe("test");
  expect(result.courseUrl).toBe("test.netlify.app");

  // Verify transformation happened
  expect(result.courseId).not.toContain(".netlify.app");
});
```

---

## Running Tests

### Local Development

```bash
# Watch mode (re-runs on file change)
npm run test

# Run all tests once
npm run test:all

# Unit + integration only (fast)
npm run test:unit

# With coverage report
npm run test:unit -- --coverage

# Component tests
npm run test:components

# E2E tests
npm run test:e2e

# E2E with UI (debugging)
npm run test:e2e:ui

# Mutation testing
npm run test:mutation

# Run tests for changed files only
npm run test:changed
```

### CI/CD Pipeline

Tests run automatically on:

- **Pull Requests**: All layers + mutation testing on changed files
- **Main Branch Push**: Full test suite + weekly full mutation run
- **Pre-commit Hook**: Lint + type check + changed file tests

**GitHub Actions Workflow**:

```yaml
jobs:
  unit-integration-tests:
    - npm run lint
    - npm run check
    - npm run test:unit -- --coverage

  component-tests:
    - npm run test:components

  e2e-tests:
    - npm run build
    - npm run test:e2e

  mutation-testing:
    - npx stryker run (on changed files only)
```

---

## Writing Tests

### Test File Structure

```typescript
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/svelte";
import { functionToTest } from "../module";

describe("Feature: Course Loading", () => {
  // Setup runs before each test
  beforeEach(() => {
    // Reset state
    courseService.courses.clear();
  });

  describe("WHEN a course is successfully loaded", () => {
    it("shall cache the course with correct courseId", async () => {
      // Given (Arrange)
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ title: "Test" })
      });

      // When (Act)
      const result = await courseService.getOrLoadCourse("test", mockFetch);

      // Then (Assert)
      expect(courseService.courses.has("test")).toBe(true);
      expect(result.title).toBe("Test");
    });
  });
});
```

### Test Naming Convention

**Format**: `<EARS template> <expected behavior>`

**Examples**:

- ✅ `WHEN a user clicks Next THEN shall navigate to next step`
- ✅ `IF fetch fails THEN shall throw error with status code`
- ✅ `WHILE loading shall display spinner`
- ❌ `test navigation` (not descriptive)
- ❌ `should work` (not specific)

### Mocking Guidelines

**When to Mock**:

- ✅ External services (HTTP, database, WebSockets)
- ✅ Time-dependent code (`Date.now()`, timers)
- ✅ Browser APIs (localStorage, fetch)
- ✅ Slow operations

**When NOT to Mock**:

- ❌ Pure functions (test them directly)
- ❌ Framework code (Svelte, SvelteKit)
- ❌ Your own utilities (integration test them)

**Mocking Examples**:

```typescript
// Mock fetch with Vitest
const mockFetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ data: "test" })
});

// Mock Supabase client
import { createMockSupabaseClient } from "../mocks/supabase";
const mockSupabase = createMockSupabaseClient();

// Mock MSW handlers
server.use(
  http.get("/api/courses", () => {
    return HttpResponse.json({ courses: [] });
  })
);

// Mock timers
vi.useFakeTimers();
vi.advanceTimersByTime(1000);
vi.useRealTimers();
```

---

## Testing Workflow

### For New Features

1. **Read EARS requirements** (`/tests/requirements/`)
2. **Write tests first** (TDD approach)
   - Unit tests for business logic
   - Integration tests for service layer
   - Component tests for UI interactions
3. **Implement feature** until tests pass
4. **Run mutation testing** on new code
5. **Add surviving mutant tests** if mutation score < 80%

### For Bug Fixes

1. **Write failing test** that reproduces the bug
2. **Add EARS requirement** to document unwanted behavior
   ```
   IF user enters negative number THEN shall display validation error
   ```
3. **Fix the bug** until test passes
4. **Verify mutation score** doesn't decrease

### For Refactoring

1. **Ensure existing tests pass**
2. **Check mutation score** before refactoring
3. **Refactor code**
4. **Verify tests still pass** (behavior unchanged)
5. **Check mutation score** after (should be same or higher)

---

## Quality Gates

### PR Merge Requirements

All of these must pass:

- ✅ All tests pass (100% pass rate)
- ✅ No coverage decrease vs. target branch
- ✅ Mutation score ≥60% on changed files
- ✅ Test suite execution time <5 minutes
- ✅ Lint + type check passing
- ✅ Zero flaky tests (3 consecutive runs)

### Coverage Targets

| Layer         | Current | Target  |
| ------------- | ------- | ------- |
| Service Layer | 70%     | 80%     |
| Utilities     | 60%     | 75%     |
| UI Components | 5%      | 60%     |
| Routes        | 10%     | 40%     |
| **Overall**   | **60%** | **70%** |

### Test Quality Metrics

- **Mutation Score**: 70%+ (excellent), 60%+ (acceptable)
- **Test Speed**: <5ms unit, <100ms integration
- **Flakiness Rate**: <0.5% (max 1 flaky per 200 runs)
- **Test-to-Code Ratio**: ~1:1 (1 line test per 1 line code)

---

## Common Testing Patterns

### Testing Async Code

```typescript
it("shall load course asynchronously", async () => {
  const promise = courseService.getOrLoadCourse("test", mockFetch);

  // Test loading state
  expect(courseService.loading).toBe(true);

  // Wait for completion
  const result = await promise;

  // Test final state
  expect(courseService.loading).toBe(false);
  expect(result.title).toBe("Test");
});
```

### Testing Error Handling

```typescript
describe("Error Handling Tests", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Suppress console.error during error tests to reduce noise
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("shall throw error when fetch fails", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    await expect(courseService.getOrLoadCourse("test", mockFetch)).rejects.toThrow("Network error");
  });
});
```

**Why suppress console.error?**  
Tests that intentionally trigger errors should suppress `console.error()` output to avoid polluting test logs with expected error messages. The spy can still be inspected if you need to verify errors were logged:

```typescript
it("shall log error to console", async () => {
  mockFetch.mockRejectedValue(new Error("Network error"));

  await expect(courseService.getOrLoadCourse("test", mockFetch)).rejects.toThrow();

  expect(consoleErrorSpy).toHaveBeenCalled();
});
```

### Testing User Events

```typescript
it("shall increment count when button clicked", async () => {
  const user = userEvent.setup();
  render(Counter);

  const button = screen.getByRole("button", { name: /increment/i });
  await user.click(button);

  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});
```

### Testing Reactive State (Svelte 5 Runes)

```typescript
it("shall react to rune value changes", () => {
  const count = rune(0);
  let doubled = $derived(count.value * 2);

  expect(doubled).toBe(0);

  count.value = 5;
  expect(doubled).toBe(10);
});
```

---

## Troubleshooting

### KaTeX Quirks Mode Warning (Known Issue)

**Warning Message**:

```
stderr | tests/integration/course-service.test.ts
Warning: KaTeX doesn't work in quirks mode. Make sure your website has a suitable doctype.
```

**Status**: Harmless - can be ignored

**Cause**: KaTeX detects the test environment (happy-dom) and warns about missing HTML5 doctype. This warning is emitted during module import before tests run.

**Impact**: None - KaTeX works correctly in tests, markdown rendering is unaffected

**Why not suppress it?**: The warning is written to stderr during module import, before our test setup can intercept it. Attempting to suppress it would require complex process-level hooks that could interfere with legitimate error reporting.

**When to worry**: If you see actual test failures related to markdown rendering, investigate those. The KaTeX warning alone is not a problem.

---

### Console Errors in Test Output (stderr)

**Problem**: Tests pass but stderr shows error messages

**Likely causes**:

- Tests intentionally triggering errors (error handling tests)
- Application code logging errors with `console.error()`
- Expected errors being treated as unexpected noise

**Solution**:

```typescript
describe("Error Tests", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Suppress console.error to reduce noise in test output
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.error after each test
    consoleErrorSpy.mockRestore();
  });

  it("shall handle errors gracefully", async () => {
    // Test that intentionally triggers an error
    await expect(riskyOperation()).rejects.toThrow();
    // No error spam in test output!
  });
});
```

### Tests Failing in CI but Passing Locally

**Likely causes**:

- Timezone differences (use UTC in tests)
- Race conditions (add proper awaits)
- Environment variables not set
- File system case sensitivity (Linux vs Mac)

**Solution**:

```typescript
// Bad - relies on system timezone
const date = new Date().toLocaleDateString();

// Good - explicit timezone
const date = new Date().toLocaleDateString("en-US", { timeZone: "UTC" });
```

### Flaky E2E Tests

**Likely causes**:

- Not waiting for elements to appear
- Network timing issues
- Animation delays

**Solution**:

```typescript
// Bad - will randomly fail
await page.click(".button");

// Good - waits for element to be ready
await page.getByRole("button").click(); // Auto-waits with Playwright
```

### Mutation Tests Taking Too Long

**Likely causes**:

- Running all mutants instead of incremental
- Too many slow integration tests

**Solution**:

```bash
# Use incremental mode
npm run test:mutation:incremental

# Or run on specific files only
npx stryker run --mutate "src/lib/services/course/**/*.ts"
```

---

## Resources

- **Vitest Documentation**: https://vitest.dev/
- **Playwright Best Practices**: https://playwright.dev/docs/best-practices
- **Stryker Mutator**: https://stryker-mutator.io/
- **Testing Library**: https://testing-library.com/docs/svelte-testing-library/intro
- **EARS Specification**: https://alistairmavin.com/ears/
- **BDD with Gherkin**: https://cucumber.io/docs/gherkin/

---

## Contributing

When adding new features:

1. Create EARS requirements document in `/tests/requirements/`
2. Write tests that implement each requirement
3. Run mutation testing to verify test quality
4. Update this guide if introducing new testing patterns

See `CONTRIBUTING.md` for full development guidelines.
