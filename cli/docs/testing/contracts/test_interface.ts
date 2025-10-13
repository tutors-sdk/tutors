/**
 * Test Strategy Contracts
 *
 * Defines TypeScript interfaces for the test system components.
 * These are NOT implementation files - they define the contract/API
 * that implementations must follow.
 *
 * Aligns with: FR-010, FR-014 (KISS principles), Constitution Principle III (Clear Intention)
 */

// ============================================================================
// Core Test Entities
// ============================================================================

/**
 * Priority levels for test scenarios
 */
export type Priority = "P1" | "P2" | "P3" | "P4";

/**
 * Test category based on user scenarios
 */
export type TestCategory = "critical_paths" | "edge_cases" | "regression" | "integration";

/**
 * CLI tools under test
 */
export type CLITool = "tutors" | "tutors-lite" | "tutors-publish-npm" | "tutors-gen-lib";

/**
 * Test execution status
 */
export type TestStatus = "pending" | "running" | "passed" | "failed" | "skipped" | "error";

/**
 * Sample course fixture sizes
 */
export type FixtureSize = "minimal" | "standard" | "large";

/**
 * Error types for intentionally broken fixtures
 */
export type FixtureErrorType =
  | "empty_dir"
  | "malformed_markdown"
  | "missing_assets"
  | "special_chars"
  | "circular_refs"
  | null;

// ============================================================================
// Test Scenario Interface
// ============================================================================

/**
 * Single assertion within a test
 */
export interface Assertion {
  /** Type of assertion to perform */
  type: "exitCode" | "fileExists" | "schemaValid" | "contentMatches" | "performance";
  /** Expected value or condition */
  value?: unknown;
  /** Path to file/schema for validation */
  path?: string;
  /** Custom error message if assertion fails */
  message?: string;
}

/**
 * Expected output definition
 */
export interface ExpectedOutput {
  /** Output type */
  type: "json" | "html" | "netlify_config" | "error_message";
  /** Where output should be generated */
  location: string;
  /** Optional schema path for validation */
  schemaPath?: string;
}

/**
 * Complete test scenario definition
 * Represents a single test case from spec.md user scenarios
 */
export interface TestScenario {
  /** Unique identifier (e.g., "critical-001") */
  id: string;
  /** Human-readable name in plain English (Constitution Principle II) */
  name: string;
  /** Which user scenario category this belongs to */
  category: TestCategory;
  /** Priority level from spec */
  priority: Priority;
  /** Which CLI tool is being tested */
  cliTool: CLITool;
  /** Path to sample course directory */
  inputFixture: string;
  /** Expected output definition */
  expectedOutput: ExpectedOutput;
  /** List of assertions to verify */
  assertions: Assertion[];
  /** Maximum execution time in milliseconds (default: 10000) */
  timeout: number;
  /** Deno permissions required */
  permissions: string[];
  /** Optional description for documentation */
  description?: string;
}

// ============================================================================
// Sample Course (Fixture) Interface
// ============================================================================

/**
 * Course structure element
 */
export interface CourseElement {
  /** Element type */
  type: "course" | "topic" | "lab" | "unit";
  /** Element title */
  title: string;
  /** Order/position */
  order?: number;
  /** Child elements */
  children?: CourseElement[];
  /** Number of steps (for labs) */
  steps?: number;
}

/**
 * Asset included in course
 */
export interface Asset {
  /** Asset type */
  type: "image" | "video" | "pdf" | "other";
  /** Relative path within course */
  path: string;
  /** File size in bytes */
  size: number;
}

/**
 * Sample course fixture for testing
 * Must use realistic, obvious content per Constitution Testing Standards
 */
export interface SampleCourse {
  /** Fixture identifier */
  name: string;
  /** Absolute path to fixture directory */
  path: string;
  /** What this fixture represents */
  description: string;
  /** Fixture complexity level */
  size: FixtureSize;
  /** Course structure */
  structure: CourseElement;
  /** Assets included */
  assets: Asset[];
  /** Whether this fixture intentionally contains errors */
  hasErrors: boolean;
  /** Type of error (if hasErrors is true) */
  errorType: FixtureErrorType;
}

// ============================================================================
// Validation Interfaces
// ============================================================================

/**
 * Validator types
 */
export type ValidatorType = "schema" | "structure" | "content" | "performance" | "link";

/**
 * Validation configuration (validator-specific)
 */
