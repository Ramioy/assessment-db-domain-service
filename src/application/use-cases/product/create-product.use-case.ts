import { Injectable, Inject } from '@nestjs/common';
import { Product, CreateProductDto } from '@domain/models/product.entity';
import { NotFoundError, type DomainError } from '@domain/errors';
import { IProductRepository } from '@application/ports/out/product-repository.port';
import { IProductCategoryRepository } from '@application/ports/out/product-category-repository.port';
import { err, type Result } from '@shared/result';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
    @Inject('IProductCategoryRepository')
    private readonly categoryRepository: IProductCategoryRepository,
  ) {}

  async execute(dto: CreateProductDto): Promise<Result<Product, DomainError>> {
    const categoryResult = await this.categoryRepository.findById(dto.categoryId);
    if (!categoryResult.ok) return categoryResult;
    if (!categoryResult.value) {
      return err(new NotFoundError('ProductCategory', dto.categoryId));
    }

    const entity = Object.assign(new Product(), dto);
    return this.productRepository.save(entity);
  }
}
