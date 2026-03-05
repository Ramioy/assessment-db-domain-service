import { BadRequestException } from '@nestjs/common';
import { ZodValidationPipe } from '@presentation/pipes/zod-validation.pipe';
import { z } from 'zod';

const testSchema = z.object({
  name: z.string().min(1),
  age: z.number().int().positive(),
});

describe('ZodValidationPipe', () => {
  let pipe: ZodValidationPipe;

  beforeEach(() => {
    pipe = new ZodValidationPipe(testSchema);
  });

  it('returns the parsed value when data is valid', () => {
    const input = { name: 'Alice', age: 30 };
    const result = pipe.transform(input);
    expect(result).toEqual(input);
  });

  it('strips unknown fields (zod strip behavior)', () => {
    const input = { name: 'Alice', age: 30, extra: 'should be removed' };
    const result = pipe.transform(input) as Record<string, unknown>;
    expect(result).not.toHaveProperty('extra');
  });

  it('throws BadRequestException when data is invalid', () => {
    const input = { name: '', age: 30 };
    expect(() => pipe.transform(input)).toThrow(BadRequestException);
  });

  it('includes validation errors in the exception response', () => {
    const input = { name: '', age: -1 };
    try {
      pipe.transform(input);
      fail('should have thrown');
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
      const response = (e as BadRequestException).getResponse() as Record<string, unknown>;
      expect(response.message).toBe('Validation failed');
      expect(Array.isArray(response.errors)).toBe(true);
      expect((response.errors as unknown[]).length).toBeGreaterThan(0);
    }
  });

  it('includes the field path in each error', () => {
    const input = { name: 'Alice', age: -5 };
    try {
      pipe.transform(input);
    } catch (e) {
      const response = (e as BadRequestException).getResponse() as Record<string, unknown>;
      const errors = response.errors as Array<{ path: string; message: string }>;
      expect(errors.some((err) => err.path === 'age')).toBe(true);
    }
  });

  it('throws BadRequestException when required field is missing', () => {
    expect(() => pipe.transform({ age: 25 })).toThrow(BadRequestException);
  });

  it('works with a simple string schema', () => {
    const stringPipe = new ZodValidationPipe(z.string().min(3));
    expect(stringPipe.transform('hello')).toBe('hello');
    expect(() => stringPipe.transform('ab')).toThrow(BadRequestException);
  });
});
