# Feature Specification: Comprehensive Test Strategy for Tutors CLI Tools

**Feature Branch**: `001-the-tutors-project`
**Created**: 2025-10-13
**Status**: Draft
**Input**: User description: "The tutors project has grown organically over several years but has no firm test strategy. The CLI tools are at the heart of the process https://github.com/tutors-sdk/tutors-apps/tree/development/cli. The goal here is to analyse the existing tools and propose a robust test strategy that governs unit tests and in particular end to end tests to give a solid starting point for testing of the overall project."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Core CLI Functionality Verification (Priority: P1)

As a **developer working on Tutors CLI tools**, I need to verify that the core CLI commands work correctly when processing course content, so that I can catch breaking changes before users encounter them.

**Why this priority**: The CLI tools are the heart of the Tutors platform. If the main commands fail, the entire course generation pipeline breaks, affecting all educators using the platform. This is the foundation that all other testing builds upon.

**Independent Test**: Can be fully tested by running the primary CLI commands against sample course directories and verifying that output files are generated with correct structure and content. Delivers immediate confidence that core functionality works.

**Acceptance Scenarios**:

1. **Given** a valid course directory with markdown files and assets, **When** running the tutors CLI tool to generate dynamic content, **Then** a properly structured JSON output folder is created with all course resources processed
2. **Given** a valid course directory, **When** running tutors-lite to generate static HTML, **Then** a complete HTML site is created with navigation, content pages, and all assets included
3. **Given** an empty directory, **When** running any CLI tool, **Then** a clear error message explains what is missing and how to fix it
4. **Given** a course with nested topics and labs, **When** generating output, **Then** the hierarchical structure is preserved in the output with correct parent-child relationships
5. **Given** malformed markdown content, **When** processing the course, **Then** the tool reports specific errors with file paths and line numbers

---

### User Story 2 - Output Validation and Quality Assurance (Priority: P2)

As a **developer maintaining the CLI tools**, I need to validate that generated output meets quality standards and matches expected formats, so that downstream consumers (web readers, deployment systems) can reliably process the results.

**Why this priority**: Even if tools run without crashing, incorrect output breaks the user experience. Educators depend on consistent, valid output for course deployment. This ensures quality beyond basic functionality.

**Independent Test**: Can be tested by running CLI tools and then validating the generated output against schemas, checking file formats, verifying asset integrity, and confirming navigation structures. Delivers assurance about output quality.

**Acceptance Scenarios**:

1. **Given** generated JSON output, **When** validating against expected schemas, **Then** all required fields are present with correct data types
2. **Given** a course with images and media files, **When** generation completes, **Then** all assets are copied to output directory with correct paths and no corruption
3. **Given** generated static HTML, **When** opening pages in a browser, **Then** navigation links work, content displays properly, and no broken resources exist
4. **Given** courses with special characters in titles and paths, **When** generating output, **Then** all filenames and URLs are properly encoded and valid
5. **Given** large courses with hundreds of files, **When** processing completes, **Then** all content is included and generation time is under 60 seconds

---

### User Story 3 - Regression Prevention (Priority: P3)

As a **project maintainer**, I need a test suite that catches regressions when making changes, so that refactoring and new features don't break existing functionality that users depend on.

**Why this priority**: As the project grows, confidence in making changes decreases without regression tests. This enables safe evolution of the codebase while protecting existing users from breaks.

**Independent Test**: Can be tested by creating a suite of previously identified bug scenarios and known edge cases, running them after code changes, and verifying that old bugs don't resurface. Delivers long-term stability.

**Acceptance Scenarios**:

1. **Given** a library update or code refactoring, **When** running the full test suite, **Then** all previously passing scenarios still pass
2. **Given** a new feature addition, **When** existing tests run, **Then** no unintended side effects occur in other CLI commands
3. **Given** historical bug reports, **When** tests include those scenarios, **Then** the same bugs do not reoccur in future versions
4. **Given** performance baselines established, **When** code changes are made, **Then** course generation time does not degrade by more than 10%

---

### User Story 4 - Integration and Deployment Confidence (Priority: P4)

As a **DevOps engineer or course creator**, I need end-to-end tests that verify the entire pipeline from course source to deployed website, so that I can confidently push updates to production.

