import { expect, test as base, type Page, type Response } from '@playwright/test';

interface AuthFixtures {
  adminPage: Page;
  userPage: Page;
}

export const test = base.extend<AuthFixtures>({
  adminPage: async ({ page }, use) => {
    await loginAsAdmin(page);
    await use(page);
  },
  userPage: async ({ page }, use) => {
    await loginAsUser(page);
    await use(page);
  },
});

export { expect } from '@playwright/test';

async function loginAsAdmin(page: Page): Promise<void> {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be provided in HW04/.env');
  }

  await page.goto('/');

  const loginHeading = page.getByRole('heading', { level: 2, name: 'Admin Login', exact: true });
  if (!(await loginHeading.isVisible())) {
    await expect(page.getByRole('heading', { level: 1, name: 'EShop Admin', exact: true })).toBeVisible();
    return;
  }

  await page.getByPlaceholder('Email', { exact: true }).fill(email);
  await page.getByPlaceholder('Password', { exact: true }).fill(password);

  const loginResponsePromise = waitForApiResponse(page, 'POST', '/api/login');
  const couponsResponsePromise = waitForApiResponse(page, 'GET', '/api/coupons');
  await page.getByRole('button', { name: 'Login', exact: true }).click();

  const loginResponse = await loginResponsePromise;
  if (!loginResponse.ok()) {
    throw new Error(`Admin login API returned ${loginResponse.status()}`);
  }

  const couponsResponse = await couponsResponsePromise;
  if (!couponsResponse.ok()) {
    throw new Error(`Coupon list API returned ${couponsResponse.status()} after admin login`);
  }

  await expect(page.getByRole('heading', { level: 1, name: 'EShop Admin', exact: true })).toBeVisible();
}

function waitForApiResponse(page: Page, method: string, pathname: string): Promise<Response> {
  return page.waitForResponse((response) => {
    const url = new URL(response.url());
    return response.request().method() === method && url.pathname === pathname;
  });
}

async function loginAsUser(page: Page): Promise<void> {
  const email = process.env.USER_EMAIL;
  const password = process.env.USER_PASSWORD;

  if (!email || !password) {
    throw new Error('USER_EMAIL and USER_PASSWORD must be provided in HW04/.env');
  }

  await page.goto('/login');
  const loginForm = page.locator('form').filter({
    has: page.getByRole('button', { name: 'Sign In', exact: true }),
  });
  const loginInputs = loginForm.locator('input');
  await loginInputs.nth(0).fill(email);
  await loginInputs.nth(1).fill(password);

  const loginResponsePromise = waitForApiResponse(page, 'POST', '/api/login');
  const productsResponsePromise = waitForApiResponse(page, 'GET', '/api/products').catch(() => null);
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();

  const loginResponse = await loginResponsePromise;
  if (!loginResponse.ok()) {
    throw new Error(`User login API returned ${loginResponse.status()}`);
  }

  const productsResponse = await productsResponsePromise;
  if (!productsResponse || !(productsResponse.ok() || productsResponse.status() === 304)) {
    throw new Error('Product list did not load after user login');
  }

  await expect(
    page.getByRole('heading', { level: 1, name: 'Danh sách sản phẩm', exact: true }),
  ).toBeVisible();
}
