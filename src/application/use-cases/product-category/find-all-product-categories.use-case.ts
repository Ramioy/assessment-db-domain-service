import { Injectable, Inject } from '@nestjs/common';
import { ProductCategory } from '@domain/models/product-category.entity';
import { type DomainError } from '@domain/errors';
import { IProductCategoryRepository } from '@application/ports/out/product-category-repository.port';
import { type Result } from '@shared/result';

@Injectable()
export class FindAllProductCategoriesUseCase {
  constructor(
    @Inject('IProductCategoryRepository')
    private readonly repository: IProductCategoryRepository,
  ) {}

  async execute(): Promise<Result<ProductCategory[], DomainError>> {
    return this.repository.findAll();
  }
}
