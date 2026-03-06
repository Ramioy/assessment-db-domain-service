// @ts-nocheck
/* eslint-disable */
import { Transaction } from '@domain/models/transaction.entity';
import { makeTransaction } from '../../../helpers/entity-factory';

describe('Transaction', () => {
  const NOW = new Date('2024-01-15T10:00:00.000Z');

  const createDto = {
    customerId: 1,
    transactionStatusId: 2,
    cut: null,
  };

  describe('create()', () => {
    it('returns a Transaction with correct fields and id=0', () => {
      const transaction = Transaction.create(createDto);

      expect(transaction.id).toBe(0);
      expect(transaction.customerId).toBe(1);
      expect(transaction.transactionStatusId).toBe(2);
      expect(transaction.cut).toBeNull();
    });

    it('sets cut when provided', () => {
      const transaction = Transaction.create({ ...createDto, cut: '2024-01' });

      expect(transaction.cut).toBe('2024-01');
    });
  });

  describe('fromPersistence()', () => {
    it('reconstitutes a Transaction from persistence data', () => {
      const transaction = Transaction.fromPersistence({
        id: 10,
        customerId: 1,
        transactionStatusId: 2,
        cut: '2024-01',
        createdAt: NOW,
        updatedAt: NOW,
      });

      expect(transaction.id).toBe(10);
      expect(transaction.customerId).toBe(1);
      expect(transaction.cut).toBe('2024-01');
    });
  });

  describe('applyUpdate()', () => {
    it('returns a new Transaction with updated status', () => {
      const transaction = makeTransaction({ id: 1, transactionStatusId: 1 });
      const updated = transaction.applyUpdate({ transactionStatusId: 3 });

      expect(updated.transactionStatusId).toBe(3);
      expect(updated.id).toBe(1);
      expect(updated.customerId).toBe(transaction.customerId);
    });

    it('preserves existing values when update is empty', () => {
      const transaction = makeTransaction({ id: 1 });
      const updated = transaction.applyUpdate({});

      expect(updated.customerId).toBe(transaction.customerId);
      expect(updated.transactionStatusId).toBe(transaction.transactionStatusId);
      expect(updated.id).toBe(1);
    });

    it('allows updating cut field', () => {
      const transaction = makeTransaction({ cut: null });
      const updated = transaction.applyUpdate({ cut: '2024-02' });

      expect(updated.cut).toBe('2024-02');
    });

    it('does not mutate the original Transaction', () => {
      const transaction = makeTransaction({ transactionStatusId: 1 });
      transaction.applyUpdate({ transactionStatusId: 2 });

      expect(transaction.transactionStatusId).toBe(1);
    });

    it('returns a different object reference', () => {
      const transaction = makeTransaction();
      const updated = transaction.applyUpdate({ transactionStatusId: 3 });

      expect(updated).not.toBe(transaction);
    });
  });
});
