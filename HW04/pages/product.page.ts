import type { Page } from '@playwright/test';

export class ProductPage {
  constructor(readonly page: Page) {}

  // Add selectors and user actions only after inspecting the running SUT.
}

