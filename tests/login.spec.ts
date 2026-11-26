import { test, expect } from '@playwright/test'
import { acceptCookies } from './helpers'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { mockLoginSuccess, mockNoSales } from './mocks/api'

test.describe('Login', { tag: '@login' }, () => {
  let login: LoginPage

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page)
    await acceptCookies(page)
    await login.goto()
    await expect(login.cookieDialog.dialog).toBeHidden()
  })

  test('submitting username and password sends the login request', async ({ page }) => {
    const request = page.waitForRequest(LoginPage.LOGIN_ROUTE)
    await login.login('demo-user', 'secret123')
    expect((await request).method()).toBe('POST')
  })

  test('shows an error when username and password are empty', async () => {
    await login.submit.click()

    await expect(login.error).toBeVisible()
  })

  // Login and data are mocked, so no real backend or credentials are needed
  test('logs in with a mocked token', async ({ page }) => {
    await mockLoginSuccess(page, 'demo-user')
    await mockNoSales(page) // the dashboard opens on Sales; a fake token would get 401 from the real API
    await login.login('demo-user', 'secret123')

    await expect(new DashboardPage(page).sidebar).toBeVisible()
  })
})
