// @ts-nocheck
/* eslint-disable */
import { Customer } from '@domain/models/customer.entity';
import { makeCustomer } from '../../../helpers/entity-factory';

describe('Customer', () => {
  const NOW = new Date('2024-01-15T10:00:00.000Z');

  const createDto = {
    customerDocumentTypeId: 1,
    documentNumber: '123456789',
    email: 'john@example.com',
    contactPhone: null,
    address: null,
  };

  describe('create()', () => {
    it('returns a Customer with correct fields and id=0', () => {
      const customer = Customer.create(createDto);

      expect(customer.id).toBe(0);
      expect(customer.email).toBe('john@example.com');
      expect(customer.documentNumber).toBe('123456789');
      expect(customer.customerDocumentTypeId).toBe(1);
      expect(customer.contactPhone).toBeNull();
      expect(customer.address).toBeNull();
    });

    it('sets timestamps on creation', () => {
      const before = new Date();
      const customer = Customer.create(createDto);
      const after = new Date();

      expect(customer.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(customer.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('fromPersistence()', () => {
    it('reconstitutes a Customer from persistence data', () => {
      const customer = Customer.fromPersistence({
        id: 42,
        customerDocumentTypeId: 1,
        documentNumber: '123456789',
        email: 'john@example.com',
        contactPhone: '+57 300 000 0000',
        address: 'Calle 1',
        createdAt: NOW,
        updatedAt: NOW,
      });

      expect(customer.id).toBe(42);
      expect(customer.email).toBe('john@example.com');
      expect(customer.contactPhone).toBe('+57 300 000 0000');
      expect(customer.createdAt).toBe(NOW);
    });
  });

  describe('applyUpdate()', () => {
    it('returns a new Customer with updated fields', () => {
      const customer = makeCustomer({ id: 1, email: 'john@example.com' });
      const updated = customer.applyUpdate({ email: 'jane@example.com' });

      expect(updated.email).toBe('jane@example.com');
      expect(updated.documentNumber).toBe(customer.documentNumber);
      expect(updated.id).toBe(1);
    });

    it('preserves existing values when update is empty', () => {
      const customer = makeCustomer({ id: 1 });
      const updated = customer.applyUpdate({});

      expect(updated.email).toBe(customer.email);
      expect(updated.documentNumber).toBe(customer.documentNumber);
      expect(updated.id).toBe(1);
    });

    it('allows setting nullable fields to null', () => {
      const customer = makeCustomer({ contactPhone: '+57 300 000 0000' });
      const updated = customer.applyUpdate({ contactPhone: null });

      expect(updated.contactPhone).toBeNull();
    });

    it('does not mutate the original Customer', () => {
      const customer = makeCustomer({ email: 'john@example.com' });
      customer.applyUpdate({ email: 'jane@example.com' });

      expect(customer.email).toBe('john@example.com');
    });

    it('returns a different object reference', () => {
      const customer = makeCustomer();
      const updated = customer.applyUpdate({ email: 'new@example.com' });

      expect(updated).not.toBe(customer);
    });
  });
});
