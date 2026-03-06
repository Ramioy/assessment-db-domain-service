// @ts-nocheck
/* eslint-disable */
import { StockMapper } from '@infrastructure/persistence/mappers/stock.mapper';
import { StockOrmEntity } from '@infrastructure/persistence/entities/stock.orm-entity';
import { Stock } from '@domain/models/stock.entity';
import { makeStock } from '../../../../helpers/entity-factory';

describe('StockMapper', () => {
  const NOW = new Date('2024-01-15T10:00:00.000Z');

  describe('toDomain()', () => {
    it('maps ORM entity to domain entity', () => {
      const orm = Object.assign(new StockOrmEntity(), {
        id: 1,
        productId: 10,
        description: 'Warehouse A',
        quantity: 50,
        createdAt: NOW,
        updatedAt: NOW,
      });

      const domain = StockMapper.toDomain(orm);

      expect(domain).toBeInstanceOf(Stock);
      expect(domain.id).toBe(1);
      expect(domain.productId).toBe(10);
      expect(domain.description).toBe('Warehouse A');
      expect(domain.quantity).toBe(50);
      expect(domain.createdAt).toBe(NOW);
      expect(domain.updatedAt).toBe(NOW);
    });

    it('maps null description correctly', () => {
      const orm = Object.assign(new StockOrmEntity(), {
        id: 2,
        productId: 5,
        description: null,
        quantity: 0,
        createdAt: NOW,
        updatedAt: NOW,
      });

      const domain = StockMapper.toDomain(orm);

      expect(domain.description).toBeNull();
    });
  });

  describe('toOrm()', () => {
    it('maps domain entity to ORM entity with id when id > 0', () => {
      const entity = makeStock({ id: 7 });
      const orm = StockMapper.toOrm(entity);

      expect(orm).toBeInstanceOf(StockOrmEntity);
      expect(orm.id).toBe(7);
      expect(orm.productId).toBe(entity.productId);
      expect(orm.description).toBe(entity.description);
      expect(orm.quantity).toBe(entity.quantity);
    });

    it('does not set id on ORM entity when id is 0 (new entity)', () => {
      const entity = Stock.create({ productId: 1, quantity: 10 });
      const orm = StockMapper.toOrm(entity);

      expect(orm.id).toBeUndefined();
    });

    it('maps null description to null', () => {
      const entity = makeStock({ description: undefined });
      const orm = StockMapper.toOrm(entity);

      expect(orm.description).toBeNull();
    });
  });
});
