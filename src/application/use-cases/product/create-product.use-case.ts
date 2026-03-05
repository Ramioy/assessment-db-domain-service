import { Injectable, Inject } from '@nestjs/common';
import { DI_TOKENS } from '@shared/di-tokens';
import { Product, CreateProductDto } from '@domain/models/product.entity';
import { NotFoundError, type DomainError } from '@domain/errors';
import { ProductRepositoryPort } from '@application/ports/out/product-repository.port';
import { ProductCategoryRepositoryPort } from '@application/ports/out/product-category-repository.port';
import { err, type Result } from '@shared/result';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(DI_TOKENS.PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
    @Inject(DI_TOKENS.PRODUCT_CATEGORY_REPOSITORY)
    private readonly categoryRepository: ProductCategoryRepositoryPort,
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
