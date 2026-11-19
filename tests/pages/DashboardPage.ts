import type { Locator, Page } from '@playwright/test';

export class SessionDialog {
  readonly root: Locator;
  readonly title: Locator;
  readonly yes: Locator;
  readonly no: Locator;

  constructor(page: Page) {
    this.root = page.getByTestId('session-dialog');
    this.title = page.getByTestId('session-title');
    this.yes = page.getByTestId('session-yes');
    this.no = page.getByTestId('session-no');
  }
}

export class DashboardPage {
  readonly sessionDialog: SessionDialog;
  readonly root: Locator;
  readonly username: Locator;
  readonly logout: Locator;
  readonly salesNav: Locator;
  readonly productsNav: Locator;
  readonly salesView: Locator;
  readonly productsView: Locator;

  constructor(readonly page: Page) {
    this.sessionDialog = new SessionDialog(page);
    this.root = page.getByTestId('dashboard');
    this.username = page.getByTestId('sidebar-username');
    this.logout = page.getByTestId('logout-button');
    this.salesNav = page.getByTestId('nav-sales');
    this.productsNav = page.getByTestId('nav-products');
    this.salesView = page.getByTestId('sales-view');
    this.productsView = page.getByTestId('products-view');
  }

  async gotoSales() {
    await this.page.goto('/dashboard/sales');
  }

  async gotoProducts() {
    await this.page.goto('/dashboard/products');
  }
}
