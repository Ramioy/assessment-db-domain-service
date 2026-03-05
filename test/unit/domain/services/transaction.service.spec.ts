import { TransactionService } from '@domain/services/transaction.service';
import { InvalidTransactionException } from '@domain/exceptions/invalid-transaction.exception';

describe('TransactionService', () => {
  let service: TransactionService;

  beforeEach(() => {
    service = new TransactionService();
  });

  describe('validateTransactionCreation', () => {
    it('does not throw for valid customerId and statusId', () => {
      expect(() => service.validateTransactionCreation(1, 1)).not.toThrow();
    });

    it('does not throw for large positive values', () => {
      expect(() => service.validateTransactionCreation(999, 5)).not.toThrow();
    });

    it('throws InvalidTransactionException when customerId is zero', () => {
      expect(() => service.validateTransactionCreation(0, 1)).toThrow(
        InvalidTransactionException,
      );
    });

    it('throws with correct message when customerId is zero', () => {
      expect(() => service.validateTransactionCreation(0, 1)).toThrow(
        'customer id must be a positive integer',
      );
    });

    it('throws InvalidTransactionException when customerId is negative', () => {
      expect(() => service.validateTransactionCreation(-1, 1)).toThrow(
        InvalidTransactionException,
      );
    });

    it('throws InvalidTransactionException when statusId is zero', () => {
      expect(() => service.validateTransactionCreation(1, 0)).toThrow(
        InvalidTransactionException,
      );
    });

    it('throws with correct message when statusId is zero', () => {
      expect(() => service.validateTransactionCreation(1, 0)).toThrow(
        'transaction status id must be a positive integer',
      );
    });

    it('throws InvalidTransactionException when statusId is negative', () => {
      expect(() => service.validateTransactionCreation(1, -5)).toThrow(
        InvalidTransactionException,
      );
    });

    it('validates customerId before statusId', () => {
      // Both invalid – the customerId error should surface first
      try {
        service.validateTransactionCreation(0, 0);
        fail('should have thrown');
      } catch (e) {
        expect((e as Error).message).toContain('customer id');
      }
    });
  });
});
