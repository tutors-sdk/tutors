/**
 * Performance Tracker Helper
 *
 * Tracks performance metrics and compares against baselines
 * for regression detection.
 *
 * Supports FR-009 (performance tracking) and SC-010 (degradation alerts)
 */

/**
 * Performance metrics structure
 */
export interface PerformanceMetrics {
  /** Generation time in milliseconds */
  generationTimeMs: number;
  /** Memory usage in bytes (if available) */
  memoryUsageBytes?: number;
  /** Output size in bytes */
  outputSizeBytes?: number;
  /** Number of files processed */
  filesProcessed?: number;
}

/**
 * Performance baseline structure
 */
export interface PerformanceBaseline {
  /** Test scenario ID */
  testId: string;
  /** CLI tool being tested */
  cliTool: string;
  /** Input fixture size */
  inputSize: "minimal" | "standard" | "large";
  /** Baseline metrics */
  metrics: PerformanceMetrics;
  /** When baseline was recorded */
  recordedAt: string;
  /** Environment information */
  environment: {
    os: string;
    denoVersion: string;
  };
}

/**
 * Comparison result structure
 */
export interface ComparisonResult {
  /** Whether performance is within acceptable range */
  withinRange: boolean;
  /** Percentage change (positive = slower, negative = faster) */
  changePercent: number;
  /** Human-readable message */
  message: string;
  /** Current metrics */
  current: PerformanceMetrics;
  /** Baseline metrics */
  baseline: PerformanceMetrics;
}

/**
 * Default baselines file path
 */
const BASELINES_PATH = "./baselines/performance_metrics.json";

/**
 * Maximum acceptable degradation percentage
 */
const MAX_DEGRADATION_PERCENT = 10;

/**
 * Load baselines from file
 *
 * @param path - Path to baselines file (defaults to BASELINES_PATH)
 * @returns Array of performance baselines
 */
export async function loadBaselines(path: string = BASELINES_PATH): Promise<PerformanceBaseline[]> {
  try {
    const content = await Deno.readTextFile(path);
    const data = JSON.parse(content);
    return data.baselines || [];
  } catch {
    // File doesn't exist or is invalid - return empty array
    return [];
  }
}

/**
 * Acquire a lock file to prevent concurrent writes
 */
async function acquireLock(lockPath: string, maxRetries = 50): Promise<boolean> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      // Try to create lock file exclusively
      await Deno.writeTextFile(lockPath, Date.now().toString(), { createNew: true });
      return true;
    } catch {
      // Lock exists, wait a bit and retry
      await new Promise((resolve) => setTimeout(resolve, 100 + Math.random() * 100));
    }
  }
  return false;
}

/**
 * Release a lock file
 */
async function releaseLock(lockPath: string): Promise<void> {
  try {
    await Deno.remove(lockPath);
  } catch {
    // Lock file already removed or doesn't exist
  }
}

/**
 * Save baselines to file with file locking to prevent race conditions
 *
 * @param baselines - Array of baselines to save
 * @param path - Path to baselines file (defaults to BASELINES_PATH)
 */
export async function saveBaselines(baselines: PerformanceBaseline[], path: string = BASELINES_PATH): Promise<void> {
  const lockPath = path + ".lock";

  // Acquire lock
  const locked = await acquireLock(lockPath);
  if (!locked) {
    console.warn("  ⚠️  Could not acquire lock for baseline file, skipping save");
    return;
  }

  try {
    const data = {
      baselines,
      lastUpdated: new Date().toISOString(),
    };

    // Ensure directory exists
    const dir = path.substring(0, path.lastIndexOf("/"));
    try {
      await Deno.mkdir(dir, { recursive: true });
    } catch {
      // Directory already exists or can't be created
    }

    await Deno.writeTextFile(path, JSON.stringify(data, null, 2));
  } finally {
    // Always release lock
    await releaseLock(lockPath);
  }
}

/**
 * Get baseline for a specific test
 *
 * @param testId - Test scenario ID
 * @param cliTool - CLI tool name
 * @param inputSize - Input fixture size
 * @param path - Path to baselines file
 * @returns Baseline or null if not found
 */
export async function getBaseline(
  testId: string,
  cliTool: string,
  inputSize: "minimal" | "standard" | "large",
  path: string = BASELINES_PATH,
): Promise<PerformanceBaseline | null> {
  const baselines = await loadBaselines(path);
  return baselines.find((b) => b.testId === testId && b.cliTool === cliTool && b.inputSize === inputSize) || null;
}

