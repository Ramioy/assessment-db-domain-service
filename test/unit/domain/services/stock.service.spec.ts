import { StockService } from '@domain/services/stock.service';
import { InsufficientStockException } from '@domain/exceptions/insufficient-stock.exception';
import { makeStock } from '../../../helpers/entity-factory';

describe('StockService', () => {
  let service: StockService;

  beforeEach(() => {
    service = new StockService();
  });

  describe('validateStockAvailability', () => {
    it('does not throw when stock is sufficient', () => {
      const stock = makeStock({ quantity: 10 });
      expect(() => service.validateStockAvailability(stock, 5)).not.toThrow();
    });

    it('does not throw when requested equals available', () => {
      const stock = makeStock({ quantity: 5 });
      expect(() => service.validateStockAvailability(stock, 5)).not.toThrow();
    });

    it('throws Error when requestedQty is zero', () => {
      const stock = makeStock({ quantity: 10 });
      expect(() => service.validateStockAvailability(stock, 0)).toThrow(
        'Requested quantity must be greater than zero',
      );
    });

    it('throws Error when requestedQty is negative', () => {
      const stock = makeStock({ quantity: 10 });
      expect(() => service.validateStockAvailability(stock, -3)).toThrow(
        'Requested quantity must be greater than zero',
      );
    });

    it('throws InsufficientStockException when stock is insufficient', () => {
      const stock = makeStock({ productId: 7, quantity: 2 });
      expect(() => service.validateStockAvailability(stock, 5)).toThrow(
        InsufficientStockException,
      );
    });

    it('throws InsufficientStockException with correct details', () => {
      const stock = makeStock({ productId: 7, quantity: 2 });
      try {
        service.validateStockAvailability(stock, 5);
        fail('should have thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(InsufficientStockException);
        expect((e as Error).message).toContain('product 7');
        expect((e as Error).message).toContain('requested 5');
        expect((e as Error).message).toContain('available 2');
      }
    });
  });

  describe('decrementStock', () => {
    it('decrements quantity by the given amount', () => {
      const stock = makeStock({ quantity: 10 });
      const updated = service.decrementStock(stock, 3);
      expect(updated.quantity).toBe(7);
    });

    it('returns the same stock object (mutated in-place)', () => {
      const stock = makeStock({ quantity: 10 });
      const result = service.decrementStock(stock, 4);
      expect(result).toBe(stock);
    });

    it('allows decrement to zero', () => {
      const stock = makeStock({ quantity: 5 });
      const updated = service.decrementStock(stock, 5);
      expect(updated.quantity).toBe(0);
    });

    it('throws when requested qty exceeds stock', () => {
      const stock = makeStock({ quantity: 3 });
      expect(() => service.decrementStock(stock, 10)).toThrow(
        InsufficientStockException,
      );
    });

    it('throws when qty is zero', () => {
      const stock = makeStock({ quantity: 10 });
      expect(() => service.decrementStock(stock, 0)).toThrow(
        'Requested quantity must be greater than zero',
      );
    });
  });
});
