import { Page, Locator, expect } from '@playwright/test';

export class NoticiasPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly categoryButtons: Locator;
  readonly newsCards: Locator;
  readonly paginationButtons: Locator;
  readonly nextPageButton: Locator;
  readonly prevPageButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('input[placeholder="Buscar notícias..."]');
    this.categoryButtons = page.locator('button:has-text("Todas")').locator('../*'); // Select all buttons in the category filter
    this.newsCards = page.locator('div.grid > div'); // Assuming cards are direct children of the grid
    this.paginationButtons = page.locator('div.flex.items-center.justify-center.gap-2 > div > button');
    this.nextPageButton = page.locator('button:has-text("Próximo")');
    this.prevPageButton = page.locator('button:has-text("Anterior")');
  }

  async goto() {
    await this.page.goto('/noticias');
  }

  async searchFor(term: string) {
    await this.searchInput.fill(term);
    // Wait for the network request to complete after debouncing
    await this.page.waitForResponse(resp => resp.url().includes('/api/noticias') && resp.status() === 200);
  }

  async filterByCategory(categoryName: string) {
    await this.categoryButtons.filter({ hasText: categoryName }).click();
    await this.page.waitForResponse(resp => resp.url().includes('/api/noticias') && resp.status() === 200);
  }

  async clickNextPage() {
    await this.nextPageButton.click();
    await this.page.waitForResponse(resp => resp.url().includes('/api/noticias') && resp.status() === 200);
  }

  async clickPrevPage() {
    await this.prevPageButton.click();
    await this.page.waitForResponse(resp => resp.url().includes('/api/noticias') && resp.status() === 200);
  }

  async getNewsCount(): Promise<number> {
    return this.newsCards.count();
  }

  async expectNewsCountToBe(count: number) {
    await expect(this.newsCards).toHaveCount(count);
  }
}
