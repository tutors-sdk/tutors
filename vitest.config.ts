import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
  plugins: [svelte({ hot: !process.env.VITEST })],

  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts'],

    include: [
      'src/**/__tests__/**/*.test.ts',
      'tests/**/*.test.ts'
    ],

    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.svelte-kit/**'
    ],

    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],

      include: ['src/lib/**/*.{ts,svelte}'],

      exclude: [
        'src/lib/**/*.test.ts',
        'src/lib/**/types.ts',
        'src/lib/**/__tests__/**'
      ],

      thresholds: {
        lines: 60,
        functions: 60,
        branches: 55,
        statements: 60
      }
    },

    // Parallel execution
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false
      }
    },

    // Test timeout
    testTimeout: 10000,
    hookTimeout: 10000
  },

  resolve: {
    alias: {
      '$lib': path.resolve('./src/lib'),
      '$app': path.resolve('./node_modules/@sveltejs/kit/src/runtime/app'),
      '$env/static/public': path.resolve('./tests/mocks/env-static-public.ts')
    }
  }
});
