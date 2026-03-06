// @ts-nocheck

import {
  NotFoundError,
  AlreadyExistsError,
  InsufficientStockError,
  InvalidTransactionError,
  InfrastructureError,
} from '@domain/errors';

describe('Domain Error Value Objects', () => {
  describe('NotFoundError', () => {
    it('has code NOT_FOUND', () => {
      const error = new NotFoundError('Product', 5);
      expect(error.code).toBe('NOT_FOUND');
    });

    it('stores entity and id', () => {
      const error = new NotFoundError('Customer', 99);
      expect(error.entity).toBe('Customer');
      expect(error.id).toBe(99);
    });

    it('formats message with entity name and numeric id', () => {
      const error = new NotFoundError('Product', 42);
      expect(error.message).toBe('Product with id 42 not found');
    });

    it('formats message with entity name and string id', () => {
      const error = new NotFoundError('Product', 'some-uuid');
      expect(error.message).toBe('Product with id some-uuid not found');
    });
  });

  describe('AlreadyExistsError', () => {
    it('has code ALREADY_EXISTS', () => {
      const error = new AlreadyExistsError('Customer', 'email', 'a@b.com');
      expect(error.code).toBe('ALREADY_EXISTS');
    });

    it('stores entity, field, and value', () => {
      const error = new AlreadyExistsError('Customer', 'email', 'a@b.com');
      expect(error.entity).toBe('Customer');
      expect(error.field).toBe('email');
      expect(error.value).toBe('a@b.com');
    });

    it('formats message correctly', () => {
      const error = new AlreadyExistsError('Customer', 'email', 'a@b.com');
      expect(error.message).toBe("Customer with email 'a@b.com' already exists");
    });
  });

  describe('InsufficientStockError', () => {
    it('has code INSUFFICIENT_STOCK', () => {
      const error = new InsufficientStockError(1, 10, 3);
      expect(error.code).toBe('INSUFFICIENT_STOCK');
    });

    it('stores productId, requested, and available', () => {
      const error = new InsufficientStockError(1, 10, 3);
      expect(error.productId).toBe(1);
      expect(error.requested).toBe(10);
      expect(error.available).toBe(3);
    });

    it('formats message with productId, requested, and available', () => {
      const error = new InsufficientStockError(7, 10, 3);
      expect(error.message).toBe('Insufficient stock for product 7: requested 10, available 3');
    });
  });

  describe('InvalidTransactionError', () => {
    it('has code INVALID_TRANSACTION', () => {
      const error = new InvalidTransactionError('bad input');
      expect(error.code).toBe('INVALID_TRANSACTION');
    });

    it('stores reason', () => {
      const error = new InvalidTransactionError('bad input');
      expect(error.reason).toBe('bad input');
    });

    it('formats message with reason', () => {
      const error = new InvalidTransactionError('customer id must be positive');
      expect(error.message).toBe('Invalid transaction: customer id must be positive');
    });
  });

  describe('InfrastructureError', () => {
    it('has code INFRASTRUCTURE_ERROR', () => {
      const error = new InfrastructureError('db timeout');
      expect(error.code).toBe('INFRASTRUCTURE_ERROR');
    });

    it('stores reason and optional cause', () => {
      const cause = new Error('original');
      const error = new InfrastructureError('db timeout', cause);
      expect(error.reason).toBe('db timeout');
      expect(error.cause).toBe(cause);
    });

    it('formats message with reason', () => {
      const error = new InfrastructureError('connection refused');
      expect(error.message).toBe('Infrastructure error: connection refused');
    });
  });
});
