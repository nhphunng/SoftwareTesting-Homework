import { expect, test } from '../fixtures/auth.fixture';
import { AdminCouponPage, type CouponFormInput } from '../pages/admin-coupon.page';
import featureDataJson from '../data/fr17-coupon-crud.json';

type CaseKind = 'view' | 'create' | 'delete';
type ExpectedOutcome = 'created' | 'rejected' | 'deleted' | 'normalized-or-rejected';
type RejectionMechanism = 'native' | 'server' | 'business';

interface Fr17Case {
  id: string;
  description: string;
  enabled: boolean;
  kind: CaseKind;
  preconditions: string[];
  input?: CouponFormInput;
  expected: {
    outcome?: ExpectedOutcome;
    rejectionMechanism?: RejectionMechanism;
    errorText?: string;
    rowText?: string[];
    seedCodes?: string[];
    headers?: string[];
  };
}

interface Fr17FeatureData {
  feature: 'FR-17';
  source: string;
  cases: Fr17Case[];
}

const featureData = featureDataJson as Fr17FeatureData;
const enabledCases = featureData.cases.filter((testCase) => testCase.enabled);

validateFeatureData(featureData, enabledCases);

test.describe('FR-17 – Coupon Management CRUD', () => {
  let cleanupCodes: string[];

  test.beforeEach(() => {
    cleanupCodes = [];
  });

  test.afterEach(async ({ adminPage }) => {
    const couponPage = new AdminCouponPage(adminPage);
    for (const code of cleanupCodes) {
      if ((await couponPage.couponRow(code).count()) === 1) {
        await couponPage.deleteCoupon(code);
      }
    }
  });

  for (const testCase of enabledCases) {
    test(`${testCase.id} | ${testCase.description}`, async ({ adminPage }, testInfo) => {
      const couponPage = new AdminCouponPage(adminPage);
      await couponPage.open();

      if (testCase.kind === 'view') {
        await verifyCouponManagementView(couponPage, testCase);
        return;
      }

      const uniqueCode = buildUniqueCode(testCase.id, testInfo.workerIndex, testInfo.retry);
      const input = materializeInput(testCase.input, uniqueCode);
      if (input.code.includes(uniqueCode)) {
        cleanupCodes.push(uniqueCode);
      }

      await couponPage.fillForm(input);
      await expect(couponPage.codeInput).toHaveValue(input.code.toUpperCase());

      const rowCountBeforeSubmit = await couponPage.couponTable.locator('tbody tr').count();
      const submitResult = await couponPage.submit();

      if (testCase.kind === 'delete') {
        expect(submitResult.responseStatus).toBe(200);
        await expect(couponPage.couponRow(input.code)).toHaveCount(1);
        await couponPage.deleteCoupon(input.code);
        await couponPage.reloadAndOpen();
        await expect(couponPage.couponRow(input.code)).toHaveCount(0);
        return;
      }

      if (testCase.expected.outcome === 'created') {
        await verifyCreatedCoupon(couponPage, input, testCase, submitResult.responseStatus);
        return;
      }

      if (testCase.expected.outcome === 'normalized-or-rejected') {
        await verifySafelyHandledWhitespace(
          couponPage,
          input,
          rowCountBeforeSubmit,
          submitResult.responseStatus,
        );
        return;
      }

      await verifyRejectedCoupon(
        couponPage,
        input,
        testCase,
        rowCountBeforeSubmit,
        submitResult,
      );
    });
  }
});

async function verifyCouponManagementView(
  couponPage: AdminCouponPage,
  testCase: Fr17Case,
): Promise<void> {
  await expect(couponPage.pageHeading).toBeVisible();
  await expect(couponPage.createButton).toBeEnabled();

  for (const header of testCase.expected.headers ?? []) {
    await expect(couponPage.couponTable.getByRole('columnheader', { name: header, exact: true })).toBeVisible();
  }

  for (const code of testCase.expected.seedCodes ?? []) {
    await expect(couponPage.couponRow(code)).toHaveCount(1);
  }
}

