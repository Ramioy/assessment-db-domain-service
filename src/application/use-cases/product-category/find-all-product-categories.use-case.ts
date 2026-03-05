import { Injectable, Inject } from '@nestjs/common';
import { ProductCategory } from '@domain/models/product-category.entity';
import { IProductCategoryRepository } from '@application/ports/out/product-category-repository.port';

@Injectable()
export class FindAllProductCategoriesUseCase {
  constructor(
    @Inject('IProductCategoryRepository')
    private readonly repository: IProductCategoryRepository,
  ) {}

  async execute(): Promise<ProductCategory[]> {
    return this.repository.findAll();
  }
}
