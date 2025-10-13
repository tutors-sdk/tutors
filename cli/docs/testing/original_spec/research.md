# Research: Comprehensive Test Strategy for Tutors CLI Tools

**Date**: 2025-10-13
**Feature**: Comprehensive Test Strategy for Tutors CLI Tools
**Purpose**: Resolve technical uncertainties and establish technology choices for test implementation

## Overview

This document captures research findings for implementing a test strategy for the Tutors CLI tools. All NEEDS CLARIFICATION items from Technical Context have been investigated and resolved.

---

## 1. Deno Version Requirements

### Decision
Target **Deno 2.1+ (LTS)** with minimum version **Deno 2.0**

### Rationale
- **Current Stable**: Deno 2.5.4 (released October 9, 2025)
- **LTS Version**: Deno 2.1.x provides 6 months of bug fixes, security updates, and critical performance improvements
- **Backwards Compatibility**: Deno 2.0+ offers full Node.js and npm compatibility, native package.json support
- **Stability**: LTS channel provides production guarantees while being modern enough for all current features
- **Key Improvements**: Workspaces/monorepo support, improved package management (`deno add`, `deno install`), stabilized JSR standard library

### Alternatives Considered
- **Deno 1.x**: Rejected - lacks modern package management, no LTS support, missing JSR integration
- **Latest Stable Only (2.5.4)**: Rejected - too bleeding edge without LTS guarantees for enterprise use
- **Minimum 2.2.15**: Considered but 2.1 is the official LTS with better stability

### Implementation Impact
- CI configuration should test against both Deno 2.1 (minimum) and latest stable (2.5.4)
- Documentation should specify minimum version requirement
- deno.json should not use features introduced after 2.1

---

## 2. JSON Schema Validation Library

### Decision
Use **Zod** (@zod/zod on JSR)

### Rationale
- **Industry Standard**: 40.3k GitHub stars, 482 contributors, extremely active maintenance
- **TypeScript-First**: Provides static type inference - validates at runtime AND provides compile-time types
- **Zero Dependencies**: Tiny 2kb core bundle with no external dependencies
- **Deno Native**: Available on JSR as `@zod/zod`, fully Deno-compatible
- **Excellent Documentation**: Comprehensive docs, large community, Discord support
- **Feature Complete**: Complex validation scenarios, custom validators, error handling, JSON Schema conversion
- **Production Ready**: Latest release v4.1.12 (October 2025), actively maintained
- **Aligns with KISS**: Simple API, no complex configuration needed

### Usage Pattern
```typescript
// In deno.json
{
  "imports": {
    "zod": "jsr:@zod/zod@^4.1.0"
  }
}

// In test code
import { z } from "zod";

const courseOutputSchema = z.object({
  title: z.string(),
  topics: z.array(z.object({
    id: z.string(),
    title: z.string(),
    type: z.enum(["lab", "topic", "unit"])
  })),
  version: z.string()
});

// Validate output
const result = courseOutputSchema.safeParse(jsonOutput);
if (!result.success) {
  console.error(result.error.issues);
}
```

### Alternatives Considered
- **Valibot** (@valibot/valibot):
  - Pros: Extremely small bundle (<700 bytes), modular architecture, 95% smaller than Zod
  - Cons: Younger project, smaller community, less documentation, fewer real-world battle tests
  - Verdict: Excellent for bundle-size-critical apps, but Zod's maturity wins for test infrastructure

- **AJV**:
  - Pros: Fastest JSON validator, supports multiple JSON Schema drafts, strict compliance
  - Cons: Not TypeScript-first, npm-focused, more complex configuration
  - Verdict: Better for strict JSON Schema compliance, but Zod provides better DX for testing

- **@inbestigator/vali**:
  - Pros: Swift, tiny JSON schema validator (JSR score 100)
  - Cons: Minimal documentation, unknown maintenance status, small community
  - Verdict: Too risky without proven track record

### Implementation Impact
- Test fixtures can define schemas alongside expected outputs
- Type-safe output validation with compile-time checks
- Clear error messages when validation fails (critical for FR-005, FR-020)
- Minimal learning curve for developers familiar with TypeScript

---

## 3. HTML Validation Library

### Decision
Use **deno-dom** (@b-fuze/deno-dom) for structural validation + **@std/html** for entity handling

