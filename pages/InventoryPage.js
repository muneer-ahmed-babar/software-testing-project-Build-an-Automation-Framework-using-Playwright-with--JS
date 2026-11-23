import BasePage from './BasePage.js';

export default class InventoryPage extends BasePage {
  constructor(page) {
    super(page);
    this.title = page.locator('[data-test="title"]');
    this.items = page.locator('.inventory_item');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.prices = page.locator('.inventory_item_price');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  // sortValue examples: 'az', 'za', 'lohi', 'hilo'
  async sortBy(sortValue) {
    await this.sortDropdown.selectOption(sortValue);
  }

  // Returns every price on the page as a number, e.g. [7.99, 9.99, ...]
  async getAllPrices() {
    const priceTexts = await this.prices.allTextContents();
    return priceTexts.map((text) => Number(text.replace('$', '')));
  }

  // productSlug example: 'sauce-labs-backpack'
  async addToCart(productSlug) {
    await this.click(this.page.locator(`[data-test="add-to-cart-${productSlug}"]`));
  }

  async removeFromCart(productSlug) {
    await this.click(this.page.locator(`[data-test="remove-${productSlug}"]`));
  }

  async openCart() {
    await this.click(this.cartLink);
  }
}
