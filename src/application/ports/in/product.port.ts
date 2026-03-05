import { Product, CreateProductDto, UpdateProductDto } from '@domain/models/product.entity';
import type { DomainError } from '@domain/errors';
import type { Result } from '@shared/result';

export interface ProductInputPort {
  create(dto: CreateProductDto): Promise<Result<Product, DomainError>>;
  findById(id: number): Promise<Result<Product, DomainError>>;
  findAll(categoryId?: number): Promise<Result<Product[], DomainError>>;
  update(id: number, dto: UpdateProductDto): Promise<Result<Product, DomainError>>;
  delete(id: number): Promise<Result<void, DomainError>>;
}
