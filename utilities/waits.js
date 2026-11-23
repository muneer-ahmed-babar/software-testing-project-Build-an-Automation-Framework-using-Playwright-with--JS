// Explicit wait: wait until an element is visible
export async function waitForVisible(locator, timeout = 10_000) {
  await locator.waitFor({ state: 'visible', timeout });
}

// Explicit wait: wait until the URL contains some text, e.g. 'inventory'
export async function waitForUrlContains(page, text, timeout = 10_000) {
  await page.waitForURL(`**${text}*`, { timeout });
}

// Explicit wait: wait until the page stops making network calls
export async function waitForNetworkIdle(page) {
  await page.waitForLoadState('networkidle');
}
