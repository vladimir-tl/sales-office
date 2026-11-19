import { test, expect } from '@playwright/test';
import { acceptCookies, signIn } from './helpers';
import { DashboardPage } from './pages/DashboardPage';
import { mockThreeSales } from './mocks/api';

test('Sales: shows 3 sales from GET /sales', async ({ page }) => {
  const dashboard = new DashboardPage(page);
  await acceptCookies(page);
  await signIn(page);
  await mockThreeSales(page);
  await dashboard.gotoSales();

  await expect(page.getByTestId('sales-row')).toHaveCount(3);
  await expect(page.getByTestId('sales-count')).toHaveText('3 records');
  await expect(page.getByTestId('sales-cell-id')).toHaveText(['S-1042', 'S-1043', 'S-1044']);
  await expect(page.getByTestId('sales-cell-customer')).toHaveText(['Northwind Ltd', 'Baltic Trade Co.', 'Green Leaf Studio']);
  await expect(page.getByTestId('sales-cell-amount')).toHaveText(['€4,200.00', '€12,800.00', '€980.00']);
  await expect(page.getByTestId('sales-cell-status')).toHaveText(['paid', 'pending', 'cancelled']);
});
