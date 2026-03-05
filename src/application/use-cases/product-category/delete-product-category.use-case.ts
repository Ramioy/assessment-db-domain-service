import { Injectable, Inject } from '@nestjs/common';
import { DI_TOKENS } from '@shared/di-tokens';
import { NotFoundError, type DomainError } from '@domain/errors';
import { ProductCategoryRepositoryPort } from '@application/ports/out/product-category-repository.port';
import { ok, err, type Result } from '@shared/result';

@Injectable()
export class DeleteProductCategoryUseCase {
  constructor(
    @Inject(DI_TOKENS.PRODUCT_CATEGORY_REPOSITORY)
    private readonly repository: ProductCategoryRepositoryPort,
  ) {}

  async execute(id: number): Promise<Result<void, DomainError>> {
    const findResult = await this.repository.findById(id);
    if (!findResult.ok) return findResult;
    if (!findResult.value) return err(new NotFoundError('ProductCategory', id));

    const deleteResult = await this.repository.delete(id);
    if (!deleteResult.ok) return deleteResult;

    return ok(undefined);
  }
}
