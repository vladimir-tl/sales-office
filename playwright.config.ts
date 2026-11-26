import { defineConfig, devices } from '@playwright/test'

// LOGIN_USER / LOGIN_PASS for the real login flow live in .env (not committed)
try {
  process.loadEnvFile('.env')
} catch {
  // no .env — rely on variables from the shell / CI
}

// Tests don't start the app: run `astro dev` yourself (CI does it in its own step),
// or point BASE_URL at a deployed site. 4321 is often taken by other projects
const PORT = Number(process.env.PORT ?? 4322)
const baseURL = process.env.BASE_URL || `http://localhost:${PORT}`

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    testIdAttribute: 'data-testid',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
