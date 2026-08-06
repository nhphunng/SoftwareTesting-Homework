import type { Page } from '@playwright/test';

export class CheckoutPage {
  constructor(readonly page: Page) {}

  // Add coupon and checkout actions only after inspecting the running SUT.
}

