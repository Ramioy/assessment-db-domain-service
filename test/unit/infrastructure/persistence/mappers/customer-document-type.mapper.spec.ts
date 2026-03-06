// @ts-nocheck

import { CustomerDocumentTypeMapper } from '@infrastructure/persistence/mappers/customer-document-type.mapper';
import { CustomerDocumentTypeOrmEntity } from '@infrastructure/persistence/entities/customer-document-type.orm-entity';
import { CustomerDocumentType } from '@domain/models/customer-document-type.entity';
import { makeCustomerDocumentType } from '../../../../helpers/entity-factory';

describe('CustomerDocumentTypeMapper', () => {
  const NOW = new Date('2024-01-15T10:00:00.000Z');

  describe('toDomain()', () => {
    it('maps ORM entity to domain entity', () => {
      const orm = Object.assign(new CustomerDocumentTypeOrmEntity(), {
        id: 1,
        name: 'CC',
        description: 'Cédula de Ciudadanía',
        createdAt: NOW,
        updatedAt: NOW,
      });

      const domain = CustomerDocumentTypeMapper.toDomain(orm);

      expect(domain).toBeInstanceOf(CustomerDocumentType);
      expect(domain.id).toBe(1);
      expect(domain.name).toBe('CC');
      expect(domain.description).toBe('Cédula de Ciudadanía');
      expect(domain.createdAt).toBe(NOW);
      expect(domain.updatedAt).toBe(NOW);
    });

    it('maps null description correctly', () => {
      const orm = Object.assign(new CustomerDocumentTypeOrmEntity(), {
        id: 2,
        name: 'NIT',
        description: null,
        createdAt: NOW,
        updatedAt: NOW,
      });

      const domain = CustomerDocumentTypeMapper.toDomain(orm);

      expect(domain.description).toBeNull();
    });
  });

  describe('toOrm()', () => {
    it('maps domain entity to ORM entity with id when id > 0', () => {
      const entity = makeCustomerDocumentType({ id: 3 });
      const orm = CustomerDocumentTypeMapper.toOrm(entity);

      expect(orm).toBeInstanceOf(CustomerDocumentTypeOrmEntity);
      expect(orm.id).toBe(3);
      expect(orm.name).toBe(entity.name);
      expect(orm.description).toBe(entity.description);
    });

    it('does not set id on ORM entity when id is 0 (new entity)', () => {
      const entity = CustomerDocumentType.create({ name: 'RUT' });
      const orm = CustomerDocumentTypeMapper.toOrm(entity);

      expect(orm.id).toBeUndefined();
    });

    it('maps null description to null', () => {
      const entity = makeCustomerDocumentType({ description: undefined });
      const orm = CustomerDocumentTypeMapper.toOrm(entity);

      expect(orm.description).toBeNull();
    });
  });
});
