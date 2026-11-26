import { test as base, expect } from '@playwright/test'
import { acceptCookies } from './helpers'
import { LoginPage } from './pages/LoginPage'

type Fixtures = {
  /** Login page that is already open, with cookies accepted (no cookie dialog) */
  loginPageWithCookies: LoginPage
}

export const test = base.extend<Fixtures>({
  loginPageWithCookies: async ({ page }, use) => {
    const login = new LoginPage(page)
    await acceptCookies(page)
    await login.goto()
    await expect(login.cookieDialog.dialog).toBeHidden()

    await use(login)
  },
})

export { expect }