export interface ValidationConfig {
  /** Schema path for schema validators */
  schemaPath?: string;
  /** Strict mode flag */
  strictMode?: boolean;
  /** Required HTML elements */
  requiredElements?: string[];
  /** Forbidden HTML elements */
  forbiddenElements?: string[];
  /** Check links flag */
  checkLinks?: boolean;
  /** Check images flag */
  checkImages?: boolean;
  /** Baseline path for performance validators */
  baselinePath?: string;
  /** Maximum degradation percentage */
  maxDegradationPercent?: number;
  /** Metrics to track */
  metrics?: string[];
}

/**
 * Output validator component
 * Performs specific validation checks on generated output
 */
export interface OutputValidator {
  /** Validator identifier */
  name: string;
  /** Validator type */
  type: ValidatorType;
  /** Validation function to execute */
  validationFunction: string;
  /** Validator-specific configuration */
  config: ValidationConfig;
}

// ============================================================================
// Performance Tracking Interfaces
// ============================================================================

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  /** Generation time in milliseconds */
  generationTimeMs: number;
  /** Memory usage in bytes */
  memoryUsageBytes: number;
  /** Output size in bytes */
  outputSizeBytes: number;
  /** Number of files processed */
  filesProcessed: number;
  /** Number of assets processed */
  assetsProcessed: number;
}

/**
 * Test environment details
 */
export interface Environment {
  /** Operating system */
  os: string;
  /** Deno version */
  denoVersion: string;
  /** CPU architecture */
  cpu?: string;
  /** Number of CPU cores */
  cores?: number;
}

/**
 * Performance baseline for regression detection
 * Supports FR-009 (performance tracking) and SC-010 (degradation alerts)
 */
export interface PerformanceBaseline {
  /** Test scenario ID this baseline applies to */
  testId: string;
  /** CLI tool measured */
  cliTool: string;
  /** Input fixture size */
  inputSize: FixtureSize;
  /** Measured metrics */
  metrics: PerformanceMetrics;
  /** When baseline was established */
  recordedAt: Date;
  /** System environment details */
  environment: Environment;
}

// ============================================================================
// Test Result Interfaces
// ============================================================================

/**
 * Result of a single assertion
 */
export interface AssertionResult {
  /** Assertion description */
  assertion: string;
  /** Whether assertion passed */
  passed: boolean;
  /** Additional details (especially for failures) */
  details?: string;
  /** Expected value */
  expected?: unknown;
  /** Actual value */
  actual?: unknown;
}

/**
 * Generated artifact from test
 */
export interface Artifact {
  /** Artifact type */
  type: "json" | "html" | "log" | "other";
  /** Absolute path to artifact */
  path: string;
  /** Artifact size in bytes */
  size: number;
}

/**
 * Result of test execution
 * Supports FR-020 (clear failure identification)
 */
export interface TestResult {
  /** Test scenario ID */
  testId: string;
  /** Test execution status */
  status: TestStatus;
  /** Execution time in milliseconds */
  executionTimeMs: number;
  /** CLI tool exit code */
  exitCode: number;
  /** Standard output */
  stdout: string;
  /** Standard error */
  stderr: string;
  /** Results of all assertions */
  assertionResults: AssertionResult[];
  /** Failure reason with file paths (if failed) */
  failureReason: string | null;
  /** Generated artifacts */
  artifacts: Artifact[];
  /** When test ran */
  timestamp: Date;
}

// ============================================================================
// Test Reporting Interfaces
// ============================================================================

/**
 * Test coverage metrics
 */
export interface Coverage {
  /** Critical path scenario coverage percentage */
  criticalPathScenarios: string;
  /** Edge case coverage percentage */
  edgeCases: string;
  /** Overall coverage percentage */
  totalPercentage: string;
}

/**
 * Test run report
 * Supports FR-011 (CI reporting), SC-001 (5-minute execution), SC-002 (80% coverage)
 */
export interface TestReport {
  /** Unique run identifier */
  runId: string;
  /** Run start time */
  startTime: Date;
  /** Run end time */
  endTime: Date;
  /** Total scenarios executed */
  totalTests: number;
  /** Number passed */
  passed: number;
  /** Number failed */
  failed: number;
  /** Number skipped */
  skipped: number;
  /** Coverage metrics */
  coverage: Coverage;
  /** Individual test results */
  results: TestResult[];
  /** Human-readable summary */
  summary: string;
}

// ============================================================================
// Test Execution Interface
// ============================================================================

/**
 * Options for test execution
 */
export interface TestExecutionOptions {
  /** Filter tests by pattern */
  filter?: string;
  /** Run tests in parallel */
  parallel?: boolean;
  /** Fail fast on first failure */
  failFast?: boolean;
  /** Enable coverage collection */
  coverage?: boolean;
  /** Output format */
  reporter?: "default" | "junit" | "json";
  /** Timeout for entire suite in milliseconds */
  suiteTimeout?: number;
}

