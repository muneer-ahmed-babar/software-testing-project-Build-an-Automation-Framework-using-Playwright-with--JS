import { test } from '@playwright/test';
import BasePage from './BasePage.js';
import { attachStepScreenshot } from '../utilities/screenshot.js';

export default class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.username = page.locator('[data-test="username"]');
    this.password = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async open() {
    await this.navigate('/');
  }

  async login(username, password) {
    await test.step(`Login with user "${username}"`, async () => {
      await this.type(this.username, username);
      await this.type(this.password, password);
      await attachStepScreenshot(this.page, 'Credentials entered');
      await this.click(this.loginButton);
    });
  }
}
