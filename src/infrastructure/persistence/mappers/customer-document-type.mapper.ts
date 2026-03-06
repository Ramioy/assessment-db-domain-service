import { CustomerDocumentType } from '@domain/models/customer-document-type.entity';
import { CustomerDocumentTypeOrmEntity } from '../entities/customer-document-type.orm-entity';

export class CustomerDocumentTypeMapper {
  static toDomain(orm: CustomerDocumentTypeOrmEntity): CustomerDocumentType {
    return CustomerDocumentType.fromPersistence({
      id: orm.id,
      name: orm.name,
      description: orm.description,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toOrm(entity: CustomerDocumentType): CustomerDocumentTypeOrmEntity {
    const orm = new CustomerDocumentTypeOrmEntity();
    if (entity.id > 0) orm.id = entity.id;
    orm.name = entity.name;
    orm.description = entity.description ?? null;
    return orm;
  }
}
