import { test, expect } from '@playwright/test'
import { acceptCookies } from './helpers'
import { LoginPage } from './pages/LoginPage'

test('shows the cookie dialog without cookie_consent', async ({ page }) => {
  const login = new LoginPage(page)
  await login.goto()
  await expect(login.cookieDialog.dialog).toBeVisible()
})

test('hides the cookie dialog with cookie_consent and keeps the login form usable', async ({
  page,
}) => {
  const login = new LoginPage(page)
  await acceptCookies(page)
  await login.goto()

  await expect(login.cookieDialog.dialog).toBeHidden()
  await expect(login.form).toBeVisible()
  await login.username.click() // page isn't inert, so the field is clickable
  await expect(login.username).toBeFocused()
})
