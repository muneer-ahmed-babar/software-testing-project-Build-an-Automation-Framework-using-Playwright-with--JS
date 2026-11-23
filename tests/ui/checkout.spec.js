import { test, expect } from '../../fixtures/testSetup.js';
import { readJson } from '../../utilities/readJson.js';

const data = readJson('checkoutData.json');

test.describe('Checkout', () => {
  test('user can complete an order end to end', async ({ loggedInInventory, cartPage, checkoutPage }) => {
    await loggedInInventory.addToCart(data.product);
    await loggedInInventory.openCart();
    await expect(cartPage.itemNames).toContainText([data.productName]);

    await cartPage.startCheckout();
    await checkoutPage.fillCustomerInfo(data.customer);
    await checkoutPage.continue();
    await checkoutPage.finish();

    await expect(checkoutPage.completeHeader).toHaveText(data.expectedConfirmation);
  });

  test('checkout is blocked when first name is empty', async ({ loggedInInventory, cartPage, checkoutPage }) => {
    await loggedInInventory.addToCart(data.product);
    await loggedInInventory.openCart();
    await cartPage.startCheckout();

    await checkoutPage.fillCustomerInfo(data.missingFirstName);
    await checkoutPage.continue();

    await expect(checkoutPage.errorMessage).toContainText(data.missingFirstName.expectedError);
  });
});
