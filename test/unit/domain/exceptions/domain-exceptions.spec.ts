import { DomainException } from '@domain/exceptions/domain.exception';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
import { AlreadyExistsException } from '@domain/exceptions/already-exists.exception';
import { InsufficientStockException } from '@domain/exceptions/insufficient-stock.exception';
import { InvalidTransactionException } from '@domain/exceptions/invalid-transaction.exception';

describe('Domain Exceptions', () => {
  describe('DomainException', () => {
    it('is an instance of Error', () => {
      const ex = new DomainException('base error');
      expect(ex).toBeInstanceOf(Error);
    });

    it('sets the correct name', () => {
      const ex = new DomainException('msg');
      expect(ex.name).toBe('DomainException');
    });

    it('sets the message', () => {
      const ex = new DomainException('something went wrong');
      expect(ex.message).toBe('something went wrong');
    });
  });

  describe('NotFoundException', () => {
    it('extends DomainException', () => {
      const ex = new NotFoundException('Product', 5);
      expect(ex).toBeInstanceOf(DomainException);
      expect(ex).toBeInstanceOf(Error);
    });

    it('sets name to NotFoundException', () => {
      const ex = new NotFoundException('Customer', 99);
      expect(ex.name).toBe('NotFoundException');
    });

    it('formats message with entity name and numeric id', () => {
      const ex = new NotFoundException('Product', 42);
      expect(ex.message).toBe('Product with id 42 not found');
    });

    it('formats message with entity name and string id', () => {
      const ex = new NotFoundException('Product', 'some-uuid');
      expect(ex.message).toBe('Product with id some-uuid not found');
    });
  });

  describe('AlreadyExistsException', () => {
    it('extends DomainException', () => {
      const ex = new AlreadyExistsException('Customer', 'email', 'a@b.com');
      expect(ex).toBeInstanceOf(DomainException);
    });

    it('sets name to AlreadyExistsException', () => {
      const ex = new AlreadyExistsException('Customer', 'email', 'a@b.com');
      expect(ex.name).toBe('AlreadyExistsException');
    });

    it('formats message correctly', () => {
      const ex = new AlreadyExistsException('Customer', 'email', 'a@b.com');
      expect(ex.message).toBe("Customer with email 'a@b.com' already exists");
    });
  });

  describe('InsufficientStockException', () => {
    it('extends DomainException', () => {
      const ex = new InsufficientStockException(1, 10, 3);
      expect(ex).toBeInstanceOf(DomainException);
    });

    it('sets name to InsufficientStockException', () => {
      const ex = new InsufficientStockException(1, 10, 3);
      expect(ex.name).toBe('InsufficientStockException');
    });

    it('formats message with productId, requested, and available', () => {
      const ex = new InsufficientStockException(7, 10, 3);
      expect(ex.message).toBe(
        'Insufficient stock for product 7: requested 10, available 3',
      );
    });
  });

  describe('InvalidTransactionException', () => {
    it('extends DomainException', () => {
      const ex = new InvalidTransactionException('bad input');
      expect(ex).toBeInstanceOf(DomainException);
    });

    it('sets name to InvalidTransactionException', () => {
      const ex = new InvalidTransactionException('bad input');
      expect(ex.name).toBe('InvalidTransactionException');
    });

    it('formats message with reason', () => {
      const ex = new InvalidTransactionException('customer id must be positive');
      expect(ex.message).toBe(
        'Invalid transaction: customer id must be positive',
      );
    });
  });
});
