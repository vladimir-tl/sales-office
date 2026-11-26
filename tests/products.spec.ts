import { test, expect } from '@playwright/test'
import { acceptCookies } from './helpers'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { mockFourProducts, mockLoginSuccess, mockNoSales } from './mocks/api'

test('Products: shows 4 products from GET /products', async ({ page }) => {
  const login = new LoginPage(page)
  const dashboard = new DashboardPage(page)
  await acceptCookies(page)
  await mockLoginSuccess(page)
  await mockNoSales(page) // login lands on Sales; a fake token would get 401 from the real API
  await mockFourProducts(page)

  await login.goto()
  await login.login('demo-user', 'secret123')
  await expect(page).toHaveURL(/\/dashboard\/sales$/)
  await dashboard.gotoProducts()

  await expect(page.getByTestId('products-row')).toHaveCount(4)
})
