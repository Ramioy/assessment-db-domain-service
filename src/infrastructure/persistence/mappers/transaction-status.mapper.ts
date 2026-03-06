import { TransactionStatus } from '@domain/models/transaction-status.entity';
import { TransactionStatusOrmEntity } from '../entities/transaction-status.orm-entity';

export class TransactionStatusMapper {
  static toDomain(orm: TransactionStatusOrmEntity): TransactionStatus {
    return TransactionStatus.fromPersistence({
      id: orm.id,
      name: orm.name,
      description: orm.description,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toOrm(entity: TransactionStatus): TransactionStatusOrmEntity {
    const orm = new TransactionStatusOrmEntity();
    if (entity.id > 0) orm.id = entity.id;
    orm.name = entity.name;
    orm.description = entity.description ?? null;
    return orm;
  }
}
