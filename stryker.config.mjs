/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  packageManager: 'npm',
  reporters: ['html', 'clear-text', 'progress'],
  testRunner: 'vitest',
  coverageAnalysis: 'perTest',

  // Target service layer for mutation testing
  mutate: [
    'src/lib/services/**/*.ts',
    '!src/lib/services/**/*.test.ts',
    '!src/lib/services/**/types.ts',
    '!src/lib/services/**/__tests__/**'
  ],

  // Quality thresholds
  thresholds: {
    high: 80,    // Excellent test quality
    low: 60,     // Acceptable minimum
    break: 50    // CI fails below this
  },

  // Incremental mode for faster subsequent runs
  incremental: true,
  incrementalFile: '.stryker-tmp/incremental.json',

  // Concurrency settings
  maxConcurrentTestRunners: 4,

  // Timeout configuration
  timeoutMS: 60000,
  timeoutFactor: 1.5,

  // Vitest configuration
  vitest: {
    configFile: 'vitest.config.ts'
  }
};
