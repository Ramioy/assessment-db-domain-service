import {
  ProductCategory,
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
} from '@domain/models/product-category.entity';
import type { AppError } from '@domain/errors';
import type { Result } from '@shared/result';

export interface ProductCategoryInputPort {
  create(dto: CreateProductCategoryDto): Promise<Result<ProductCategory, AppError>>;
  findById(id: number): Promise<Result<ProductCategory, AppError>>;
  findAll(): Promise<Result<ProductCategory[], AppError>>;
  update(id: number, dto: UpdateProductCategoryDto): Promise<Result<ProductCategory, AppError>>;
  delete(id: number): Promise<Result<void, AppError>>;
}
