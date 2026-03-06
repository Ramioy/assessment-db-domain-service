import { Customer } from '@domain/models/customer.entity';
import { CustomerOrmEntity } from '../entities/customer.orm-entity';

export class CustomerMapper {
  static toDomain(orm: CustomerOrmEntity): Customer {
    return Customer.fromPersistence({
      id: orm.id,
      customerDocumentTypeId: orm.customerDocumentTypeId,
      documentNumber: orm.documentNumber,
      email: orm.email,
      contactPhone: orm.contactPhone,
      address: orm.address,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toOrm(entity: Customer): CustomerOrmEntity {
    const orm = new CustomerOrmEntity();
    if (entity.id > 0) orm.id = entity.id;
    orm.customerDocumentTypeId = entity.customerDocumentTypeId;
    orm.documentNumber = entity.documentNumber;
    orm.email = entity.email;
    orm.contactPhone = entity.contactPhone ?? null;
    orm.address = entity.address ?? null;
    return orm;
  }
}
