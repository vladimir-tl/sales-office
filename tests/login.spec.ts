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

  // Client-side validation: the form shows an error and never calls the backend
  for (const { name, username, password } of [
    { name: 'both fields empty', username: '', password: '' },
    { name: 'password empty', username: 'demo-user', password: '' },
    { name: 'username empty', username: '', password: 'secret123' },
  ]) {
    test(`shows an error and sends no request when ${name}`, async ({ page }) => {
      let requested = false;
      await page.route(LoginPage.LOGIN_ROUTE, (route) => {
        requested = true;
        return route.abort();
      });

      await login.login(username, password);

      await expect(login.error).toBeVisible();
      expect(requested).toBe(false);
    });
  }

  // Skipped until the login token is mocked; then it won't need the real backend
  test.skip('logs in with real credentials', async ({ page }) => {
    await login.login(process.env.LOGIN_USER!, process.env.LOGIN_PASS!);

    await expect(page).toHaveURL(/\/dashboard\/sales$/);
  });
});
