// @ts-nocheck

import { DeliveryMapper } from '@infrastructure/persistence/mappers/delivery.mapper';
import { DeliveryOrmEntity } from '@infrastructure/persistence/entities/delivery.orm-entity';
import { Delivery } from '@domain/models/delivery.entity';
import { makeDelivery } from '../../../../helpers/entity-factory';

describe('DeliveryMapper', () => {
  const NOW = new Date('2024-01-15T10:00:00.000Z');

  describe('toDomain()', () => {
    it('maps ORM entity to domain entity', () => {
      const orm = Object.assign(new DeliveryOrmEntity(), {
        id: 1,
        uuid: 'dddddddd-eeee-ffff-0000-111122223333',
        customerId: 5,
        customerAddressId: 10,
        transactionId: 3,
        createdAt: NOW,
        updatedAt: NOW,
      });

      const domain = DeliveryMapper.toDomain(orm);

      expect(domain).toBeInstanceOf(Delivery);
      expect(domain.id).toBe(1);
      expect(domain.uuid).toBe('dddddddd-eeee-ffff-0000-111122223333');
      expect(domain.customerId).toBe(5);
      expect(domain.customerAddressId).toBe(10);
      expect(domain.transactionId).toBe(3);
      expect(domain.createdAt).toBe(NOW);
      expect(domain.updatedAt).toBe(NOW);
    });

    it('maps null customerAddressId correctly', () => {
      const orm = Object.assign(new DeliveryOrmEntity(), {
        id: 2,
        uuid: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
        customerId: 1,
        customerAddressId: null,
        transactionId: 1,
        createdAt: NOW,
        updatedAt: NOW,
      });

      const domain = DeliveryMapper.toDomain(orm);

      expect(domain.customerAddressId).toBeNull();
    });
  });

  describe('toOrm()', () => {
    it('maps domain entity to ORM entity with id and uuid when both are set', () => {
      const entity = makeDelivery({ id: 4, uuid: 'dddddddd-eeee-ffff-0000-111122223333' });
      const orm = DeliveryMapper.toOrm(entity);

      expect(orm).toBeInstanceOf(DeliveryOrmEntity);
      expect(orm.id).toBe(4);
      expect(orm.uuid).toBe('dddddddd-eeee-ffff-0000-111122223333');
      expect(orm.customerId).toBe(entity.customerId);
      expect(orm.transactionId).toBe(entity.transactionId);
    });

    it('does not set id on ORM entity when id is 0 (new entity)', () => {
      const entity = Delivery.create({ customerId: 1, transactionId: 1 });
      const orm = DeliveryMapper.toOrm(entity);

      expect(orm.id).toBeUndefined();
    });

    it('does not set uuid on ORM entity when uuid is empty string (new entity)', () => {
      const entity = Delivery.create({ customerId: 1, transactionId: 1 });
      const orm = DeliveryMapper.toOrm(entity);

      expect(orm.uuid).toBeUndefined();
    });

    it('maps null customerAddressId to null', () => {
      const entity = makeDelivery({ customerAddressId: undefined });
      const orm = DeliveryMapper.toOrm(entity);

      expect(orm.customerAddressId).toBeNull();
    });
  });
});
