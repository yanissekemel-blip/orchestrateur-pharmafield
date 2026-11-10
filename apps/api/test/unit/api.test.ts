import { describe, expect, test } from 'bun:test';
import { app } from '../../src/index-api';

describe('API', () => {
  test('GET /api/health reports the API as running', async () => {
    const response = await app.request('/api/health');
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: 'ok' });
  });

  test('unknown routes return the French error envelope', async () => {
    const response = await app.request('/api/unknown');
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Ressource introuvable' },
    });
  });

  test('serves the OpenAPI document', async () => {
    const response = await app.request('/openapi.json');
    expect(response.status).toBe(200);
    const document = (await response.json()) as { paths: object };
    expect(Object.keys(document.paths)).toContain('/api/health');
  });
});
