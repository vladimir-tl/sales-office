import { test, expect } from '@playwright/test'
import { acceptCookies, signIn } from './helpers'
import { DashboardPage } from './pages/DashboardPage'
import { mockThreeSales } from './mocks/api'

test('Sales: shows 3 sales from GET /sales', async ({ page }) => {
  const dashboard = new DashboardPage(page)
  await acceptCookies(page)
  await signIn(page)
  await mockThreeSales(page)
  await dashboard.gotoSales()

  await expect(page.getByTestId('sales-row')).toHaveCount(3)
})
