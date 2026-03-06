// @ts-nocheck

import { CustomerMapper } from '@infrastructure/persistence/mappers/customer.mapper';
import { CustomerOrmEntity } from '@infrastructure/persistence/entities/customer.orm-entity';
import { Customer } from '@domain/models/customer.entity';
import { makeCustomer } from '../../../../helpers/entity-factory';

describe('CustomerMapper', () => {
  const NOW = new Date('2024-01-15T10:00:00.000Z');

  describe('toDomain()', () => {
    it('maps ORM entity to domain entity', () => {
      const orm = Object.assign(new CustomerOrmEntity(), {
        id: 1,
        customerDocumentTypeId: 2,
        documentNumber: '123456789',
        email: 'a@b.com',
        contactPhone: '+57 300 000 0000',
        address: 'Calle 1',
        createdAt: NOW,
        updatedAt: NOW,
      });

      const domain = CustomerMapper.toDomain(orm);

      expect(domain).toBeInstanceOf(Customer);
      expect(domain.id).toBe(1);
      expect(domain.customerDocumentTypeId).toBe(2);
      expect(domain.documentNumber).toBe('123456789');
      expect(domain.email).toBe('a@b.com');
      expect(domain.contactPhone).toBe('+57 300 000 0000');
      expect(domain.address).toBe('Calle 1');
      expect(domain.createdAt).toBe(NOW);
      expect(domain.updatedAt).toBe(NOW);
    });

    it('maps null nullable fields correctly', () => {
      const orm = Object.assign(new CustomerOrmEntity(), {
        id: 2,
        customerDocumentTypeId: 1,
        documentNumber: '999',
        email: 'x@y.com',
        contactPhone: null,
        address: null,
        createdAt: NOW,
        updatedAt: NOW,
      });

      const domain = CustomerMapper.toDomain(orm);

      expect(domain.contactPhone).toBeNull();
      expect(domain.address).toBeNull();
    });
  });

  describe('toOrm()', () => {
    it('maps domain entity to ORM entity with id when id > 0', () => {
      const entity = makeCustomer({ id: 5 });
      const orm = CustomerMapper.toOrm(entity);

      expect(orm).toBeInstanceOf(CustomerOrmEntity);
      expect(orm.id).toBe(5);
      expect(orm.customerDocumentTypeId).toBe(entity.customerDocumentTypeId);
      expect(orm.documentNumber).toBe(entity.documentNumber);
      expect(orm.email).toBe(entity.email);
      expect(orm.contactPhone).toBe(entity.contactPhone);
      expect(orm.address).toBe(entity.address);
    });

    it('does not set id on ORM entity when id is 0 (new entity)', () => {
      const entity = Customer.create({
        customerDocumentTypeId: 1,
        documentNumber: '123',
        email: 'a@b.com',
      });
      const orm = CustomerMapper.toOrm(entity);

      expect(orm.id).toBeUndefined();
    });

    it('maps nullable fields to null when undefined', () => {
      const entity = makeCustomer({ contactPhone: undefined, address: undefined });
      const orm = CustomerMapper.toOrm(entity);

      expect(orm.contactPhone).toBeNull();
      expect(orm.address).toBeNull();
    });
  });
});
