// @ts-nocheck
/* eslint-disable */
import { TransactionStatus } from '@domain/models/transaction-status.entity';
import { makeTransactionStatus } from '../../../helpers/entity-factory';

describe('TransactionStatus', () => {
  const NOW = new Date('2024-01-15T10:00:00.000Z');

  describe('create()', () => {
    it('returns a TransactionStatus with correct fields and id=0', () => {
      const entity = TransactionStatus.create({ name: 'PENDING', description: 'Awaiting processing' });

      expect(entity.id).toBe(0);
      expect(entity.name).toBe('PENDING');
      expect(entity.description).toBe('Awaiting processing');
    });

    it('defaults description to null when not provided', () => {
      const entity = TransactionStatus.create({ name: 'COMPLETED' });

      expect(entity.description).toBeNull();
    });
  });

  describe('fromPersistence()', () => {
    it('reconstitutes a TransactionStatus from persistence data', () => {
      const entity = TransactionStatus.fromPersistence({
        id: 3,
        name: 'APPROVED',
        description: 'Transaction approved',
        createdAt: NOW,
        updatedAt: NOW,
      });

      expect(entity.id).toBe(3);
      expect(entity.name).toBe('APPROVED');
      expect(entity.description).toBe('Transaction approved');
      expect(entity.createdAt).toBe(NOW);
    });
  });

  describe('applyUpdate()', () => {
    it('returns a new TransactionStatus with updated name', () => {
      const entity = makeTransactionStatus({ id: 1, name: 'PENDING' });
      const updated = entity.applyUpdate({ name: 'APPROVED' });

      expect(updated.name).toBe('APPROVED');
      expect(updated.id).toBe(1);
    });

    it('preserves existing values when update is empty', () => {
      const entity = makeTransactionStatus({ id: 2, name: 'PENDING' });
      const updated = entity.applyUpdate({});

      expect(updated.name).toBe('PENDING');
      expect(updated.id).toBe(2);
    });

    it('updates description to null when explicitly set', () => {
      const entity = makeTransactionStatus({ description: 'Some description' });
      const updated = entity.applyUpdate({ description: null });

      expect(updated.description).toBeNull();
    });

    it('does not mutate the original TransactionStatus', () => {
      const entity = makeTransactionStatus({ name: 'PENDING' });
      entity.applyUpdate({ name: 'APPROVED' });

      expect(entity.name).toBe('PENDING');
    });

    it('returns a different object reference', () => {
      const entity = makeTransactionStatus();
      const updated = entity.applyUpdate({ name: 'NEW_STATUS' });

      expect(updated).not.toBe(entity);
    });
  });
});
