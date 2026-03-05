import { Injectable, Inject } from '@nestjs/common';
import { ProductCategory, UpdateProductCategoryDto } from '@domain/models/product-category.entity';
import { NotFoundError, type DomainError } from '@domain/errors';
import { IProductCategoryRepository } from '@application/ports/out/product-category-repository.port';
import { err, type Result } from '@shared/result';

@Injectable()
export class UpdateProductCategoryUseCase {
  constructor(
    @Inject('IProductCategoryRepository')
    private readonly repository: IProductCategoryRepository,
  ) {}

  async execute(
    id: number,
    dto: UpdateProductCategoryDto,
  ): Promise<Result<ProductCategory, DomainError>> {
    const findResult = await this.repository.findById(id);
    if (!findResult.ok) return findResult;
    if (!findResult.value) return err(new NotFoundError('ProductCategory', id));

    Object.assign(findResult.value, dto);
    return this.repository.save(findResult.value);
  }
}