/**
 * Record a new baseline
 *
 * @param baseline - Baseline to record
 * @param path - Path to baselines file
 */
export async function recordBaseline(baseline: PerformanceBaseline, path: string = BASELINES_PATH): Promise<void> {
  const baselines = await loadBaselines(path);

  // Remove existing baseline for same test/tool/size if it exists
  const filtered = baselines.filter(
    (b) => !(b.testId === baseline.testId && b.cliTool === baseline.cliTool && b.inputSize === baseline.inputSize),
  );

  // Add new baseline
  filtered.push(baseline);

  await saveBaselines(filtered, path);
}

/**
 * Compare current metrics to baseline
 *
 * @param testId - Test scenario ID
 * @param cliTool - CLI tool name
 * @param inputSize - Input fixture size
 * @param currentMetrics - Current performance metrics
 * @param maxDegradation - Maximum acceptable degradation percentage (default: 10)
 * @param path - Path to baselines file
 * @returns Comparison result
 */
export async function compareToBaseline(
  testId: string,
  cliTool: string,
  inputSize: "minimal" | "standard" | "large",
  currentMetrics: PerformanceMetrics,
  maxDegradation: number = MAX_DEGRADATION_PERCENT,
  path: string = BASELINES_PATH,
): Promise<ComparisonResult> {
  const baseline = await getBaseline(testId, cliTool, inputSize, path);

  if (!baseline) {
    return {
      withinRange: true,
      changePercent: 0,
      message: "No baseline found - this is the first run",
      current: currentMetrics,
      baseline: currentMetrics,
    };
  }

  // Calculate percentage change in generation time
  const baselineTime = baseline.metrics.generationTimeMs;
  const currentTime = currentMetrics.generationTimeMs;
  const changePercent = ((currentTime - baselineTime) / baselineTime) * 100;

  const withinRange = changePercent <= maxDegradation;

  let message: string;
  if (withinRange) {
    if (changePercent > 0) {
      message = `Performance within range: ${changePercent.toFixed(1)}% slower than baseline`;
    } else {
      message = `Performance improved: ${Math.abs(changePercent).toFixed(1)}% faster than baseline`;
    }
  } else {
    message = `⚠️ Performance degradation: ${changePercent.toFixed(1)}% slower than baseline (max: ${maxDegradation}%)`;
  }

  return {
    withinRange,
    changePercent,
    message,
    current: currentMetrics,
    baseline: baseline.metrics,
  };
}

/**
 * Create a baseline from current metrics
 *
 * @param testId - Test scenario ID
 * @param cliTool - CLI tool name
 * @param inputSize - Input fixture size
 * @param metrics - Performance metrics to record
 * @returns Performance baseline
 */
export function createBaseline(
  testId: string,
  cliTool: string,
  inputSize: "minimal" | "standard" | "large",
  metrics: PerformanceMetrics,
): PerformanceBaseline {
  return {
    testId,
    cliTool,
    inputSize,
    metrics,
    recordedAt: new Date().toISOString(),
    environment: {
      os: Deno.build.os,
      denoVersion: Deno.version.deno,
    },
  };
}

/**
 * Measure execution time of an async function
 *
 * @param fn - Function to measure
 * @returns Tuple of [result, duration in milliseconds]
 */
export async function measureTime<T>(fn: () => Promise<T>): Promise<[T, number]> {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  return [result, duration];
}

/**
 * Get current memory usage (if available)
 *
 * @returns Memory usage in bytes, or undefined if not available
 */
export function getMemoryUsage(): number | undefined {
  if (Deno.memoryUsage) {
    return Deno.memoryUsage().heapUsed;
  }
  return undefined;
}

/**
 * Get directory size in bytes (recursive)
 *
 * @param dirPath - Path to directory
 * @returns Total size in bytes
 */
export async function getDirectorySize(dirPath: string): Promise<number> {
  let totalSize = 0;

  async function traverse(path: string): Promise<void> {
    try {
      for await (const entry of Deno.readDir(path)) {
        const fullPath = `${path}/${entry.name}`;
        if (entry.isFile) {
          const stat = await Deno.stat(fullPath);
          totalSize += stat.size;
        } else if (entry.isDirectory) {
          await traverse(fullPath);
        }
      }
    } catch {
      // Ignore errors
    }
  }

  await traverse(dirPath);
  return totalSize;
}
