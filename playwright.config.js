import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 30_000,                          // max time for one test
  expect: { timeout: 7_000 },               // max time for one assertion
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,          // retry once, only on Jenkins/Docker
  workers: process.env.CI ? 2 : undefined,

  // list = console output, html = Playwright report, allure = the main report
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['allure-playwright'],
  ],

  use: {
    actionTimeout: 10_000,                  // "implicit" wait: Playwright auto-waits up to 10s per action
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'ui',
      testDir: './tests/ui',
      use: { ...devices['Desktop Chrome'], baseURL: 'https://www.saucedemo.com' },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: 'https://jsonplaceholder.typicode.com' },
    },
  ],
});
