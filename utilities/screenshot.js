import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Takes a screenshot in the middle of a test and attaches it to the Allure report
export async function attachStepScreenshot(page, name) {
  await test.info().attach(name, {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
}

// Called from the afterEach hook.
// Always attaches a final screenshot; if the test failed, it also saves a PNG to /screenshots
export async function afterEachScreenshot(page, testInfo) {
  const image = await page.screenshot();
  await testInfo.attach('Final Screenshot', { body: image, contentType: 'image/png' });

  const testFailed = testInfo.status !== testInfo.expectedStatus;
  if (testFailed) {
    const safeName = testInfo.title.replace(/[^a-z0-9]/gi, '_');
    fs.mkdirSync('screenshots', { recursive: true });
    fs.writeFileSync(path.join('screenshots', `${safeName}.png`), image);
    await testInfo.attach('Failure Screenshot', { body: image, contentType: 'image/png' });
  }
}
