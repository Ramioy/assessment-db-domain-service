import { Injectable, Inject } from '@nestjs/common';
import { Product } from '@domain/models/product.entity';
import { IProductRepository } from '@application/ports/out/product-repository.port';

@Injectable()
export class FindAllProductsUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly repository: IProductRepository,
  ) {}

  async execute(categoryId?: number): Promise<Product[]> {
    if (categoryId !== undefined) {
      return this.repository.findByCategoryId(categoryId);
    }
    return this.repository.findAll();
  }
}
