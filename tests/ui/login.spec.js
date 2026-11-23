import { test, expect } from '../../fixtures/testSetup.js';
import { readJson } from '../../utilities/readJson.js';
import { logger } from '../../utilities/logger.js';

const loginData = readJson('loginData.json');

test.describe('Login', () => {
  // HOOKS: run once per file (no browser available here, so just logging)
  test.beforeAll(() => logger.info('=== Login suite started ==='));
  test.afterAll(() => logger.info('=== Login suite finished ==='));

  // Data-driven: one test is generated for every valid user in the JSON file
  for (const user of loginData.validUsers) {
    test(`valid login works for ${user.username}`, async ({ loginPage, inventoryPage }) => {
      await loginPage.open();
      await loginPage.login(user.username, user.password);
      await expect(inventoryPage.title).toHaveText('Products');
    });
  }

  // Data-driven: one test for every invalid scenario
  for (const user of loginData.invalidUsers) {
    test(`login fails: ${user.scenario}`, async ({ loginPage }) => {
      await loginPage.open();
      await loginPage.login(user.username, user.password);
      await expect(loginPage.errorMessage).toContainText(user.expectedError);
    });
  }
});
