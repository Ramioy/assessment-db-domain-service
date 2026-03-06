// @ts-nocheck
/* eslint-disable */
import { Delivery } from '@domain/models/delivery.entity';
import { makeDelivery } from '../../../helpers/entity-factory';

describe('Delivery', () => {
  const NOW = new Date('2024-01-15T10:00:00.000Z');

  const createDto = {
    customerId: 1,
    transactionId: 2,
    customerAddressId: null,
  };

  describe('create()', () => {
    it('returns a Delivery with correct fields, id=0, and empty uuid', () => {
      const delivery = Delivery.create(createDto);

      expect(delivery.id).toBe(0);
      expect(delivery.uuid).toBe(''); // assigned by DB
      expect(delivery.customerId).toBe(1);
      expect(delivery.transactionId).toBe(2);
      expect(delivery.customerAddressId).toBeNull();
    });

    it('sets customerAddressId when provided', () => {
      const delivery = Delivery.create({ ...createDto, customerAddressId: 5 });

      expect(delivery.customerAddressId).toBe(5);
    });
  });

  describe('fromPersistence()', () => {
    it('reconstitutes a Delivery from persistence data', () => {
      const delivery = Delivery.fromPersistence({
        id: 7,
        uuid: 'dddddddd-eeee-ffff-0000-111122223333',
        customerId: 1,
        customerAddressId: null,
        transactionId: 2,
        createdAt: NOW,
        updatedAt: NOW,
      });

      expect(delivery.id).toBe(7);
      expect(delivery.uuid).toBe('dddddddd-eeee-ffff-0000-111122223333');
      expect(delivery.customerId).toBe(1);
      expect(delivery.transactionId).toBe(2);
    });
  });
});
