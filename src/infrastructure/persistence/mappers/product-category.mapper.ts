import { ProductCategory } from '@domain/models/product-category.entity';
import { ProductCategoryOrmEntity } from '../entities/product-category.orm-entity';

export class ProductCategoryMapper {
  static toDomain(orm: ProductCategoryOrmEntity): ProductCategory {
    return ProductCategory.fromPersistence({
      id: orm.id,
      name: orm.name,
      description: orm.description,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toOrm(entity: ProductCategory): ProductCategoryOrmEntity {
    const orm = new ProductCategoryOrmEntity();
    if (entity.id > 0) orm.id = entity.id;
    orm.name = entity.name;
    orm.description = entity.description ?? null;
    return orm;
  }
}