### Rationale
- **Lightweight DOM Parsing**: deno-dom provides familiar DOMParser API
- **Well Maintained**: 471 stars, 25 contributors, actively developed
- **Two Backends**: WASM (portable) and native (performance)
- **Standard Web APIs**: Supports `querySelector`, `innerHTML`, DOM manipulation - mirrors browser APIs
- **KISS Principle**: Simple API, no complex configuration
- **Validation Approach**: Parse HTML and check well-formedness; invalid HTML throws parsing errors
- **Complement with @std/html**: Official standard library for entity escaping/unescaping (JSR score 100)
- **Link Checking**: Use Deno's built-in `fetch()` for simple link validation

### Usage Pattern
```typescript
import { DOMParser } from "jsr:@b-fuze/deno-dom";
import { escape } from "jsr:@std/html";

// Structural validation
const doc = new DOMParser().parseFromString(htmlContent, "text/html");

// Check for broken structure
if (!doc.querySelector("html")) {
  throw new Error("Invalid HTML structure: missing <html> element");
}

// Validate navigation links
const links = doc.querySelectorAll("a[href]");
for (const link of links) {
  const href = link.getAttribute("href");
  if (href?.startsWith("#")) {
    // Check internal anchor exists
    const target = doc.querySelector(href);
    if (!target) {
      throw new Error(`Broken internal link: ${href}`);
    }
  }
}

// Validate all images have alt text
const images = doc.querySelectorAll("img");
for (const img of images) {
  if (!img.getAttribute("alt")) {
    console.warn(`Image missing alt text: ${img.getAttribute("src")}`);
  }
}
```

### Alternatives Considered
- **@nmyvision/html-parser**:
  - Pros: Zero dependencies, parses HTML/JSX/Vue
  - Cons: Score 76/100, less feature-complete, limited documentation
  - Verdict: Good parser but deno-dom provides more complete DOM API

- **html-validate (npm)**:
  - Pros: Comprehensive HTML validation with rules engine, accessibility checks
  - Cons: npm package (not Deno-native), complex configuration, violates KISS
  - Verdict: Overkill for simple validation needs

- **@std/html alone**:
  - Pros: Official standard library, lightweight
  - Cons: Only provides entity escaping/unescaping, no parsing/validation
  - Verdict: Use as complement, not sole solution

- **Custom regex-based validation**:
  - Pros: Extremely lightweight
  - Cons: Fragile, doesn't handle edge cases, hard to maintain
  - Verdict: Never parse HTML with regex

### Implementation Impact
- Tests can validate HTML structure without external tools
- Familiar browser-like APIs reduce learning curve
- Can check for specific elements, attributes, and navigation integrity
- Simple link validation for basic broken link detection

---

## 4. Deno Testing Best Practices

### Decision
Use **Deno.test** with **@std/assert**, organize tests with **BDD style** when complexity warrants

### Rationale

#### Test File Naming Conventions
- **Pattern**: `{*_,*.,}test.{ts,tsx,mts,js,mjs,jsx}`
- **Recommended**: `<module_name>_test.ts` (e.g., `tutors_cli_test.ts`)
- **Auto-Discovery**: `deno test` automatically finds matching files
- **Colocation**: Keep test files close to source for maintainability

#### Assertion Libraries
**Primary: @std/assert**
- 27 assertion functions: `assertEquals`, `assertExists`, `assertThrows`, `assertMatch`, etc.
- TypeScript-first with full type safety
- Zero configuration required
- Official Deno standard library (JSR score 100)
- Aligns with KISS: straightforward, predictable assertions

**Secondary: @std/expect** (when needed)
- Jest-compatible `expect().toBe()` syntax
- Use case: Teams migrating from Jest or preferring chainable assertions
- Trade-off: Slightly less Deno-idiomatic

#### Performance Measurement
**Built-in Approaches**:

1. **deno bench**: Dedicated benchmarking tool
   - File pattern: `*_bench.ts`
   - Command: `deno bench`
   - Supports groups, baselines, filtering
   - JSON output for CI integration

2. **Performance.now()**: For inline measurements
   ```typescript
   Deno.test("course generation performance", () => {
     const start = performance.now();
     generateCourse(sampleDir);
     const duration = performance.now() - start;
     assert(duration < 1000, `Too slow: ${duration}ms`);
   });
   ```

3. **@std/testing**: Provides FakeTime for time-based tests

#### Test Organization Patterns

**Basic Pattern** (simple, straightforward tests):
```typescript
import { assertEquals } from "@std/assert";

Deno.test("tutors CLI generates valid JSON", async () => {
  const result = await runTutorsCLI("./fixtures/minimal_course");
  assertEquals(result.exitCode, 0);
  assert(existsSync("./json/tutors.json"));
});
```

