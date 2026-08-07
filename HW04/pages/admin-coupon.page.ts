import { expect, type Locator, type Page, type Response } from '@playwright/test';

export interface CouponFormInput {
  code: string;
  type: 'percent' | 'fixed';
  discountValue: string;
  minOrderAmount: string;
  expiredAt: string;
  maxUsesPerUser: string;
}

export interface CouponSubmitResult {
  submitted: boolean;
  responseStatus: number | null;
  dialogMessage: string | null;
  invalidFieldCount: number;
}

export class AdminCouponPage {
  readonly pageHeading: Locator;
  readonly createForm: Locator;
  readonly codeInput: Locator;
  readonly typeSelect: Locator;
  readonly discountValueInput: Locator;
  readonly minOrderInput: Locator;
  readonly expirationInput: Locator;
  readonly maxUsesInput: Locator;
  readonly createButton: Locator;
  readonly couponTable: Locator;

  constructor(readonly page: Page) {
    this.pageHeading = page.getByRole('heading', {
      level: 2,
      name: 'Quản lý Mã Giảm Giá',
      exact: true,
    });
    this.createForm = page.locator('form').filter({
      has: page.getByRole('heading', { level: 3, name: 'Tạo mã giảm giá mới', exact: true }),
    });
    this.codeInput = page.getByPlaceholder('Mã coupon (VD: SAVE10)', { exact: true });
    this.typeSelect = this.createForm.getByRole('combobox');
    this.discountValueInput = this.createForm.locator('input[type="number"]').nth(0);
    this.minOrderInput = page.getByPlaceholder('Đơn tối thiểu (₫)', { exact: true });
    this.expirationInput = page.getByPlaceholder('Ngày hết hạn', { exact: true });
    this.maxUsesInput = page.getByPlaceholder('Số lần dùng tối đa/người', { exact: true });
    this.createButton = page.getByRole('button', { name: 'Tạo mã', exact: true });
    this.couponTable = page.getByRole('table');
  }

  async open(): Promise<void> {
    await this.page.getByText('Mã Giảm Giá', { exact: true }).click();
    await expect(this.pageHeading).toBeVisible();
    await expect(this.createForm).toBeVisible();
    await expect(this.couponTable).toBeVisible();
  }

  async fillForm(input: CouponFormInput): Promise<void> {
    await this.codeInput.fill(input.code);
    await this.typeSelect.selectOption(input.type);
    await this.discountValueInput.fill(input.discountValue);
    await this.minOrderInput.fill(input.minOrderAmount);
    await this.expirationInput.fill(input.expiredAt);
    await this.maxUsesInput.fill(input.maxUsesPerUser);
  }

  async submit(): Promise<CouponSubmitResult> {
    const isValid = await this.createForm.evaluate((form: HTMLFormElement) => form.checkValidity());

    if (!isValid) {
      await this.createButton.click();
      return {
        submitted: false,
        responseStatus: null,
        dialogMessage: null,
        invalidFieldCount: await this.createForm.locator(':invalid').count(),
      };
    }

    let resolveDialog!: (message: string) => void;
    const dialogMessagePromise = new Promise<string>((resolve) => {
      resolveDialog = resolve;
    });
    this.page.once('dialog', async (dialog) => {
      resolveDialog(dialog.message());
      await dialog.dismiss();
    });

    const createResponsePromise = this.waitForCouponResponse('POST');
    const listResponsePromise = this.waitForCouponResponse('GET').catch(() => null);
    await this.createButton.click();
    const createResponse = await createResponsePromise;

    let dialogMessage: string | null = null;
    if (createResponse.ok()) {
      const listResponse = await listResponsePromise;
      if (!listResponse) {
        throw new Error('Coupon list did not reload after successful creation');
      }
      this.assertSuccessfulResponse(listResponse, 'reload coupon list');
    } else {
      dialogMessage = await dialogMessagePromise;
    }

    return {
      submitted: true,
      responseStatus: createResponse.status(),
      dialogMessage,
      invalidFieldCount: 0,
    };
  }

  couponRow(code: string): Locator {
    return this.couponTable
      .locator('tbody tr')
      .filter({ has: this.page.getByText(code.trim(), { exact: false }) });
  }

  async reloadAndOpen(): Promise<void> {
    const listResponsePromise = this.waitForCouponResponse('GET');
    await this.page.reload();
    const listResponse = await listResponsePromise;
    this.assertSuccessfulResponse(listResponse, 'reload coupon list');
    await this.open();
  }

  async deleteCoupon(code: string): Promise<void> {
    const row = this.couponRow(code);
    await expect(row).toHaveCount(1);

    const deleteResponsePromise = this.waitForCouponResponse('DELETE');
    const listResponsePromise = this.waitForCouponResponse('GET');
    await row.getByRole('button', { name: 'Xóa', exact: true }).click();

    this.assertSuccessfulResponse(await deleteResponsePromise, `delete coupon ${code.trim()}`);
    this.assertSuccessfulResponse(await listResponsePromise, 'reload coupon list after delete');
    await expect(row).toHaveCount(0);
  }

  private waitForCouponResponse(method: 'GET' | 'POST' | 'DELETE'): Promise<Response> {
    return this.page.waitForResponse((response) => {
      const url = new URL(response.url());
      const isCouponPath =
        method === 'GET'
          ? url.pathname === '/api/coupons'
          : method === 'POST'
            ? url.pathname === '/api/admin/coupons'
            : /^\/api\/admin\/coupons\/\d+$/.test(url.pathname);

      return response.request().method() === method && isCouponPath;
    });
  }

  private assertSuccessfulResponse(response: Response, action: string): void {
    if (!response.ok()) {
      throw new Error(`Coupon API returned ${response.status()} while attempting to ${action}`);
    }
  }
}
