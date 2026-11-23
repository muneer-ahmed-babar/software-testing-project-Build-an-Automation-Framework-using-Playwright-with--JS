import BasePage from './BasePage.js';

export default class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.itemNames = page.locator('.inventory_item_name');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async startCheckout() {
    await this.click(this.checkoutButton);
  }
}
