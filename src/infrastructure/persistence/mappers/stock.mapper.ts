import { Stock } from '@domain/models/stock.entity';
import { StockOrmEntity } from '../entities/stock.orm-entity';

export class StockMapper {
  static toDomain(orm: StockOrmEntity): Stock {
    return Stock.fromPersistence({
      id: orm.id,
      productId: orm.productId,
      description: orm.description,
      quantity: orm.quantity,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toOrm(entity: Stock): StockOrmEntity {
    const orm = new StockOrmEntity();
    if (entity.id > 0) orm.id = entity.id;
    orm.productId = entity.productId;
    orm.description = entity.description ?? null;
    orm.quantity = entity.quantity;
    return orm;
  }
}
