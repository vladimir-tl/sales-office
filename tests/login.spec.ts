import { test, expect } from '@playwright/test';
import { acceptCookies } from './helpers';
import { LoginPage } from './pages/LoginPage';

test.describe('Login', () => {
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


  // Real login against the backend: LOGIN_USER / LOGIN_PASS from .env
  test('logs in with real credentials', async ({ page }) => {
    const user = process.env.LOGIN_USER ?? '';
    const pass = process.env.LOGIN_PASS ?? '';
    test.skip(!user || !pass, 'set LOGIN_USER and LOGIN_PASS');

    await login.login(user, pass);

    await expect(page).toHaveURL(/\/dashboard\/sales$/);
    await expect(page.getByTestId('sidebar-username')).toHaveText(user);
  });
});
