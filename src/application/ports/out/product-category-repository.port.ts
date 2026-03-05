import type { Result } from '@shared/result';
import type { InfrastructureError } from '@shared/errors';
import { ProductCategory } from '@domain/models/product-category.entity';

export interface ProductCategoryRepositoryPort {
  findById(id: number): Promise<Result<ProductCategory | null, InfrastructureError>>;
  findAll(): Promise<Result<ProductCategory[], InfrastructureError>>;
  findByName(name: string): Promise<Result<ProductCategory | null, InfrastructureError>>;
  save(entity: ProductCategory): Promise<Result<ProductCategory, InfrastructureError>>;
  delete(id: number): Promise<Result<boolean, InfrastructureError>>;
}
