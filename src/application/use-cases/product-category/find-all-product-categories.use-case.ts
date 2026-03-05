import { Injectable, Inject } from '@nestjs/common';
import { DI_TOKENS } from '@shared/di-tokens';
import { ProductCategory } from '@domain/models/product-category.entity';
import { type AppError } from '@domain/errors';
import { ProductCategoryRepositoryPort } from '@application/ports/out/product-category-repository.port';
import { type Result } from '@shared/result';

@Injectable()
export class FindAllProductCategoriesUseCase {
  constructor(
    @Inject(DI_TOKENS.PRODUCT_CATEGORY_REPOSITORY)
    private readonly repository: ProductCategoryRepositoryPort,
  ) {}

  async execute(): Promise<Result<ProductCategory[], AppError>> {
    return this.repository.findAll();
  }
}
