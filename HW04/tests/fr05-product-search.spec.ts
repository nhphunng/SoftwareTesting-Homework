import { expect, test } from '../fixtures/auth.fixture';
import { ProductPage } from '../pages/product.page';
import featureDataJson from '../data/fr05-search.json';

type CaseKind = 'initial-grid' | 'search' | 'reset-search';
type SearchEchoExpectation = 'literal' | 'visible' | 'absent';

interface SearchInput {
  keyword?: string;
  repeatCharacter?: string;
  repeatCount?: number;
}

interface Fr05Case {
  id: string;
  description: string;
  enabled: boolean;
  kind: CaseKind;
  preconditions: string[];
  setup?: { keyword: string };
  input?: SearchInput;
  expected: {
    resultCount: number;
    productNames: string[];
    h1Count?: number;
    searchEcho?: SearchEchoExpectation;
    emptyState?: boolean;
    unsafeMarkupCount?: number;
  };
}

interface Fr05FeatureData {
  feature: 'FR-05';
  source: string;
  cases: Fr05Case[];
}

const featureData = featureDataJson as Fr05FeatureData;
const enabledCases = featureData.cases.filter((testCase) => testCase.enabled);

validateFeatureData(featureData, enabledCases);

test.describe('FR-05 – Product Listing and Search', () => {
  for (const testCase of enabledCases) {
    test(`${testCase.id} | ${testCase.description}`, async ({ page }) => {
      const productPage = new ProductPage(page);
      await productPage.open();

      if (testCase.setup) {
        await productPage.search(testCase.setup.keyword);
      }

      const keyword = resolveKeyword(testCase.input);
      if (testCase.kind !== 'initial-grid') {
        await productPage.search(keyword);
        await expect(productPage.searchInput).toHaveValue(keyword);
      }

      await test.step('verify the product result set', async () => {
        await expect(productPage.pageHeading).toBeVisible(); // kiểm tra tiêu đề trang có hiển thị hay không
        await expect(productPage.productHeadings).toHaveCount(testCase.expected.resultCount); // kiểm tra số lượng sản phẩm hiển thị có đúng với số lượng mong đợi hay không

        for (const productName of testCase.expected.productNames) {
          await expect(productPage.productHeading(productName)).toBeVisible(); // kiểm tra từng sản phẩm có hiển thị hay không
        }
      });

      await test.step('verify feature-specific expectations', async () => {
        if (testCase.expected.h1Count !== undefined) {
          await expect(productPage.levelOneHeadings).toHaveCount(testCase.expected.h1Count);
        }

        if (testCase.expected.searchEcho === 'literal') {
          await expect(productPage.searchEcho).toBeVisible();
          await expect(productPage.searchEcho).toContainText(keyword);
        } else if (testCase.expected.searchEcho === 'visible') {
          await expect(productPage.searchEcho).toBeVisible();
        } else if (testCase.expected.searchEcho === 'absent') {
          await expect(productPage.searchEcho).toHaveCount(0);
        }

        if (testCase.expected.emptyState) {
          await expect(productPage.emptyState).toBeVisible();
        }

        if (testCase.expected.unsafeMarkupCount !== undefined) {
          await expect(productPage.unsafeSearchMarkup).toHaveCount(
            testCase.expected.unsafeMarkupCount,
          );
        }
      });
    });
  }
});

function resolveKeyword(input?: SearchInput): string {
  if (!input) {
    return '';
  }

  if (input.keyword !== undefined) {
    return input.keyword;
  }

  if (input.repeatCharacter !== undefined && input.repeatCount !== undefined) {
    return input.repeatCharacter.repeat(input.repeatCount);
  }

  throw new Error('FR-05 case has no valid keyword input');
}

function validateFeatureData(
  featureDataToValidate: Fr05FeatureData,
  activeCases: Fr05Case[],
): void {
  if (featureDataToValidate.feature !== 'FR-05') {
    throw new Error('Expected FR-05 external test data');
  }

  if (activeCases.length < 12) {
    throw new Error(`FR-05 requires at least 12 enabled cases, got ${activeCases.length}`);
  }

  const ids = activeCases.map((testCase) => testCase.id);
  if (new Set(ids).size !== ids.length) {
    throw new Error('FR-05 external test data contains duplicate case IDs');
  }

  for (const testCase of activeCases) {
    if (!testCase.id.startsWith('FR05-')) {
      throw new Error(`Invalid FR-05 test case ID: ${testCase.id}`);
    }

    if (testCase.expected.resultCount !== testCase.expected.productNames.length) {
      throw new Error(`${testCase.id} resultCount does not match expected productNames length`);
    }
  }
}
