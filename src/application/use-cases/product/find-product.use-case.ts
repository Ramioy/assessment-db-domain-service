import { Injectable, Inject } from '@nestjs/common';
import { Product } from '@domain/models/product.entity';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
import { IProductRepository } from '@application/ports/out/product-repository.port';

@Injectable()
export class FindProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly repository: IProductRepository,
  ) {}

  async execute(id: number): Promise<Product> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new NotFoundException('Product', id);
    }
    return entity;
  }
}
