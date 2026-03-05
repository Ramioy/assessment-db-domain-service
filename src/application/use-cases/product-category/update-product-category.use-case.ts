import { Injectable, Inject } from '@nestjs/common';
import { ProductCategory, UpdateProductCategoryDto } from '@domain/models/product-category.entity';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
import { IProductCategoryRepository } from '@application/ports/out/product-category-repository.port';

@Injectable()
export class UpdateProductCategoryUseCase {
  constructor(
    @Inject('IProductCategoryRepository')
    private readonly repository: IProductCategoryRepository,
  ) {}

  async execute(id: number, dto: UpdateProductCategoryDto): Promise<ProductCategory> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new NotFoundException('ProductCategory', id);
    }
    Object.assign(entity, dto);
    return this.repository.save(entity);
  }
}
