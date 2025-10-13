# Data Model: Comprehensive Test Strategy for Tutors CLI Tools

**Date**: 2025-10-13
**Feature**: Comprehensive Test Strategy for Tutors CLI Tools
**Purpose**: Define data structures, test entities, and their relationships

## Overview

This document defines the data model for the test strategy. Since this is a testing feature rather than a traditional application, the "entities" are test-related concepts: test scenarios, fixtures, results, and validation schemas.

---

## Core Test Entities

### 1. Test Scenario

**Purpose**: Represents a single test case with inputs, execution, and expected outcomes

**Attributes**:
- `id`: string - Unique identifier (e.g., "critical-001", "edge-003")
- `name`: string - Human-readable test name in plain English
- `category`: enum - One of: critical_paths | edge_cases | regression | integration
- `priority`: enum - P1 | P2 | P3 | P4
- `cliTool`: enum - tutors | tutors-lite | tutors-publish-npm | tutors-gen-lib
- `inputFixture`: string - Path to sample course directory
- `expectedOutput`: ExpectedOutput - Description of expected results
- `assertions`: Assertion[] - List of validation checks to perform
- `timeout`: number - Maximum execution time in milliseconds (default: 10000)
- `permissions`: string[] - Deno permissions needed (e.g., ["--allow-read", "--allow-write"])

**Relationships**:
- References one SampleCourse (input fixture)
- Produces one TestResult per execution
- May reference multiple OutputValidators

**State Transitions**:
- pending → running → passed/failed/skipped

**Example**:
```typescript
{
  id: "critical-001",
  name: "tutors CLI generates valid JSON from minimal course",
  category: "critical_paths",
  priority: "P1",
  cliTool: "tutors",
  inputFixture: "./fixtures/sample_courses/minimal_course",
  expectedOutput: {
    type: "json",
    location: "./json/tutors.json",
    schemaPath: "./fixtures/schemas/course_output_schema.json"
  },
  assertions: [
    { type: "exitCode", value: 0 },
    { type: "fileExists", path: "./json/tutors.json" },
    { type: "schemaValid", schemaPath: "./fixtures/schemas/course_output_schema.json" }
  ],
  timeout: 5000,
  permissions: ["--allow-read", "--allow-write", "--allow-env"]
}
```

---

### 2. Sample Course (Test Fixture)

**Purpose**: A controlled course directory structure used as test input with known, predictable content

**Attributes**:
- `name`: string - Fixture identifier (e.g., "minimal_course", "standard_course")
- `path`: string - Location in fixtures directory
- `description`: string - What this fixture represents
- `size`: enum - minimal (10 files) | standard (100 files) | large (1000+ files)
- `structure`: CourseStructure - Hierarchical organization
- `assets`: Asset[] - Images, videos, PDFs included
- `hasErrors`: boolean - Whether this fixture intentionally contains errors
- `errorType`: enum | null - empty_dir | malformed_markdown | missing_assets | special_chars | null

**Relationships**:
- Used by multiple TestScenarios
- Contains multiple CourseElements (topics, labs, units)
- May have corresponding ExpectedOutput

**Validation Rules**:
- Path must exist and be readable
- Structure must be valid unless hasErrors is true
- Assets must be under 10MB total per constitution constraint
- Markdown files must use realistic, obvious content (not "test123")

**Example**:
```typescript
{
  name: "minimal_course",
  path: "./fixtures/sample_courses/minimal_course",
  description: "Basic course with 2 topics, 1 lab, 10 total files",
  size: "minimal",
  structure: {
    type: "course",
    title: "Introduction to Programming",
    topics: [
      { type: "topic", title: "Variables and Data Types", order: 1 },
      { type: "topic", title: "Control Flow", order: 2 }
    ],
    labs: [
      { type: "lab", title: "First Program", steps: 3 }
    ]
  },
  assets: [
    { type: "image", path: "img/variables.png", size: 45000 },
    { type: "pdf", path: "resources/syllabus.pdf", size: 120000 }
  ],
  hasErrors: false,
  errorType: null
}
```

---

### 3. Expected Output

**Purpose**: Defines what a successful test execution should produce

