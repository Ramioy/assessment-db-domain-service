import { Injectable, Inject } from '@nestjs/common';
import { DI_TOKENS } from '@shared/di-tokens';
import { ProductCategory, CreateProductCategoryDto } from '@domain/models/product-category.entity';
import { AlreadyExistsError, type AppError } from '@domain/errors';
import { ProductCategoryRepositoryPort } from '@application/ports/out/product-category-repository.port';
import { err, type Result } from '@shared/result';

@Injectable()
export class CreateProductCategoryUseCase {
  constructor(
    @Inject(DI_TOKENS.PRODUCT_CATEGORY_REPOSITORY)
    private readonly repository: ProductCategoryRepositoryPort,
  ) {}

  async execute(dto: CreateProductCategoryDto): Promise<Result<ProductCategory, AppError>> {
    const existingResult = await this.repository.findByName(dto.name);
    if (!existingResult.ok) return existingResult;
    if (existingResult.value) {
      return err(new AlreadyExistsError('ProductCategory', 'name', dto.name));
    }

    const entity = ProductCategory.create(dto);
    return this.repository.save(entity);
  }
}
