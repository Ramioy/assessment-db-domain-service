// @ts-nocheck
/* eslint-disable */
import { CustomerDocumentType } from '@domain/models/customer-document-type.entity';
import { makeCustomerDocumentType } from '../../../helpers/entity-factory';

describe('CustomerDocumentType', () => {
  const NOW = new Date('2024-01-15T10:00:00.000Z');

  describe('create()', () => {
    it('returns a CustomerDocumentType with correct fields and id=0', () => {
      const entity = CustomerDocumentType.create({ name: 'Passport', description: 'Travel document' });

      expect(entity.id).toBe(0);
      expect(entity.name).toBe('Passport');
      expect(entity.description).toBe('Travel document');
    });

    it('defaults description to null when not provided', () => {
      const entity = CustomerDocumentType.create({ name: 'ID Card' });

      expect(entity.description).toBeNull();
    });
  });

  describe('fromPersistence()', () => {
    it('reconstitutes a CustomerDocumentType from persistence data', () => {
      const entity = CustomerDocumentType.fromPersistence({
        id: 2,
        name: 'Passport',
        description: 'Travel document',
        createdAt: NOW,
        updatedAt: NOW,
      });

      expect(entity.id).toBe(2);
      expect(entity.name).toBe('Passport');
      expect(entity.description).toBe('Travel document');
      expect(entity.createdAt).toBe(NOW);
    });
  });

  describe('applyUpdate()', () => {
    it('returns a new CustomerDocumentType with updated name', () => {
      const entity = makeCustomerDocumentType({ id: 1, name: 'Passport' });
      const updated = entity.applyUpdate({ name: 'National ID' });

      expect(updated.name).toBe('National ID');
      expect(updated.id).toBe(1);
    });

    it('preserves existing values when update is empty', () => {
      const entity = makeCustomerDocumentType({ id: 2, name: 'Passport' });
      const updated = entity.applyUpdate({});

      expect(updated.name).toBe('Passport');
      expect(updated.id).toBe(2);
    });

    it('updates description to null when explicitly set', () => {
      const entity = makeCustomerDocumentType({ description: 'Some description' });
      const updated = entity.applyUpdate({ description: null });

      expect(updated.description).toBeNull();
    });

    it('does not mutate the original CustomerDocumentType', () => {
      const entity = makeCustomerDocumentType({ name: 'Passport' });
      entity.applyUpdate({ name: 'National ID' });

      expect(entity.name).toBe('Passport');
    });

    it('returns a different object reference', () => {
      const entity = makeCustomerDocumentType();
      const updated = entity.applyUpdate({ name: 'New Name' });

      expect(updated).not.toBe(entity);
    });
  });
});
