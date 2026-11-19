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

  test('shows an error for wrong username or password', async ({ page }) => {
    await page.route(LoginPage.LOGIN_ROUTE, (route) => route.fulfill({ status: 401 }));

    await login.login('demo-user', 'wrong');

    await expect(login.error).toHaveText('Incorrect username or password');
    await expect(page).toHaveURL('/');
  });

  test('does not send a request when fields are empty', async ({ page }) => {
    let called = false;
    await page.route(LoginPage.LOGIN_ROUTE, (route) => {
      called = true;
      return route.abort();
    });

    await login.submit.click();

    await expect(login.error).toHaveText('Enter your username and password');
    await expect(login.username).toBeFocused();
    expect(called).toBe(false);
  });

  test('toggle button shows and hides the password', async () => {
    await login.password.fill('secret123');
    await expect(login.password).toHaveAttribute('type', 'password');

    await login.passwordToggle.click();
    await expect(login.password).toHaveAttribute('type', 'text');

    await login.passwordToggle.click();
    await expect(login.password).toHaveAttribute('type', 'password');
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
