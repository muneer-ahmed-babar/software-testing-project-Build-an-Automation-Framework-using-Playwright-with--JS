import { test, expect } from '@playwright/test';
import { readJson } from '../../utilities/readJson.js';
import { validateSchema, attachResponse } from '../../utilities/apiHelper.js';

const api = readJson('apiData.json');
const postSchema = readJson('schemas/post.schema.json');
const MAX_RESPONSE_TIME_MS = 3000;

test.describe('Posts API', () => {
  test('GET all posts: status, headers, time, count', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get(api.getAllPosts.endpoint);
    const responseTime = Date.now() - startTime;
    const body = await response.json();
    await attachResponse('GET /posts', body.slice(0, 3));   // attach only 3 items to keep the report small

    expect(response.status()).toBe(api.getAllPosts.expectedStatus);
    expect(response.headers()['content-type']).toContain('application/json');
    expect(responseTime).toBeLessThan(MAX_RESPONSE_TIME_MS);
    expect(body).toHaveLength(api.getAllPosts.expectedCount);
  });

  test('GET single post matches the JSON schema', async ({ request }) => {
    const response = await request.get(api.getSinglePost.endpoint);
    const body = await response.json();
    await attachResponse('GET /posts/1', body);

    expect(response.status()).toBe(api.getSinglePost.expectedStatus);
    expect(body.userId).toBe(api.getSinglePost.expectedUserId);

    const { valid, errors } = validateSchema(postSchema, body);
    expect(valid, JSON.stringify(errors)).toBe(true);
  });

  test('GET missing post returns 404', async ({ request }) => {
    const response = await request.get(api.getMissingPost.endpoint);
    expect(response.status()).toBe(api.getMissingPost.expectedStatus);
  });

  test('GET posts filtered by userId', async ({ request }) => {
    const response = await request.get(api.getPostsByUser.endpoint);
    const body = await response.json();

    expect(response.status()).toBe(api.getPostsByUser.expectedStatus);
    expect(body).toHaveLength(api.getPostsByUser.expectedCount);
    expect(body.every((post) => post.userId === 1)).toBe(true);   // every post belongs to user 1
  });

  test('POST creates a new post', async ({ request }) => {
    const response = await request.post(api.createPost.endpoint, { data: api.createPost.payload });
    const body = await response.json();
    await attachResponse('POST /posts', body);

    expect(response.status()).toBe(api.createPost.expectedStatus);
    expect(body.title).toBe(api.createPost.payload.title);
    expect(body.id).toBeDefined();                           // server gives the new post an id
    expect(validateSchema(postSchema, body).valid).toBe(true);
  });

  test('PUT replaces a post', async ({ request }) => {
    const response = await request.put(api.updatePost.endpoint, { data: api.updatePost.payload });
    const body = await response.json();

    expect(response.status()).toBe(api.updatePost.expectedStatus);
    expect(body.title).toBe(api.updatePost.payload.title);
  });

  test('PATCH changes only one field', async ({ request }) => {
    const response = await request.patch(api.patchPost.endpoint, { data: api.patchPost.payload });
    const body = await response.json();

    expect(response.status()).toBe(api.patchPost.expectedStatus);
    expect(body.title).toBe(api.patchPost.payload.title);
    expect(body.userId).toBe(1);                             // other fields stay untouched
  });

  test('DELETE removes a post', async ({ request }) => {
    const response = await request.delete(api.deletePost.endpoint);
    expect(response.status()).toBe(api.deletePost.expectedStatus);
  });
});
