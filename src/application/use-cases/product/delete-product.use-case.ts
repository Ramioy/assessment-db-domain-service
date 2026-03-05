import { Injectable, Inject } from '@nestjs/common';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
import { IProductRepository } from '@application/ports/out/product-repository.port';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly repository: IProductRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new NotFoundException('Product', id);
    }
    await this.repository.delete(id);
  }
}
