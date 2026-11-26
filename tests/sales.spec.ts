import { test, expect } from '@playwright/test'
import { acceptCookies } from './helpers'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { mockLoginSuccess, mockThreeSales } from './mocks/api'

test('Sales: shows 3 sales from GET /sales', async ({ page }) => {
  const login = new LoginPage(page)
  const dashboard = new DashboardPage(page)
  await acceptCookies(page)
  await mockLoginSuccess(page)
  await mockThreeSales(page)

  await login.goto()
  await login.login('demo-user', 'secret123')
  await expect(page).toHaveURL(/\/dashboard\/sales$/)
  await dashboard.gotoSales()

  await expect(page.getByTestId('sales-row')).toHaveCount(3)
})