**Attributes**:
- `type`: enum - json | html | netlify_config | error_message
- `location`: string - Where output should be generated
- `schemaPath`: string | null - Path to validation schema (for JSON/structured output)
- `structureChecks`: StructureCheck[] - Specific elements that must exist
- `performanceConstraints`: PerformanceConstraint[] - Time/size limits
- `contentValidations`: ContentValidation[] - Specific content requirements

**Relationships**:
- Referenced by TestScenario
- May reference OutputSchema for validation
- Compared against actual TestResult

**Validation Rules**:
- Location must be relative to test execution directory
- Schema path must exist if specified
- Structure checks must be verifiable programmatically

**Example for JSON Output**:
```typescript
{
  type: "json",
  location: "./json/tutors.json",
  schemaPath: "./fixtures/schemas/course_output_schema.json",
  structureChecks: [
    { element: "title", required: true, type: "string" },
    { element: "topics", required: true, type: "array", minLength: 1 },
    { element: "version", required: true, type: "string", pattern: "^\\d+\\.\\d+\\.\\d+$" }
  ],
  performanceConstraints: [
    { metric: "generationTime", maxMs: 1000 },
    { metric: "outputSize", maxBytes: 1048576 }
  ],
  contentValidations: [
    { field: "topics[0].title", matches: "Variables and Data Types" },
    { field: "labs.length", equals: 1 }
  ]
}
```

**Example for HTML Output**:
```typescript
{
  type: "html",
  location: "./html/index.html",
  schemaPath: null,
  structureChecks: [
    { element: "html", required: true },
    { element: "head > title", required: true },
    { element: "nav", required: true },
    { element: "main", required: true }
  ],
  performanceConstraints: [
    { metric: "generationTime", maxMs: 2000 }
  ],
  contentValidations: [
    { selector: "a[href]", check: "allHrefsValid" },
    { selector: "img", check: "allHaveAlt" }
  ]
}
```

---

### 4. Output Validator

**Purpose**: Component that performs specific validation checks on generated output

**Attributes**:
- `name`: string - Validator identifier (e.g., "JSONSchemaValidator", "HTMLStructureValidator")
- `type`: enum - schema | structure | content | performance | link
- `validationFunction`: string - Name of validation function to execute
- `config`: ValidationConfig - Validator-specific configuration

**Relationships**:
- Used by multiple TestScenarios
- Operates on TestResult outputs
- May reference OutputSchema

**Validation Rules**:
- Each validator must have clear pass/fail criteria
- Error messages must include file paths and line numbers (FR-005)
- Validators must complete within test timeout period

**Types**:

**Schema Validator**:
```typescript
{
  name: "JSONSchemaValidator",
  type: "schema",
  validationFunction: "validateWithZod",
  config: {
    schemaPath: "./fixtures/schemas/course_output_schema.json",
    strictMode: true
  }
}
```

**HTML Structure Validator**:
```typescript
{
  name: "HTMLStructureValidator",
  type: "structure",
  validationFunction: "validateHTMLWithDenoDom",
  config: {
    requiredElements: ["html", "head", "body", "nav"],
    forbiddenElements: ["script[src*='analytics']"],
    checkLinks: true,
    checkImages: true
  }
}
```

**Performance Validator**:
```typescript
{
  name: "PerformanceValidator",
  type: "performance",
  validationFunction: "compareToBaseline",
  config: {
    baselinePath: "./baselines/performance_metrics.json",
    maxDegradationPercent: 10,
    metrics: ["generationTime", "memoryUsage", "outputSize"]
  }
}
```

---

### 5. Performance Baseline

**Purpose**: Recorded metrics used to detect performance regressions

**Attributes**:
- `testId`: string - Which test scenario this applies to
- `cliTool`: string - Which tool was measured
- `inputSize`: string - Fixture size (minimal/standard/large)
- `metrics`: PerformanceMetrics - Measured values
- `recordedAt`: Date - When baseline was established
- `environment`: Environment - System details (OS, Deno version, hardware)

**Metrics**:
```typescript
interface PerformanceMetrics {
  generationTimeMs: number;
  memoryUsageBytes: number;
  outputSizeBytes: number;
  filesProcessed: number;
  assetsProcessed: number;
}
```

**Relationships**:
- Referenced by Performance Validators
- One baseline per (testId, cliTool, inputSize) combination
- Updated when intentional performance improvements are made

