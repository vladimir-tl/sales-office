import { defineConfig, devices } from '@playwright/test';

// LOGIN_USER / LOGIN_PASS for the real login flow live in .env (not committed)
try {
  process.loadEnvFile('.env');
} catch {
  // no .env — rely on variables from the shell / CI
}

// Astro runs one dev server per project; 4321 is often taken by other projects
const PORT = Number(process.env.PORT ?? 4322);
const baseURL = process.env.BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    testIdAttribute: 'data-testid',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Start the dev server ourselves unless tests run against BASE_URL
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: `npx astro dev --port ${PORT} --strictPort`,
        url: baseURL,
        reuseExistingServer: true, // reuse this project's running `astro dev`
        timeout: 120_000,
      },
});
