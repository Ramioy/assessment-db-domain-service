// @ts-nocheck
/* eslint-disable */
import { TransactionService } from '@domain/services/transaction.service';
import { InvalidTransactionError } from '@domain/errors';

describe('TransactionService', () => {
  let service: TransactionService;

  beforeEach(() => {
    service = new TransactionService();
  });

  describe('validateTransactionCreation', () => {
    it('returns ok for valid customerId and statusId', () => {
      const result = service.validateTransactionCreation(1, 1);
      expect(result.ok).toBe(true);
    });

    it('returns ok for large positive values', () => {
      const result = service.validateTransactionCreation(999, 5);
      expect(result.ok).toBe(true);
    });

    it('returns InvalidTransactionError when customerId is zero', () => {
      const result = service.validateTransactionCreation(0, 1);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBeInstanceOf(InvalidTransactionError);
    });

    it('returns error with correct message when customerId is zero', () => {
      const result = service.validateTransactionCreation(0, 1);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain('customer id must be a positive integer');
      }
    });

    it('returns InvalidTransactionError when customerId is negative', () => {
      const result = service.validateTransactionCreation(-1, 1);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBeInstanceOf(InvalidTransactionError);
    });

    it('returns InvalidTransactionError when statusId is zero', () => {
      const result = service.validateTransactionCreation(1, 0);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBeInstanceOf(InvalidTransactionError);
    });

    it('returns error with correct message when statusId is zero', () => {
      const result = service.validateTransactionCreation(1, 0);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain('transaction status id must be a positive integer');
      }
    });

    it('returns InvalidTransactionError when statusId is negative', () => {
      const result = service.validateTransactionCreation(1, -5);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBeInstanceOf(InvalidTransactionError);
    });

    it('validates customerId before statusId', () => {
      // Both invalid - the customerId error should surface first
      const result = service.validateTransactionCreation(0, 0);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain('customer id');
      }
    });
  });
});
