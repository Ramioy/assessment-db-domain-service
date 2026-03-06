// @ts-nocheck
/* eslint-disable */
import { TransactionStatusMapper } from '@infrastructure/persistence/mappers/transaction-status.mapper';
import { TransactionStatusOrmEntity } from '@infrastructure/persistence/entities/transaction-status.orm-entity';
import { TransactionStatus } from '@domain/models/transaction-status.entity';
import { makeTransactionStatus } from '../../../../helpers/entity-factory';

describe('TransactionStatusMapper', () => {
  const NOW = new Date('2024-01-15T10:00:00.000Z');

  describe('toDomain()', () => {
    it('maps ORM entity to domain entity', () => {
      const orm = Object.assign(new TransactionStatusOrmEntity(), {
        id: 1,
        name: 'PENDING',
        description: 'Awaiting processing',
        createdAt: NOW,
        updatedAt: NOW,
      });

      const domain = TransactionStatusMapper.toDomain(orm);

      expect(domain).toBeInstanceOf(TransactionStatus);
      expect(domain.id).toBe(1);
      expect(domain.name).toBe('PENDING');
      expect(domain.description).toBe('Awaiting processing');
      expect(domain.createdAt).toBe(NOW);
      expect(domain.updatedAt).toBe(NOW);
    });

    it('maps null description correctly', () => {
      const orm = Object.assign(new TransactionStatusOrmEntity(), {
        id: 2,
        name: 'APPROVED',
        description: null,
        createdAt: NOW,
        updatedAt: NOW,
      });

      const domain = TransactionStatusMapper.toDomain(orm);

      expect(domain.description).toBeNull();
    });
  });

  describe('toOrm()', () => {
    it('maps domain entity to ORM entity with id when id > 0', () => {
      const entity = makeTransactionStatus({ id: 5 });
      const orm = TransactionStatusMapper.toOrm(entity);

      expect(orm).toBeInstanceOf(TransactionStatusOrmEntity);
      expect(orm.id).toBe(5);
      expect(orm.name).toBe(entity.name);
      expect(orm.description).toBe(entity.description);
    });

    it('does not set id on ORM entity when id is 0 (new entity)', () => {
      const entity = TransactionStatus.create({ name: 'CANCELLED' });
      const orm = TransactionStatusMapper.toOrm(entity);

      expect(orm.id).toBeUndefined();
    });

    it('maps null description to null', () => {
      const entity = makeTransactionStatus({ description: undefined });
      const orm = TransactionStatusMapper.toOrm(entity);

      expect(orm.description).toBeNull();
    });
  });
});
