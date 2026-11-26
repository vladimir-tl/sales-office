import type { Page } from '@playwright/test'
import { CONSENT_KEY, CONSENT_VERSION } from '../src/lib/consent'

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
  }
  // Runs in the page before its own scripts, so no URL/domain is needed:
  // the cookie lands on whatever origin the test opens
  const cookie = `${CONSENT_KEY}=${encodeURIComponent(JSON.stringify(consent))}; Path=/; SameSite=Lax`
  await page.addInitScript((value) => {
    document.cookie = value
  }, cookie)
}

/**
 * Pseudo JWT for mocks: `header.payload.signature` in base64url.
 * The app only decodes the payload (`sub` → sidebar name, `exp` → expiry)
 * and never checks the signature, so a fake one is enough.
 * `expiresInSec` counts from now; pass a negative value for an expired token.
 */
export function fakeJwt({ sub = 'demo-user', expiresInSec = 60 * 60 } = {}) {
  const encode = (data: object) => Buffer.from(JSON.stringify(data)).toString('base64url')
  const now = Math.floor(Date.now() / 1000)
  const header = encode({ alg: 'HS256', typ: 'JWT' })
  const payload = encode({ sub, iat: now, exp: now + expiresInSec })
  return `${header}.${payload}.fake-signature`
}
