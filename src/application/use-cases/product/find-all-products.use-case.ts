import { Injectable, Inject } from '@nestjs/common';
import { DI_TOKENS } from '@shared/di-tokens';
import { Product } from '@domain/models/product.entity';
import { type DomainError } from '@domain/errors';
import { ProductRepositoryPort } from '@application/ports/out/product-repository.port';
import { type Result } from '@shared/result';

@Injectable()
export class FindAllProductsUseCase {
  constructor(
    @Inject(DI_TOKENS.PRODUCT_REPOSITORY)
    private readonly repository: ProductRepositoryPort,
  ) {}

  async execute(categoryId?: number): Promise<Result<Product[], DomainError>> {
    if (categoryId !== undefined) {
      return this.repository.findByCategoryId(categoryId);
    }
    return this.repository.findAll();
  }
}
