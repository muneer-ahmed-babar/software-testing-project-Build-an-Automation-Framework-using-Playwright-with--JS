import { waitForVisible } from '../utilities/waits.js';

export default class BasePage {
  constructor(page) {
    this.page = page;
    // The burger menu exists on every page after login, so logout lives here
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  async navigate(url = '/') {
    await this.page.goto(url);
  }

  // Wait until the element is visible, then click it
  async click(locator) {
    await waitForVisible(locator);
    await locator.click();
  }

  // Wait until the element is visible, then type into it
  async type(locator, text) {
    await waitForVisible(locator);
    await locator.fill(text);
  }

  async logout() {
    await this.click(this.menuButton);
    await this.click(this.logoutLink);
  }

  // Alerts / popups: call this BEFORE the action that opens the alert.
  // SauceDemo has no alerts, but the method is here to meet the project requirement.
  handleNextDialog(action = 'accept') {
    this.page.once('dialog', async (dialog) => {
      if (action === 'accept') await dialog.accept();
      else await dialog.dismiss();
    });
  }
}
