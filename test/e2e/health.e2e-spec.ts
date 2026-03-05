// @ts-nocheck
/* eslint-disable */
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { bootstrapTestApp } from './app-bootstrap';

describe('HealthController (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    ({ app } = await bootstrapTestApp());
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health returns 200 with status field', async () => {
    const response = await app.inject({ method: 'GET', url: '/health' });

    expect(response.statusCode).toBe(200);
    const body = response.json<{ status: string; db: string; timestamp: string }>();
    expect(['ok', 'degraded']).toContain(body.status);
    expect(typeof body.timestamp).toBe('string');
  });
});
