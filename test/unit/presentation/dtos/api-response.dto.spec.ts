// @ts-nocheck

import { toApiResponse } from '@presentation/dtos/common/api-response.dto';

describe('toApiResponse', () => {
  it('wraps data with statusCode 200 by default', () => {
    const result = toApiResponse({ id: 1 });
    expect(result.data).toEqual({ id: 1 });
    expect(result.statusCode).toBe(200);
    expect(typeof result.timestamp).toBe('string');
  });

  it('uses custom statusCode when provided', () => {
    const result = toApiResponse('created', 201);
    expect(result.statusCode).toBe(201);
    expect(result.data).toBe('created');
  });

  it('timestamp is a valid ISO date string', () => {
    const result = toApiResponse(null);
    expect(() => new Date(result.timestamp)).not.toThrow();
    expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
  });
});
