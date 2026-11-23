import { test as base, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage.js';
import InventoryPage from '../pages/InventoryPage.js';
import CartPage from '../pages/CartPage.js';
import CheckoutPage from '../pages/CheckoutPage.js';
import { afterEachScreenshot } from '../utilities/screenshot.js';
import { readJson } from '../utilities/readJson.js';
import { logger } from '../utilities/logger.js';

const loginData = readJson('loginData.json');

export const test = base.extend({
  // Each page object is created fresh for every test
  loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
  inventoryPage: async ({ page }, use) => { await use(new InventoryPage(page)); },
  cartPage: async ({ page }, use) => { await use(new CartPage(page)); },
  checkoutPage: async ({ page }, use) => { await use(new CheckoutPage(page)); },

  // Shortcut: logs in with the first valid user and hands back the inventory page
  loggedInInventory: async ({ loginPage, inventoryPage }, use) => {
    const user = loginData.validUsers[0];
    await loginPage.open();
    await loginPage.login(user.username, user.password);
    await use(inventoryPage);
  },
});

// HOOK: runs before every test
test.beforeEach(async ({}, testInfo) => {
  logger.info(`START: ${testInfo.title}`);
});

// HOOK: runs after every test (screenshot + log result)
test.afterEach(async ({ page }, testInfo) => {
  await afterEachScreenshot(page, testInfo);
  logger.info(`END: ${testInfo.title} -> ${testInfo.status}`);
});

export { expect };
