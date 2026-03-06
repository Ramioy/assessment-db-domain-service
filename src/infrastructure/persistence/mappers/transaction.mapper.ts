import { Transaction } from '@domain/models/transaction.entity';
import { TransactionOrmEntity } from '../entities/transaction.orm-entity';

export class TransactionMapper {
  static toDomain(orm: TransactionOrmEntity): Transaction {
    return Transaction.fromPersistence({
      id: orm.id,
      customerId: orm.customerId,
      cut: orm.cut,
      transactionStatusId: orm.transactionStatusId,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toOrm(entity: Transaction): TransactionOrmEntity {
    const orm = new TransactionOrmEntity();
    if (entity.id > 0) orm.id = entity.id;
    orm.customerId = entity.customerId;
    orm.cut = entity.cut ?? null;
    orm.transactionStatusId = entity.transactionStatusId;
    return orm;
  }
}
