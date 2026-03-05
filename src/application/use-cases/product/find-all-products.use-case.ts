import { Injectable, Inject } from '@nestjs/common';
import { Product } from '@domain/models/product.entity';
import { type DomainError } from '@domain/errors';
import { IProductRepository } from '@application/ports/out/product-repository.port';
import { type Result } from '@shared/result';

@Injectable()
export class FindAllProductsUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly repository: IProductRepository,
  ) {}

  async execute(categoryId?: number): Promise<Result<Product[], DomainError>> {
    if (categoryId !== undefined) {
      return this.repository.findByCategoryId(categoryId);
    }
    return this.repository.findAll();
  }
}
