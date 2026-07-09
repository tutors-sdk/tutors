import { test, expect } from '@playwright/test';

test.describe('Anonymous Course Browsing', () => {
  test('WHEN an anonymous user navigates to a public course THEN they can view the course content', async ({ page }) => {
    // This is a placeholder E2E test that demonstrates the structure
    // Real tests would navigate to actual course URLs

    // Skip this test for now since we don't have a running dev server with test data
    test.skip(true, 'Requires running dev server with test course data');

    // Navigate to course
    await page.goto('/course/test-course');

    // Wait for course to load
    await expect(page.locator('h1')).toBeVisible();

    // Verify course title is displayed
    const title = await page.locator('h1').textContent();
    expect(title).toBeTruthy();

    // Verify course navigation is present
    await expect(page.locator('[data-testid="course-nav"]')).toBeVisible();
  });

  test('WHEN a course fails to load THEN an error message is displayed', async ({ page }) => {
    test.skip(true, 'Requires running dev server');

    // Navigate to non-existent course
    await page.goto('/course/non-existent-course');

    // Wait for error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();

    // Verify error text
    const errorText = await page.locator('[data-testid="error-message"]').textContent();
    expect(errorText).toContain('error');
  });

  test('WHEN navigating between course topics THEN the URL updates correctly', async ({ page }) => {
    test.skip(true, 'Requires running dev server with test course data');

    await page.goto('/course/test-course');

    // Click on first topic
    await page.locator('[data-testid="topic-link"]').first().click();

    // Verify URL changed
    await expect(page).toHaveURL(/\/topic\//);

    // Verify topic content is loaded
    await expect(page.locator('[data-testid="topic-content"]')).toBeVisible();
  });
});

test.describe('Course Navigation', () => {
  test('WHEN clicking breadcrumb links THEN navigation works correctly', async ({ page }) => {
    test.skip(true, 'Requires running dev server with test course data');

    await page.goto('/topic/test-course/intro');

    // Click course breadcrumb
    await page.locator('[data-testid="breadcrumb-course"]').click();

    // Should navigate back to course home
    await expect(page).toHaveURL(/\/course\/test-course$/);
  });

  test('WHEN accessing a deep link THEN the course loads correctly', async ({ page }) => {
    test.skip(true, 'Requires running dev server with test course data');

    // Direct navigation to topic
    await page.goto('/topic/test-course/advanced/databases');

    // Verify topic content loads
    await expect(page.locator('h1')).toBeVisible();

    // Verify breadcrumbs show full path
    const breadcrumbs = page.locator('[data-testid="breadcrumbs"]');
    await expect(breadcrumbs).toContainText('Course');
    await expect(breadcrumbs).toContainText('Advanced');
    await expect(breadcrumbs).toContainText('Databases');
  });
});