**Validation Rules**:
- Baselines must be updated when major CLI changes occur
- Alert if current performance exceeds baseline by >10% (FR-009, SC-010)
- Baseline file stored as JSON for easy version control

**Example**:
```typescript
{
  testId: "critical-001",
  cliTool: "tutors",
  inputSize: "minimal",
  metrics: {
    generationTimeMs: 450,
    memoryUsageBytes: 25165824,  // ~24 MB
    outputSizeBytes: 15000,
    filesProcessed: 10,
    assetsProcessed: 2
  },
  recordedAt: "2025-10-13T10:30:00Z",
  environment: {
    os: "Linux",
    denoVersion: "2.1.0",
    cpu: "x64",
    cores: 8
  }
}
```

---

### 6. Test Result

**Purpose**: Captures the outcome of a single test execution

**Attributes**:
- `testId`: string - References TestScenario
- `status`: enum - passed | failed | skipped | error
- `executionTimeMs`: number - How long the test took
- `exitCode`: number - CLI tool exit code
- `stdout`: string - Standard output from CLI
- `stderr`: string - Standard error from CLI
- `assertionResults`: AssertionResult[] - Pass/fail for each assertion
- `failureReason`: string | null - Why test failed (if applicable)
- `artifacts`: Artifact[] - Generated files for inspection
- `timestamp`: Date - When test ran

**Relationships**:
- References one TestScenario
- Contains multiple AssertionResults
- May be stored for historical comparison

**State Transitions**:
- Test starts → status: pending
- Execution completes → status: passed/failed/error
- Result logged → available for reporting

**Example**:
```typescript
{
  testId: "critical-001",
  status: "passed",
  executionTimeMs: 467,
  exitCode: 0,
  stdout: "Processing course... Generated 15 files",
  stderr: "",
  assertionResults: [
    { assertion: "exitCode equals 0", passed: true },
    { assertion: "file exists at ./json/tutors.json", passed: true },
    { assertion: "JSON validates against schema", passed: true, details: "All fields present" }
  ],
  failureReason: null,
  artifacts: [
    { type: "json", path: "./test-output/critical-001/tutors.json", size: 15234 }
  ],
  timestamp: "2025-10-13T10:45:23Z"
}
```

---

### 7. Test Report

**Purpose**: Summary of test execution results showing passed, failed, and skipped tests

**Attributes**:
- `runId`: string - Unique identifier for this test run
- `startTime`: Date - When run started
- `endTime`: Date - When run completed
- `totalTests`: number - Total scenarios executed
- `passed`: number - Number of passing tests
- `failed`: number - Number of failing tests
- `skipped`: number - Number of skipped tests
- `coverage`: Coverage - Test coverage metrics
- `results`: TestResult[] - Individual test results
- `summary`: string - Human-readable summary

**Relationships**:
- Contains multiple TestResults
- May be exported as JUnit XML for CI (FR-011)
- Referenced for trend analysis

**Validation Rules**:
- totalTests must equal passed + failed + skipped
- Run must complete within overall timeout (5 minutes per SC-001)
- Report must clearly identify failures (FR-020)

**Example**:
```typescript
{
  runId: "run-2025-10-13-104500",
  startTime: "2025-10-13T10:45:00Z",
  endTime: "2025-10-13T10:47:30Z",
  totalTests: 25,
  passed: 23,
  failed: 2,
  skipped: 0,
  coverage: {
    criticalPathScenarios: "100%",
    edgeCases: "85%",
    totalPercentage: "80%"
  },
  results: [ /* TestResult objects */ ],
  summary: "23/25 tests passed. Failures: edge-003 (special characters), integration-002 (Netlify config)"
}
```

---

## Output Schemas

### Course JSON Output Schema (Zod)

```typescript
import { z } from "zod";

export const CourseOutputSchema = z.object({
  title: z.string().min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  topics: z.array(z.object({
    id: z.string(),
    title: z.string(),
    type: z.enum(["lab", "topic", "unit"]),
    order: z.number().int().positive(),
    content: z.string().optional(),
    children: z.array(z.string()).optional()
  })),
  metadata: z.object({
    generatedAt: z.string().datetime(),
    generator: z.string(),
    sourceDirectory: z.string()
  }),
  assets: z.array(z.object({
    type: z.enum(["image", "video", "pdf", "other"]),
    path: z.string(),
    size: z.number().int().positive()
  })).optional()
});

export type CourseOutput = z.infer<typeof CourseOutputSchema>;
```

