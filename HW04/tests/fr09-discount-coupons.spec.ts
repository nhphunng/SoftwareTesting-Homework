import { expect, test, type CouponSetup } from '../fixtures/coupon.fixture';
import { CheckoutPage } from '../pages/checkout.page';
import featureDataJson from '../data/fr09-coupons.json';

type ExpectedOutcome = 'success' | 'error' | 'safe-nonnegative';

interface Fr09Case {
  id: string;
  description: string;
  enabled: boolean;
  preconditions: string[];
  coupon?: Omit<CouponSetup, 'prefix'>;
  input: {
    total: number;
    code?: string;
  };
  expected: {
    outcome: ExpectedOutcome;
    errorText?: string;
    discountAmount?: number;
    finalAmount: number;
  };
}

interface Fr09FeatureData {
  feature: 'FR-09';
  source: string;
  cases: Fr09Case[];
}

const featureData = featureDataJson as Fr09FeatureData;
const enabledCases = featureData.cases.filter((testCase) => testCase.enabled);

validateFeatureData(featureData, enabledCases);

test.describe('FR-09 – Discount Coupons', () => {
  for (const testCase of enabledCases) {
    test(`${testCase.id} | ${testCase.description}`, async ({ userPage, createCoupon }) => {
      const controlledCoupon = testCase.coupon
        ? await createCoupon({ prefix: testCase.id, ...testCase.coupon })
        : null;
      const couponCode = controlledCoupon?.code ?? testCase.input.code;
      if (!couponCode) {
        throw new Error(`${testCase.id} has neither controlled coupon setup nor an input code`);
      }

      const checkoutPage = new CheckoutPage(userPage);
      await checkoutPage.openWithSeededProduct();
      await checkoutPage.setEditableTotal(testCase.input.total);
      const response = await checkoutPage.applyCoupon(couponCode);

      if (testCase.expected.outcome === 'error') {
        expect(response.status()).toBeGreaterThanOrEqual(400);
        await expect(checkoutPage.errorMessage).toBeVisible();
        await expect(checkoutPage.errorMessage).toContainText(testCase.expected.errorText ?? '');
        await expect(checkoutPage.successMessage).toHaveCount(0);
        expect(await checkoutPage.paymentTotalAmount()).toBe(testCase.expected.finalAmount);
        return;
      }

      expect(response.status()).toBe(200);
      await expect(checkoutPage.successMessage).toBeVisible();
      await expect(checkoutPage.successMessage).toContainText('Áp dụng thành công');
      await expect(checkoutPage.errorMessage).toHaveCount(0);

      const savings = await checkoutPage.savingsAmount();
      const couponFinal = await checkoutPage.couponFinalAmount();
      const paymentTotal = await checkoutPage.paymentTotalAmount();

      if (testCase.expected.outcome === 'safe-nonnegative') {
        expect.soft(savings).toBeLessThanOrEqual(testCase.input.total);
        expect.soft(couponFinal).toBeGreaterThanOrEqual(0);
        expect(paymentTotal).toBeGreaterThanOrEqual(0);
        expect(paymentTotal).toBe(testCase.expected.finalAmount);
        return;
      }

      expect.soft(savings).toBe(testCase.expected.discountAmount);
      expect.soft(couponFinal).toBe(testCase.expected.finalAmount);
      expect.soft(paymentTotal).toBe(testCase.expected.finalAmount);

      const responseBody = await checkoutPage.responseBody(response);
      expect.soft(responseBody.discount_amount).toBe(testCase.expected.discountAmount);
      expect(responseBody.final_amount).toBe(testCase.expected.finalAmount);
    });
  }
});

function validateFeatureData(data: Fr09FeatureData, activeCases: Fr09Case[]): void {
  if (data.feature !== 'FR-09') {
    throw new Error('Expected FR-09 external test data');
  }

  if (activeCases.length < 12) {
    throw new Error(`FR-09 requires at least 12 enabled cases, got ${activeCases.length}`);
  }

  const ids = activeCases.map((testCase) => testCase.id);
  if (new Set(ids).size !== ids.length) {
    throw new Error('FR-09 external test data contains duplicate case IDs');
  }

  for (const testCase of activeCases) {
    if (!testCase.id.startsWith('FR09-')) {
      throw new Error(`Invalid FR-09 source case ID: ${testCase.id}`);
    }

    if (!Number.isFinite(testCase.input.total) || testCase.input.total < 0) {
      throw new Error(`${testCase.id} has an invalid cart total`);
    }

    if (testCase.expected.outcome === 'success' && testCase.expected.discountAmount === undefined) {
      throw new Error(`${testCase.id} success case is missing expected discount amount`);
    }
  }
}