**Why this priority**: Individual components may work in isolation but fail when integrated. This tests the real-world workflow that users experience and catches integration issues.

**Independent Test**: Can be tested by running a complete workflow: prepare course content, run appropriate CLI tool, deploy output to hosting platform, verify the deployed site is accessible and functional. Delivers production readiness confidence.

**Acceptance Scenarios**:

1. **Given** a sample course in version control, **When** running the full pipeline (generate, build, deploy simulation), **Then** the process completes without errors and produces a deployable artifact
2. **Given** Netlify deployment configuration, **When** testing the build command and output directory, **Then** the generated structure matches what Netlify expects
3. **Given** multiple course examples (simple, complex, edge cases), **When** running end-to-end tests in parallel, **Then** all complete successfully within expected timeframes
4. **Given** a course update scenario, **When** regenerating from modified source, **Then** only changed content is updated and existing URLs remain stable

---

### Edge Cases

- What happens when a course directory contains files with special characters, spaces, or unicode in names?
- How does the system handle extremely large courses with thousands of topics and assets?
- What occurs when markdown files contain malformed frontmatter or invalid syntax?
- How are circular references in course navigation handled?
- What happens when required dependencies or libraries are missing?
- How does the tool behave when disk space is insufficient during generation?
- What occurs when network failures happen during asset processing or deployment?
- How are permission errors handled when writing to output directories?
- What happens when the same tool is run concurrently on the same course directory?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Test suite MUST verify that the tutors CLI tool generates valid JSON output structures from markdown course directories
- **FR-002**: Test suite MUST verify that tutors-lite CLI tool generates complete static HTML sites that can be viewed offline
- **FR-003**: Test suite MUST validate that all course assets (images, videos, PDFs) are correctly processed and included in output
- **FR-004**: Test suite MUST verify that course hierarchies (topics, labs, steps) are correctly represented in generated output
- **FR-005**: Test suite MUST check that error messages are clear, actionable, and include file paths when processing fails
- **FR-006**: Test suite MUST validate generated output against defined schemas for JSON and HTML formats
- **FR-007**: Test suite MUST verify that navigation structures in output are complete and correctly linked
- **FR-008**: Test suite MUST include tests for common error scenarios (empty directories, malformed content, missing assets)
- **FR-009**: Test suite MUST measure and track performance metrics (generation time, memory usage) for regression detection
- **FR-010**: Test suite MUST support testing individual CLI tools in isolation (unit tests) and in combination (integration tests)
- **FR-011**: Test suite MUST be executable in continuous integration environments with clear pass/fail reporting
- **FR-012**: Test suite MUST include end-to-end scenarios that simulate real user workflows from course source to deployable output
- **FR-013**: Test suite MUST verify that generated Netlify configurations are valid and deployment-ready
- **FR-014**: Test framework MUST be simple, readable, and follow KISS principles per project constitution
- **FR-015**: Test suite MUST include regression tests for previously identified bugs to prevent reoccurrence
- **FR-016**: Test suite MUST validate that LLM-ready content generation (when enabled) produces properly structured output
- **FR-017**: Test suite MUST verify that both tutors and tutors-lite handle the same course input without conflicts
- **FR-018**: Test suite MUST include tests for edge cases like special characters, large files, and deeply nested structures
- **FR-019**: Test execution time MUST be reasonable (complete suite under 5 minutes) to encourage frequent running
- **FR-020**: Test output MUST clearly identify which CLI tool, scenario, and specific assertion failed

### Test Coverage Requirements

- **TCR-001**: Unit tests MUST cover core functions in tutors-gen-lib (parsing, generation, asset processing)
- **TCR-002**: Integration tests MUST cover interactions between CLI tools and the generator library
- **TCR-003**: End-to-end tests MUST cover complete workflows: source directory → CLI execution → output validation
- **TCR-004**: Performance tests MUST establish baselines for small (10 files), medium (100 files), and large (1000+ files) courses
- **TCR-005**: Error handling tests MUST cover all identified error scenarios and edge cases
- **TCR-006**: Compatibility tests MUST verify tools work with supported runtime versions (Deno versions)

### Key Entities

