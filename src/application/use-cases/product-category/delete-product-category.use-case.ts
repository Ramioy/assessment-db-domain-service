import { Injectable, Inject } from '@nestjs/common';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
import { IProductCategoryRepository } from '@application/ports/out/product-category-repository.port';

@Injectable()
export class DeleteProductCategoryUseCase {
  constructor(
    @Inject('IProductCategoryRepository')
    private readonly repository: IProductCategoryRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new NotFoundException('ProductCategory', id);
    }
    await this.repository.delete(id);
  }
}
