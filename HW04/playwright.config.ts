import { defineConfig, devices } from '@playwright/test';
import { loadEnvFile } from 'node:process';

try {
  loadEnvFile('.env');
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
    throw error;
  }
}

const studentId = process.env.STUDENT_ID ?? 'YOUR_STUDENT_ID';
const runTimestamp = new Date().toISOString();
const runLabel = process.env.RUN_LABEL ?? 'full-suite';
const targetApp = process.env.TARGET_APP ?? 'user';
const htmlReportHost = process.env.PLAYWRIGHT_HTML_HOST ?? '127.0.0.1';
const htmlReportPort = Number(process.env.PLAYWRIGHT_HTML_PORT ?? '9323');

if (!Number.isInteger(htmlReportPort) || htmlReportPort < 1 || htmlReportPort > 65_535) {
  throw new Error(`PLAYWRIGHT_HTML_PORT must be a valid TCP port, got "${process.env.PLAYWRIGHT_HTML_PORT}"`);
}

if (targetApp !== 'user' && targetApp !== 'admin') {
  throw new Error(`TARGET_APP must be "user" or "admin", got "${targetApp}"`);
}

const userWebUrl = process.env.USER_WEB_URL ?? 'http://localhost:5173';
const adminWebUrl = process.env.ADMIN_WEB_URL ?? 'http://localhost:5174';
const baseURL = targetApp === 'admin' ? adminWebUrl : userWebUrl;

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
        open: 'always',
        host: htmlReportHost,
        port: htmlReportPort,
        outputFolder: process.env.PLAYWRIGHT_HTML_OUTPUT_DIR ?? 'reports/html/latest',
        title: `HW04 ${runLabel} (${targetApp}) | Run by: ${studentId} | ${runTimestamp}`,
      },
    ],
  ],
  metadata: {
    runBy: studentId,
    runTimestamp,
    runLabel,
    targetApp,
  },
  use: {
    baseURL,
    screenshot: { mode: 'only-on-failure', fullPage: true },
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
