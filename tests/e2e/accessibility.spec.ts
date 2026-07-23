import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const COURSE_URL = '/course/reference-course';

test.describe('Accessibility Audit', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(COURSE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('course page has no critical or serious ARIA violations', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const critical = results.violations.filter(v => v.impact === 'critical');
    const serious = results.violations.filter(v => v.impact === 'serious');
    const moderate = results.violations.filter(v => v.impact === 'moderate');
    const minor = results.violations.filter(v => v.impact === 'minor');

    const total = results.violations.length;
    const passed = results.passes.length;
    const score = passed + total > 0 ? Math.round((passed / (passed + total)) * 100) : 100;

    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('       ACCESSIBILITY AUDIT REPORT      ');
    console.log('═══════════════════════════════════════');
    console.log(`  Score:    ${score}% (${passed} passed, ${total} violations)`);
    console.log(`  Critical: ${critical.length}`);
    console.log(`  Serious:  ${serious.length}`);
    console.log(`  Moderate: ${moderate.length}`);
    console.log(`  Minor:    ${minor.length}`);
    console.log('───────────────────────────────────────');

    for (const violation of results.violations) {
      console.log(`  [${violation.impact?.toUpperCase()}] ${violation.id}: ${violation.description}`);
      console.log(`    Help: ${violation.helpUrl}`);
      console.log(`    Affected: ${violation.nodes.length} element(s)`);
      for (const node of violation.nodes.slice(0, 3)) {
        console.log(`      → ${node.target.join(' > ')}`);
      }
      if (violation.nodes.length > 3) {
        console.log(`      ... and ${violation.nodes.length - 3} more`);
      }
      console.log('');
    }

    console.log('═══════════════════════════════════════');

    expect(critical, `${critical.length} critical violation(s) found`).toHaveLength(0);
    expect(serious, `${serious.length} serious violation(s) found`).toHaveLength(0);
  });

  test('course page passes landmark and navigation rules', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['best-practice'])
      .analyze();

    const passed = results.passes.length;
    const total = results.violations.length;

    console.log('');
    console.log('── Best Practice Rules ──');
    console.log(`  Passed: ${passed}, Violations: ${total}`);

    for (const violation of results.violations) {
      console.log(`  [${violation.impact?.toUpperCase()}] ${violation.id}: ${violation.description}`);
    }
  });

  test('dark mode has no additional violations', async ({ page }) => {
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });
    await page.waitForTimeout(500);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const critical = results.violations.filter(v => v.impact === 'critical');
    const serious = results.violations.filter(v => v.impact === 'serious');

    console.log('');
    console.log('── Dark Mode Audit ──');
    console.log(`  Violations: ${results.violations.length} (${critical.length} critical, ${serious.length} serious)`);

    for (const violation of results.violations) {
      console.log(`  [${violation.impact?.toUpperCase()}] ${violation.id}: ${violation.description}`);
    }

    expect(critical, 'Dark mode introduced critical violations').toHaveLength(0);
    expect(serious, 'Dark mode introduced serious violations').toHaveLength(0);
  });
});