async function verifyCreatedCoupon(
  couponPage: AdminCouponPage,
  input: CouponFormInput,
  testCase: Fr17Case,
  responseStatus: number | null,
): Promise<void> {
  expect(responseStatus).toBe(200);
  const row = couponPage.couponRow(input.code);
  await expect(row).toHaveCount(1);
  await expect(row).toContainText(input.code.trim());

  for (const expectedText of testCase.expected.rowText ?? []) {
    await expect(row).toContainText(expectedText);
  }

  await couponPage.reloadAndOpen();
  await expect(couponPage.couponRow(input.code)).toHaveCount(1);
}

async function verifyRejectedCoupon(
  couponPage: AdminCouponPage,
  input: CouponFormInput,
  testCase: Fr17Case,
  rowCountBeforeSubmit: number,
  submitResult: {
    submitted: boolean;
    responseStatus: number | null;
    dialogMessage: string | null;
    invalidFieldCount: number;
  },
): Promise<void> {
  if (testCase.expected.rejectionMechanism === 'native') {
    expect(submitResult.submitted).toBe(false);
    expect(submitResult.responseStatus).toBeNull();
    expect(submitResult.invalidFieldCount).toBeGreaterThan(0);
  } else {
    expect(submitResult.submitted).toBe(true);
    expect(submitResult.responseStatus).not.toBeNull();
    expect.soft(submitResult.responseStatus).toBeGreaterThanOrEqual(400);
  }

  if (testCase.expected.errorText) {
    expect(submitResult.dialogMessage).toContain(testCase.expected.errorText);
  }

  await expect(couponPage.couponTable.locator('tbody tr')).toHaveCount(rowCountBeforeSubmit);
}

async function verifySafelyHandledWhitespace(
  couponPage: AdminCouponPage,
  input: CouponFormInput,
  rowCountBeforeSubmit: number,
  responseStatus: number | null,
): Promise<void> {
  if (responseStatus !== null && responseStatus >= 400) {
    await expect(couponPage.couponTable.locator('tbody tr')).toHaveCount(rowCountBeforeSubmit);
    return;
  }

  expect(responseStatus).toBe(200);
  const row = couponPage.couponRow(input.code);
  await expect(row).toHaveCount(1);
  const storedCode = await row.locator('td').first().textContent();
  expect(storedCode).toBe(input.code.trim());
}

function materializeInput(input: CouponFormInput | undefined, uniqueCode: string): CouponFormInput {
  if (!input) {
    throw new Error('FR-17 create/delete case is missing input data');
  }

  return {
    ...input,
    code: input.code.replace('{{UNIQUE}}', uniqueCode),
  };
}

function buildUniqueCode(caseId: string, workerIndex: number, retry: number): string {
  const caseToken = caseId.replace(/[^A-Z0-9]/g, '').slice(-8);
  const timeToken = Date.now().toString(36).slice(-7);
  return `HW4${caseToken}${workerIndex}${retry}${timeToken}`.toUpperCase();
}

function validateFeatureData(data: Fr17FeatureData, activeCases: Fr17Case[]): void {
  if (data.feature !== 'FR-17') {
    throw new Error('Expected FR-17 external test data');
  }

  if (activeCases.length < 12 || activeCases.length > 15) {
    throw new Error(`FR-17 requires 12–15 enabled cases for Day 2, got ${activeCases.length}`);
  }

  const ids = activeCases.map((testCase) => testCase.id);
  if (new Set(ids).size !== ids.length) {
    throw new Error('FR-17 external test data contains duplicate case IDs');
  }

  for (const testCase of activeCases) {
    if (!testCase.id.startsWith('FR17-')) {
      throw new Error(`Invalid FR-17 test case ID: ${testCase.id}`);
    }

    if (testCase.kind !== 'view' && !testCase.input) {
      throw new Error(`${testCase.id} must provide input data`);
    }

    if (testCase.kind === 'create' && !testCase.expected.outcome) {
      throw new Error(`${testCase.id} must define an expected outcome`);
    }
  }
}
