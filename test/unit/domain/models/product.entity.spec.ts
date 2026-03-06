// @ts-nocheck

import { Product } from '@domain/models/product.entity';
import { makeProduct } from '../../../helpers/entity-factory';

describe('Product', () => {
  const NOW = new Date('2024-01-15T10:00:00.000Z');

  const createDto = {
    name: 'Laptop Pro',
    description: 'High-performance laptop',
    imageUrl: 'https://example.com/laptop.png',
    categoryId: 1,
  };

  describe('create()', () => {
    it('returns a Product with correct fields and id=0', () => {
      const product = Product.create(createDto);

      expect(product.id).toBe(0);
      expect(product.uuid).toBe(''); // assigned by DB
      expect(product.name).toBe('Laptop Pro');
      expect(product.description).toBe('High-performance laptop');
      expect(product.categoryId).toBe(1);
    });

    it('defaults description and imageUrl to null when not provided', () => {
      const product = Product.create({ name: 'Plain', categoryId: 2 });

      expect(product.description).toBeNull();
      expect(product.imageUrl).toBeNull();
    });
  });

  describe('fromPersistence()', () => {
    it('reconstitutes a Product from persistence data', () => {
      const product = Product.fromPersistence({
        id: 5,
        uuid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        name: 'Laptop Pro',
        description: null,
        imageUrl: null,
        categoryId: 1,
        createdAt: NOW,
        updatedAt: NOW,
      });

      expect(product.id).toBe(5);
      expect(product.uuid).toBe('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
      expect(product.name).toBe('Laptop Pro');
    });
  });

  describe('applyUpdate()', () => {
    it('returns a new Product with updated fields', () => {
      const product = makeProduct({ id: 1, name: 'Old Name' });
      const updated = product.applyUpdate({ name: 'New Name' });

      expect(updated.name).toBe('New Name');
      expect(updated.id).toBe(1);
      expect(updated.uuid).toBe(product.uuid);
    });

    it('preserves existing values when update is empty', () => {
      const product = makeProduct({ id: 1, name: 'Laptop Pro' });
      const updated = product.applyUpdate({});

      expect(updated.name).toBe('Laptop Pro');
      expect(updated.categoryId).toBe(product.categoryId);
      expect(updated.id).toBe(1);
    });

    it('allows setting nullable fields to null', () => {
      const product = makeProduct({ imageUrl: 'https://example.com/img.png' });
      const updated = product.applyUpdate({ imageUrl: null });

      expect(updated.imageUrl).toBeNull();
    });

    it('does not mutate the original Product', () => {
      const product = makeProduct({ name: 'Laptop Pro' });
      product.applyUpdate({ name: 'Desktop' });

      expect(product.name).toBe('Laptop Pro');
    });

    it('returns a different object reference', () => {
      const product = makeProduct();
      const updated = product.applyUpdate({ name: 'Updated' });

      expect(updated).not.toBe(product);
    });
  });
});
