import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategory } from '@domain/models/product-category.entity';
import { DI_TOKENS } from '@shared/di-tokens';
import { ProductCategoryRepository } from '@infrastructure/adapters/database/product-category.repository';
import { CreateProductCategoryUseCase } from '@application/use-cases/product-category/create-product-category.use-case';
import { FindProductCategoryUseCase } from '@application/use-cases/product-category/find-product-category.use-case';
import { FindAllProductCategoriesUseCase } from '@application/use-cases/product-category/find-all-product-categories.use-case';
import { UpdateProductCategoryUseCase } from '@application/use-cases/product-category/update-product-category.use-case';
import { DeleteProductCategoryUseCase } from '@application/use-cases/product-category/delete-product-category.use-case';
import { ProductCategoryController } from '@presentation/controllers/product-category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategory])],
  controllers: [ProductCategoryController],
  providers: [
    CreateProductCategoryUseCase,
    FindProductCategoryUseCase,
    FindAllProductCategoriesUseCase,
    UpdateProductCategoryUseCase,
    DeleteProductCategoryUseCase,
    {
      provide: DI_TOKENS.PRODUCT_CATEGORY_REPOSITORY,
      useClass: ProductCategoryRepository,
    },
  ],
  exports: [DI_TOKENS.PRODUCT_CATEGORY_REPOSITORY],
})
export class ProductCategoryModule {}
