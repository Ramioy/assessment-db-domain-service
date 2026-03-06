import { Product } from '@domain/models/product.entity';
import { ProductOrmEntity } from '../entities/product.orm-entity';

export class ProductMapper {
  static toDomain(orm: ProductOrmEntity): Product {
    return Product.fromPersistence({
      id: orm.id,
      uuid: orm.uuid,
      name: orm.name,
      description: orm.description,
      imageUrl: orm.imageUrl,
      categoryId: orm.categoryId,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toOrm(entity: Product): ProductOrmEntity {
    const orm = new ProductOrmEntity();
    if (entity.id > 0) orm.id = entity.id;
    if (entity.uuid) orm.uuid = entity.uuid;
    orm.name = entity.name;
    orm.description = entity.description ?? null;
    orm.imageUrl = entity.imageUrl ?? null;
    orm.categoryId = entity.categoryId;
    return orm;
  }
}
