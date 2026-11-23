import { test, expect } from '../../fixtures/testSetup.js';
import { readJson } from '../../utilities/readJson.js';

const checkoutData = readJson('checkoutData.json');

test.describe('Inventory', () => {
  test('page shows all 6 products', async ({ loggedInInventory }) => {
    await expect(loggedInInventory.items).toHaveCount(6);
  });

  test('sorting by price low to high works', async ({ loggedInInventory }) => {
    await loggedInInventory.sortBy('lohi');
    const prices = await loggedInInventory.getAllPrices();
    const expectedOrder = [...prices].sort((a, b) => a - b);   // sort a copy ourselves
    expect(prices).toEqual(expectedOrder);
  });

  test('adding a product shows 1 in the cart badge', async ({ loggedInInventory }) => {
    await loggedInInventory.addToCart(checkoutData.product);
    await expect(loggedInInventory.cartBadge).toHaveText('1');
  });

  test('removing a product clears the cart badge', async ({ loggedInInventory }) => {
    await loggedInInventory.addToCart(checkoutData.product);
    await loggedInInventory.removeFromCart(checkoutData.product);
    await expect(loggedInInventory.cartBadge).toHaveCount(0);   // badge disappears when cart is empty
  });

  test('user can log out', async ({ loggedInInventory, loginPage }) => {
    await loggedInInventory.logout();
    await expect(loginPage.loginButton).toBeVisible();
  });
});
