// @ts-nocheck
/* eslint-disable */
import { Stock } from '@domain/models/stock.entity';
import { InsufficientStockError } from '@domain/errors';
import { makeStock } from '../../../helpers/entity-factory';

describe('Stock', () => {
  const NOW = new Date('2024-01-15T10:00:00.000Z');

  describe('create()', () => {
    it('returns a Stock with correct fields and id=0', () => {
      const stock = Stock.create({ productId: 5, description: 'Shelf B', quantity: 20 });

      expect(stock.id).toBe(0);
      expect(stock.productId).toBe(5);
      expect(stock.description).toBe('Shelf B');
      expect(stock.quantity).toBe(20);
    });

    it('defaults quantity to 0 when not provided', () => {
      const stock = Stock.create({ productId: 1 });

      expect(stock.quantity).toBe(0);
    });
  });

  describe('fromPersistence()', () => {
    it('reconstitutes a Stock from persistence data', () => {
      const stock = Stock.fromPersistence({
        id: 7,
        productId: 2,
        description: 'Warehouse A',
        quantity: 100,
        createdAt: NOW,
        updatedAt: NOW,
      });

      expect(stock.id).toBe(7);
      expect(stock.productId).toBe(2);
      expect(stock.quantity).toBe(100);
    });
  });

  describe('applyUpdate()', () => {
    it('returns a new Stock with updated quantity', () => {
      const stock = makeStock({ quantity: 50 });
      const updated = stock.applyUpdate({ quantity: 30 });

      expect(updated.quantity).toBe(30);
      expect(updated.id).toBe(stock.id);
      expect(updated.productId).toBe(stock.productId);
    });

    it('preserves existing values when update is empty', () => {
      const stock = makeStock({ quantity: 50 });
      const updated = stock.applyUpdate({});

      expect(updated.quantity).toBe(50);
      expect(updated.productId).toBe(stock.productId);
    });
  });

  describe('hasEnough()', () => {
    it('returns true when stock quantity meets requested amount', () => {
      const stock = makeStock({ quantity: 50 });

      expect(stock.hasEnough(10)).toBe(true);
      expect(stock.hasEnough(50)).toBe(true);
    });

    it('returns false when stock quantity is insufficient', () => {
      const stock = makeStock({ quantity: 5 });

      expect(stock.hasEnough(10)).toBe(false);
    });

    it('returns false when requested quantity is zero or negative', () => {
      const stock = makeStock({ quantity: 50 });

      expect(stock.hasEnough(0)).toBe(false);
      expect(stock.hasEnough(-1)).toBe(false);
    });
  });

  describe('decrement()', () => {
    it('returns a new Stock with reduced quantity', () => {
      const stock = makeStock({ quantity: 50 });
      const result = stock.decrement(10);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.quantity).toBe(40);
        expect(result.value.productId).toBe(stock.productId);
        expect(result.value.id).toBe(stock.id);
      }
    });

    it('returns InsufficientStockError when quantity is insufficient', () => {
      const stock = makeStock({ quantity: 5 });
      const result = stock.decrement(10);

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBeInstanceOf(InsufficientStockError);
    });

    it('returns InsufficientStockError when requested quantity is zero', () => {
      const stock = makeStock({ quantity: 50 });
      const result = stock.decrement(0);

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBeInstanceOf(InsufficientStockError);
    });

    it('returns InsufficientStockError when requested quantity is negative', () => {
      const stock = makeStock({ quantity: 50 });
      const result = stock.decrement(-5);

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBeInstanceOf(InsufficientStockError);
    });

    it('does not mutate the original Stock', () => {
      const stock = makeStock({ quantity: 50 });
      stock.decrement(10);

      expect(stock.quantity).toBe(50);
    });
  });
});
