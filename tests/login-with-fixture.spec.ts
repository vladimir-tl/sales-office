import { test, expect } from './fixtures'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { mockLoginSuccess, mockNoSales } from './mocks/api'

// Same checks as login.spec.ts, but the page is prepared by the `loginPageWithCookies` fixture
test.describe('Login (fixture)', { tag: '@login' }, () => {
  test('submitting username and password sends the login request', async ({
    loginPageWithCookies: login,
  }) => {
    const request = login.page.waitForRequest(LoginPage.LOGIN_ROUTE)
    await login.login('demo-user', 'secret123')
    expect((await request).method()).toBe('POST')
  })

  test('shows an error when username and password are empty', async ({
    loginPageWithCookies: login,
  }) => {
    await login.submit.click()

    await expect(login.error).toBeVisible()
  })

  test('logs in with a mocked token', async ({ loginPageWithCookies: login }) => {
    await mockLoginSuccess(login.page, 'demo-user')
    await mockNoSales(login.page)
    await login.login('demo-user', 'secret123')

    await expect(new DashboardPage(login.page).sidebar).toBeVisible()
  })
})
