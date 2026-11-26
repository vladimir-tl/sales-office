import type { Locator, Page } from '@playwright/test'
import { CookieDialog } from './CookieDialog'

export class LoginPage {
  static readonly LOGIN_ROUTE = '**/api/login/auth'

  readonly cookieDialog: CookieDialog
  readonly form: Locator
  readonly username: Locator
  readonly password: Locator
  readonly passwordToggle: Locator
  readonly submit: Locator
  readonly error: Locator

  constructor(readonly page: Page) {
    this.cookieDialog = new CookieDialog(page)
    this.form = page.getByTestId('login-form')
    this.username = page.getByTestId('login-username')
    this.password = page.getByTestId('login-password')
    this.passwordToggle = page.getByTestId('login-password-toggle')
    this.submit = page.getByTestId('login-submit')
    this.error = page.getByTestId('login-error')
  }

  async goto() {
    await this.page.goto('/')
  }

  async login(username: string, password: string) {
    await this.username.fill(username)
    await this.password.fill(password)
    await this.submit.click()
  }
}
