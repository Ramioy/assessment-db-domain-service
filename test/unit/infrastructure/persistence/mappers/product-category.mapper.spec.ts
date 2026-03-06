// @ts-nocheck
/* eslint-disable */
import { ProductCategoryMapper } from '@infrastructure/persistence/mappers/product-category.mapper';
import { ProductCategoryOrmEntity } from '@infrastructure/persistence/entities/product-category.orm-entity';
import { ProductCategory } from '@domain/models/product-category.entity';
import { makeProductCategory } from '../../../../helpers/entity-factory';

describe('ProductCategoryMapper', () => {
  const NOW = new Date('2024-01-15T10:00:00.000Z');

  describe('toDomain()', () => {
    it('maps ORM entity to domain entity', () => {
      const orm = Object.assign(new ProductCategoryOrmEntity(), {
        id: 1,
        name: 'Electronics',
        description: 'Electronic devices',
        createdAt: NOW,
        updatedAt: NOW,
      });

      const domain = ProductCategoryMapper.toDomain(orm);

      expect(domain).toBeInstanceOf(ProductCategory);
      expect(domain.id).toBe(1);
      expect(domain.name).toBe('Electronics');
      expect(domain.description).toBe('Electronic devices');
      expect(domain.createdAt).toBe(NOW);
      expect(domain.updatedAt).toBe(NOW);
    });

    it('maps null description correctly', () => {
      const orm = Object.assign(new ProductCategoryOrmEntity(), {
        id: 2,
        name: 'Books',
        description: null,
        createdAt: NOW,
        updatedAt: NOW,
      });

      const domain = ProductCategoryMapper.toDomain(orm);

      expect(domain.description).toBeNull();
    });
  });

  describe('toOrm()', () => {
    it('maps domain entity to ORM entity with id when id > 0', () => {
      const entity = makeProductCategory({ id: 4 });
      const orm = ProductCategoryMapper.toOrm(entity);

      expect(orm).toBeInstanceOf(ProductCategoryOrmEntity);
      expect(orm.id).toBe(4);
      expect(orm.name).toBe(entity.name);
      expect(orm.description).toBe(entity.description);
    });

    it('does not set id on ORM entity when id is 0 (new entity)', () => {
      const entity = ProductCategory.create({ name: 'New Category' });
      const orm = ProductCategoryMapper.toOrm(entity);

      expect(orm.id).toBeUndefined();
    });

    it('maps null description to null', () => {
      const entity = makeProductCategory({ description: undefined });
      const orm = ProductCategoryMapper.toOrm(entity);

      expect(orm.description).toBeNull();
    });
  });
});
