import { Product, CreateProductDto, UpdateProductDto } from '@domain/models/product.entity';
import type { AppError } from '@domain/errors';
import type { Result } from '@shared/result';

export interface ProductInputPort {
  create(dto: CreateProductDto): Promise<Result<Product, AppError>>;
  findById(id: number): Promise<Result<Product, AppError>>;
  findAll(categoryId?: number): Promise<Result<Product[], AppError>>;
  update(id: number, dto: UpdateProductDto): Promise<Result<Product, AppError>>;
  delete(id: number): Promise<Result<void, AppError>>;
}