/**
 * Test runner interface
 * Executes test scenarios and produces reports
 */
export interface TestRunner {
  /**
   * Run a single test scenario
   * @param scenario Test scenario to execute
   * @returns Test result
   */
  runTest(scenario: TestScenario): Promise<TestResult>;

  /**
   * Run multiple test scenarios
   * @param scenarios Array of scenarios to execute
   * @param options Execution options
   * @returns Test report
   */
  runTests(scenarios: TestScenario[], options?: TestExecutionOptions): Promise<TestReport>;

  /**
   * Validate test output against schema
   * @param outputPath Path to generated output
   * @param validator Validator to use
   * @returns Validation result
   */
  validateOutput(outputPath: string, validator: OutputValidator): Promise<boolean>;
}

// ============================================================================
// Fixture Management Interface
// ============================================================================

/**
 * Fixture builder interface
 * Creates and manages test fixtures
 * Only implements helpers after Rule of Three (Constitution Principle IV)
 */
export interface FixtureBuilder {
  /**
   * Create a sample course fixture
   * @param config Course configuration
   * @returns Created sample course
   */
  createCourse(config: Partial<SampleCourse>): Promise<SampleCourse>;

  /**
   * Load existing fixture
   * @param name Fixture name
   * @returns Sample course
   */
  loadFixture(name: string): Promise<SampleCourse>;

  /**
   * Clean up temporary fixtures
   * @param path Fixture path to remove
   */
  cleanupFixture(path: string): Promise<void>;
}

// ============================================================================
// Performance Tracking Interface
// ============================================================================

/**
 * Performance tracker interface
 * Manages baselines and detects regressions
 * Supports FR-009 and SC-010
 */
export interface PerformanceTracker {
  /**
   * Record a new baseline
   * @param baseline Baseline to record
   */
  recordBaseline(baseline: PerformanceBaseline): Promise<void>;

  /**
   * Get baseline for comparison
   * @param testId Test scenario ID
   * @param cliTool CLI tool
   * @param inputSize Fixture size
   * @returns Baseline or null if not found
   */
  getBaseline(testId: string, cliTool: string, inputSize: FixtureSize): Promise<PerformanceBaseline | null>;

  /**
   * Compare current metrics to baseline
   * @param testId Test scenario ID
   * @param currentMetrics Current measured metrics
   * @returns True if within acceptable range, false if degraded
   */
  compareToBaseline(testId: string, currentMetrics: PerformanceMetrics): Promise<{
    withinRange: boolean;
    degradationPercent: number;
    message: string;
  }>;

  /**
   * Load all baselines from file
   * @returns Array of baselines
   */
  loadBaselines(): Promise<PerformanceBaseline[]>;

  /**
   * Save all baselines to file
   * @param baselines Array of baselines to save
   */
  saveBaselines(baselines: PerformanceBaseline[]): Promise<void>;
}

// ============================================================================
// CLI Execution Interface
// ============================================================================

/**
 * CLI execution result
 */
export interface CLIExecutionResult {
  /** Exit code */
  exitCode: number;
  /** Standard output */
  stdout: string;
  /** Standard error */
  stderr: string;
  /** Execution time in milliseconds */
  durationMs: number;
}

/**
 * CLI executor interface
 * Runs Tutors CLI tools for testing
 */
export interface CLIExecutor {
  /**
   * Execute a CLI tool
   * @param tool CLI tool to run
   * @param inputPath Path to course directory
   * @param outputPath Path for output
   * @param permissions Deno permissions
   * @param timeout Execution timeout in milliseconds
   * @returns Execution result
   */
  execute(
    tool: CLITool,
    inputPath: string,
    outputPath: string,
    permissions: string[],
    timeout: number
  ): Promise<CLIExecutionResult>;
}

// ============================================================================
// Export All Interfaces
// ============================================================================

export type {
  // Core types
  Priority,
  TestCategory,
  CLITool,
  TestStatus,
  FixtureSize,
  FixtureErrorType,
  ValidatorType,

  // Primary interfaces
  TestScenario,
  SampleCourse,
  OutputValidator,
  PerformanceBaseline,
  TestResult,
  TestReport,

  // Supporting interfaces
  Assertion,
  ExpectedOutput,
  CourseElement,
  Asset,
  ValidationConfig,
  PerformanceMetrics,
  Environment,
  AssertionResult,
  Artifact,
  Coverage,
  TestExecutionOptions,
  CLIExecutionResult,

  // Component interfaces
  TestRunner,
  FixtureBuilder,
  PerformanceTracker,
  CLIExecutor
};
