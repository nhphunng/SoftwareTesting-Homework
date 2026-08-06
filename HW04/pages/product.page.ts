import { expect, type Locator, type Page, type Response } from '@playwright/test';

export class ProductPage {
  readonly pageHeading: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly productHeadings: Locator;
  readonly searchEcho: Locator;
  readonly emptyState: Locator;
  readonly unsafeSearchMarkup: Locator;
  readonly levelOneHeadings: Locator;

  constructor(readonly page: Page) {
    this.pageHeading = page.getByRole('heading', { level: 1, name: 'Danh sách sản phẩm', exact: true });
    this.searchInput = page.getByPlaceholder('Tìm kiếm...', { exact: true });
    this.searchButton = page.getByRole('button', { name: 'Tìm', exact: true });
    this.productHeadings = page.getByRole('heading', { level: 2 });
    this.searchEcho = page.locator('main').getByText('Kết quả tìm kiếm cho:', { exact: false });
    this.emptyState = page.getByText(/không (tìm thấy|có) sản phẩm/i);
    this.unsafeSearchMarkup = page.locator('main script, main iframe, main object, main embed');
    this.levelOneHeadings = page.locator('h1');
  }

  async open(): Promise<void> {
    const productsResponse = this.waitForProductsResponse();
    await this.page.goto('/');
    await this.assertSuccessfulResponse(await productsResponse);
    await expect(this.pageHeading).toBeVisible();
  }

  async search(keyword: string): Promise<void> {
    await this.searchInput.fill(keyword);
    const productsResponse = this.waitForProductsResponse();
    await this.searchButton.click();
    await this.assertSuccessfulResponse(await productsResponse);
  }

  productHeading(name: string): Locator {
    return this.page.getByRole('heading', { level: 2, name, exact: true });
  }

  private waitForProductsResponse(): Promise<Response> {
    return this.page.waitForResponse((response) => {
      const url = new URL(response.url());
      return url.pathname === '/api/products' && response.request().method() === 'GET';
    });
  }

  private async assertSuccessfulResponse(response: Response): Promise<void> {
    const isSuccessfulProductResponse = response.ok() || response.status() === 304;

    if (!isSuccessfulProductResponse) {
      throw new Error(`Product API returned ${response.status()} for ${response.url()}`);
    }
  }
}
