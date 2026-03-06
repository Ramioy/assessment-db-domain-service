import { Delivery } from '@domain/models/delivery.entity';
import { DeliveryOrmEntity } from '../entities/delivery.orm-entity';

export class DeliveryMapper {
  static toDomain(orm: DeliveryOrmEntity): Delivery {
    return Delivery.fromPersistence({
      id: orm.id,
      uuid: orm.uuid,
      customerId: orm.customerId,
      customerAddressId: orm.customerAddressId,
      transactionId: orm.transactionId,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toOrm(entity: Delivery): DeliveryOrmEntity {
    const orm = new DeliveryOrmEntity();
    if (entity.id > 0) orm.id = entity.id;
    if (entity.uuid) orm.uuid = entity.uuid;
    orm.customerId = entity.customerId;
    orm.customerAddressId = entity.customerAddressId ?? null;
    orm.transactionId = entity.transactionId;
    return orm;
  }
}
