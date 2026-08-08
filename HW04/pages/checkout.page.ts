import { expect, type Locator, type Page, type Response } from '@playwright/test';

export class CheckoutPage {
  readonly pageHeading: Locator;
  readonly cartProductList: Locator;
  readonly editableTotalInput: Locator;
  readonly couponInput: Locator;
  readonly applyButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly savingsMessage: Locator;
  readonly couponFinalMessage: Locator;
  readonly paymentTotal: Locator;

  constructor(readonly page: Page) {
    this.pageHeading = page.getByRole('heading', {
      level: 2,
      name: 'Xác Nhận Đơn Hàng',
      exact: true,
    });
    this.cartProductList = page.getByRole('heading', { level: 3, name: 'Sản phẩm:', exact: true }).locator('..');
    this.editableTotalInput = page.locator('input[type="number"]');
    this.couponInput = page.getByPlaceholder('Nhập mã giảm giá...', { exact: true });
    this.applyButton = page.getByRole('button', { name: 'Áp dụng', exact: true });
    this.errorMessage = page.locator('p.text-red-600.text-sm');
    this.successMessage = page.getByText(/^✅ /);
    this.savingsMessage = page.getByText(/^Tiết kiệm:/);
    this.couponFinalMessage = page.getByText(/^Thành tiền:/);
    this.paymentTotal = page.getByText(/^Tổng thanh toán:/);
  }

  async openWithSeededProduct(productName = 'Samsung Galaxy S24 Ultra'): Promise<void> {
    const productCard = this.page
      .getByRole('heading', { level: 2, name: productName, exact: true })
      .locator('..');
    await productCard.getByRole('button', { name: 'Thêm vào giỏ', exact: true }).click();
    await this.page.getByRole('link', { name: 'Giỏ hàng', exact: true }).click();
    await expect(this.page.getByRole('heading', { level: 2, name: 'Giỏ Hàng', exact: true })).toBeVisible();
    await this.page.getByRole('button', { name: 'Tiến hành thanh toán', exact: true }).click();
    await expect(this.pageHeading).toBeVisible();
    await expect(this.cartProductList).toContainText(productName);
  }

  async setEditableTotal(total: number): Promise<void> {
    await this.editableTotalInput.fill(String(total));
    await expect(this.editableTotalInput).toHaveValue(String(total));
  }

  async applyCoupon(code: string): Promise<Response> {
    await this.couponInput.fill(code);
    await expect(this.couponInput).toHaveValue(code);
    const responsePromise = this.page.waitForResponse((response) => {
      const url = new URL(response.url());
      return response.request().method() === 'POST' && url.pathname === '/api/apply-coupon';
    });
    await this.applyButton.click();
    return responsePromise;
  }

  async savingsAmount(): Promise<number> {
    return parseVnd(await this.savingsMessage.innerText());
  }

  async couponFinalAmount(): Promise<number> {
    return parseVnd(await this.couponFinalMessage.innerText());
  }

  async paymentTotalAmount(): Promise<number> {
    return parseVnd(await this.paymentTotal.innerText());
  }

  async responseBody(response: Response): Promise<Record<string, unknown>> {
    return response.json() as Promise<Record<string, unknown>>;
  }
}

export function parseVnd(text: string): number {
  const normalized = text.replace(/[^\d-]/g, '');
  if (!/^-?\d+$/.test(normalized)) {
    throw new Error(`Cannot parse VND amount from: ${text}`);
  }
  return Number(normalized);
}
