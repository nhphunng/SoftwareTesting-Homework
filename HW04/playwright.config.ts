import { defineConfig, devices } from '@playwright/test';

const studentId = process.env.STUDENT_ID ?? 'YOUR_STUDENT_ID';
const runTimestamp = new Date().toISOString();
const runLabel = process.env.RUN_LABEL ?? 'full-suite';

export default defineConfig({
  testDir: './tests',
  outputDir: 'test-results',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    [
      'html',
      {
        open: 'never',
        outputFolder: process.env.PLAYWRIGHT_HTML_OUTPUT_DIR ?? 'reports/html/latest',
        title: `HW04 ${runLabel} | Run by: ${studentId} | ${runTimestamp}`,
      },
    ],
  ],
  metadata: {
    runBy: studentId,
    runTimestamp,
    runLabel,
  },
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});

