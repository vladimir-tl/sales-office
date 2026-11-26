import { test, expect } from '@playwright/test'
import { imitateAcceptedCookie } from './helpers'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { mockFourProducts, mockLoginSuccess, mockNoSales } from './mocks/api'

test.describe('Products', { tag: '@products' }, () => {
  let login: LoginPage
  let dashboard: DashboardPage

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page)
    dashboard = new DashboardPage(page)
    await imitateAcceptedCookie(page)
    await mockLoginSuccess(page)
    await mockNoSales(page) // login lands on Sales; a fake token would get 401 from the real API
    await mockFourProducts(page)

    await login.goto()
    await login.login('demo-user', 'secret123')
    await expect(page).toHaveURL(/\/dashboard\/sales$/)
  })

  test('shows 4 products from GET /products', async ({ page }) => {
    await dashboard.gotoProducts()

    await expect(page.getByTestId('products-row')).toHaveCount(4)
  })
})
