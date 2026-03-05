import type { Result } from '@shared/result';
import type { InfrastructureError } from '@domain/errors';
import { Product } from '@domain/models/product.entity';

export interface ProductRepositoryPort {
  findById(id: number): Promise<Result<Product | null, InfrastructureError>>;
  findByUuid(uuid: string): Promise<Result<Product | null, InfrastructureError>>;
  findAll(): Promise<Result<Product[], InfrastructureError>>;
  findByCategoryId(categoryId: number): Promise<Result<Product[], InfrastructureError>>;
  save(entity: Product): Promise<Result<Product, InfrastructureError>>;
  delete(id: number): Promise<Result<boolean, InfrastructureError>>;
}
