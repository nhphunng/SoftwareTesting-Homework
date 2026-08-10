import { expect, test } from '../fixtures/auth.fixture';
import { ProfilePage, type ProfileValues } from '../pages/profile.page';
import featureDataJson from '../data/fr04-profile.json';

type CaseKind =
  | 'profile-view'
  | 'guest-access'
  | 'profile-update'
  | 'native-required'
  | 'email-readonly'
  | 'email-unchanged'
  | 'logout'
  | 'empty-order-history';
type UpdateOutcome = 'accepted' | 'rejected';

interface Fr04Case {
  id: string;
  description: string;
  enabled: boolean;
  kind: CaseKind;
  preconditions: string[];
  input?: ProfileValues;
  expected: {
    heading?: string;
    emailDisabled?: boolean;
    updateButtonVisible?: boolean;
    logoutButtonVisible?: boolean;
    redirectPath?: string;
    deniedMessage?: string;
    signInButtonVisible?: boolean;
    loginLinkVisible?: boolean;
    outcome?: UpdateOutcome;
    emptyOrderMessage?: string;
  };
}

interface Fr04FeatureData {
  feature: 'Mobile-FR04';
  source: string;
  cases: Fr04Case[];
  notAutomated: Array<{ ids: string[]; reason: string }>;
}

const featureData = featureDataJson as Fr04FeatureData;
const enabledCases = featureData.cases.filter((testCase) => testCase.enabled);
validateFeatureData(featureData, enabledCases);

test.describe('Mobile-FR04 – Profile Management on user web', () => {
  for (const testCase of enabledCases) {
    if (testCase.kind === 'guest-access') {
      test(`${testCase.id} | ${testCase.description}`, async ({ page }) => {
        await page.goto('/profile');
        await expect(page.getByText(testCase.expected.deniedMessage!, { exact: true })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Đăng nhập', exact: true })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Hồ sơ của bạn', exact: true })).toHaveCount(0);
      });
      continue;
    }

    test(`${testCase.id} | ${testCase.description}`, async ({ userPage }) => {
      const profilePage = new ProfilePage(userPage);
      await profilePage.open();

      if (testCase.kind === 'profile-view') {
        await expect(profilePage.heading).toHaveText(testCase.expected.heading!);
        await expect(profilePage.emailInput).toBeDisabled();
        await expect(profilePage.updateButton).toBeVisible();
        await expect(profilePage.logoutButton).toBeVisible();
        return;
      }

      if (testCase.kind === 'email-readonly') {
        const emailBefore = await profilePage.emailInput.inputValue();
        await expect(profilePage.emailInput).toBeDisabled();
        await expect(profilePage.emailInput).toHaveValue(emailBefore);
        return;
      }

      if (testCase.kind === 'logout') {
        await profilePage.logoutButton.click();
        await expect(userPage.getByRole('link', { name: 'Đăng nhập', exact: true })).toBeVisible();
        await expect(userPage.getByText(testCase.expected.deniedMessage!, { exact: true })).toBeVisible();
        await expect(profilePage.heading).toHaveCount(0);
        return;
      }

      if (testCase.kind === 'empty-order-history') {
        await expect(profilePage.orderHistoryHeading).toBeVisible();
        await expect(profilePage.emptyOrderMessage).toHaveText(testCase.expected.emptyOrderMessage!);
        await expect(userPage.getByText(/^Đơn #/)).toHaveCount(0);
        return;
      }

      const originalValues = await profilePage.readValues();
      const originalEmail = await profilePage.emailInput.inputValue();
      const input = requireInput(testCase);

      try {
        await profilePage.fill(input);

        if (testCase.kind === 'native-required') {
          await profilePage.updateButton.click();
          const isValid = await profilePage.fullNameInput.evaluate(
            (element) => (element as HTMLInputElement).checkValidity(),
          );
          expect(isValid).toBe(false);
          await expect(profilePage.fullNameInput).toBeFocused();
          await expect(profilePage.reloadAndReadValues()).resolves.toEqual(originalValues);
          return;
        }

        const dialogMessage = await profilePage.submitAndAcceptDialog();
        expect(dialogMessage.trim().length).toBeGreaterThan(0);
        const persistedValues = await profilePage.reloadAndReadValues();

        if (testCase.expected.outcome === 'accepted') {
          expect(persistedValues, `Profile dialog: ${dialogMessage}`).toEqual(input);
        } else {
          expect(persistedValues, `Profile dialog: ${dialogMessage}`).toEqual(originalValues);
        }

        if (testCase.kind === 'email-unchanged') {
          await expect(profilePage.emailInput).toHaveValue(originalEmail);
        }
      } finally {
        await profilePage.restore(originalValues);
      }
    });
  }
});

function requireInput(testCase: Fr04Case): ProfileValues {
  if (!testCase.input) {
    throw new Error(`${testCase.id} requires profile input data`);
  }
  return testCase.input;
}

function validateFeatureData(data: Fr04FeatureData, activeCases: Fr04Case[]): void {
  if (data.feature !== 'Mobile-FR04') {
    throw new Error('Expected Mobile-FR04 external test data');
  }

  if (activeCases.length < 12) {
    throw new Error(`Mobile-FR04 requires at least 12 enabled cases, got ${activeCases.length}`);
  }

  const ids = activeCases.map((testCase) => testCase.id);
  if (new Set(ids).size !== ids.length) {
    throw new Error('Mobile-FR04 external test data contains duplicate case IDs');
  }

  for (const testCase of activeCases) {
    if (!testCase.id.startsWith('MFR04-')) {
      throw new Error(`Invalid Mobile-FR04 test case ID: ${testCase.id}`);
    }

    if (
      ['profile-update', 'native-required', 'email-unchanged'].includes(testCase.kind) &&
      (!testCase.input || !testCase.expected.outcome)
    ) {
      throw new Error(`${testCase.id} requires input and expected outcome`);
    }
  }
}
