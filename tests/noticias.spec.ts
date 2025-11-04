import { test, expect } from '@playwright/test';
import { NoticiasPage } from './pom/NoticiasPage';

// Since we are using a real database, we need to make some assumptions about the data.
// These tests assume that there is enough data for pagination and filtering to work.
// For a real-world scenario, it would be better to seed the database with known test data before running the tests.

test.describe('Notícias Page E2E Tests', () => {
  let noticiasPage: NoticiasPage;

  test.beforeEach(async ({ page }) => {
    noticiasPage = new NoticiasPage(page);
    await noticiasPage.goto();
  });

  test('should load and display initial news articles', async () => {
    // The page should have a title
    await expect(noticiasPage.page).toHaveTitle(/Comunicação/);

    // There should be some news cards visible
    const initialCount = await noticiasPage.getNewsCount();
    expect(initialCount).toBeGreaterThan(0);
  });

  test('should filter news by search term', async () => {
    const initialCount = await noticiasPage.getNewsCount();

    // Assuming 'Seminário' is a term that will filter the results
    await noticiasPage.searchFor('Seminário');

    const filteredCount = await noticiasPage.getNewsCount();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
    expect(filteredCount).toBeGreaterThan(0);
  });

  test('should filter news by category', async () => {
    const initialCount = await noticiasPage.getNewsCount();

    // Assuming 'Eventos' is a category that will filter the results
    // Note: The category name needs to exist in the database
    await noticiasPage.filterByCategory('Eventos');

    const filteredCount = await noticiasPage.getNewsCount();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
    expect(filteredCount).toBeGreaterThan(0);
  });

  test('should navigate through pages using pagination', async () => {
    const initialNews = await noticiasPage.newsCards.first().textContent();

    // Assuming there is more than one page of news
    await noticiasPage.clickNextPage();

    // After clicking next, the content of the first card should be different
    const nextNews = await noticiasPage.newsCards.first().textContent();
    expect(nextNews).not.toEqual(initialNews);

    await noticiasPage.clickPrevPage();

    // After clicking previous, we should be back to the first page
    const prevNews = await noticiasPage.newsCards.first().textContent();
    expect(prevNews).toEqual(initialNews);
  });

  test('should handle combined search and category filters', async () => {
    await noticiasPage.searchFor('Previdência');
    await noticiasPage.filterByCategory('Seminário');

    const count = await noticiasPage.getNewsCount();
    expect(count).toBeGreaterThan(0);

    // Check that the results contain the search term and are in the correct category
    const firstCardText = await noticiasPage.newsCards.first().textContent();
    expect(firstCardText).toContain('Previdência');
    expect(firstCardText).toContain('Seminário');
  });

  test('should display a message when no results are found', async () => {
    await noticiasPage.searchFor('A_TERM_THAT_DOES_NOT_EXIST_12345');
    
    const noResultsMessage = noticiasPage.page.locator('text=Nenhuma notícia encontrada');
    await expect(noResultsMessage).toBeVisible();
  });
});
