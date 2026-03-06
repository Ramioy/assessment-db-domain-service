// @ts-nocheck

import { ProductMapper } from '@infrastructure/persistence/mappers/product.mapper';
import { ProductOrmEntity } from '@infrastructure/persistence/entities/product.orm-entity';
import { Product } from '@domain/models/product.entity';
import { makeProduct } from '../../../../helpers/entity-factory';

describe('ProductMapper', () => {
  const NOW = new Date('2024-01-15T10:00:00.000Z');

  describe('toDomain()', () => {
    it('maps ORM entity to domain entity', () => {
      const orm = Object.assign(new ProductOrmEntity(), {
        id: 1,
        uuid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        name: 'Laptop Pro',
        description: 'High-performance laptop',
        imageUrl: 'https://example.com/laptop.png',
        categoryId: 2,
        createdAt: NOW,
        updatedAt: NOW,
      });

      const domain = ProductMapper.toDomain(orm);

      expect(domain).toBeInstanceOf(Product);
      expect(domain.id).toBe(1);
      expect(domain.uuid).toBe('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
      expect(domain.name).toBe('Laptop Pro');
      expect(domain.description).toBe('High-performance laptop');
      expect(domain.imageUrl).toBe('https://example.com/laptop.png');
      expect(domain.categoryId).toBe(2);
      expect(domain.createdAt).toBe(NOW);
      expect(domain.updatedAt).toBe(NOW);
    });

    it('maps null nullable fields correctly', () => {
      const orm = Object.assign(new ProductOrmEntity(), {
        id: 2,
        uuid: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        name: 'Widget',
        description: null,
        imageUrl: null,
        categoryId: 1,
        createdAt: NOW,
        updatedAt: NOW,
      });

      const domain = ProductMapper.toDomain(orm);

      expect(domain.description).toBeNull();
      expect(domain.imageUrl).toBeNull();
    });
  });

  describe('toOrm()', () => {
    it('maps domain entity to ORM entity with id and uuid when both are set', () => {
      const entity = makeProduct({ id: 5, uuid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' });
      const orm = ProductMapper.toOrm(entity);

      expect(orm).toBeInstanceOf(ProductOrmEntity);
      expect(orm.id).toBe(5);
      expect(orm.uuid).toBe('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
      expect(orm.name).toBe(entity.name);
      expect(orm.categoryId).toBe(entity.categoryId);
    });

    it('does not set id on ORM entity when id is 0 (new entity)', () => {
      const entity = Product.create({ name: 'New Product', categoryId: 1 });
      const orm = ProductMapper.toOrm(entity);

      expect(orm.id).toBeUndefined();
    });

    it('does not set uuid on ORM entity when uuid is empty string (new entity)', () => {
      const entity = Product.create({ name: 'New Product', categoryId: 1 });
      const orm = ProductMapper.toOrm(entity);

      expect(orm.uuid).toBeUndefined();
    });

    it('maps nullable fields to null when not provided', () => {
      const entity = makeProduct({ description: undefined, imageUrl: undefined });
      const orm = ProductMapper.toOrm(entity);

      expect(orm.description).toBeNull();
      expect(orm.imageUrl).toBeNull();
    });
  });
});
