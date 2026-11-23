import { test } from '@playwright/test';
import Ajv from 'ajv';

const ajv = new Ajv();

// Checks that a response body matches a JSON schema. Returns { valid, errors }
export function validateSchema(schema, data) {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  return { valid, errors: validate.errors };
}

// Adds the response body to the Allure report so it can be inspected later
export async function attachResponse(name, body) {
  await test.info().attach(name, {
    body: JSON.stringify(body, null, 2),
    contentType: 'application/json',
  });
}
