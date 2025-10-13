# Test Strategy Contracts

**Purpose**: Define the interfaces and contracts for the test system components

## Overview

This directory contains TypeScript interface definitions that define the contract/API for the test strategy implementation. These are **not** implementation files - they specify what implementations must provide.

## Files

### test_interface.ts
Complete TypeScript interfaces for all test system components:

- **Test Entities**: TestScenario, SampleCourse, ExpectedOutput
- **Validation**: OutputValidator, ValidationConfig
- **Performance**: PerformanceBaseline, PerformanceMetrics
- **Results**: TestResult, TestReport, AssertionResult
- **Execution**: TestRunner, CLIExecutor
- **Utilities**: FixtureBuilder, PerformanceTracker

## Design Principles

These contracts follow the project constitution:

1. **Simplicity First (Principle I)**
   - Interfaces are straightforward and focused
   - No complex inheritance hierarchies
   - Clear, single-purpose contracts

2. **Clear Intention (Principle III)**
   - All interface members have descriptive names
   - JSDoc comments explain purpose
   - Type annotations make expectations explicit

3. **Direct Over Abstract (Principle IV)**
   - Interfaces defined only after analyzing spec entities
   - No speculative "might need this later" interfaces
   - Based on concrete requirements from spec.md

## Usage in Implementation

When implementing the test strategy:

1. **Import types from this contract**:
   ```typescript
   import type { TestScenario, TestResult, TestRunner } from "../contracts/test_interface.ts";
   ```

2. **Implement interfaces for components**:
   ```typescript
   class DenoTestRunner implements TestRunner {
     async runTest(scenario: TestScenario): Promise<TestResult> {
       // Implementation
     }

     async runTests(scenarios: TestScenario[], options?: TestExecutionOptions): Promise<TestReport> {
       // Implementation
     }

     async validateOutput(outputPath: string, validator: OutputValidator): Promise<boolean> {
       // Implementation
     }
   }
   ```

3. **Use types for data structures**:
   ```typescript
   const scenario: TestScenario = {
     id: "critical-001",
     name: "tutors CLI generates valid JSON",
     category: "critical_paths",
     priority: "P1",
     // ... rest of scenario definition
   };
   ```

## Alignment with Requirements

| Requirement | Contract Support |
|-------------|------------------|
| FR-001 to FR-020 | TestScenario interface maps all functional requirements to executable tests |
| TCR-001 to TCR-006 | TestCategory enum organizes tests by coverage type (unit, integration, e2e) |
| FR-009, SC-010 | PerformanceBaseline and PerformanceTracker support performance regression detection |
| FR-020 | TestResult.failureReason and AssertionResult provide clear failure identification |
| FR-011 | TestReport supports CI reporting with multiple format options |
| SC-001 | TestExecutionOptions.suiteTimeout enforces 5-minute limit |
| SC-002 | Coverage interface tracks 80% critical path target |

## Constitution Compliance

- **KISS (Principle II)**: Interfaces use simple, flat structures
- **Readable (Principle II)**: Extensive JSDoc comments and clear type names
- **Clear Intention (Principle III)**: Every field has a clear purpose
- **No Premature Abstraction (Principle IV)**: Interfaces derived from actual spec requirements

## Modification Guidelines

When updating these contracts:

1. **Document the change**: Update this README with rationale
2. **Version increment**: If breaking changes, increment major version in comments
3. **Constitution check**: Ensure changes align with KISS and clarity principles
4. **Spec alignment**: Changes must trace back to spec.md requirements
5. **Avoid complexity**: Reject changes that add unnecessary abstraction

## Example: Adding a New Validator Type

If implementation reveals a need for a new validator type:

1. ✅ **Good**: Add to ValidatorType enum if it solves a concrete problem from spec
   ```typescript
   export type ValidatorType = "schema" | "structure" | "content" | "performance" | "link" | "accessibility";
   ```

2. ❌ **Bad**: Add complex validator hierarchy "for flexibility"
   ```typescript
   // DON'T DO THIS
   interface BaseValidator { /* ... */ }
   interface AdvancedValidator extends BaseValidator { /* ... */ }
   interface MetaValidator<T extends BaseValidator> { /* ... */ }
   ```

## References

- Specification: [../spec.md](../spec.md)
- Data Model: [../data-model.md](../data-model.md)
- Constitution: [/.specify/memory/constitution.md](/.specify/memory/constitution.md)
