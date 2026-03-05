import { Injectable, Inject } from '@nestjs/common';
import { ProductCategory, CreateProductCategoryDto } from '@domain/models/product-category.entity';
import { AlreadyExistsException } from '@domain/exceptions/already-exists.exception';
import { IProductCategoryRepository } from '@application/ports/out/product-category-repository.port';

@Injectable()
export class CreateProductCategoryUseCase {
  constructor(
    @Inject('IProductCategoryRepository')
    private readonly repository: IProductCategoryRepository,
  ) {}

  async execute(dto: CreateProductCategoryDto): Promise<ProductCategory> {
    const existing = await this.repository.findByName(dto.name);
    if (existing) {
      throw new AlreadyExistsException('ProductCategory', 'name', dto.name);
    }
    const entity = Object.assign(new ProductCategory(), dto);
    return this.repository.save(entity);
  }
}
