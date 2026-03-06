// @ts-nocheck
/* eslint-disable */
import { TransactionMapper } from '@infrastructure/persistence/mappers/transaction.mapper';
import { TransactionOrmEntity } from '@infrastructure/persistence/entities/transaction.orm-entity';
import { Transaction } from '@domain/models/transaction.entity';
import { makeTransaction } from '../../../../helpers/entity-factory';

describe('TransactionMapper', () => {
  const NOW = new Date('2024-01-15T10:00:00.000Z');

  describe('toDomain()', () => {
    it('maps ORM entity to domain entity', () => {
      const orm = Object.assign(new TransactionOrmEntity(), {
        id: 1,
        customerId: 10,
        cut: 'CUT-001',
        transactionStatusId: 2,
        createdAt: NOW,
        updatedAt: NOW,
      });

      const domain = TransactionMapper.toDomain(orm);

      expect(domain).toBeInstanceOf(Transaction);
      expect(domain.id).toBe(1);
      expect(domain.customerId).toBe(10);
      expect(domain.cut).toBe('CUT-001');
      expect(domain.transactionStatusId).toBe(2);
      expect(domain.createdAt).toBe(NOW);
      expect(domain.updatedAt).toBe(NOW);
    });

    it('maps null cut correctly', () => {
      const orm = Object.assign(new TransactionOrmEntity(), {
        id: 2,
        customerId: 1,
        cut: null,
        transactionStatusId: 1,
        createdAt: NOW,
        updatedAt: NOW,
      });

      const domain = TransactionMapper.toDomain(orm);

      expect(domain.cut).toBeNull();
    });
  });

  describe('toOrm()', () => {
    it('maps domain entity to ORM entity with id when id > 0', () => {
      const entity = makeTransaction({ id: 3 });
      const orm = TransactionMapper.toOrm(entity);

      expect(orm).toBeInstanceOf(TransactionOrmEntity);
      expect(orm.id).toBe(3);
      expect(orm.customerId).toBe(entity.customerId);
      expect(orm.transactionStatusId).toBe(entity.transactionStatusId);
    });

    it('does not set id on ORM entity when id is 0 (new entity)', () => {
      const entity = Transaction.create({ customerId: 1, transactionStatusId: 1 });
      const orm = TransactionMapper.toOrm(entity);

      expect(orm.id).toBeUndefined();
    });

    it('maps null cut to null', () => {
      const entity = makeTransaction({ cut: undefined });
      const orm = TransactionMapper.toOrm(entity);

      expect(orm.cut).toBeNull();
    });
  });
});
