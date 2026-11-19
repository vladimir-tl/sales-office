import type { Locator, Page } from '@playwright/test';

export class CookieDialog {
  readonly root: Locator;
  readonly acceptAll: Locator;
  readonly rejectAll: Locator;

  constructor(page: Page) {
    this.root = page.getByTestId('cookie-dialog');
    this.acceptAll = page.getByTestId('cookie-accept-all');
    this.rejectAll = page.getByTestId('cookie-reject-all');
  }
}
