// @ts-nocheck
/* eslint-disable */
import { StockService } from '@domain/services/stock.service';
import { InsufficientStockError } from '@domain/errors';
import { makeStock } from '../../../helpers/entity-factory';

describe('StockService', () => {
  let service: StockService;

  beforeEach(() => {
    service = new StockService();
  });

  describe('validateStockAvailability', () => {
    it('returns ok when stock is sufficient', () => {
      const stock = makeStock({ quantity: 10 });
      const result = service.validateStockAvailability(stock, 5);
      expect(result.ok).toBe(true);
    });

    it('returns ok when requested equals available', () => {
      const stock = makeStock({ quantity: 5 });
      const result = service.validateStockAvailability(stock, 5);
      expect(result.ok).toBe(true);
    });

    it('returns InsufficientStockError when requestedQty is zero', () => {
      const stock = makeStock({ quantity: 10 });
      const result = service.validateStockAvailability(stock, 0);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBeInstanceOf(InsufficientStockError);
    });

    it('returns InsufficientStockError when requestedQty is negative', () => {
      const stock = makeStock({ quantity: 10 });
      const result = service.validateStockAvailability(stock, -3);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBeInstanceOf(InsufficientStockError);
    });

    it('returns InsufficientStockError when stock is insufficient', () => {
      const stock = makeStock({ productId: 7, quantity: 2 });
      const result = service.validateStockAvailability(stock, 5);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBeInstanceOf(InsufficientStockError);
    });

    it('returns InsufficientStockError with correct details', () => {
      const stock = makeStock({ productId: 7, quantity: 2 });
      const result = service.validateStockAvailability(stock, 5);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(InsufficientStockError);
        expect(result.error.message).toContain('product 7');
        expect(result.error.message).toContain('requested 5');
        expect(result.error.message).toContain('available 2');
      }
    });
  });

  describe('decrementStock', () => {
    it('decrements quantity by the given amount', () => {
      const stock = makeStock({ quantity: 10 });
      const result = service.decrementStock(stock, 3);
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.value.quantity).toBe(7);
    });

    it('returns the same stock object (mutated in-place)', () => {
      const stock = makeStock({ quantity: 10 });
      const result = service.decrementStock(stock, 4);
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.value).toBe(stock);
    });

    it('allows decrement to zero', () => {
      const stock = makeStock({ quantity: 5 });
      const result = service.decrementStock(stock, 5);
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.value.quantity).toBe(0);
    });

    it('returns error when requested qty exceeds stock', () => {
      const stock = makeStock({ quantity: 3 });
      const result = service.decrementStock(stock, 10);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBeInstanceOf(InsufficientStockError);
    });

    it('returns error when qty is zero', () => {
      const stock = makeStock({ quantity: 10 });
      const result = service.decrementStock(stock, 0);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBeInstanceOf(InsufficientStockError);
    });
  });
});
