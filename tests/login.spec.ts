import { test, expect } from '@playwright/test';
import { acceptCookies } from './helpers';
import { LoginPage } from './pages/LoginPage';

test.describe('Login', { tag: '@login' }, () => {
  let login: LoginPage;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
    await acceptCookies(page);
    await login.goto();
    await expect(login.cookieDialog.dialog).toBeHidden();
  });

  test('submitting username and password sends the login request', async ({ page }) => {
    const request = page.waitForRequest(LoginPage.LOGIN_ROUTE);
    await login.login('demo-user', 'secret123');
    expect((await request).method()).toBe('POST');
  });

  // Skipped until the login token is mocked; then it won't need the real backend
  test.skip('logs in with real credentials', async ({ page }) => {
    await login.login(process.env.LOGIN_USER!, process.env.LOGIN_PASS!);

    await expect(page).toHaveURL(/\/dashboard\/sales$/);
  });
});
