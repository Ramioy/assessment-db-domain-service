import { ProductCategory } from '@domain/models/product-category.entity';

export interface IProductCategoryRepository {
  findById(id: number): Promise<ProductCategory | null>;
  findAll(): Promise<ProductCategory[]>;
  findByName(name: string): Promise<ProductCategory | null>;
  save(entity: ProductCategory): Promise<ProductCategory>;
  delete(id: number): Promise<boolean>;
}
