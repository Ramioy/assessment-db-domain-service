import {
  ProductCategory,
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
} from '@domain/models/product-category.entity';
import type { DomainError } from '@domain/errors';
import type { Result } from '@shared/result';

export interface ProductCategoryInputPort {
  create(dto: CreateProductCategoryDto): Promise<Result<ProductCategory, DomainError>>;
  findById(id: number): Promise<Result<ProductCategory, DomainError>>;
  findAll(): Promise<Result<ProductCategory[], DomainError>>;
  update(id: number, dto: UpdateProductCategoryDto): Promise<Result<ProductCategory, DomainError>>;
  delete(id: number): Promise<Result<void, DomainError>>;
}
