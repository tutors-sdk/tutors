# Implementation Plan: Comprehensive Test Strategy for Tutors CLI Tools

**Branch**: `001-the-tutors-project` | **Date**: 2025-10-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-the-tutors-project/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Create a comprehensive test strategy for the Tutors CLI tools (tutors, tutors-lite, tutors-gen-lib) to establish unit testing, integration testing, and end-to-end testing capabilities. The strategy must verify CLI functionality, validate output quality, prevent regressions, and provide deployment confidence while adhering to KISS principles for test readability and maintainability.

## Technical Context

**Language/Version**: TypeScript with Deno 2.1+ (LTS) runtime, test against latest stable (2.5.4)
**Primary Dependencies**: Deno standard library (@std/assert, @std/testing, @std/html), Zod (@zod/zod) for JSON schema validation, deno-dom (@b-fuze/deno-dom) for HTML validation, JSR packages (@tutors/tutors-gen-lib)
**Storage**: File system (test fixtures, sample courses, baseline metrics stored as JSON files)
**Testing**: Deno's built-in test framework (Deno.test) with @std/assert for assertions
**Target Platform**: Cross-platform (Linux, macOS, Windows) - wherever Deno runs
**Project Type**: Single project (test suite for existing CLI tools)
**Performance Goals**: Complete test suite execution under 5 minutes; individual test scenarios under 10 seconds
**Constraints**: Must not require network access for core tests; sample course fixtures under 10MB total; tests must be CI-friendly
**Scale/Scope**: Testing 3 CLI tools (tutors, tutors-lite, tutors-publish-npm) + 1 core library (tutors-gen-lib); targeting 80% critical path coverage with 20-50 test scenarios

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Simplicity First (KISS) ✅ PASS

- **Complexity Assessment**: Test strategy is inherently straightforward - run tests against sample courses, validate output
- **Dependencies**: Minimal - using Deno's built-in test framework, file system for fixtures, standard validation libraries
- **Justification**: No unnecessary complexity; testing is direct and focused on real CLI behavior

### II. Readable Tests Over Clever Tests ✅ PASS

- **Test Design**: Specification explicitly requires (FR-014) tests follow KISS principles per constitution
- **Test Names**: SC-009 measures test readability in reviews
- **Assertion Strategy**: User scenarios designed to be independently testable with clear acceptance criteria
- **No Violations**: This is a test strategy feature - readability is the PRIMARY goal

### III. Clear Intention ✅ PASS

- **Naming**: Test scenarios named after user goals (Core CLI Functionality, Output Validation, Regression Prevention)
- **Organization**: Tests organized by scenario, not by code structure (aligns with constitution Testing Standards)
- **Documentation**: Test fixtures will use realistic course examples with obvious content

### IV. Direct Over Abstract ✅ PASS

- **Approach**: Direct testing - run actual CLI commands on real sample courses
- **No Premature Abstraction**: Starting with concrete test cases; abstractions only if Rule of Three applies
- **Validation**: Schema-based output validation (direct) rather than complex comparison frameworks

### V. Fail Fast and Visibly ✅ PASS

- **Error Reporting**: FR-020 requires tests clearly identify which tool, scenario, and assertion failed
- **Validation**: FR-005 requires tests verify error messages are clear and actionable
- **Performance Monitoring**: FR-009 establishes baselines; failures trigger visible alerts

### Constitution-Specific Test Requirements ✅ PASS

- **Test Organization**: Matches constitution's prescribed structure (critical_paths/, edge_cases/, regression/, integration/)
- **Test Data Strategy**: Follows "obvious and minimal" principle - realistic, self-explanatory fixtures
- **Coverage Philosophy**: SC-002 targets 80% critical path coverage, not arbitrary 100% (aligns with "coverage is a metric, not a goal")

**GATE RESULT**: ✅ **PASS** - Proceed to Phase 0

