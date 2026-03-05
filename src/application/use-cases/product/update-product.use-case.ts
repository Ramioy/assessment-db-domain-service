import { Injectable, Inject } from '@nestjs/common';
import { Product, UpdateProductDto } from '@domain/models/product.entity';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
import { IProductRepository } from '@application/ports/out/product-repository.port';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly repository: IProductRepository,
  ) {}

  async execute(id: number, dto: UpdateProductDto): Promise<Product> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new NotFoundException('Product', id);
    }
    Object.assign(entity, dto);
    return this.repository.save(entity);
  }
}
