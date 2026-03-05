import { Injectable, Inject } from '@nestjs/common';
import { NotFoundError, type DomainError } from '@domain/errors';
import { IProductCategoryRepository } from '@application/ports/out/product-category-repository.port';
import { ok, err, type Result } from '@shared/result';

@Injectable()
export class DeleteProductCategoryUseCase {
  constructor(
    @Inject('IProductCategoryRepository')
    private readonly repository: IProductCategoryRepository,
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
