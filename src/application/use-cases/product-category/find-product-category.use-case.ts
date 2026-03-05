import { Injectable, Inject } from '@nestjs/common';
import { DI_TOKENS } from '@shared/di-tokens';
import { ProductCategory } from '@domain/models/product-category.entity';
import { NotFoundError, type DomainError } from '@domain/errors';
import { ProductCategoryRepositoryPort } from '@application/ports/out/product-category-repository.port';
import { ok, err, type Result } from '@shared/result';

@Injectable()
export class FindProductCategoryUseCase {
  constructor(
    @Inject(DI_TOKENS.PRODUCT_CATEGORY_REPOSITORY)
    private readonly repository: ProductCategoryRepositoryPort,
  ) {}

  async execute(id: number): Promise<Result<ProductCategory, DomainError>> {
    const result = await this.repository.findById(id);
    if (!result.ok) return result;
    if (!result.value) return err(new NotFoundError('ProductCategory', id));
    return ok(result.value);
  }
}
