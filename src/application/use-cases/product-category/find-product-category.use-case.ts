import { Injectable, Inject } from '@nestjs/common';
import { ProductCategory } from '@domain/models/product-category.entity';
import { NotFoundError, type DomainError } from '@domain/errors';
import { IProductCategoryRepository } from '@application/ports/out/product-category-repository.port';
import { ok, err, type Result } from '@shared/result';

@Injectable()
export class FindProductCategoryUseCase {
  constructor(
    @Inject('IProductCategoryRepository')
    private readonly repository: IProductCategoryRepository,
  ) {}

  async execute(id: number): Promise<Result<ProductCategory, DomainError>> {
    const result = await this.repository.findById(id);
    if (!result.ok) return result;
    if (!result.value) return err(new NotFoundError('ProductCategory', id));
    return ok(result.value);
  }
}
