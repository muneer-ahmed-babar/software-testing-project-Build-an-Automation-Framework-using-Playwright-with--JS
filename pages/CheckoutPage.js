import BasePage from './BasePage.js';

export default class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.firstName = page.locator('[data-test="firstName"]');
    this.lastName = page.locator('[data-test="lastName"]');
    this.postalCode = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
  }

  // customer = { firstName, lastName, postalCode }
  async fillCustomerInfo(customer) {
    await this.type(this.firstName, customer.firstName);
    await this.type(this.lastName, customer.lastName);
    await this.type(this.postalCode, customer.postalCode);
  }

  async continue() {
    await this.click(this.continueButton);
  }

  async finish() {
    await this.click(this.finishButton);
  }
}
