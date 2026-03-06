// @ts-nocheck

import { ProductCategory } from '@domain/models/product-category.entity';
import { makeProductCategory } from '../../../helpers/entity-factory';

describe('ProductCategory', () => {
  const NOW = new Date('2024-01-15T10:00:00.000Z');

  describe('create()', () => {
    it('returns a ProductCategory with correct fields and id=0', () => {
      const category = ProductCategory.create({ name: 'Electronics', description: 'Devices' });

      expect(category.id).toBe(0);
      expect(category.name).toBe('Electronics');
      expect(category.description).toBe('Devices');
    });

    it('defaults description to null when not provided', () => {
      const category = ProductCategory.create({ name: 'Books' });

      expect(category.description).toBeNull();
    });
  });

  describe('fromPersistence()', () => {
    it('reconstitutes a ProductCategory from persistence data', () => {
      const category = ProductCategory.fromPersistence({
        id: 3,
        name: 'Electronics',
        description: 'Devices and accessories',
        createdAt: NOW,
        updatedAt: NOW,
      });

      expect(category.id).toBe(3);
      expect(category.name).toBe('Electronics');
      expect(category.createdAt).toBe(NOW);
    });
  });

  describe('applyUpdate()', () => {
    it('returns a new ProductCategory with updated name', () => {
      const category = makeProductCategory({ id: 1, name: 'Electronics' });
      const updated = category.applyUpdate({ name: 'Gadgets' });

      expect(updated.name).toBe('Gadgets');
      expect(updated.id).toBe(1);
    });

    it('preserves existing values when update is empty', () => {
      const category = makeProductCategory({ id: 2, name: 'Books' });
      const updated = category.applyUpdate({});

      expect(updated.name).toBe('Books');
      expect(updated.id).toBe(2);
    });

    it('does not mutate the original ProductCategory', () => {
      const category = makeProductCategory({ name: 'Electronics' });
      category.applyUpdate({ name: 'Gadgets' });

      expect(category.name).toBe('Electronics');
    });

    it('returns a different object reference', () => {
      const category = makeProductCategory();
      const updated = category.applyUpdate({ name: 'New Name' });

      expect(updated).not.toBe(category);
    });
  });
});
