---
description: "Task list for comprehensive test strategy implementation"
---

# Tasks: Comprehensive Test Strategy for Tutors CLI Tools

**Input**: Design documents from `/specs/001-the-tutors-project/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, contracts/, research.md, quickstart.md

**Tests**: This is a testing strategy feature - all tasks involve creating tests

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `tests/`, `fixtures/`, `test_helpers/`, `baselines/` at repository root
- Paths shown below use single project structure per plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure needed by all user stories

- [ ] T001 Create project directory structure per implementation plan (tests/, fixtures/, test_helpers/, baselines/)
- [ ] T002 Create deno.json with imports for @std/assert, @std/testing, @std/html, zod, deno-dom
- [ ] T003 [P] Create fixtures/sample_courses/ directory structure
- [ ] T004 [P] Create fixtures/expected_outputs/ directory structure
- [ ] T005 [P] Create fixtures/schemas/ directory structure
- [ ] T006 [P] Create baselines/performance_metrics.json with initial empty structure
- [ ] T007 Create .gitignore to exclude test-output/ and cov_profile/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure and utilities that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T008 Create fixtures/schemas/course_output_schema.ts with Zod schema for JSON validation
- [ ] T009 [P] Create fixtures/schemas/netlify_config_schema.ts with Zod schema for Netlify config
- [ ] T010 Create test_helpers/output_validator.ts with validateWithZod function
- [ ] T011 [P] Create test_helpers/performance_tracker.ts with baseline comparison logic
- [ ] T012 [P] Create minimal sample course in fixtures/sample_courses/minimal_course/ (10 files: course.md, 2 topics, 1 lab, 2 assets)
- [ ] T013 Create fixtures/sample_courses/minimal_course/course.md with "Introduction to Programming" content
- [ ] T014 [P] Create fixtures/sample_courses/minimal_course/topic-01/topic.md for "Variables and Data Types"
- [ ] T015 [P] Create fixtures/sample_courses/minimal_course/topic-02/topic.md for "Control Flow"
- [ ] T016 [P] Create fixtures/sample_courses/minimal_course/lab-01/lab.md for "First Program" lab with 3 steps
- [ ] T017 [P] Add 2 small test assets to fixtures/sample_courses/minimal_course/ (image and PDF under 200KB total)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Core CLI Functionality Verification (Priority: P1) 🎯 MVP

**Goal**: Verify that the core CLI commands work correctly when processing course content

**Independent Test**: Run primary CLI commands against minimal course and verify output files are generated with correct structure

### Implementation for User Story 1

- [ ] T018 [P] [US1] Create tests/critical_paths/tutors_cli_test.ts for tutors CLI JSON generation
- [ ] T019 [P] [US1] Create tests/critical_paths/tutors_lite_test.ts for tutors-lite HTML generation
- [ ] T020 [P] [US1] Create tests/critical_paths/gen_lib_core_test.ts for core library parsing functions
- [ ] T021 [US1] Implement "tutors CLI generates valid JSON from minimal course" test in tests/critical_paths/tutors_cli_test.ts
- [ ] T022 [US1] Implement "tutors-lite generates complete HTML site" test in tests/critical_paths/tutors_lite_test.ts
- [ ] T023 [US1] Implement "error handling for empty directory" test in tests/critical_paths/tutors_cli_test.ts
- [ ] T024 [US1] Implement "hierarchical structure preservation" test in tests/critical_paths/tutors_cli_test.ts
- [ ] T025 [US1] Implement "malformed markdown error reporting" test in tests/critical_paths/tutors_cli_test.ts
- [ ] T026 [US1] Run tests for User Story 1 and verify all pass

**Checkpoint**: At this point, User Story 1 (Core CLI Functionality) should be fully functional and testable independently

---

## Phase 4: User Story 2 - Output Validation and Quality Assurance (Priority: P2)

**Goal**: Validate that generated output meets quality standards and matches expected formats

**Independent Test**: Run CLI tools and validate generated output against schemas, check file formats, verify asset integrity

### Implementation for User Story 2

- [ ] T027 [P] [US2] Create test_helpers/html_validator.ts with deno-dom HTML validation functions
- [ ] T028 [P] [US2] Create fixtures/expected_outputs/minimal_json/ with known-good JSON output
- [ ] T029 [P] [US2] Create fixtures/expected_outputs/minimal_html/ with known-good HTML output
- [ ] T030 [US2] Create tests/critical_paths/output_validation_test.ts for JSON schema validation
- [ ] T031 [US2] Implement "JSON output validates against schema" test in tests/critical_paths/output_validation_test.ts
- [ ] T032 [US2] Implement "assets copied to output with correct paths" test in tests/critical_paths/output_validation_test.ts
- [ ] T033 [US2] Implement "HTML navigation links work correctly" test using html_validator.ts
- [ ] T034 [US2] Create tests/edge_cases/special_characters_test.ts for filenames with special chars
- [ ] T035 [US2] Implement "special characters in titles and paths are properly encoded" test
- [ ] T036 [US2] Create tests/edge_cases/large_courses_test.ts for performance testing
- [ ] T037 [US2] Create fixtures/sample_courses/standard_course/ with 100 files (similar structure to minimal but expanded)
- [ ] T038 [US2] Implement "large course completes in under 60 seconds" test in tests/edge_cases/large_courses_test.ts
- [ ] T039 [US2] Run tests for User Story 2 and verify all pass

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Regression Prevention (Priority: P3)

**Goal**: Create a test suite that catches regressions when making changes

**Independent Test**: Run full test suite after code changes and verify no regressions occur

### Implementation for User Story 3

- [ ] T040 [US3] Establish performance baseline for minimal course in baselines/performance_metrics.json
- [ ] T041 [US3] Establish performance baseline for standard course in baselines/performance_metrics.json
- [ ] T042 [P] [US3] Create tests/regression/ directory structure (initially empty, documented)
- [ ] T043 [US3] Create tests/regression/README.md explaining how to add regression tests with issue numbers
- [ ] T044 [US3] Implement "all previously passing scenarios still pass" meta-test in tests/regression/regression_suite_test.ts
- [ ] T045 [US3] Implement "no unintended side effects in other CLI commands" test (runs multiple tools on same course)
- [ ] T046 [US3] Create performance regression test in tests/critical_paths/performance_test.ts
- [ ] T047 [US3] Implement "course generation time does not degrade by more than 10%" test using performance_tracker.ts
- [ ] T048 [US3] Update test_helpers/performance_tracker.ts to compare current metrics against baselines
- [ ] T049 [US3] Run tests for User Story 3 and verify all pass

**Checkpoint**: All user stories 1, 2, and 3 should now be independently functional

---

## Phase 6: User Story 4 - Integration and Deployment Confidence (Priority: P4)

**Goal**: Verify the entire pipeline from course source to deployed website works end-to-end

**Independent Test**: Run complete workflow (prepare, generate, validate deploy-readiness) and verify deployable artifact is produced

### Implementation for User Story 4

- [ ] T050 [P] [US4] Create tests/integration/e2e_json_generation_test.ts for complete JSON workflow
- [ ] T051 [P] [US4] Create tests/integration/e2e_html_generation_test.ts for complete HTML workflow
- [ ] T052 [P] [US4] Create tests/integration/netlify_deployment_test.ts for deployment validation
- [ ] T053 [US4] Implement "full pipeline produces deployable artifact" test in e2e_json_generation_test.ts
- [ ] T054 [US4] Implement "Netlify configuration structure is valid" test in netlify_deployment_test.ts
- [ ] T055 [US4] Create fixtures/sample_courses/complex_course/ with edge case scenarios (deeply nested, special chars, large assets)
- [ ] T056 [US4] Implement "multiple course examples run in parallel successfully" test
- [ ] T057 [US4] Implement "course update only changes modified content" test (incremental generation)
- [ ] T058 [US4] Run tests for User Story 4 and verify all pass

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and finalization

- [ ] T059 [P] Create README.md in tests/ directory explaining test organization and how to run tests
- [ ] T060 [P] Document all test scenarios in tests/README.md with descriptions and purposes
- [ ] T061 [P] Create .github/workflows/test.yml for CI integration with Deno test execution
- [ ] T062 Configure CI workflow to run tests with --parallel flag and generate JUnit XML report
- [ ] T063 Configure CI workflow to collect and publish coverage reports to codecov/coveralls
- [ ] T064 [P] Add example test scripts to deno.json tasks (test:critical, test:integration, etc.)
- [ ] T065 Create quickstart example in tests/examples/hello_test.ts demonstrating basic test structure
- [ ] T066 [P] Review all test code for readability (Constitution Principle II compliance)
- [ ] T067 [P] Review all test fixtures for realistic, obvious content (not "test123")
- [ ] T068 Verify complete test suite runs in under 5 minutes (SC-001)
- [ ] T069 Verify test suite achieves 80% coverage of critical path scenarios (SC-002)
- [ ] T070 Run full test suite and generate final test report

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 (P1): Can start after Foundational - No dependencies on other stories
  - US2 (P2): Can start after Foundational - Builds on US1 but independently testable
  - US3 (P3): Can start after Foundational - Uses baselines from US1/US2 execution
  - US4 (P4): Can start after Foundational - Integrates US1/US2 but independently testable
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May use US1 tests as examples but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Needs baselines established (can use US1/US2 as baseline sources)
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Integrates all CLIs but independently testable

### Within Each User Story

- Tests can be created in parallel (different files)
- Sample courses before tests that use them
- Validation helpers before tests that depend on them
- Performance baselines before regression tests

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Within each user story, tasks marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all test file creation for User Story 1 together:
Task T018: "Create tests/critical_paths/tutors_cli_test.ts"
Task T019: "Create tests/critical_paths/tutors_lite_test.ts"
Task T020: "Create tests/critical_paths/gen_lib_core_test.ts"

# These can run simultaneously - different files, no conflicts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Core CLI Functionality)
4. **STOP and VALIDATE**: Run User Story 1 tests independently
5. Deploy/demo if ready (basic CLI testing functional)

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (output validation added)
4. Add User Story 3 → Test independently → Deploy/Demo (regression protection added)
5. Add User Story 4 → Test independently → Deploy/Demo (full E2E confidence)
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Core CLI tests)
   - Developer B: User Story 2 (Output validation)
   - Developer C: User Story 3 (Regression tests)
   - Developer D: User Story 4 (Integration tests)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- All tasks involve writing tests since this is a testing strategy feature
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

---

## Task Summary

**Total Tasks**: 70
**Setup Tasks**: 7 (T001-T007)
**Foundational Tasks**: 10 (T008-T017)
**User Story 1 Tasks**: 9 (T018-T026) - Core CLI Functionality
**User Story 2 Tasks**: 13 (T027-T039) - Output Validation
**User Story 3 Tasks**: 10 (T040-T049) - Regression Prevention
**User Story 4 Tasks**: 9 (T050-T058) - Integration & Deployment
**Polish Tasks**: 12 (T059-T070) - Cross-cutting concerns

**Parallel Opportunities**: 32 tasks marked [P] can run in parallel within their phase

**MVP Scope**: Phase 1 (Setup) + Phase 2 (Foundational) + Phase 3 (User Story 1) = 26 tasks for basic CLI testing

**Independent Test Criteria**:
- **US1**: Run tutors/tutors-lite against minimal course, verify output generated
- **US2**: Validate generated output against schemas, check asset integrity
- **US3**: Re-run existing tests after changes, verify no regressions
- **US4**: Run complete pipeline workflow, verify deployable artifact

---

**Generated**: 2025-10-13
**Branch**: 001-the-tutors-project
**Ready for**: Implementation
