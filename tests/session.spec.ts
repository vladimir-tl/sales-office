import { test, expect } from '@playwright/test';
import { acceptCookies, signIn } from './helpers';
import { DashboardPage } from './pages/DashboardPage';
import { mockNoSales } from './mocks/api';

/**
 * The session dialog appears after 30 s of inactivity.
 * page.clock fakes timers, so the tests don't actually wait 30 seconds.
 */
test.describe('Session expiry dialog', () => {
  let dashboard: DashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboard = new DashboardPage(page);
    await acceptCookies(page);
    await mockNoSales(page); // answer right away
    await signIn(page);
    await page.clock.install(); // before the dashboard reloads, so its setTimeout is faked
    await dashboard.gotoSales();
    await expect(dashboard.root).toBeVisible();
  });

  test('appears after 30 seconds of inactivity', async () => {
    await dashboard.page.clock.runFor('00:29');
    await expect(dashboard.sessionDialog.dialog).toBeHidden();

    await dashboard.page.clock.runFor('00:02');
    await expect(dashboard.sessionDialog.dialog).toBeVisible();
  });

  test('user activity restarts the countdown', async ({ page }) => {
    await page.clock.runFor('00:20');
    await page.mouse.move(200, 200); // any activity resets the 30 s timer

    await page.clock.runFor('00:20'); // 40 s since load, but only 20 s since activity
    await expect(dashboard.sessionDialog.dialog).toBeHidden();

    await page.clock.runFor('00:10');
    await expect(dashboard.sessionDialog.dialog).toBeVisible();
  });

  test('"Yes" closes the dialog and it comes back after another 30 seconds', async ({ page }) => {
    await page.clock.runFor('00:30');
    await dashboard.sessionDialog.yes.click();
    await expect(dashboard.sessionDialog.dialog).toBeHidden();

    await page.clock.runFor('00:30');
    await expect(dashboard.sessionDialog.dialog).toBeVisible();
  });

  test('"No" logs the user out', async ({ page }) => {
    await page.clock.runFor('00:30');
    await dashboard.sessionDialog.no.click();

    await expect(page).toHaveURL('/');
  });
});