### Netlify Config Schema (Zod)

```typescript
export const NetlifyConfigSchema = z.object({
  build: z.object({
    command: z.string(),
    publish: z.string()
  }),
  redirects: z.array(z.object({
    from: z.string(),
    to: z.string(),
    status: z.number().int()
  })).optional()
});
```

---

## Relationships Diagram

```
TestScenario
├── references → SampleCourse (input)
├── defines → ExpectedOutput
├── uses → OutputValidator[]
├── produces → TestResult
└── compares against → PerformanceBaseline

SampleCourse
├── used by → TestScenario[]
└── contains → CourseElement[]

ExpectedOutput
├── referenced by → TestScenario
├── may reference → OutputSchema
└── compared with → TestResult

OutputValidator
├── validates → TestResult
└── may use → PerformanceBaseline

TestResult
├── references → TestScenario
├── contains → AssertionResult[]
└── included in → TestReport

PerformanceBaseline
└── used by → OutputValidator (performance type)

TestReport
└── aggregates → TestResult[]
```

---

## Data Storage

### File System Organization

```
fixtures/
├── sample_courses/
│   ├── minimal_course/       # SampleCourse entity
│   ├── standard_course/      # SampleCourse entity
│   └── large_course/         # SampleCourse entity
├── expected_outputs/
│   ├── minimal_json/         # ExpectedOutput reference
│   └── minimal_html/         # ExpectedOutput reference
└── schemas/
    ├── course_output_schema.ts  # OutputSchema (Zod)
    └── netlify_config_schema.ts # OutputSchema (Zod)

baselines/
└── performance_metrics.json  # PerformanceBaseline[]

test_helpers/
├── output_validator.ts       # OutputValidator implementations
├── course_builder.ts         # SampleCourse factory
└── performance_tracker.ts    # PerformanceBaseline manager

tests/
├── critical_paths/           # TestScenario implementations
├── edge_cases/              # TestScenario implementations
├── regression/              # TestScenario implementations
└── integration/             # TestScenario implementations
```

### Baseline Metrics File Format

**baselines/performance_metrics.json**:
```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-10-13T10:00:00Z",
  "baselines": [
    {
      "testId": "critical-001",
      "cliTool": "tutors",
      "inputSize": "minimal",
      "metrics": {
        "generationTimeMs": 450,
        "memoryUsageBytes": 25165824,
        "outputSizeBytes": 15000,
        "filesProcessed": 10,
        "assetsProcessed": 2
      },
      "environment": {
        "os": "Linux",
        "denoVersion": "2.1.0"
      }
    }
  ]
}
```

---

## Validation Rules Summary

1. **Test Scenarios**:
   - Must have unique IDs within category
   - Timeout must be ≤ 10 seconds (individual) or 5 minutes (suite)
   - Input fixtures must exist and be readable

2. **Sample Courses**:
   - Total fixture size < 10MB per constitution
   - Must use realistic, obvious content (not "test123")
   - Error fixtures must clearly document what error they test

3. **Expected Outputs**:
   - Schema paths must exist if specified
   - Structure checks must be programmatically verifiable
   - Performance constraints must be measurable

4. **Performance Baselines**:
   - Alert if degradation > 10% from baseline
   - Baselines versioned in git for traceability
   - Environment details recorded for reproducibility

5. **Test Results**:
   - Failure reasons must include file paths (FR-005, FR-020)
   - All assertions logged with pass/fail status
   - Artifacts preserved for failed tests

---

## Alignment with Requirements

- **FR-001 to FR-020**: All functional requirements map to test entities and validation rules
- **TCR-001 to TCR-006**: Test coverage requirements supported by TestScenario categories
- **SC-001**: TestReport tracks execution time (< 5 minutes)
- **SC-002**: Coverage metrics in TestReport (80% critical paths)
- **SC-004**: Failure reasons in TestResult enable 2-minute problem identification
- **SC-009**: SampleCourse uses realistic data for readability
- **SC-010**: PerformanceBaseline implements 10% degradation alerts

---

This data model provides a complete structure for implementing the test strategy while maintaining KISS principles and constitutional alignment.