- **Test Scenario**: A specific test case with input course content, CLI command, and expected outcomes
- **Sample Course**: A controlled course directory structure used for testing with known content and expected results
- **Test Fixture**: Reusable test data including course directories, markdown files, assets, and expected output structures
- **Output Validator**: Component that checks generated output against schemas, expected formats, and quality criteria
- **Performance Baseline**: Recorded metrics (time, memory, file size) used to detect performance regressions
- **Test Report**: Summary of test execution results showing passed, failed, and skipped tests with diagnostic details
- **CI Configuration**: Automation setup for running tests in continuous integration with environment specifications

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Developers can run the complete test suite and receive results within 5 minutes
- **SC-002**: Test suite achieves 80% coverage of critical path scenarios (core CLI commands with standard inputs)
- **SC-003**: All CLI tools pass end-to-end tests for small (10 files), medium (100 files), and large (1000 files) sample courses
- **SC-004**: Test failure messages enable developers to identify and locate the problem within 2 minutes
- **SC-005**: Zero previously identified bugs reoccur after regression tests are in place
- **SC-006**: Test suite runs successfully in CI environment with automated pass/fail reporting
- **SC-007**: 95% of common error scenarios (missing files, malformed content, invalid input) have explicit test coverage
- **SC-008**: New CLI features cannot be merged without corresponding tests (enforced via review process)
- **SC-009**: Test code readability scores "highly readable" in team reviews (subjective but tracked)
- **SC-010**: Course generation performance baselines are established with alerts triggered for 10%+ degradation

## Assumptions

1. **Testing Framework**: Assuming Deno's built-in test framework is preferred given the project uses Deno runtime
2. **Sample Courses**: Assuming test fixtures can be created as sample course directories included in the repository
3. **Schema Definitions**: Assuming JSON schemas for output formats can be created or already exist for validation
4. **CI Environment**: Assuming GitHub Actions or similar CI is available for automated test execution
5. **Performance Targets**: Assuming current generation performance is acceptable and baselines will be established from current state
6. **Test Organization**: Assuming tests will be organized by user scenario (critical paths, edge cases, regression) per constitution principles
7. **Breaking Changes**: Assuming breaking API changes in CLI tools are acceptable if properly tested and documented
8. **Resource Availability**: Assuming test course assets (sample images, videos, PDFs) can be small files or mocks to keep repository size manageable

## Scope Boundaries

### In Scope
- Unit tests for core library functions (tutors-gen-lib)
- Integration tests for CLI tools (tutors, tutors-lite, tutors-publish-npm)
- End-to-end tests for complete course generation workflows
- Output validation (JSON structure, HTML validity, asset integrity)
- Error handling and edge case coverage
- Performance baseline establishment and regression detection
- Test documentation and examples
- CI integration for automated testing

### Out of Scope
- Testing of the web reader/frontend components (separate from CLI)
- Load testing with thousands of concurrent executions
- Security penetration testing
- Browser compatibility testing for generated HTML (assumes modern browsers)
- Testing of third-party dependencies (Deno libraries, Netlify platform)
- Automated visual regression testing of HTML output appearance
- Internationalization and localization testing
- Accessibility testing of generated content (WCAG compliance)
- Migration tools for legacy course formats (unless specifically needed for testing)

## Dependencies

- Access to the tutors-apps repository and CLI source code
- Deno runtime environment for test execution
- Sample course content for creating test fixtures
- JSON schema definitions for validating output formats
- CI/CD environment configuration access
- Documentation of current CLI tool behavior and expected outputs

## Risks and Mitigation

### Risk: Test suite becomes too complex or clever
**Mitigation**: Follow constitution principle II - prioritize readable tests over clever tests. Enforce in code reviews.

### Risk: Tests become brittle with output format changes
**Mitigation**: Use schema validation and focus on essential structure rather than exact string matching. Version test fixtures alongside code.

### Risk: Long test execution times discourage running tests
**Mitigation**: Organize tests by speed; run fast unit tests frequently, slower integration tests before commits, full E2E suite in CI.

### Risk: Insufficient sample courses for comprehensive testing
**Mitigation**: Start with minimal samples covering key scenarios, expand coverage incrementally based on real user issues.

### Risk: Test maintenance burden as codebase evolves
**Mitigation**: Keep tests simple and focused. Remove obsolete tests. Co-locate tests with code when possible.
