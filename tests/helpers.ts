import { expect, type Page } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { CONSENT_KEY, CONSENT_VERSION } from '../src/lib/consent';

/**
 * Bypass the cookie dialog: set the `cookie_consent` cookie as if the user
 * had already clicked "Accept all", so the dialog doesn't appear on load.
 * Call it before page.goto().
 */
export async function acceptCookies(page: Page) {
  const consent = {
    version: CONSENT_VERSION,
    necessary: true,
    analytics: true,
    marketing: true,
    updatedAt: new Date().toISOString(),
  };
  // Runs in the page before its own scripts, so no URL/domain is needed:
  // the cookie lands on whatever origin the test opens
  const cookie = `${CONSENT_KEY}=${encodeURIComponent(JSON.stringify(consent))}; Path=/; SameSite=Lax`;
  await page.addInitScript((value) => {
    document.cookie = value;
  }, cookie);
}

/**
 * Real login through the form: POST /api/login/auth → backend /login/student.
 * Credentials come from LOGIN_USER / LOGIN_PASS (.env). Ends on /dashboard/sales.
 */
export async function signIn(page: Page) {
  const username = process.env.LOGIN_USER;
  const password = process.env.LOGIN_PASS;
  if (!username || !password) throw new Error('Set LOGIN_USER and LOGIN_PASS in .env');

  const login = new LoginPage(page);
  await login.goto();
  await login.login(username, password);
  await expect(page).toHaveURL(/\/dashboard\/sales$/);
}