**BDD Pattern** (complex test suites with setup/teardown):
```typescript
import { describe, it, beforeEach, afterEach } from "@std/testing/bdd";

describe("Tutors CLI JSON Generation", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = Deno.makeTempDirSync();
  });

  it("should process markdown files", () => {
    // Test implementation
  });

  it("should copy assets correctly", () => {
    // Test implementation
  });

  afterEach(() => {
    Deno.removeSync(tempDir, { recursive: true });
  });
});
```

**Test Steps** (hierarchical organization for workflows):
```typescript
Deno.test("end-to-end course generation", async (t) => {
  await t.step("setup sample course", () => {
    // Arrange
  });

  await t.step("run tutors CLI", async () => {
    // Act
  });

  await t.step("validate JSON output", () => {
    // Assert
  });

  await t.step("validate asset integrity", () => {
    // Assert
  });
});
```

#### CI Integration Patterns

**Key Features**:
- **JUnit XML Reporter**: `deno test --reporter=junit --junit-path=./report.xml`
- **Parallel Execution**: `deno test --parallel`
- **Coverage**: `deno test --coverage=./cov_profile && deno coverage cov_profile --lcov --output=cov.lcov`
- **Fail Fast**: `deno test --fail-fast`
- **Watch Mode**: `deno test --watch` (development only)
- **Filtering**: `deno test --filter "critical_paths"`

**Example GitHub Actions Configuration**:
```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: denoland/setup-deno@v1
        with:
          deno-version: v2.x
      - run: deno test --parallel --coverage=./cov
      - run: deno coverage cov --lcov --output=coverage.lcov
      - run: deno test --reporter=junit --junit-path=./junit.xml
```

**Coverage Best Practices**:
- Use `--coverage` flag to collect V8-based coverage data
- Generate lcov format for Codecov/Coveralls integration
- Coverage is highly accurate (directly from V8 engine)
- Include `--allow-read` and `--allow-write` permissions

### Alternatives Considered
- **@std/expect over @std/assert**:
  - Pros: Jest-familiar syntax, chainable matchers
  - Cons: Less idiomatic to Deno, slightly more verbose
  - Verdict: Use @std/assert as primary, expect for Jest migrations only

- **External test runners (Vitest, Jest)**:
  - Pros: Feature-rich, familiar tooling
  - Cons: Adds dependencies, configuration complexity, not Deno-native
  - Verdict: Deno's built-in runner is sufficient and simpler (KISS)

- **Manual benchmark scripts**:
  - Pros: Full control over measurement
  - Cons: Reinventing the wheel, no standardization
  - Verdict: Use `deno bench` - built-in and optimized

### Implementation Impact
- Test files follow `*_test.ts` naming convention
- Use basic Deno.test for simple scenarios, BDD pattern for complex suites
- @std/assert for all assertions
- deno bench for performance baseline establishment (FR-009, TCR-004)
- CI integration straightforward with built-in reporters

---

## Technology Stack Summary

### Recommended Configuration

**deno.json**:
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

### Key Principles Applied
1. **KISS**: Simple, well-documented solutions without complex configuration
2. **Deno-Native**: Prefer JSR packages and standard library over npm
3. **Well-Maintained**: Active development, large communities, proven track record
4. **Type-Safe**: TypeScript-first approach throughout
5. **Zero Config**: Minimal setup, maximum productivity

---

## Updated Technical Context Resolutions

| Item | Original Status | Resolution |
|------|----------------|------------|
| **Deno Version** | NEEDS CLARIFICATION | **Deno 2.1+ (LTS)** minimum, test against 2.5.4 stable |
| **JSON Schema Library** | NEEDS CLARIFICATION | **Zod** (@zod/zod) for type-safe validation |
| **HTML Validation** | NEEDS CLARIFICATION | **deno-dom** + **@std/html** for parsing and validation |
| **Testing Framework** | Assumed | **Deno.test** with **@std/assert** (confirmed as best practice) |

All technical uncertainties have been resolved. Implementation can proceed with confidence.

---

## References

- Deno Documentation: https://docs.deno.com/runtime/fundamentals/testing/
- JSR Registry: https://jsr.io/
- Deno Standard Library: https://github.com/denoland/deno_std
- Zod Repository: https://github.com/colinhacks/zod
- deno-dom Repository: https://github.com/b-fuze/deno-dom
- Valibot Repository: https://github.com/fabian-hiller/valibot
