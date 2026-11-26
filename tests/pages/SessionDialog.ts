import type { Locator, Page } from '@playwright/test'

export class SessionDialog {
  readonly dialog: Locator
  readonly title: Locator
  readonly yes: Locator
  readonly no: Locator

  constructor(page: Page) {
    this.dialog = page.getByTestId('session-dialog')
    this.title = page.getByTestId('session-title')
    this.yes = page.getByTestId('session-yes')
    this.no = page.getByTestId('session-no')
  }
}