**Rationale**: A test strategy feature that explicitly enforces constitution principles cannot violate those principles. All requirements align with KISS, readability, directness, and clear error reporting.

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```
tests/
├── critical_paths/          # P1: Core CLI functionality tests
│   ├── tutors_cli_test.ts
│   ├── tutors_lite_test.ts
│   └── gen_lib_core_test.ts
├── edge_cases/              # P2: Boundary and error scenarios
│   ├── special_characters_test.ts
│   ├── large_courses_test.ts
│   └── malformed_content_test.ts
├── regression/              # P3: Bug-specific tests with issue refs
│   └── (empty initially, populated as bugs found)
└── integration/             # P4: End-to-end pipeline tests
    ├── e2e_json_generation_test.ts
    ├── e2e_html_generation_test.ts
    └── netlify_deployment_test.ts

fixtures/
├── sample_courses/          # Test course directories
│   ├── minimal_course/      # 10 files - basic structure
│   ├── standard_course/     # 100 files - typical course
│   └── large_course/        # 1000+ files - stress test
├── expected_outputs/        # Known-good outputs for validation
│   ├── minimal_json/
│   └── minimal_html/
└── schemas/                 # JSON schemas for validation
    ├── course_output_schema.json
    └── netlify_config_schema.json

test_helpers/                # Shared utilities (only if Rule of Three applies)
├── output_validator.ts      # Schema validation helper
├── course_builder.ts        # Fixture generation utility
└── performance_tracker.ts   # Baseline comparison

baselines/                   # Performance baseline data
└── performance_metrics.json
```

**Structure Decision**: Single project structure with tests organized by user scenario (critical paths, edge cases, regression, integration) per constitution testing standards. Test fixtures separated to keep test code clean and focused. Helpers directory included but will only contain utilities after three concrete examples prove the need (Rule of Three).

## Complexity Tracking

*No violations - section not applicable*

---

## Phase Summary

### Phase 0: Research ✅ COMPLETED

**Artifacts Generated**:
- [research.md](./research.md) - Technology stack research and decisions

**Key Decisions Made**:
1. **Deno Version**: Target Deno 2.1+ (LTS), test against 2.5.4 stable
2. **JSON Schema Validation**: Zod (@zod/zod) - TypeScript-first, zero dependencies, industry standard
3. **HTML Validation**: deno-dom (@b-fuze/deno-dom) + @std/html for parsing and validation
4. **Testing Best Practices**: Use Deno.test with @std/assert, BDD pattern for complex suites

**NEEDS CLARIFICATION Resolved**: All technical uncertainties from Technical Context have been investigated and resolved.

### Phase 1: Design & Contracts ✅ COMPLETED

**Artifacts Generated**:
- [data-model.md](./data-model.md) - Complete data model for test entities
- [contracts/test_interface.ts](./contracts/test_interface.ts) - TypeScript interfaces for all components
- [contracts/README.md](./contracts/README.md) - Contract documentation
- [quickstart.md](./quickstart.md) - Developer quickstart guide
- CLAUDE.md - Updated agent context

**Key Design Elements**:
1. **Test Entities**: TestScenario, SampleCourse, ExpectedOutput, OutputValidator, PerformanceBaseline, TestResult, TestReport
2. **Component Interfaces**: TestRunner, CLIExecutor, FixtureBuilder, PerformanceTracker
3. **Validation Schemas**: Zod schemas for course output and Netlify config
4. **Test Organization**: By user scenario (critical_paths/, edge_cases/, regression/, integration/)

**Constitution Re-Check**: ✅ PASS - Design maintains KISS principles, clear intention, direct approach

### Phase 2: Task Generation (Next Step)

**Command**: `/speckit.tasks`

**Will Generate**:
- tasks.md - Actionable, dependency-ordered task list for implementation

**Prerequisites**: All Phase 0 and Phase 1 artifacts complete ✅

---

## Implementation Readiness

### Ready to Implement ✅

All planning phases complete. The test strategy is ready for task generation and implementation.

**Next Steps**:
1. Run `/speckit.tasks` to generate implementation task list
2. Begin implementation following tasks.md
3. Create minimal sample course fixture
4. Write first critical path test
5. Establish performance baselines
6. Expand test coverage iteratively

### Key Files Reference

| File | Purpose | Status |
|------|---------|--------|
| [spec.md](./spec.md) | Feature specification with user scenarios | ✅ Complete |
| [plan.md](./plan.md) | This file - implementation plan | ✅ Complete |
| [research.md](./research.md) | Technology stack research | ✅ Complete |
| [data-model.md](./data-model.md) | Test entity data model | ✅ Complete |
| [contracts/](./contracts/) | TypeScript interface definitions | ✅ Complete |
| [quickstart.md](./quickstart.md) | Developer quickstart guide | ✅ Complete |
| tasks.md | Implementation task list | ⏳ Pending `/speckit.tasks` |

---

**Planning Complete**: 2025-10-13
**Branch**: 001-the-tutors-project
**Ready for**: Task generation and implementation
