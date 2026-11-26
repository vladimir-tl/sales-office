import { test, expect } from '@playwright/test'
import { imitateAcceptedCookie } from './helpers'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { mockLoginSuccess, mockThreeSales } from './mocks/api'

test.describe('Sales', { tag: '@sales' }, () => {
  let login: LoginPage
  let dashboard: DashboardPage

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page)
    dashboard = new DashboardPage(page)
    await imitateAcceptedCookie(page)
    await mockLoginSuccess(page)
    // Mock sales before logging in: the dashboard opens on Sales right after login
    await mockThreeSales(page)

    await login.goto()
    await login.login('demo-user', 'secret123')
    await expect(page).toHaveURL(/\/dashboard\/sales$/)
  })

  test('shows 3 sales from GET /sales', async ({ page }) => {
    await dashboard.gotoSales()

    await expect(page.getByTestId('sales-row')).toHaveCount(3)
  })
})
