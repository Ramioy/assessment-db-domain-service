import { Injectable, Inject } from '@nestjs/common';
import { Product, CreateProductDto } from '@domain/models/product.entity';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
import { IProductRepository } from '@application/ports/out/product-repository.port';
import { IProductCategoryRepository } from '@application/ports/out/product-category-repository.port';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
    @Inject('IProductCategoryRepository')
    private readonly categoryRepository: IProductCategoryRepository,
  ) {}

  async execute(dto: CreateProductDto): Promise<Product> {
    const category = await this.categoryRepository.findById(dto.categoryId);
    if (!category) {
      throw new NotFoundException('ProductCategory', dto.categoryId);
    }
    const entity = Object.assign(new Product(), dto);
    return this.productRepository.save(entity);
  }
}
