import { Injectable, Inject } from '@nestjs/common';
import { ProductCategory, CreateProductCategoryDto } from '@domain/models/product-category.entity';
import { AlreadyExistsError, type DomainError } from '@domain/errors';
import { IProductCategoryRepository } from '@application/ports/out/product-category-repository.port';
import { err, type Result } from '@shared/result';

@Injectable()
export class CreateProductCategoryUseCase {
  constructor(
    @Inject('IProductCategoryRepository')
    private readonly repository: IProductCategoryRepository,
  ) {}

  async execute(dto: CreateProductCategoryDto): Promise<Result<ProductCategory, DomainError>> {
    const existingResult = await this.repository.findByName(dto.name);
    if (!existingResult.ok) return existingResult;
    if (existingResult.value) {
      return err(new AlreadyExistsError('ProductCategory', 'name', dto.name));
    }

    const entity = Object.assign(new ProductCategory(), dto);
    return this.repository.save(entity);
  }
}
