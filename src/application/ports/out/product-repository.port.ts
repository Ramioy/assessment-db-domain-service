import { Product } from '@domain/models/product.entity';

export interface IProductRepository {
  findById(id: number): Promise<Product | null>;
  findByUuid(uuid: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  findByCategoryId(categoryId: number): Promise<Product[]>;
  save(entity: Product): Promise<Product>;
  delete(id: number): Promise<boolean>;
}
