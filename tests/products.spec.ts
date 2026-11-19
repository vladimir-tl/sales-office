import { test, expect } from '@playwright/test';
import { acceptCookies, signIn } from './helpers';
import { DashboardPage } from './pages/DashboardPage';
import { mockFourProducts } from './mocks/api';

test('Products: shows 4 products from GET /products', async ({ page }) => {
  const dashboard = new DashboardPage(page);
  await acceptCookies(page);
  await signIn(page);
  await mockFourProducts(page);
  await dashboard.gotoProducts();

  await expect(page.getByTestId('products-row')).toHaveCount(4);
  await expect(page.getByTestId('products-count')).toHaveText('4 records');
  await expect(page.getByTestId('products-cell-sku')).toHaveText(['LIC-ANNUAL', 'LIC-MONTH', 'SRV-ONBOARD', 'SRV-SUPPORT']);
  await expect(page.getByTestId('products-cell-price')).toHaveText(['€2,100.00', '€245.00', '€12,800.00', '€90.50']);
  await expect(page.getByTestId('products-cell-stock')).toHaveText(['120', '0', '15', '1,000']);
  await expect(page.getByTestId('products-cell-active')).toHaveText(['Yes', 'No', 'Yes', 'Yes']);
});
