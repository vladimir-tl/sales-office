import { test, expect } from '@playwright/test'
import { acceptCookies, signIn } from './helpers'
import { DashboardPage } from './pages/DashboardPage'
import { mockFourProducts } from './mocks/api'

test('Products: shows 4 products from GET /products', async ({ page }) => {
  const dashboard = new DashboardPage(page)
  await acceptCookies(page)
  await signIn(page)
  await mockFourProducts(page)
  await dashboard.gotoProducts()

  await expect(page.getByTestId('products-row')).toHaveCount(4)
})
